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
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesAnalytics = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedYear, setSelectedYear] = useState(format(new Date(), 'yyyy'));
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    itemBreakdown: [],
    topCustomers: [],
    salesData: [],
  });

  const loadAnalytics = useCallback(async () => {
    try {
      const salesRef = ref(database, 'tailoring_sales');
      const snapshot = await get(salesRef);

      if (!snapshot.exists()) {
        setAnalytics({
          totalSales: 0,
          itemBreakdown: [],
          topCustomers: [],
          salesData: [],
        });
        return;
      }

      const salesData = snapshot.val();
      const filteredData = filterSalesByPeriod(salesData);
      calculateAnalytics(filteredData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }, [viewType, selectedDate, selectedMonth, selectedYear]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const filterSalesByPeriod = (salesData) => {
    let filtered = [];

    Object.entries(salesData).forEach(([dateKey, entries]) => {
      const date = dateKey.replace(/_/g, '-');
      
      let includeDate = false;
      
      if (viewType === 'daily' && date === selectedDate) {
        includeDate = true;
      } else if (viewType === 'monthly' && date.startsWith(selectedMonth)) {
        includeDate = true;
      } else if (viewType === 'yearly' && date.startsWith(selectedYear)) {
        includeDate = true;
      }

      if (includeDate) {
        Object.values(entries).forEach((entry) => {
          if (entry.rows) {
            filtered.push(...entry.rows);
          }
        });
      }
    });

    return filtered;
  };

  const calculateAnalytics = (salesData) => {
    const itemBreakdown = {
      'Embroidery Lenghas': 0,
      'Dresses': 0,
      'Blouses': 0,
      'Petticoat': 0,
    };

    const customerSales = {};

    salesData.forEach((row) => {
      // Count items
      if (row.embroideryLenghas) {
        const count = parseFloat(row.embroideryLenghas) || 0;
        itemBreakdown['Embroidery Lenghas'] += count;
      }
      if (row.dresses) {
        const count = parseFloat(row.dresses) || 0;
        itemBreakdown['Dresses'] += count;
      }
      if (row.blouses) {
        const count = parseFloat(row.blouses) || 0;
        itemBreakdown['Blouses'] += count;
      }
      if (row.petticoat) {
        const count = parseFloat(row.petticoat) || 0;
        itemBreakdown['Petticoat'] += count;
      }

      // Track customer purchases
      if (row.cusName) {
        if (!customerSales[row.cusName]) {
          customerSales[row.cusName] = 0;
        }
        const totalItems = 
          (parseFloat(row.embroideryLenghas) || 0) +
          (parseFloat(row.dresses) || 0) +
          (parseFloat(row.blouses) || 0) +
          (parseFloat(row.petticoat) || 0);
        customerSales[row.cusName] += totalItems;
      }
    });

    // Convert to chart data
    const itemChartData = Object.entries(itemBreakdown).map(([name, value]) => ({
      name,
      value,
    }));

    // Top customers
    const topCustomers = Object.entries(customerSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const totalSales = Object.values(itemBreakdown).reduce((sum, val) => sum + val, 0);

    setAnalytics({
      totalSales,
      itemBreakdown: itemChartData,
      topCustomers,
      salesData,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/sales')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sales Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>View Type</InputLabel>
                <Select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  label="View Type"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {viewType === 'daily' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Select Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            
            {viewType === 'monthly' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="month"
                  label="Select Month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            
            {viewType === 'yearly' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Select Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Items Sold
                </Typography>
                <Typography variant="h3" component="div">
                  {analytics.totalSales}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Items Sold by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.itemBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Item Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.itemBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.itemBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Customers
              </Typography>
              {analytics.topCustomers.length === 0 ? (
                <Typography color="text.secondary">No customer data available</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#FAEAB1' }}>
                        <TableCell><strong>Customer Name</strong></TableCell>
                        <TableCell align="right"><strong>Items Purchased</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.topCustomers.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell align="right">{customer.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SalesAnalytics;

