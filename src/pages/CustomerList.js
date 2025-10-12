import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const customersRef = ref(database, 'tailoring_customers');
      const snapshot = await get(customersRef);
      
      if (snapshot.exists()) {
        const customersData = Object.values(snapshot.val());
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filterCustomers = useCallback(() => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.firstName?.toLowerCase().includes(term) ||
        customer.lastName?.toLowerCase().includes(term) ||
        customer.phoneNumber?.includes(term) ||
        customer.fullPhone?.includes(term)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  useEffect(() => {
    filterCustomers();
  }, [filterCustomers]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer List
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customers/add')}
          >
            Add Customer
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search by Name or Phone Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Typography>Loading customers...</Typography>
          ) : filteredCustomers.length === 0 ? (
            <Typography>No customers found. Add your first customer!</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#FAEAB1' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Phone Number</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.fullPhone || customer.phoneNumber}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/customers/edit/${customer.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerList;

