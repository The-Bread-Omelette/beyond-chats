import { createTheme } from '@mui/material/styles';
import processing_bg from '../assets/processing_bg.svg';

const glass = {
  background: 'rgba(20, 20, 25, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // Electric Blue (Tailwind-ish but custom)
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E2E8F0', // Slate 200
      contrastText: '#0F172A',
    },
    background: {
      default: '#050505', // Deep smooth black, not #000
      paper: '#0A0A0A',   // Slightly lighter black
      subtle: '#121212',
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#94A3B8', // Slate 400
      disabled: '#475569',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(59, 130, 246, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", system-ui, sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.015em' },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '1rem' },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    body1: { fontSize: '1rem', lineHeight: 1.6, color: '#94A3B8' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#64748B' },
    button: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@keyframes subtle-drift': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        body: {
          backgroundColor: '#050505',
          backgroundImage: `
            radial-gradient(circle at 50% 0%, #151515 0%, #050505 60%),
            url(${processing_bg})
          `,
          backgroundSize: '100% 100%, 120% 120%', // Scale up bg image for movement
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center top, center center',
          backgroundAttachment: 'scroll, fixed',
          minHeight: '100vh',
          scrollBehavior: 'smooth',
          // animation: 'subtle-drift 60s linear infinite alternate', // Subtle movement
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(5, 5, 5, 0.85)', // Darken it significantly so it's just texture
            zIndex: -1,
            pointerEvents: 'none',
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 18px rgba(2,6,23,0.35)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.15)',
          color: '#E2E8F0',
          '&:hover': {
            borderColor: '#E2E8F0',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: '#F8FAFC',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 20, 0.7)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 6px 18px rgba(2,6,23,0.6)',
          transition: 'transform 0.28s ease, border-color 0.28s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.06)',
        },
        filled: {
          backgroundColor: 'rgba(255,255,255,0.03)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(10, 10, 12, 0.5)',
            transition: 'background-color 0.2s',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover': {
              backgroundColor: 'rgba(15, 15, 20, 0.8)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(15, 15, 20, 1)',
              '& fieldset': {
                borderColor: '#3B82F6',
              },
            },
          },
        },
      },
    },
  },
});