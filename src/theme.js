import { createTheme } from '@mui/material/styles';

// A refined, editorial dark theme — warm ink + signal amber accent.
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0e1016',
      paper: '#161a23',
    },
    primary: { main: '#e8b339' },        // signal amber
    secondary: { main: '#5cc8b3' },      // teal
    error: { main: '#e5615b' },
    success: { main: '#5cc8b3' },
    text: {
      primary: '#eef0f4',
      secondary: '#9aa3b2',
    },
    divider: 'rgba(255,255,255,0.07)',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", system-ui, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
    body2: { letterSpacing: '0.005em' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.72rem', fontWeight: 500 },
      },
    },
  },
});

export default theme;
