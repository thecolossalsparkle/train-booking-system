import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Paper,
  Divider,
  Stack,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import {
  Train as TrainIcon,
  ArrowRightAlt as ArrowIcon,
  AccessTime as TimeIcon,
  LocalOffer as OfferIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

// Mock data for stations
const STATIONS = [
  'New Delhi', 'Mumbai Central', 'Chennai Central', 'Kolkata', 
  'Bangalore City', 'Hyderabad', 'Ahmedabad', 'Pune', 
  'Jaipur', 'Lucknow', 'Bhopal', 'Chandigarh'
];

// Featured destinations data
const FEATURED_DESTINATIONS = [
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
    description: 'The financial capital with vibrant culture and historic sites',
  },
  {
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    description: 'India\'s capital with rich history and modern infrastructure',
  },
  {
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2',
    description: 'The Silicon Valley of India with pleasant weather',
  },
  {
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
    description: 'Cultural capital of South India with beautiful beaches',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchError, setSearchError] = useState('');

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
    
    // Navigate to train search page with query params
    navigate(`/trains?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${date}`);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.8s ease-out' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          color: 'white',
          mb: 8,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1474487548417-781cb71495f3)`,
          height: 500,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: { xs: '100%', md: '60%' } }}>
            <Typography 
              component="h1" 
              variant="h2" 
              color="inherit" 
              gutterBottom 
              className="gradient-text"
              sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 1s ease-out',
                mb: 2
              }}
            >
              Travel Made Simple
            </Typography>
            <Typography 
              variant="h5" 
              color="inherit" 
              paragraph
              sx={{ 
                fontWeight: 400,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                opacity: 0.9,
                animation: 'slideIn 1s ease-out',
                mb: 4
              }}
            >
              Book train tickets quickly and easily with TrainBooker.
              Find the best routes, prices, and schedules all in one place.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.4)',
                animation: 'fadeIn 1.4s ease-out',
                backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
              }}
              onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Book Now
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Search Box */}
      <Container maxWidth="md" sx={{ mb: 8 }} id="search-section">
        <Card 
          elevation={8} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            transform: 'translateY(-30px)',
            background: 'white',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(to right, #1a73e8, #0d47a1)',
              zIndex: 1
            }
          }}
          className="hover-lift"
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                Find Your Train
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your travel details to search for available trains
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  id="from-station"
                  options={STATIONS}
                  value={source}
                  onChange={(event, newValue) => {
                    setSource(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!searchError}
                      helperText={searchError}
                      InputProps={{
                        ...params.InputProps,
                        sx: { 
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(26, 115, 232, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(26, 115, 232, 0.5)',
                          }
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ArrowIcon color="primary" />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Autocomplete
                  id="to-station"
                  options={STATIONS}
                  value={destination}
                  onChange={(event, newValue) => {
                    setDestination(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!searchError}
                      helperText={searchError}
                      InputProps={{
                        ...params.InputProps,
                        sx: { 
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(26, 115, 232, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(26, 115, 232, 0.5)',
                          }
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  id="travel-date"
                  label="Travel Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  error={!!searchError}
                  helperText={searchError}
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(26, 115, 232, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(26, 115, 232, 0.5)',
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {searchError && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {searchError}
              </Typography>
            )}
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{ 
                  px: 5, 
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
                  boxShadow: '0 4px 14px rgba(26, 115, 232, 0.3)',
                }}
              >
                Search Trains
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Why Choose Us */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(to right, #1a73e8, #0d47a1)',
                bottom: '-10px',
                left: 'calc(50% - 30px)',
                borderRadius: '2px'
              }
            }}
          >
            Why Choose TrainBooker
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              mt: 4,
              mb: 2
            }}
          >
            We offer the best train booking experience with numerous benefits
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }
              }}
              className="hover-lift"
            >
              <Box 
                sx={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(26, 115, 232, 0.1)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <TimeIcon color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Fast Booking</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Book your tickets in less than 2 minutes with our streamlined process
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }
              }}
              className="hover-lift"
            >
              <Box 
                sx={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 111, 0, 0.1)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <OfferIcon sx={{ color: 'secondary.main' }} fontSize="large" />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Best Prices</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Get access to exclusive discounts and the best fare options
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }
              }}
              className="hover-lift"
            >
              <Box 
                sx={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(52, 168, 83, 0.1)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <SecurityIcon sx={{ color: '#34A853' }} fontSize="large" />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Secure Payments</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                All transactions are protected with industry-standard security measures
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }
              }}
              className="hover-lift"
            >
              <Box 
                sx={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(66, 133, 244, 0.1)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <SupportIcon color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>24/7 Support</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Our customer service team is available round-the-clock to assist you
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Destinations */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(to right, #1a73e8, #0d47a1)',
                bottom: '-10px',
                left: 'calc(50% - 30px)',
                borderRadius: '2px'
              }
            }}
          >
            Popular Destinations
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              mt: 4,
              mb: 2
            }}
          >
            Explore these top destinations with frequent train connections
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {FEATURED_DESTINATIONS.map((destination, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                  },
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column'
                }}
                className="hover-lift"
              >
                <CardActionArea 
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
                  onClick={() => {
                    setSource('');
                    setDestination(destination.name);
                    document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Box sx={{ position: 'relative', height: 180, width: '100%' }}>
                    <CardMedia
                      component="img"
                      image={destination.image}
                      alt={destination.name}
                      sx={{ 
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    }} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {destination.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
            backgroundImage: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(26, 115, 232, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              zIndex: 0
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              zIndex: 0
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                mb: 4, 
                maxWidth: '700px', 
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Sign up today and receive special offers, personalized recommendations, and travel insights to enhance your journey.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => navigate('/register')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Create an Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 