import { createTheme } from '@mui/material/styles';

// Gundojus Clean Earth Tone Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#34656D', // Teal
      light: '#4A8B95',
      dark: '#234247',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FAEAB1', // Light Yellow
      light: '#FFF5D6',
      dark: '#E8D89F',
      contrastText: '#334443',
    },
    background: {
      default: '#FAF8F1', // Off-white cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#334443', // Dark grey-green
      secondary: '#5C6665',
    },
    success: {
      main: '#34656D',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      color: '#334443',
    },
    h2: {
      fontWeight: 600,
      color: '#334443',
    },
    h3: {
      fontWeight: 600,
      color: '#334443',
    },
    h4: {
      fontWeight: 600,
      color: '#334443',
    },
    h5: {
      fontWeight: 600,
      color: '#334443',
    },
    h6: {
      fontWeight: 600,
      color: '#334443',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(52, 101, 109, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(52, 101, 109, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#34656D',
          borderRadius: 0, // Edge to edge, no rounding
        },
      },
    },
  },
});

export default theme;

