import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/layout/MainLayout';

// Pages
import HomePage from './components/home/HomePage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import TrainSearchPage from './components/trains/TrainSearchPage';
import TrainDetailsPage from './components/trains/TrainDetailsPage';
import BookingPage from './components/bookings/BookingPage';
import PaymentPage from './components/bookings/PaymentPage';
import BookingConfirmationPage from './components/bookings/BookingConfirmationPage';
import TicketPage from './components/tickets/TicketPage';
import ProfilePage from './components/profile/ProfilePage';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Modern blue - professional and trustworthy
      light: '#4dabf5',
      dark: '#0d47a1',
      lightest: '#e8f0fe',
    },
    secondary: {
      main: '#ff5722', // Vibrant orange for accents and calls to action
      light: '#ff8a50',
      dark: '#c41c00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Softer background for better readability
      paper: '#ffffff',
      light: '#fafafa',
    },
    success: {
      main: '#34a853', // Google-style success green
      light: '#66bb6a',
    },
    info: {
      main: '#4285f4',
      light: '#64b5f6',
    },
    warning: {
      main: '#fbbc04', // Warmer warning yellow
      light: '#ffca28',
    },
    error: {
      main: '#ea4335', // Google-style error red
      light: '#ef5350',
    },
    text: {
      primary: '#202124', // Darker text for better contrast
      secondary: '#5f6368',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0',
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0',
      fontSize: '1rem',
    },
    subtitle1: {
      letterSpacing: '0.15px',
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      letterSpacing: '0.1px',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      letterSpacing: '0.15px',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      letterSpacing: '0.15px',
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      letterSpacing: '0.4px',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.07)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          '& .MuiAutocomplete-paper': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: 8,
            animation: 'fadeIn 0.2s ease-out',
          },
        },
        option: {
          transition: 'background-color 0.15s ease-in-out',
        },
        listbox: {
          padding: '8px 0',
          '& .MuiAutocomplete-option': {
            minHeight: 48,
            padding: '6px 16px',
          },
        },
        inputRoot: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation4: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(26, 115, 232, 0.04)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to bottom, #1a73e8, #0d65d9)',
          '&:hover': {
            backgroundImage: 'linear-gradient(to bottom, #0d65d9, #0d47a1)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 16,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        filled: {
          '&:hover': {
            filter: 'brightness(0.95)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 6,
          overflow: 'hidden',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(26, 115, 232, 0.15)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(0, 0, 0, 0.15)',
          transition: 'border-color 0.2s ease',
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
          animation: 'slideIn 0.2s ease-out',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
        },
        standardSuccess: {
          backgroundColor: 'rgba(52, 168, 83, 0.1)',
          color: '#2e7d32',
        },
        standardError: {
          backgroundColor: 'rgba(234, 67, 53, 0.1)',
          color: '#d32f2f',
        },
        standardWarning: {
          backgroundColor: 'rgba(251, 188, 4, 0.1)',
          color: '#ed6c02',
        },
        standardInfo: {
          backgroundColor: 'rgba(26, 115, 232, 0.1)',
          color: '#0d47a1',
        },
      },
    },
  },
});

// Add global CSS for animations
const GlobalCss = () => {
  React.useEffect(() => {
    // This adds animation styles to the document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 100% 0; }
      }
      
      .hover-lift {
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      }
      
      .gradient-text {
        background: linear-gradient(90deg, #1a73e8, #0d47a1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
      }
      
      .card-gradient {
        background: linear-gradient(145deg, #ffffff, #f8fafc);
      }
      
      /* Add smooth font rendering */
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Add subtle focus styles for accessibility */
      :focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.4);
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    
    // Load Inter font from Google Fonts
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(linkElement);
    
    return () => {
      document.head.removeChild(style);
      document.head.removeChild(linkElement);
    };
  }, []);
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalCss />
      <CssBaseline />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '0.875rem',
          padding: '12px 16px',
          fontFamily: '"Inter", sans-serif'
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="trains" element={<TrainSearchPage />} />
            <Route path="trains/:trainId" element={<TrainDetailsPage />} />
            <Route path="booking/:trainId" element={<BookingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="tickets/:pnr" element={<TicketPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
