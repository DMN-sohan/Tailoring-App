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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import HelpButton from '../components/HelpButton';
import { database } from '../firebase';
import { ref, set, get, remove } from 'firebase/database';

const INITIAL_MASTERS = [
  'Naveed',
  'Kaleem',
  'Aslam',
  'Sharukh master',
  'Ismail',
  'Balamani',
  'Ambica',
  'lalitha',
  'Soumya',
  'Kavitha',
  'Hareeja',
  'Khurshid',
  'Sabir',
  'Arif',
];

const ManageMasters = () => {
  const navigate = useNavigate();
  const [masters, setMasters] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMasterName, setNewMasterName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initializing, setInitializing] = useState(true);

  const loadMasters = useCallback(async () => {
    try {
      const mastersRef = ref(database, 'tailoring_masters');
      const snapshot = await get(mastersRef);

      if (snapshot.exists()) {
        const mastersData = Object.values(snapshot.val());
        setMasters(mastersData);
      } else {
        // Initialize with default masters
        await initializeDefaultMasters();
      }
    } catch (error) {
      console.error('Error loading masters:', error);
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  // Auto-initialize on component mount if no masters exist
  useEffect(() => {
    const autoInitialize = async () => {
      if (masters.length === 0 && !initializing) {
        await initializeDefaultMasters();
      }
    };
    autoInitialize();
  }, [masters, initializing]);

  const initializeDefaultMasters = async () => {
    try {
      const mastersRef = ref(database, 'tailoring_masters');
      const mastersData = {};
      
      INITIAL_MASTERS.forEach((name, index) => {
        const id = name.toLowerCase().replace(/\s+/g, '_');
        mastersData[id] = { id, name };
      });

      await set(mastersRef, mastersData);
      setMasters(Object.values(mastersData));
      showSnackbar('Masters initialized successfully!', 'success');
    } catch (error) {
      console.error('Error initializing masters:', error);
      showSnackbar('Error initializing masters', 'error');
    }
  };

  const handleAddMaster = async () => {
    if (!newMasterName.trim()) {
      showSnackbar('Please enter a master name', 'warning');
      return;
    }

    try {
      const id = newMasterName.toLowerCase().replace(/\s+/g, '_');
      const masterRef = ref(database, `tailoring_masters/${id}`);
      
      await set(masterRef, {
        id,
        name: newMasterName.trim(),
      });

      setMasters([...masters, { id, name: newMasterName.trim() }]);
      setNewMasterName('');
      setOpenDialog(false);
      showSnackbar('Master added successfully!', 'success');
    } catch (error) {
      console.error('Error adding master:', error);
      showSnackbar('Error adding master', 'error');
    }
  };

  const handleDeleteMaster = async (masterId) => {
    try {
      const masterRef = ref(database, `tailoring_masters/${masterId}`);
      await remove(masterRef);
      
      setMasters(masters.filter((m) => m.id !== masterId));
      showSnackbar('Master deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting master:', error);
      showSnackbar('Error deleting master', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ color: '#FFFFFF' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <img 
              src="https://i.imgur.com/crcVWqA.png" 
              alt="Gundojus Logo" 
              style={{ height: '28px', width: '28px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
              Gundojus - Manage Masters
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<WorkIcon />}
            onClick={() => navigate('/work-entry')}
            sx={{ mr: 1, color: '#FFFFFF', fontWeight: 'bold' }}
          >
            Work Entry
          </Button>
          <Button
            color="inherit"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/masters/analytics')}
            sx={{ color: '#FFFFFF', fontWeight: 'bold' }}
          >
            Analytics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Masters List</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Master
            </Button>
          </Box>

          {initializing ? (
            <Typography>Loading masters...</Typography>
          ) : masters.length === 0 ? (
            <Typography>No masters found. Add your first master!</Typography>
          ) : (
            <List>
              {masters.map((master) => (
                <ListItem
                  key={master.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    primary={master.name}
                    secondary={`ID: ${master.id}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDeleteMaster(master.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Master</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Master Name"
            fullWidth
            variant="outlined"
            value={newMasterName}
            onChange={(e) => setNewMasterName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddMaster();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMaster} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <HelpButton
        title="Manage Masters"
        instructions={[
          "This page shows all your master craftsmen",
          "Masters are automatically loaded when you first visit",
          "To add a new master, click 'Add Master' button at the top",
          "To remove a master, click the red delete icon next to their name",
          "Click 'Work Entry' to record daily work by masters",
          "Click 'Analytics' to see production reports",
        ]}
      />
    </Box>
  );
};

export default ManageMasters;

