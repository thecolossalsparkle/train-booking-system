import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  Grid,
  TextField,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Train as TrainIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle,
  MoreVert as MoreIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Footer component
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
          <Box sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" component="div" gutterBottom>
              TrainBooker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop solution for train bookings
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" component="div" gutterBottom>
              Quick Links
            </Typography>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Home
              </Typography>
            </Link>
            <Link to="/trains" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Search Trains
              </Typography>
            </Link>
            <Link to="/bookings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                My Bookings
              </Typography>
            </Link>
          </Box>
          <Box>
            <Typography variant="subtitle1" component="div" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: support@trainbooker.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Phone: +1 (555) 123-4567
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} TrainBooker. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Define state variables
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuId = 'primary-account-menu';

  // Add handler functions
  const handleProfileMenuOpen = (event) => {
    console.log('Profile menu opened');
  };

  const handleMobileMenuOpen = (event) => {
    console.log('Mobile menu opened');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    // Here you would typically dispatch a logout action
    // For example: dispatch(logout());
    navigate('/login');
  };

  // Reference to container (for drawer)
  const container = window !== undefined ? () => window.document.body : undefined;
  
  // Drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ my: 2, mx: 2 }}>
        TrainBooker
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" selected={location.pathname === '/'}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/trains" selected={location.pathname === '/trains'}>
            <ListItemIcon>
              <TrainIcon />
            </ListItemIcon>
            <ListItemText primary="Find Trains" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/bookings" selected={location.pathname === '/bookings'}>
                <ListItemIcon>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile" selected={location.pathname === '/profile'}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        {!isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login / Register" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.3rem' }
            }}
          >
            <TrainIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }} />
            TrainBooker
          </Typography>
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              sx={{ 
                fontWeight: 500,
                px: 2,
                borderRadius: 2,
                position: 'relative',
                '&::after': location.pathname === '/' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  bgcolor: 'white',
                  borderRadius: '2px'
                } : {}
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/trains" 
              sx={{ 
                fontWeight: 500,
                px: 2,
                borderRadius: 2,
                position: 'relative',
                '&::after': location.pathname === '/trains' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  bgcolor: 'white',
                  borderRadius: '2px'
                } : {}
              }}
            >
              Find Trains
            </Button>
            {isAuthenticated && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/bookings" 
                sx={{ 
                  fontWeight: 500,
                  px: 2,
                  borderRadius: 2,
                  position: 'relative',
                  '&::after': location.pathname === '/bookings' ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '3px',
                    bgcolor: 'white',
                    borderRadius: '2px'
                  } : {}
                }}
              >
                My Bookings
              </Button>
            )}
          </Box>
          
          {/* Auth buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ 
                    ml: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500,
                    borderRadius: 2
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{ 
                    ml: { xs: 0, sm: 1 },
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Register
                </Button>
                <IconButton
                  color="inherit"
                  edge="end"
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                  sx={{ display: { sm: 'none' } }}
                >
                  <MoreIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Responsive drawer */}
      <Box>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundImage: 'linear-gradient(to right, #1a73e8, #0d47a1)',
          }}
        >
          {/* ... existing AppBar content ... */}
        </AppBar>
        
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 250,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box component="main" sx={{ flexGrow: 1, p: 0, width: '100%' }}>
          <Toolbar />
          <Outlet />
          
          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              bgcolor: 'background.paper',
              py: 4,
              px: 2,
              mt: 'auto',
              borderTop: '1px solid',
              borderColor: 'divider'
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
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 