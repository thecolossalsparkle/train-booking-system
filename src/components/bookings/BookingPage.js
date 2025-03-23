import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  EventSeat as SeatIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// Mock train data fetch function
const getTrainById = (id) => {
  const mockTrains = [
    {
      id: 1,
      trainNo: 'EXP1234',
      name: 'Rajdhani Express',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '06:00',
      arrivalTime: '22:30',
      duration: '16h 30m',
      classes: ['1A', '2A', '3A', 'SL'],
      price: { '1A': 3200, '2A': 1900, '3A': 1200, 'SL': 650 },
      availableSeats: { '1A': 12, '2A': 24, '3A': 45, 'SL': 110 },
      daysOfWeek: ['Mon', 'Wed', 'Fri', 'Sun'],
    },
    {
      id: 2,
      trainNo: 'SF5678',
      name: 'Shatabdi Express',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '08:30',
      arrivalTime: '23:45',
      duration: '15h 15m',
      classes: ['CC', 'EC'],
      price: { 'CC': 1500, 'EC': 2800 },
      availableSeats: { 'CC': 65, 'EC': 30 },
      daysOfWeek: ['Daily'],
    },
  ];
  
  return mockTrains.find(train => train.id === parseInt(id));
};

// Class type mapping for display
const CLASS_TYPES = {
  '1A': 'First AC',
  '2A': 'Second AC',
  '3A': 'Third AC',
  'SL': 'Sleeper',
  'CC': 'Chair Car',
  'EC': 'Executive Chair Car',
};

// Age categories for fare calculation
const AGE_CATEGORIES = [
  { value: 'adult', label: 'Adult (12+ years)', discount: 0 },
  { value: 'child', label: 'Child (5-11 years)', discount: 0.5 },
  { value: 'senior', label: 'Senior Citizen (60+ years)', discount: 0.4 },
];

// Steps for the booking process
const steps = ['Passenger Details', 'Seat Selection', 'Review & Pay'];

// Generate mock available seats
const generateAvailableSeats = (classType, count) => {
  const seats = [];
  const rows = Math.ceil(count / 6);
  let seatNumber = 1;
  
  for (let i = 1; i <= rows; i++) {
    for (let j = 0; j < 6 && seatNumber <= count; j++) {
      const seatPosition = ['Lower', 'Middle', 'Upper', 'Lower', 'Middle', 'Upper'][j];
      const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][j];
      
      seats.push({
        number: seatNumber,
        position: classType === 'SL' || classType.includes('A') ? seatPosition : null,
        code: `${i}${seatLetter}`,
        available: Math.random() > 0.3, // 70% of seats are available
      });
      
      seatNumber++;
    }
  }
  
  return seats;
};

