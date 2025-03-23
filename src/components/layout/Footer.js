import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import {
  Train as TrainIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        py: 4,
        px: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
        marginTop: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                fontWeight: 700
              }}
            >
              <TrainIcon />
              TrainBooker
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Book train tickets quickly and easily. Find the best routes, prices, and schedules all in one place.
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    Home
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="/trains" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    Find Trains
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    Register
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Support
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    Help Center
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    Contact Us
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="text.secondary">
                    FAQs
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <IconButton size="small" sx={{ bgcolor: 'rgba(26, 115, 232, 0.1)', color: 'primary.main' }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: 'rgba(26, 115, 232, 0.1)', color: 'primary.main' }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: 'rgba(26, 115, 232, 0.1)', color: 'primary.main' }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subscribe to our newsletter:
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField
                size="small"
                placeholder="Your email"
                variant="outlined"
                sx={{ 
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px 0 0 4px",
                    bgcolor: 'background.paper'
                  }
                }}
              />
              <Button 
                variant="contained" 
                size="small"
                sx={{ 
                  borderRadius: "0 4px 4px 0",
                  backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)'
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Box 
          sx={{ 
            borderTop: 1, 
            borderColor: 'divider', 
            mt: 3, 
            pt: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} TrainBooker. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link to="#" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="text.secondary">
                Privacy Policy
              </Typography>
            </Link>
            <Link to="#" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="text.secondary">
                Terms of Service
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 