import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@mui/icons-material';
import { database } from '../firebase';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    countryCode: '+91',
    phoneNumber: '',
    
    // Blouse Measurements
    blouse_length: '',
    blouse_dartPoint: '',
    blouse_upperChest: '',
    blouse_chest: '',
    blouse_waist: '',
    blouse_shoulder: '',
    blouse_sleeves: '',
    blouse_armhole: '',
    
    // Pants Measurements
    pants_height: '',
    pants_waist: '',
    pants_hips: '',
    
    // Petticoat Measurements
    petticoat_height: '',
    petticoat_waist: '',
    
    // Lengha Measurements
    lengha_height: '',
    lengha_waist: '',
    
    // Dress Measurements
    dress_longLength: '',
    dress_midLength: '',
    dress_chest: '',
    dress_waist: '',
    dress_hips: '',
    dress_slit: '',
    dress_shoulder: '',
    dress_armhole: '',
    dress_sleeves: 'Short',
  });

  const loadCustomer = useCallback(async (customerId) => {
    try {
      const customerRef = ref(database, `tailoring_customers/${customerId}`);
      const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        setFormData(snapshot.val());
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      showSnackbar('Error loading customer data', 'error');
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id, loadCustomer]);

  const handlePhoneLookup = async () => {
    if (!formData.phoneNumber) {
      showSnackbar('Please enter a phone number', 'warning');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = formData.countryCode + formData.phoneNumber;
      const customersRef = ref(database, 'tailoring_customers');
      const phoneQuery = query(customersRef, orderByChild('fullPhone'), equalTo(fullPhone));
      const snapshot = await get(phoneQuery);

      if (snapshot.exists()) {
        const customerData = Object.values(snapshot.val())[0];
        setFormData(customerData);
        showSnackbar('Customer found! Data loaded.', 'success');
      } else {
        showSnackbar('Customer not found. Please enter details.', 'info');
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
      showSnackbar('Error looking up customer', 'error');
    }
    setLoading(false);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      showSnackbar('Please fill in name and phone number', 'warning');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = formData.countryCode + formData.phoneNumber;
      const customerId = id || fullPhone.replace(/[^0-9]/g, '');
      const customerRef = ref(database, `tailoring_customers/${customerId}`);
      
      await set(customerRef, {
        ...formData,
        fullPhone,
        id: customerId,
        updatedAt: new Date().toISOString(),
      });

      showSnackbar('Customer saved successfully!', 'success');
      setTimeout(() => navigate('/customers'), 1500);
    } catch (error) {
      console.error('Error saving customer:', error);
      showSnackbar('Error saving customer', 'error');
    }
    setLoading(false);
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
          <IconButton edge="start" color="inherit" onClick={() => navigate('/customers')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {id ? 'Edit Customer' : 'Add Customer'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Customer Information
          </Typography>
          
          {/* Basic Information */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Country Code</InputLabel>
                <Select
                  value={formData.countryCode}
                  onChange={handleChange('countryCode')}
                  label="Country Code"
                >
                  <MenuItem value="+91">+91 (India)</MenuItem>
                  <MenuItem value="+1">+1 (USA)</MenuItem>
                  <MenuItem value="+44">+44 (UK)</MenuItem>
                  <MenuItem value="+971">+971 (UAE)</MenuItem>
                  <MenuItem value="+65">+65 (Singapore)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePhoneLookup} disabled={loading}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePhoneLookup}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                Lookup
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Blouse Measurements */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Blouse Measurements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Length" value={formData.blouse_length} onChange={handleChange('blouse_length')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Dart Point" value={formData.blouse_dartPoint} onChange={handleChange('blouse_dartPoint')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Upper Chest" value={formData.blouse_upperChest} onChange={handleChange('blouse_upperChest')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Chest" value={formData.blouse_chest} onChange={handleChange('blouse_chest')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Waist" value={formData.blouse_waist} onChange={handleChange('blouse_waist')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Shoulder" value={formData.blouse_shoulder} onChange={handleChange('blouse_shoulder')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Sleeves" value={formData.blouse_sleeves} onChange={handleChange('blouse_sleeves')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Armhole" value={formData.blouse_armhole} onChange={handleChange('blouse_armhole')} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Pants Measurements */}
          <Typography variant="h6" gutterBottom>
            Pants Measurements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Height" value={formData.pants_height} onChange={handleChange('pants_height')} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Waist" value={formData.pants_waist} onChange={handleChange('pants_waist')} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Hips" value={formData.pants_hips} onChange={handleChange('pants_hips')} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Petticoat Measurements */}
          <Typography variant="h6" gutterBottom>
            Petticoat Measurements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Height" value={formData.petticoat_height} onChange={handleChange('petticoat_height')} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Waist" value={formData.petticoat_waist} onChange={handleChange('petticoat_waist')} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Lengha Measurements */}
          <Typography variant="h6" gutterBottom>
            Lengha Measurements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Height" value={formData.lengha_height} onChange={handleChange('lengha_height')} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth label="Waist" value={formData.lengha_waist} onChange={handleChange('lengha_waist')} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Dress Measurements */}
          <Typography variant="h6" gutterBottom>
            Dress Measurements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Long Length" value={formData.dress_longLength} onChange={handleChange('dress_longLength')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Mid Length" value={formData.dress_midLength} onChange={handleChange('dress_midLength')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Chest" value={formData.dress_chest} onChange={handleChange('dress_chest')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Waist" value={formData.dress_waist} onChange={handleChange('dress_waist')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Hips" value={formData.dress_hips} onChange={handleChange('dress_hips')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Slit" value={formData.dress_slit} onChange={handleChange('dress_slit')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Shoulder" value={formData.dress_shoulder} onChange={handleChange('dress_shoulder')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField fullWidth label="Armhole" value={formData.dress_armhole} onChange={handleChange('dress_armhole')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sleeves Type</InputLabel>
                <Select
                  value={formData.dress_sleeves}
                  onChange={handleChange('dress_sleeves')}
                  label="Sleeves Type"
                >
                  <MenuItem value="Short">Short</MenuItem>
                  <MenuItem value="Elbow">Elbow</MenuItem>
                  <MenuItem value="Mid">Mid</MenuItem>
                  <MenuItem value="Full">Full</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/customers')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              Save Customer
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

export default CustomerForm;