const BookingPage = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // State variables
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(queryParams.get('class') || '');
  const [journeyDate, setJourneyDate] = useState(queryParams.get('date') || new Date().toISOString().split('T')[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [passengers, setPassengers] = useState([
    { 
      name: '', 
      age: '', 
      gender: 'male', 
      ageCategory: 'adult',
      seatNumber: null,
      berth: ''
    }
  ]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [totalFare, setTotalFare] = useState(0);
  const [discountedFare, setDiscountedFare] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openSeatSelectionDialog, setOpenSeatSelectionDialog] = useState(false);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(null);
  
  // Fetch train data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedTrain = getTrainById(trainId);
      if (fetchedTrain) {
        setTrain(fetchedTrain);
        
        // If no class is selected or the selected class is not available for this train
        if (!selectedClass || !fetchedTrain.classes.includes(selectedClass)) {
          setSelectedClass(fetchedTrain.classes[0]);
        }
        
        // Generate seats for the selected class
        if (selectedClass) {
          const seats = generateAvailableSeats(
            selectedClass, 
            fetchedTrain.availableSeats[selectedClass]
          );
          setAvailableSeats(seats);
        }
      } else {
        setError('Train not found');
      }
      setLoading(false);
    }, 1000);
  }, [trainId, selectedClass]);
  
  // Calculate fare whenever passengers or train changes
  useEffect(() => {
    if (train && selectedClass) {
      let baseFare = 0;
      let discounted = 0;
      
      passengers.forEach(passenger => {
        const baseTicketPrice = train.price[selectedClass];
        baseFare += baseTicketPrice;
        
        // Apply discount based on age category
        const category = AGE_CATEGORIES.find(cat => cat.value === passenger.ageCategory);
        const discount = category ? category.discount : 0;
        discounted += baseTicketPrice * (1 - discount);
      });
      
      setTotalFare(baseFare);
      setDiscountedFare(Math.round(discounted));
    }
  }, [train, passengers, selectedClass]);
  
  // Passenger form validation
  const passengerValidationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be at least 3 characters'),
    age: Yup.number()
      .required('Age is required')
      .positive('Age must be positive')
      .integer('Age must be an integer')
      .max(120, 'Age must be less than 120'),
    gender: Yup.string()
      .required('Gender is required'),
    ageCategory: Yup.string()
      .required('Age category is required'),
  });
  
  // Handle passenger form submission
  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([
        ...passengers, 
        { name: '', age: '', gender: 'male', ageCategory: 'adult', seatNumber: null, berth: '' }
      ]);
    } else {
      toast.warning('You can book a maximum of 6 passengers per booking');
    }
  };
  
  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    } else {
      toast.warning('At least one passenger is required');
    }
  };
  
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    
    // Update age category based on age
    if (field === 'age') {
      const age = parseInt(value);
      if (!isNaN(age)) {
        if (age < 12 && age >= 5) {
          updatedPassengers[index].ageCategory = 'child';
        } else if (age >= 60) {
          updatedPassengers[index].ageCategory = 'senior';
        } else {
          updatedPassengers[index].ageCategory = 'adult';
        }
      }
    }
    
    setPassengers(updatedPassengers);
  };
  
  // Seat selection
  const handleOpenSeatSelection = (passengerIndex) => {
    setCurrentPassengerIndex(passengerIndex);
    setOpenSeatSelectionDialog(true);
  };
  
  const handleCloseSeatSelection = () => {
    setOpenSeatSelectionDialog(false);
  };
  
  const handleSeatSelect = (seatNumber) => {
    if (currentPassengerIndex !== null) {
      const updatedPassengers = [...passengers];
      
      // If this seat was already assigned to another passenger, remove it
      updatedPassengers.forEach((passenger, index) => {
        if (index !== currentPassengerIndex && passenger.seatNumber === seatNumber) {
          passenger.seatNumber = null;
          passenger.berth = '';
        }
      });
      
      // Assign the seat to the current passenger
      const selectedSeat = availableSeats.find(seat => seat.number === seatNumber);
      updatedPassengers[currentPassengerIndex].seatNumber = seatNumber;
      updatedPassengers[currentPassengerIndex].berth = selectedSeat.position || '';
      
      setPassengers(updatedPassengers);
      handleCloseSeatSelection();
    }
  };
  
  // Step handling
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate passenger details
      let isValid = true;
      
      for (const passenger of passengers) {
        try {
          passengerValidationSchema.validateSync(passenger, { abortEarly: false });
        } catch (err) {
          isValid = false;
          toast.error('Please fill in all required passenger details correctly');
          break;
        }
      }
      
      if (isValid) {
        setActiveStep(activeStep + 1);
      }
    } else if (activeStep === 1) {
      // Validate seat selection
      const allSeatsSelected = passengers.every(passenger => passenger.seatNumber !== null);
      
      if (allSeatsSelected) {
        setActiveStep(activeStep + 1);
      } else {
        toast.error('Please select seats for all passengers');
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  const handleSubmit = () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Process booking
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be handled by an API
      const bookingId = Math.floor(1000000000 + Math.random() * 9000000000);
      
      toast.success('Booking created successfully!');
      navigate(`/payment`, { 
        state: { 
          bookingId: bookingId,
          totalAmount: Math.round(discountedFare * 1.05),
          passengers: passengers,
          train: train,
          journeyDate: journeyDate,
          selectedClass: selectedClass
        } 
      });
    }, 1500);
  };
  
  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Loading booking page...</Typography>
        </Box>
      </Container>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/trains')}>
          Go Back to Search
        </Button>
      </Container>
    );
  }
  
  if (!train) {
    return null;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Book Your Ticket
      </Typography>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Journey Details Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {train.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({train.trainNo})
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Typography variant="body1" fontWeight="bold">
                  {train.departureTime}
                </Typography>
                <Typography variant="body2">{train.source}</Typography>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Divider sx={{ width: '100%' }} />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" fontWeight="bold">
                  {train.arrivalTime}
                </Typography>
                <Typography variant="body2">{train.destination}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body1" fontWeight="bold">
                {new Date(journeyDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Class: {CLASS_TYPES[selectedClass]} ({selectedClass})
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Passenger Details Step */}
      {activeStep === 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Passenger Details
            </Typography>
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddPassenger}
              variant="outlined"
              disabled={passengers.length >= 6}
            >
              Add Passenger
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Please enter details as per government ID proof. ID verification may be required during journey.
            </Typography>
          </Alert>
          
          {passengers.map((passenger, index) => (
            <Box key={index} sx={{ mb: 4, pb: 3, borderBottom: index !== passengers.length - 1 ? '1px dashed rgba(0, 0, 0, 0.12)' : 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Passenger {index + 1}
                </Typography>
                {passengers.length > 1 && (
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => handleRemovePassenger(index)}
                    aria-label="remove passenger"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    required
                    error={!passenger.name && passenger.name !== ''}
                    helperText={!passenger.name && passenger.name !== '' ? 'Name is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    required
                    error={!passenger.age && passenger.age !== ''}
                    helperText={!passenger.age && passenger.age !== '' ? 'Age is required' : ''}
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                  <FormControl fullWidth required>
                    <FormLabel id={`gender-label-${index}`}>Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby={`gender-label-${index}`}
                      name={`gender-${index}`}
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel id={`age-category-label-${index}`}>Age Category</InputLabel>
                    <Select
                      labelId={`age-category-label-${index}`}
                      value={passenger.ageCategory}
                      label="Age Category"
                      onChange={(e) => handlePassengerChange(index, 'ageCategory', e.target.value)}
                    >
                      {AGE_CATEGORIES.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label} {category.discount > 0 && `(${category.discount * 100}% off)`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              onClick={() => navigate(`/trains/${trainId}?class=${selectedClass}&date=${journeyDate}`)}
              startIcon={<ArrowBackIcon />}
            >
              Back to Train Details
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
            >
              Continue to Seat Selection
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Seat Selection Step */}
      {activeStep === 1 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            <SeatIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Seat Selection
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Click on each passenger row to select a seat. Green seats are available, grey seats are already booked.
            </Typography>
          </Alert>
          
          <Grid container spacing={2}>
            {passengers.map((passenger, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleOpenSeatSelection(index)}
                >
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={6} md={4}>
                        <Typography variant="subtitle1">
                          {passenger.name || `Passenger ${index + 1}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {passenger.age ? `${passenger.age} years, ` : ''} 
                          {passenger.gender === 'male' ? 'Male' : 'Female'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        {passenger.seatNumber ? (
                          <Box>
                            <Typography variant="subtitle1" color="primary">
                              Seat {passenger.seatNumber}
                            </Typography>
                            {passenger.berth && (
                              <Typography variant="body2" color="text.secondary">
                                {passenger.berth} Berth
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="error">
                            No seat selected
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSeatSelection(index);
                          }}
                        >
                          {passenger.seatNumber ? 'Change Seat' : 'Select Seat'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack}>
              Back
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={!passengers.every(p => p.seatNumber)}
            >
              Continue to Review
            </Button>
          </Box>
          
          {/* Seat Selection Dialog */}
          <Dialog
            open={openSeatSelectionDialog}
            onClose={handleCloseSeatSelection}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Select a Seat
              {currentPassengerIndex !== null && (
                <Typography variant="subtitle1" component="span">
                  {' '}for {passengers[currentPassengerIndex].name || `Passenger ${currentPassengerIndex + 1}`}
                </Typography>
              )}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 24, height: 24, bgcolor: 'success.light', borderRadius: 1 }} />
                  <Typography variant="body2">Available</Typography>
                  <Box sx={{ width: 24, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
                  <Typography variant="body2">Booked</Typography>
                  <Box sx={{ width: 24, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                  <Typography variant="body2">Selected</Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Coach: {selectedClass} | Total Seats: {availableSeats.length}
                </Typography>
              </Box>
              
              <Grid container spacing={1}>
                {availableSeats.map((seat) => {
                  const isSelected = passengers.some(p => p.seatNumber === seat.number);
                  const isSelectedByCurrent = currentPassengerIndex !== null && 
                    passengers[currentPassengerIndex].seatNumber === seat.number;
                  
                  return (
                    <Grid item xs={2} sm={1} key={seat.number}>
                      <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        color={isSelectedByCurrent ? 'primary' : isSelected ? 'secondary' : 'success'}
                        disabled={!seat.available || (isSelected && !isSelectedByCurrent)}
                        onClick={() => handleSeatSelect(seat.number)}
                        sx={{ 
                          minWidth: '40px',
                          height: '40px',
                          p: 0,
                          borderRadius: 1,
                          bgcolor: !seat.available && !isSelected ? 'grey.300' : undefined
                        }}
                      >
                        {seat.number}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
              
              {(selectedClass === 'SL' || selectedClass.includes('A')) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Berth Preference:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berth preferences are automatically assigned based on seat selection, but can be adjusted if available.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSeatSelection}>Cancel</Button>
              <Button onClick={handleCloseSeatSelection} variant="contained">
                Confirm Selection
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}
      
      {/* Review & Payment Step */}
      {activeStep === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: { xs: 3, md: 0 } }}>
              <Typography variant="h6" gutterBottom>
                Review Booking Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Passenger Information
                </Typography>
                <Grid container spacing={2}>
                  {passengers.map((passenger, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={7} md={4}>
                              <Typography variant="subtitle2">
                                {passenger.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {passenger.age} years, {passenger.gender === 'male' ? 'Male' : 'Female'}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} md={3}>
                              <Typography variant="subtitle2">
                                Seat {passenger.seatNumber}
                              </Typography>
                              {passenger.berth && (
                                <Typography variant="body2" color="text.secondary">
                                  {passenger.berth} Berth
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Typography variant="subtitle2">
                                  {AGE_CATEGORIES.find(cat => cat.value === passenger.ageCategory).label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  {AGE_CATEGORIES.find(cat => cat.value === passenger.ageCategory).discount > 0 
                                    ? `(${AGE_CATEGORIES.find(cat => cat.value === passenger.ageCategory).discount * 100}% off)` 
                                    : ''}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                Fare: ₹{Math.round(train.price[selectedClass] * 
                                  (1 - AGE_CATEGORIES.find(cat => cat.value === passenger.ageCategory).discount))}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Contact Information
                </Typography>
                <Alert severity="info">
                  <Typography variant="body2">
                    Ticket details will be sent to your registered email and phone number. Make sure your contact details are up to date in your profile.
                  </Typography>
                </Alert>
              </Box>
              
              <Box>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={termsAccepted} 
                      onChange={(e) => setTermsAccepted(e.target.checked)} 
                      required
                    />
                  } 
                  label={
                    <Typography variant="body2">
                      I agree to the terms and conditions, and confirm that all passenger details are correct
                    </Typography>
                  }
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Fare Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Base Fare ({passengers.length} Passengers)</Typography>
                  <Typography variant="body2">₹{totalFare}</Typography>
                </Box>
                
                {totalFare !== discountedFare && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">Discount</Typography>
                    <Typography variant="body2" color="success.main">-₹{totalFare - discountedFare}</Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">GST (5%)</Typography>
                  <Typography variant="body2">₹{Math.round(discountedFare * 0.05)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    ₹{Math.round(discountedFare * 1.05)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!termsAccepted}
                >
                  Proceed to Payment
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BookingPage; 