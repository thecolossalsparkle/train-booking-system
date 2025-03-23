import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Train as TrainIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// Custom styled connector for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

// Custom styled step icon
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.divider,
  zIndex: 1,
  color: '#fff',
  width: 45,
  height: 45,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
  }),
}));

// Custom step icon
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <EmailIcon />,
    2: <PersonIcon />,
    3: <CheckIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

// Step labels for the registration process
const steps = ['Account Information', 'Personal Details', 'Complete'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation schemas for each step
  const accountValidationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be of minimum 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const personalDetailsValidationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name should be of minimum 2 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name should be of minimum 2 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
    validationSchema: activeStep === 0 ? accountValidationSchema : personalDetailsValidationSchema,
    onSubmit: (values) => {
      if (activeStep === 0) {
        // Move to next step if validation passes
        setActiveStep(1);
      } else if (activeStep === 1) {
        // This would be replaced with an actual API call in a real application
        console.log('Registration submitted:', values);
        
        // Success notification
        toast.success('Registration successful!');
        
        // Move to completion step
        setActiveStep(2);
      }
    },
  });

  // Handle form navigation
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Redirect to login page after registration
  const handleFinish = () => {
    navigate('/login');
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
      <Container component="main" maxWidth="sm">
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
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              py: 3, 
              px: 2, 
              textAlign: 'center',
              backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
            }}
          >
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
              Create an account for a seamless booking experience
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel 
              connector={<ColorlibConnector />} 
              sx={{ mb: 4 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={formik.handleSubmit}>
              {activeStep === 0 && (
                // Account Information Step
                <Box sx={{ mt: 2 }}>
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
                  
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 3, 
                      mb: 2,
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
                    Continue
                  </Button>
                </Box>
              )}

              {activeStep === 1 && (
                // Personal Details Step
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
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
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
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
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
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
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                    <Button 
                      onClick={handleBack}
                      variant="outlined"
                      sx={{ 
                        px: 3,
                        borderRadius: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'rgba(26, 115, 232, 0.04)',
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ 
                        px: 3,
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
                      Create Account
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                // Completion Step
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(52, 168, 83, 0.3)'
                  }}>
                    <CheckIcon sx={{ fontSize: 40 }} />
                  </Box>
                  
                  <Typography variant="h5" component="div" gutterBottom fontWeight={600} color="primary.main">
                    Registration Successful!
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Your account has been created successfully. You can now login to access your account and start booking trains.
                  </Typography>
                  
                  <Button
                    onClick={handleFinish}
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 2, 
                      px: 4,
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
                    Proceed to Login
                  </Button>
                </Box>
              )}
            </form>

            {activeStep === 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
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
                
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            )}
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

export default RegisterPage; 