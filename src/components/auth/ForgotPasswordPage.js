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
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Train as TrainIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // This would be replaced with an actual API call in a real application
      console.log('Reset password request submitted:', values);
      
      // Mock API response for demonstration
      if (values.email.includes('@')) {
        // Success notification
        toast.success('Password reset link sent to your email!');
        setRequestStatus({
          type: 'success',
          message: 'A password reset link has been sent to your email address. Please check your inbox.'
        });
        
        // In a real app, would redirect after some delay or wait for user to click a button
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        // Error handling
        setRequestStatus({
          type: 'error',
          message: 'This email is not registered in our system.'
        });
      }
    },
  });

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
              Reset your password
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}
            >
              Enter your email address and we'll send you a link to reset your password.
            </Typography>

            {requestStatus.message && (
              <Alert 
                severity={requestStatus.type} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { 
                    color: `${requestStatus.type}.main` 
                  } 
                }}
              >
                {requestStatus.message}
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
                Send Reset Link
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  component={RouterLink} 
                  to="/login" 
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
                  Back to Login
                </Link>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage; 