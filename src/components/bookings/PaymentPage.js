import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Payment as UpiIcon,
  Receipt as ReceiptIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
  });
  const [netBankingDetails, setNetBankingDetails] = useState({
    bank: '',
  });
  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');

  // Mock booking data (in a real app, this would come from location state or API)
  useEffect(() => {
    // Check if we have booking data from location state
    if (location.state && location.state.bookingId) {
      // Use the data passed from BookingPage
      const bookingData = {
        bookingId: location.state.bookingId,
        trainDetails: {
          trainNo: location.state.train.trainNo,
          name: location.state.train.name,
          source: location.state.train.source,
          destination: location.state.train.destination,
          departureTime: location.state.train.departureTime,
          arrivalTime: location.state.train.arrivalTime,
          date: location.state.journeyDate,
          class: location.state.selectedClass,
        },
        passengers: location.state.passengers.map(passenger => ({
          name: passenger.name,
          age: passenger.age,
          gender: passenger.gender === 'male' ? 'Male' : 'Female',
          seatNumber: passenger.seatNumber,
        })),
        fare: {
          baseFare: Math.round(location.state.totalAmount * 0.95), // Remove GST for base fare
          gst: Math.round(location.state.totalAmount * 0.05),
          totalFare: location.state.totalAmount,
        },
      };
      
      setBookingData(bookingData);
    } else {
      // Fallback to mock data for development/testing
      const mockBookingData = {
        bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
        trainDetails: {
          trainNo: 'EXP1234',
          name: 'Rajdhani Express',
          source: 'New Delhi',
          destination: 'Mumbai Central',
          departureTime: '06:00',
          arrivalTime: '22:30',
          date: '2023-11-15',
          class: '2A',
        },
        passengers: [
          {
            name: 'John Doe',
            age: 32,
            gender: 'Male',
            seatNumber: 23,
          },
          {
            name: 'Jane Doe',
            age: 28,
            gender: 'Female',
            seatNumber: 24,
          },
        ],
        fare: {
          baseFare: 3800,
          gst: 190,
          totalFare: 3990,
        },
      };
      
      setBookingData(mockBookingData);
      
      // In a production app, you might want to redirect:
      // navigate('/booking');
    }
  }, [location, navigate]);

  const steps = ['Review Booking', 'Select Payment Method', 'Payment'];

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (field) => (event) => {
    setCardDetails({
      ...cardDetails,
      [field]: event.target.value,
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleUpiDetailsChange = (event) => {
    setUpiDetails({
      upiId: event.target.value,
    });
    
    if (errors.upiId) {
      setErrors({
        ...errors,
        upiId: null,
      });
    }
  };

  const handleNetBankingChange = (event) => {
    setNetBankingDetails({
      bank: event.target.value,
    });
    
    if (errors.bank) {
      setErrors({
        ...errors,
        bank: null,
      });
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // First step (Review) - just proceed
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Second step (Payment Method) - validate selection and proceed
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Final step (Payment) - validate payment details
      const newErrors = validatePaymentDetails();
      
      if (Object.keys(newErrors).length === 0) {
        // If no errors, open confirmation dialog
        setConfirmDialogOpen(true);
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit_card') {
      // Basic validation for credit card
      if (!cardDetails.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!cardDetails.nameOnCard) {
        newErrors.nameOnCard = 'Name is required';
      }
      
      if (!cardDetails.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Use MM/YY format';
      }
      
      if (!cardDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else if (paymentMethod === 'upi') {
      // UPI validation
      if (!upiDetails.upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}/.test(upiDetails.upiId)) {
        newErrors.upiId = 'Invalid UPI ID';
      }
    } else if (paymentMethod === 'net_banking') {
      // Net banking validation
      if (!netBankingDetails.bank) {
        newErrors.bank = 'Please select a bank';
      }
    }
    
    return newErrors;
  };

  const handleConfirmPayment = () => {
    setConfirmDialogOpen(false);
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      
      // For credit card and net banking, show OTP verification
      if (paymentMethod === 'credit_card' || paymentMethod === 'net_banking') {
        setOtpDialogOpen(true);
      } else {
        // For UPI, directly complete payment
        handlePaymentComplete();
      }
    }, 2000);
  };

  const handleOtpSubmit = () => {
    // Basic OTP validation
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setErrors({
        ...errors,
        otp: 'Please enter a valid 6-digit OTP',
      });
      return;
    }
    
    setOtpDialogOpen(false);
    setProcessing(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setProcessing(false);
      handlePaymentComplete();
    }, 1500);
  };

  const handlePaymentComplete = () => {
    // In a real app, you'd save the booking and payment details to the backend here
    
    // Navigate to confirmation page
    navigate(`/booking-confirmation/${bookingData.bookingId}`);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const renderPaymentMethodForm = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  variant="outlined"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange('cardNumber')}
                  onBlur={() => {
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: formatCardNumber(cardDetails.cardNumber),
                    });
                  }}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  variant="outlined"
                  value={cardDetails.nameOnCard}
                  onChange={handleCardDetailsChange('nameOnCard')}
                  error={!!errors.nameOnCard}
                  helperText={errors.nameOnCard}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  variant="outlined"
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange('expiryDate')}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate || 'MM/YY'}
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  variant="outlined"
                  type="password"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange('cvv')}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Alert severity="info" icon={<SecurityIcon />}>
                <Typography variant="body2">
                  Your payment information is secure. We use encryption to protect your data.
                </Typography>
              </Alert>
            </Box>
          </Box>
        );
      
      case 'upi':
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="UPI ID"
              variant="outlined"
              value={upiDetails.upiId}
              onChange={handleUpiDetailsChange}
              error={!!errors.upiId}
              helperText={errors.upiId || 'e.g. yourname@upi'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UpiIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                <Typography variant="body2">
                  You will receive a payment request on your UPI app. Please complete the payment there.
                </Typography>
              </Alert>
            </Box>
          </Box>
        );
      
      case 'net_banking':
        const banks = [
          'State Bank of India',
          'HDFC Bank',
          'ICICI Bank',
          'Axis Bank',
          'Punjab National Bank',
          'Bank of Baroda',
          'Kotak Mahindra Bank',
          'Yes Bank',
        ];
        
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth error={!!errors.bank}>
              <Typography variant="subtitle2" gutterBottom>
                Select your Bank
              </Typography>
              <RadioGroup
                value={netBankingDetails.bank}
                onChange={handleNetBankingChange}
              >
                <Grid container spacing={2}>
                  {banks.map((bank) => (
                    <Grid item xs={12} sm={6} key={bank}>
                      <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                        <FormControlLabel
                          value={bank}
                          control={<Radio />}
                          label={bank}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
              {errors.bank && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.bank}
                </Typography>
              )}
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <Alert severity="info" icon={<BankIcon />}>
                <Typography variant="body2">
                  You will be redirected to your bank's website to complete the payment.
                </Typography>
              </Alert>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  const renderStepContent = (step) => {
    if (!bookingData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <Box>
            {/* Train Details */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Train Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    {bookingData.trainDetails.name} ({bookingData.trainDetails.trainNo})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Class: {bookingData.trainDetails.class}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    {bookingData.trainDetails.source} → {bookingData.trainDetails.destination}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(bookingData.trainDetails.date).toLocaleDateString()} • {bookingData.trainDetails.departureTime} - {bookingData.trainDetails.arrivalTime}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Passenger Summary */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Passenger Details
              </Typography>
              <Grid container spacing={2}>
                {bookingData.passengers.map((passenger, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2">
                        {passenger.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {passenger.age} years • {passenger.gender} • Seat: {passenger.seatNumber}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            
            {/* Fare Summary */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Fare Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body1">Base Fare</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">₹{bookingData.fare.baseFare}</Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">GST (5%)</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">₹{bookingData.fare.gst}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Amount
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      ₹{bookingData.fare.totalFare}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Choose your preferred payment method
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2,
                    borderColor: paymentMethod === 'credit_card' ? 'primary.main' : 'divider',
                    bgcolor: paymentMethod === 'credit_card' ? 'primary.lightest' : 'transparent',
                  }}
                >
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Credit/Debit Card</Typography>
                      </Box>
                    }
                  />
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2,
                    borderColor: paymentMethod === 'upi' ? 'primary.main' : 'divider',
                    bgcolor: paymentMethod === 'upi' ? 'primary.lightest' : 'transparent',
                  }}
                >
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UpiIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">UPI Payment</Typography>
                      </Box>
                    }
                  />
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2,
                    borderColor: paymentMethod === 'net_banking' ? 'primary.main' : 'divider',
                    bgcolor: paymentMethod === 'net_banking' ? 'primary.lightest' : 'transparent',
                  }}
                >
                  <FormControlLabel
                    value="net_banking"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BankIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Net Banking</Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
            
            <Alert severity="success" icon={<LockIcon />} sx={{ mt: 3 }}>
              <Typography variant="body2">
                All transactions are secure and encrypted. Your payment information is never stored on our servers.
              </Typography>
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            {/* Payment Method Form */}
            {renderPaymentMethodForm()}
            
            {/* Order Summary Card */}
            <Card variant="outlined" sx={{ mt: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ReceiptIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Train
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      {bookingData.trainDetails.name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Journey Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      {new Date(bookingData.trainDetails.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Passengers
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      {bookingData.passengers.length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Amount
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      ₹{bookingData.fare.totalFare}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      
      default:
        return null;
    }
  };

  // Loading state
  if (!bookingData && !processing) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {/* Main Content */}
      <Box>
        {processing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6">
              Processing your payment...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please do not close or refresh this page.
            </Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Make Payment' : 'Continue'}
              </Button>
            </Box>
          </>
        )}
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to make a payment of <strong>₹{bookingData?.fare.totalFare}</strong> for your train booking. Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmPayment} autoFocus>
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* OTP Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
      >
        <DialogTitle>
          <LockIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Verification Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            To complete your payment, please enter the 6-digit OTP sent to your registered mobile number.
          </DialogContentText>
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (errors.otp) {
                setErrors({
                  ...errors,
                  otp: null,
                });
              }
            }}
            error={!!errors.otp}
            helperText={errors.otp}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleOtpSubmit}>
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage; 