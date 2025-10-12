import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Home from './pages/Home';
import CustomerForm from './pages/CustomerForm';
import CustomerList from './pages/CustomerList';
import SalesEntry from './pages/SalesEntry';
import SalesAnalytics from './pages/SalesAnalytics';
import ManageMasters from './pages/ManageMasters';
import WorkEntry from './pages/WorkEntry';
import MasterAnalytics from './pages/MasterAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FAF8F1',
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          
          {/* Tool 1: Customer Measurements */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          
          {/* Tool 2: Sales Tracking */}
          <Route path="/sales" element={<SalesEntry />} />
          <Route 
            path="/sales/analytics" 
            element={
              <ProtectedRoute>
                <SalesAnalytics />
              </ProtectedRoute>
            } 
          />
          
          {/* Tool 3: Master Production */}
          <Route path="/masters" element={<ManageMasters />} />
          <Route path="/work-entry" element={<WorkEntry />} />
          <Route 
            path="/masters/analytics" 
            element={
              <ProtectedRoute>
                <MasterAnalytics />
              </ProtectedRoute>
            } 
          />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
