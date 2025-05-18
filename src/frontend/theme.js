// src/frontend/theme.js
import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF8C', // verd StudyBot
      light: '#80e1bc',
      dark: '#087f5b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFB74D', // taronja suau
      light: '#ffe97d',
      dark: '#c88719',
      contrastText: '#000000',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#fdd835',
    },
    info: {
      main: '#4fc3f7',
    },
    success: {
      main: '#66bb6a',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    h3: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: '0.3s ease',
        },
      },
    },
  },
});

export default appTheme;
