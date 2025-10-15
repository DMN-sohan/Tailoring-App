import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { database } from '../firebase';
import { ref, set, push } from 'firebase/database';
import { format } from 'date-fns';

const SalesEntry = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [rows, setRows] = useState([
    {
      id: 1,
      cusName: '',
      cusNumber: '',
      cusAddress: '',
      cusLehengas: '',
      cusDress: '',
      blouses: '',
      petticoat: '',
    },
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      cusName: '',
      cusNumber: '',
      cusAddress: '',
      cusLehengas: '',
      cusDress: '',
      blouses: '',
      petticoat: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCellChange = (id, field, value) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = async () => {
    try {
      const salesRef = ref(database, `tailoring_sales/${selectedDate.replace(/-/g, '_')}`);
      const salesId = push(salesRef).key;
      
      await set(ref(database, `tailoring_sales/${selectedDate.replace(/-/g, '_')}/${salesId}`), {
        date: selectedDate,
        rows: rows,
        createdAt: new Date().toISOString(),
      });

      showSnackbar('Sales data saved successfully!', 'success');
      
      // Reset to one empty row
      setRows([
        {
          id: 1,
          cusName: '',
          cusNumber: '',
          cusAddress: '',
          cusLehengas: '',
          cusDress: '',
          blouses: '',
          petticoat: '',
        },
      ]);
    } catch (error) {
      console.error('Error saving sales:', error);
      showSnackbar('Error saving sales data', 'error');
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
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sales Entry
          </Typography>
          <Button
            color="inherit"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/sales/analytics')}
          >
            Analytics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputProps={{
                sx: { fontWeight: 'bold', fontSize: '1.2rem' },
              }}
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }} size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#FAEAB1' }}>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Sr. No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cus Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cus Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cus Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cus Lehengas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cus Dress</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Blouses</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Petticoat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.cusName}
                        onChange={(e) => handleCellChange(row.id, 'cusName', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.cusNumber}
                        onChange={(e) => handleCellChange(row.id, 'cusNumber', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.cusAddress}
                        onChange={(e) => handleCellChange(row.id, 'cusAddress', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.cusLehengas}
                        onChange={(e) => handleCellChange(row.id, 'cusLehengas', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.cusDress}
                        onChange={(e) => handleCellChange(row.id, 'cusDress', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.blouses}
                        onChange={(e) => handleCellChange(row.id, 'blouses', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', p: 0 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={row.petticoat}
                        onChange={(e) => handleCellChange(row.id, 'petticoat', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ px: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteRow(row.id)}
                        disabled={rows.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add Row
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Sales
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SalesEntry;

