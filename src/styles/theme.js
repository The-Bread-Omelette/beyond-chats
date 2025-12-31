import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a0a0a',
      light: '#2d2d2d',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0052cc',
      light: '#2684FF',
      dark: '#0747A6',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#5e6c84',
      disabled: '#a5adba',
    },
    divider: '#ebecf0',
    success: {
      main: '#00875a',
      light: '#36b37e',
      dark: '#006644',
    },
    error: {
      main: '#de350b',
      light: '#ff5630',
      dark: '#bf2600',
    },
    warning: {
      main: '#ff991f',
      light: '#ffab00',
      dark: '#ff8b00',
    },
    info: {
      main: '#0052cc',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4d4d4 transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d4d4d4',
            borderRadius: '4px',
            '&:hover': {
              background: '#a3a3a3',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          border: '1px solid #ebecf0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
            borderColor: '#d4d4d4',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
          height: '24px',
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});