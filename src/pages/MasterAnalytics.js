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
  TableSortLabel,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const MasterAnalytics = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedYear, setSelectedYear] = useState(format(new Date(), 'yyyy'));
  const [analytics, setAnalytics] = useState({
    masterStats: [],
    itemBreakdown: [],
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [masters, setMasters] = useState({});

  const loadMasters = useCallback(async () => {
    try {
      const mastersRef = ref(database, 'tailoring_masters');
      const snapshot = await get(mastersRef);

      if (snapshot.exists()) {
        setMasters(snapshot.val());
      }
    } catch (error) {
      console.error('Error loading masters:', error);
    }
  }, []);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  const loadAnalytics = useCallback(async () => {
    try {
      const workRef = ref(database, 'tailoring_work_entries');
      const snapshot = await get(workRef);

      if (!snapshot.exists()) {
        setAnalytics({
          masterStats: [],
          itemBreakdown: [],
        });
        return;
      }

      const workData = snapshot.val();
      const filteredData = filterWorkByPeriod(workData);
      calculateAnalytics(filteredData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }, [viewType, selectedDate, selectedMonth, selectedYear, masters, sortBy, sortOrder]);

  useEffect(() => {
    if (Object.keys(masters).length > 0) {
      loadAnalytics();
    }
  }, [masters, loadAnalytics]);

  const filterWorkByPeriod = (workData) => {
    const aggregated = {};

    Object.entries(workData).forEach(([dateKey, entry]) => {
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
        Object.entries(entry).forEach(([masterId, items]) => {
          if (masterId !== 'date' && masterId !== 'updatedAt') {
            if (!aggregated[masterId]) {
              aggregated[masterId] = {};
              ITEM_TYPES.forEach((item) => {
                aggregated[masterId][item] = 0;
              });
            }

            ITEM_TYPES.forEach((item) => {
              aggregated[masterId][item] += items[item] || 0;
            });
          }
        });
      }
    });

    return aggregated;
  };

  const calculateAnalytics = (workData) => {
    const masterStats = [];
    const itemTotals = {};

    ITEM_TYPES.forEach((item) => {
      itemTotals[item] = 0;
    });

    Object.entries(workData).forEach(([masterId, items]) => {
      const masterName = masters[masterId]?.name || masterId;
      let totalItems = 0;

      const itemBreakdown = {};
      ITEM_TYPES.forEach((item) => {
        const count = items[item] || 0;
        itemBreakdown[item] = count;
        totalItems += count;
        itemTotals[item] += count;
      });

      masterStats.push({
        masterId,
        name: masterName,
        total: totalItems,
        ...itemBreakdown,
      });
    });

    // Convert item totals to chart data
    const itemBreakdown = ITEM_TYPES.map((item) => ({
      name: ITEM_DISPLAY_NAMES[item],
      count: itemTotals[item],
    }));

    setAnalytics({
      masterStats: sortMasterStats(masterStats, sortBy, sortOrder),
      itemBreakdown,
    });
  };

  const sortMasterStats = (stats, field, order) => {
    return [...stats].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'name') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
    
    setAnalytics({
      ...analytics,
      masterStats: sortMasterStats(analytics.masterStats, field, isAsc ? 'desc' : 'asc'),
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/masters')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Master Production Analytics
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
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Production by Item Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.itemBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ed6c02" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Master Production Details
              </Typography>
              {analytics.masterStats.length === 0 ? (
                <Typography color="text.secondary">No production data available for this period</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#FAEAB1' }}>
                        <TableCell>
                          <TableSortLabel
                            active={sortBy === 'name'}
                            direction={sortBy === 'name' ? sortOrder : 'asc'}
                            onClick={() => handleSort('name')}
                          >
                            <strong>Master Name</strong>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                          <TableSortLabel
                            active={sortBy === 'total'}
                            direction={sortBy === 'total' ? sortOrder : 'asc'}
                            onClick={() => handleSort('total')}
                          >
                            <strong>Total</strong>
                          </TableSortLabel>
                        </TableCell>
                        {ITEM_TYPES.map((item) => (
                          <TableCell align="right" key={item}>
                            <TableSortLabel
                              active={sortBy === item}
                              direction={sortBy === item ? sortOrder : 'asc'}
                              onClick={() => handleSort(item)}
                            >
                              <strong>{ITEM_DISPLAY_NAMES[item]}</strong>
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.masterStats.map((master) => (
                        <TableRow key={master.masterId} hover>
                          <TableCell>{master.name}</TableCell>
                          <TableCell align="right">
                            <strong>{master.total}</strong>
                          </TableCell>
                          {ITEM_TYPES.map((item) => (
                            <TableCell align="right" key={item}>
                              {master[item]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {/* Totals Row */}
                      <TableRow sx={{ backgroundColor: '#FAEAB1', fontWeight: 'bold' }}>
                        <TableCell><strong>TOTAL</strong></TableCell>
                        <TableCell align="right">
                          <strong>
                            {analytics.masterStats.reduce((sum, m) => sum + m.total, 0)}
                          </strong>
                        </TableCell>
                        {ITEM_TYPES.map((item) => (
                          <TableCell align="right" key={item}>
                            <strong>
                              {analytics.masterStats.reduce((sum, m) => sum + m[item], 0)}
                            </strong>
                          </TableCell>
                        ))}
                      </TableRow>
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

export default MasterAnalytics;

