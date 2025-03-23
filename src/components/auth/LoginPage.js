import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
  Train as TrainIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password should be of minimum 6 characters')
      .required('Password is required'),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // This would be replaced with an actual API call in a real application
      console.log('Login submitted:', values);
      
      // Mock login success for demonstration
      if (values.email === 'user@example.com' && values.password === 'password123') {
        // Success notification
        toast.success('Login successful!');
        // Redirect to home page after successful login
        navigate('/');
      } else {
        // Error handling
        setLoginError('Invalid email or password. Try using "user@example.com" and "password123".');
      }
    },
  });

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        background: 'linear-gradient(to bottom, #f8fafc, #e8f0fe)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.2)',
            },
          }}
        >
          <Box sx={{ 
            bgcolor: 'primary.main', 
            py: 3, 
            px: 2, 
            textAlign: 'center',
            backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
          }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: 1 
              }}
            >
              <TrainIcon sx={{ fontSize: 40, color: 'white', mr: 1 }} />
              <Typography variant="h5" component="div" sx={{ color: 'white', fontWeight: 700 }}>
                TrainBooker
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Sign in to continue your journey
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {loginError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { 
                    color: 'error.main' 
                  } 
                }}
              >
                {loginError}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(26, 115, 232, 0.1)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(26, 115, 232, 0.1)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ color: 'grey.500' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 1, mt: 0.5 }}>
                <Link 
                  component={RouterLink} 
                  to="/forgot-password" 
                  variant="body2"
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)',
                  backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(26, 115, 232, 0.4)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ 
                my: 2,
                '&::before, &::after': {
                  borderColor: 'divider',
                },
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link 
            component={RouterLink} 
            to="/" 
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            <Typography variant="body2">
              Return to Home
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 