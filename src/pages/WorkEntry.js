import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import HelpButton from '../components/HelpButton';
import { database } from '../firebase';
import { ref, set, get } from 'firebase/database';
import { format } from 'date-fns';

const ITEM_TYPES = [
  'Blouse',
  'Pants',
  'Tops',
  'Lengha',
  'Petticoat',
  'Alteration',
  'S_Falls',
  'PC',
  'Hook',
];

// Display names for the item types (with proper formatting)
const ITEM_DISPLAY_NAMES = {
  'Blouse': 'Blouse',
  'Pants': "Pant's",
  'Tops': 'Tops',
  'Lengha': 'Lengha',
  'Petticoat': 'Petticoat',
  'Alteration': 'Alteration',
  'S_Falls': 'S Falls',
  'PC': 'P.C.',
  'Hook': 'Hook',
};

const WorkEntry = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [masters, setMasters] = useState([]);
  const [workData, setWorkData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadMasters = useCallback(async () => {
    try {
      const mastersRef = ref(database, 'tailoring_masters');
      const snapshot = await get(mastersRef);

      if (snapshot.exists()) {
        const mastersData = Object.values(snapshot.val());
        setMasters(mastersData);
        initializeWorkData(mastersData);
      }
    } catch (error) {
      console.error('Error loading masters:', error);
    }
  }, []);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  const initializeWorkData = useCallback((mastersData) => {
    const initialData = {};
    mastersData.forEach((master) => {
      initialData[master.id] = {};
      ITEM_TYPES.forEach((item) => {
        initialData[master.id][item] = 0;
      });
    });
    setWorkData(initialData);
  }, []);

  const loadWorkData = useCallback(async () => {
    try {
      const dateKey = selectedDate.replace(/-/g, '_');
      const workRef = ref(database, `tailoring_work_entries/${dateKey}`);
      const snapshot = await get(workRef);

      if (snapshot.exists()) {
        setWorkData(snapshot.val());
      } else {
        initializeWorkData(masters);
      }
    } catch (error) {
      console.error('Error loading work data:', error);
    }
  }, [selectedDate, masters, initializeWorkData]);

  useEffect(() => {
    if (masters.length > 0) {
      loadWorkData();
    }
  }, [masters, loadWorkData]);

  const handleIncrement = (masterId, itemType) => {
    setWorkData({
      ...workData,
      [masterId]: {
        ...workData[masterId],
        [itemType]: (workData[masterId]?.[itemType] || 0) + 1,
      },
    });
  };

  const handleDecrement = (masterId, itemType) => {
    const currentValue = workData[masterId]?.[itemType] || 0;
    if (currentValue > 0) {
      setWorkData({
        ...workData,
        [masterId]: {
          ...workData[masterId],
          [itemType]: currentValue - 1,
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      const dateKey = selectedDate.replace(/-/g, '_');
      const workRef = ref(database, `tailoring_work_entries/${dateKey}`);
      
      await set(workRef, {
        ...workData,
        date: selectedDate,
        updatedAt: new Date().toISOString(),
      });

      showSnackbar('Work data saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving work data:', error);
      showSnackbar('Error saving work data', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Group masters into rows of 5
  const masterRows = [];
  for (let i = 0; i < masters.length; i += 5) {
    masterRows.push(masters.slice(i, i + 5));
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/masters')} sx={{ color: '#FFFFFF' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <img 
              src="https://i.imgur.com/crcVWqA.png" 
              alt="Gundojus Logo" 
              style={{ height: '28px', width: '28px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
              Gundojus - Daily Work Entry
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputProps={{
                sx: { fontWeight: 'bold', fontSize: '1.2rem' },
              }}
            />
            <Button variant="contained" onClick={handleSave}>
              Save Work Data
            </Button>
          </Box>
        </Paper>

        {masters.length === 0 ? (
          <Typography>No masters found. Please add masters first.</Typography>
        ) : (
          masterRows.map((row, rowIndex) => (
            <Grid container spacing={2} key={rowIndex} sx={{ mb: 2 }}>
              {row.map((master) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={master.id}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{
                          backgroundColor: '#34656D',
                          color: '#FFFFFF',
                          py: 1.5,
                          mb: 2,
                          borderRadius: 2,
                          fontWeight: 'bold',
                        }}
                      >
                        {master.name}
                      </Typography>

                      {ITEM_TYPES.map((itemType) => (
                        <Box
                          key={itemType}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                          }}
                        >
                          <Typography sx={{ flex: 1 }}>{ITEM_DISPLAY_NAMES[itemType]}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDecrement(master.id, itemType)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography
                              sx={{
                                minWidth: '40px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                              }}
                            >
                              {workData[master.id]?.[itemType] || 0}
                            </Typography>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleIncrement(master.id, itemType)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))
        )}
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <HelpButton
        title="Daily Work Entry"
        instructions={[
          "Select the date at the top for which you want to record work",
          "Each master has their own card showing all item types",
          "Click the + button to add one item, or - button to subtract",
          "The number in the middle shows how many items were made",
          "After entering all data, click 'Save Work Data' at the top",
          "Come back tomorrow to record the next day's work!",
        ]}
      />
    </Box>
  );
};

export default WorkEntry;

