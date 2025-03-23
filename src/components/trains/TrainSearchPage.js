import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Train as TrainIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  TrainOutlined as TrainOutlinedIcon,
  SwapVert as SwapIcon,
  ArrowRightAlt as ArrowRightIcon,
} from '@mui/icons-material';

// Mock data for stations
const STATIONS = [
  'New Delhi', 'Mumbai Central', 'Chennai Central', 'Kolkata', 
  'Bangalore City', 'Hyderabad', 'Ahmedabad', 'Pune', 
  'Jaipur', 'Lucknow', 'Bhopal', 'Chandigarh'
];

// Mock data for train results
const generateMockTrains = (source, destination) => {
  const mockTrains = [
    {
      id: 1,
      trainNo: 'EXP1234',
      name: 'Rajdhani Express',
      source: source || 'New Delhi',
      destination: destination || 'Mumbai Central',
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
      source: source || 'New Delhi',
      destination: destination || 'Mumbai Central',
      departureTime: '08:30',
      arrivalTime: '23:45',
      duration: '15h 15m',
      classes: ['CC', 'EC'],
      price: { 'CC': 1500, 'EC': 2800 },
      availableSeats: { 'CC': 65, 'EC': 30 },
      daysOfWeek: ['Daily'],
    },
    {
      id: 3,
      trainNo: 'GR9012',
      name: 'Duronto Express',
      source: source || 'New Delhi',
      destination: destination || 'Mumbai Central',
      departureTime: '16:15',
      arrivalTime: '08:10',
      duration: '15h 55m',
      classes: ['1A', '2A', '3A', 'SL'],
      price: { '1A': 3500, '2A': 2100, '3A': 1350, 'SL': 700 },
      availableSeats: { '1A': 8, '2A': 18, '3A': 36, 'SL': 95 },
      daysOfWeek: ['Tue', 'Thu', 'Sat'],
    },
    {
      id: 4,
      trainNo: 'SUP3456',
      name: 'Garib Rath',
      source: source || 'New Delhi',
      destination: destination || 'Mumbai Central',
      departureTime: '23:55',
      arrivalTime: '17:30',
      duration: '17h 35m',
      classes: ['3A', 'SL'],
      price: { '3A': 950, 'SL': 480 },
      availableSeats: { '3A': 72, 'SL': 150 },
      daysOfWeek: ['Mon', 'Thu', 'Sat'],
    },
  ];
  
  return mockTrains;
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

const TrainSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Search parameters
  const [source, setSource] = useState(queryParams.get('source') || '');
  const [destination, setDestination] = useState(queryParams.get('destination') || '');
  const [date, setDate] = useState(queryParams.get('date') || new Date().toISOString().split('T')[0]);
  const [classType, setClassType] = useState('');
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [trainResults, setTrainResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  
  // Filter states
  const [departureTime, setDepartureTime] = useState('any');
  const [sortBy, setSortBy] = useState('departureTime');
  
  // Effect to check if URL has search parameters
  useEffect(() => {
    if (source && destination) {
      handleSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleSearch = () => {
    // Form validation
    if (!source || !destination) {
      setSearchError('Please select both source and destination stations');
      return;
    }
    
    if (source === destination) {
      setSearchError('Source and destination cannot be the same');
      return;
    }
    
    setSearchError('');
    setSearchPerformed(true);
    setIsSearching(true);
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set('source', source);
    params.set('destination', destination);
    params.set('date', date);
    navigate(`/trains?${params.toString()}`, { replace: true });
    
    // Simulate API call
    setTimeout(() => {
      const results = generateMockTrains(source, destination);
      setTrainResults(results);
      setIsSearching(false);
    }, 1500);
  };
  
  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };
  
  const handleDepartureTimeChange = (event) => {
    setDepartureTime(event.target.value);
  };
  
  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };
  
  const handleSelectTrain = (trainId, classCode) => {
    navigate(`/trains/${trainId}?class=${classCode}&date=${date}`);
  };
  
  // Filter and sort trains
  const filteredTrains = trainResults.filter(train => {
    if (departureTime === 'any') return true;
    if (departureTime === 'morning' && parseInt(train.departureTime.split(':')[0]) >= 5 && parseInt(train.departureTime.split(':')[0]) < 12) return true;
    if (departureTime === 'afternoon' && parseInt(train.departureTime.split(':')[0]) >= 12 && parseInt(train.departureTime.split(':')[0]) < 17) return true;
    if (departureTime === 'evening' && parseInt(train.departureTime.split(':')[0]) >= 17 && parseInt(train.departureTime.split(':')[0]) < 21) return true;
    if (departureTime === 'night' && (parseInt(train.departureTime.split(':')[0]) >= 21 || parseInt(train.departureTime.split(':')[0]) < 5)) return true;
    return false;
  }).sort((a, b) => {
    if (sortBy === 'departureTime') {
      return parseInt(a.departureTime.replace(':', '')) - parseInt(b.departureTime.replace(':', ''));
    } else if (sortBy === 'duration') {
      const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', '').trim());
      const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', '').trim());
      return durationA - durationB;
    } else if (sortBy === 'price') {
      const minPriceA = Math.min(...Object.values(a.price));
      const minPriceB = Math.min(...Object.values(b.price));
      return minPriceA - minPriceB;
    }
    return 0;
  });
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Find Trains
      </Typography>
      
      {/* Search Form */}
      <Paper elevation={3} sx={{ mb: 5, p: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={STATIONS}
              value={source}
              onChange={(event, newValue) => {
                setSource(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="From" fullWidth required />}
            />
          </Grid>
          
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleSwapStations} color="primary" sx={{ p: 1.5 }}>
              <SwapIcon />
            </IconButton>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={STATIONS}
              value={destination}
              onChange={(event, newValue) => {
                setDestination(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="To" fullWidth required />}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              label="Date of Journey"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        
        {searchError && (
          <Typography color="error" variant="body2" sx={{ mt: 3 }}>
            {searchError}
          </Typography>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ px: 5, py: 1.5, borderRadius: 2 }}
          >
            Search Trains
          </Button>
        </Box>
      </Paper>
      
      {isSearching && (
        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress />
        </Box>
      )}
      
      {searchPerformed && !isSearching && (
        <Grid container spacing={4}>
          {/* Filters */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterIcon />
                Filters
              </Typography>
              <Divider sx={{ my: 3 }} />
              
              <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
                <FormLabel component="legend">Departure Time</FormLabel>
                <RadioGroup
                  aria-label="departure-time"
                  name="departure-time"
                  value={departureTime}
                  onChange={handleDepartureTimeChange}
                  sx={{ mt: 1.5 }}
                >
                  <FormControlLabel value="any" control={<Radio />} label="Any Time" />
                  <FormControlLabel value="morning" control={<Radio />} label="Morning (5:00 - 11:59)" />
                  <FormControlLabel value="afternoon" control={<Radio />} label="Afternoon (12:00 - 16:59)" />
                  <FormControlLabel value="evening" control={<Radio />} label="Evening (17:00 - 20:59)" />
                  <FormControlLabel value="night" control={<Radio />} label="Night (21:00 - 4:59)" />
                </RadioGroup>
              </FormControl>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortByChange}
                >
                  <MenuItem value="departureTime">Departure Time</MenuItem>
                  <MenuItem value="duration">Journey Duration</MenuItem>
                  <MenuItem value="price">Price (Low to High)</MenuItem>
                </Select>
              </FormControl>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControl fullWidth>
                <InputLabel id="class-type-label">Class Type</InputLabel>
                <Select
                  labelId="class-type-label"
                  id="class-type"
                  value={classType}
                  label="Class Type"
                  onChange={(e) => setClassType(e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  <MenuItem value="1A">First AC (1A)</MenuItem>
                  <MenuItem value="2A">Second AC (2A)</MenuItem>
                  <MenuItem value="3A">Third AC (3A)</MenuItem>
                  <MenuItem value="SL">Sleeper (SL)</MenuItem>
                  <MenuItem value="CC">Chair Car (CC)</MenuItem>
                  <MenuItem value="EC">Executive Chair Car (EC)</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          
          {/* Results */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {filteredTrains.length} trains found
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {formatDate(date)} • {source} to {destination}
              </Typography>
            </Box>
            
            {filteredTrains.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No trains found matching your criteria. Please try different filters.
              </Alert>
            ) : (
              filteredTrains.map((train) => (
                <Card key={train.id} sx={{ mb: 4, borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrainIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
                            <Typography variant="h6">{train.name}</Typography>
                          </Box>
                          <Chip 
                            label={train.trainNo} 
                            size="medium" 
                            variant="outlined" 
                            icon={<TrainOutlinedIcon />} 
                            sx={{ px: 1 }}
                          />
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>{train.departureTime}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{train.source}</Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          <TimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.8 }} />
                          {train.duration}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                          <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                          <ArrowRightIcon color="action" sx={{ mx: 1 }} />
                          <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                          Runs on: {train.daysOfWeek.join(', ')}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>{train.arrivalTime}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{train.destination}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Available Classes:</Typography>
                        
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3 }}>
                            <Typography>View all classes and prices</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 3, pt: 2, pb: 3 }}>
                            <Grid container spacing={3}>
                              {train.classes.map((cls) => (
                                <Grid item xs={12} sm={6} md={3} key={cls}>
                                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                      <Box sx={{ mb: 1.5 }}>
                                        <Typography variant="h6" component="span">
                                          {CLASS_TYPES[cls]}
                                        </Typography>
                                        <Typography variant="caption" component="span" sx={{ ml: 1 }}>
                                          ({cls})
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                                        <Typography variant="h6" color="primary">
                                          ₹{train.price[cls]}
                                        </Typography>
                                        <Typography variant="body2">
                                          {train.availableSeats[cls]} seats
                                        </Typography>
                                      </Box>
                                      <Button 
                                        variant="contained" 
                                        fullWidth 
                                        sx={{ mt: 2, borderRadius: 1.5 }}
                                        onClick={() => handleSelectTrain(train.id, cls)}
                                      >
                                        Book Now
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TrainSearchPage; 