import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
} from '@mui/material';
import {
  Train as TrainIcon,
  AccessTime as TimeIcon,
  EventSeat as SeatIcon,
  Restaurant as RestaurantIcon,
  Wifi as WifiIcon,
  Power as PowerIcon,
  AcUnit as AcIcon,
  Wc as WcIcon,
  LocalAtm as FareIcon,
  Info as InfoIcon,
  DirectionsRailway as RailwayIcon,
  People as PeopleIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock train data
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
      distance: '1384 km',
      avgSpeed: '84 km/h',
      rating: 4.5,
      reviews: 382,
      amenities: [
        { name: 'Wi-Fi', available: true, icon: <WifiIcon /> },
        { name: 'Food', available: true, icon: <RestaurantIcon /> },
        { name: 'Charging Points', available: true, icon: <PowerIcon /> },
        { name: 'AC', available: true, icon: <AcIcon /> },
        { name: 'Blankets', available: true, icon: <SeatIcon /> },
        { name: 'Bio Toilets', available: true, icon: <WcIcon /> },
      ],
      stops: [
        { station: 'New Delhi', arrivalTime: '-', departureTime: '06:00', day: 1, distance: '0 km' },
        { station: 'Mathura Junction', arrivalTime: '07:30', departureTime: '07:35', day: 1, distance: '141 km' },
        { station: 'Agra Cantt', arrivalTime: '08:20', departureTime: '08:25', day: 1, distance: '194 km' },
        { station: 'Gwalior', arrivalTime: '10:00', departureTime: '10:05', day: 1, distance: '305 km' },
        { station: 'Jhansi', arrivalTime: '11:25', departureTime: '11:30', day: 1, distance: '411 km' },
        { station: 'Bhopal', arrivalTime: '14:15', departureTime: '14:25', day: 1, distance: '702 km' },
        { station: 'Itarsi Junction', arrivalTime: '16:10', departureTime: '16:15', day: 1, distance: '830 km' },
        { station: 'Nagpur', arrivalTime: '19:55', departureTime: '20:05', day: 1, distance: '1092 km' },
        { station: 'Mumbai Central', arrivalTime: '22:30', departureTime: '-', day: 1, distance: '1384 km' },
      ],
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
      distance: '1384 km',
      avgSpeed: '91 km/h',
      rating: 4.7,
      reviews: 421,
      amenities: [
        { name: 'Wi-Fi', available: true, icon: <WifiIcon /> },
        { name: 'Food', available: true, icon: <RestaurantIcon /> },
        { name: 'Charging Points', available: true, icon: <PowerIcon /> },
        { name: 'AC', available: true, icon: <AcIcon /> },
        { name: 'Blankets', available: false, icon: <SeatIcon /> },
        { name: 'Bio Toilets', available: true, icon: <WcIcon /> },
      ],
      stops: [
        { station: 'New Delhi', arrivalTime: '-', departureTime: '08:30', day: 1, distance: '0 km' },
        { station: 'Ghaziabad', arrivalTime: '09:00', departureTime: '09:02', day: 1, distance: '29 km' },
        { station: 'Mathura Junction', arrivalTime: '10:30', departureTime: '10:35', day: 1, distance: '141 km' },
        { station: 'Agra Cantt', arrivalTime: '11:40', departureTime: '11:45', day: 1, distance: '194 km' },
        { station: 'Gwalior', arrivalTime: '13:20', departureTime: '13:25', day: 1, distance: '305 km' },
        { station: 'Jhansi', arrivalTime: '14:45', departureTime: '14:50', day: 1, distance: '411 km' },
        { station: 'Bhopal', arrivalTime: '17:35', departureTime: '17:45', day: 1, distance: '702 km' },
        { station: 'Itarsi Junction', arrivalTime: '19:30', departureTime: '19:35', day: 1, distance: '830 km' },
        { station: 'Mumbai Central', arrivalTime: '23:45', departureTime: '-', day: 1, distance: '1384 km' },
      ],
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

const TrainDetailsPage = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(queryParams.get('class') || '');
  const [journeyDate, setJourneyDate] = useState(queryParams.get('date') || new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    // Simulate API call to fetch train details
    setLoading(true);
    setTimeout(() => {
      const fetchedTrain = getTrainById(trainId);
      if (fetchedTrain) {
        setTrain(fetchedTrain);
        // If no class is selected or the selected class is not available for this train
        if (!selectedClass || !fetchedTrain.classes.includes(selectedClass)) {
          setSelectedClass(fetchedTrain.classes[0]);
        }
      } else {
        setError('Train not found');
      }
      setLoading(false);
    }, 1000);
  }, [trainId, selectedClass]);
  
  const handleClassChange = (classCode) => {
    setSelectedClass(classCode);
  };
  
  const handleBooking = () => {
    navigate(`/booking/${trainId}?class=${selectedClass}&date=${journeyDate}`);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Loading train details...</Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
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
      {/* Train Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrainIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h5">{train.name}</Typography>
                <Chip 
                  label={train.trainNo} 
                  size="small" 
                  variant="outlined" 
                  sx={{ ml: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={train.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({train.reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Typography variant="h5">{train.departureTime}</Typography>
            <Typography variant="body1">{train.source}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(journeyDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                <TimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {train.duration} • {train.distance}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 1 }}>
                <Box sx={{ flex: 1, height: 4, bgcolor: 'primary.light', borderRadius: 2 }} />
                <ArrowForwardIcon color="primary" sx={{ mx: 1 }} />
                <Box sx={{ flex: 1, height: 4, bgcolor: 'primary.light', borderRadius: 2 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Runs on: {train.daysOfWeek.join(', ')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
            <Typography variant="h5">{train.arrivalTime}</Typography>
            <Typography variant="body1">{train.destination}</Typography>
            <Typography variant="caption" color="text.secondary">
              {train.stops[train.stops.length - 1].day > 1 ? '+' + (train.stops[train.stops.length - 1].day - 1) : 'Same'} day
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Class Selection and Booking */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Route and Schedule */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RailwayIcon color="primary" />
              Route & Schedule
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TableContainer>
              <Table aria-label="train schedule">
                <TableHead>
                  <TableRow>
                    <TableCell>Station</TableCell>
                    <TableCell align="center">Arrives</TableCell>
                    <TableCell align="center">Departs</TableCell>
                    <TableCell align="center">Day</TableCell>
                    <TableCell align="right">Distance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {train.stops.map((stop, index) => (
                    <TableRow 
                      key={stop.station}
                      sx={{ 
                        bgcolor: index === 0 || index === train.stops.length - 1 
                          ? 'rgba(25, 118, 210, 0.08)' 
                          : 'inherit'
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body2" fontWeight={index === 0 || index === train.stops.length - 1 ? 'bold' : 'normal'}>
                          {stop.station}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{stop.arrivalTime}</TableCell>
                      <TableCell align="center">{stop.departureTime}</TableCell>
                      <TableCell align="center">{stop.day}</TableCell>
                      <TableCell align="right">{stop.distance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {/* Amenities */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Train Amenities
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              {train.amenities.map((amenity) => (
                <Grid item xs={6} sm={4} key={amenity.name}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      opacity: amenity.available ? 1 : 0.5
                    }}
                  >
                    <Box sx={{ color: amenity.available ? 'primary.main' : 'text.disabled', mb: 1 }}>
                      {amenity.icon}
                    </Box>
                    <Typography variant="body2" textAlign="center">
                      {amenity.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      {amenity.available ? 'Available' : 'Not Available'}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          {/* Additional Info */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Additional Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Average speed of this train is {train.avgSpeed}. Ticket can be booked up to 120 days in advance.
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Passenger Information" 
                      secondary="Valid ID proof is mandatory for all passengers during the journey."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FareIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fare Information" 
                      secondary="Fares shown are base fares. Additional charges may apply."
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cancellation Policy" 
                      secondary="Cancellation charges depend on how much in advance you cancel your ticket."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RestaurantIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Food Options" 
                      secondary="Pantry car available. Food can be purchased on board or pre-ordered."
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Booking Card */}
          <Paper elevation={4} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Book Your Ticket
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {new Date(journeyDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Select Class:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {train.classes.map((cls) => (
                <Grid item xs={6} key={cls}>
                  <Card 
                    variant={selectedClass === cls ? 'elevation' : 'outlined'}
                    onClick={() => handleClassChange(cls)}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: selectedClass === cls ? 'primary.light' : 'background.paper',
                      color: selectedClass === cls ? 'primary.contrastText' : 'inherit',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: selectedClass === cls ? 'primary.light' : 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" component="div" fontWeight="bold">
                        {CLASS_TYPES[cls]}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                        ({cls})
                      </Typography>
                      <Typography variant="h6" color={selectedClass === cls ? 'inherit' : 'primary'}>
                        ₹{train.price[cls]}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {train.availableSeats[cls]} seats left
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Prices are per person and include all taxes and fees.
              </Typography>
            </Alert>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBooking}
              disabled={!selectedClass}
              sx={{ py: 1.5 }}
            >
              Proceed to Book
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrainDetailsPage; 