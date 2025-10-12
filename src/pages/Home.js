import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import HelpButton from '../components/HelpButton';

const Home = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Customer Measurements',
      description: 'Manage customer information and measurements for different garment types',
      icon: <PersonIcon sx={{ fontSize: 60 }} />,
      color: '#1976d2',
      actions: [
        { label: 'Add Customer', path: '/customers/add' },
        { label: 'View Customers', path: '/customers' },
      ],
    },
    {
      title: 'Sales Tracking',
      description: 'Record sales entries and view detailed analytics',
      icon: <ShoppingCartIcon sx={{ fontSize: 60 }} />,
      color: '#2e7d32',
      actions: [
        { label: 'Sales Entry', path: '/sales' },
        { label: 'Analytics', path: '/sales/analytics' },
      ],
    },
    {
      title: 'Master Production',
      description: 'Track daily production work by master craftsmen',
      icon: <EngineeringIcon sx={{ fontSize: 60 }} />,
      color: '#ed6c02',
      actions: [
        { label: 'Manage Masters', path: '/masters' },
        { label: 'Work Entry', path: '/work-entry' },
        { label: 'Analytics', path: '/masters/analytics' },
      ],
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <img 
              src="https://i.imgur.com/crcVWqA.png" 
              alt="Gundojus Logo" 
              style={{ height: '32px', width: '32px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
              Gundojus
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: '#34656D',
          }}
        >
          Welcome to Gundojus
        </Typography>
        
        <Grid container spacing={4}>
          {tools.map((tool, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: tool.color, mb: 2 }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1, p: 2 }}>
                  {tool.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="contained"
                      size="small"
                      onClick={() => navigate(action.path)}
                      sx={{ backgroundColor: tool.color }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <HelpButton
        title="Home Page"
        instructions={[
          "Choose which tool you want to use from the three cards above",
          "Customer Measurements: Store customer details and body measurements",
          "Sales Tracking: Record daily sales and view analytics",
          "Master Production: Track work done by your craftsmen",
          "Click any button on the cards to get started!",
        ]}
      />
    </Box>
  );
};

export default Home;

