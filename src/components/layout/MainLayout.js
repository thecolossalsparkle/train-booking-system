import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
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
  Container,
  useScrollTrigger,
  Slide,
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
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Footer from './Footer';

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Define state variables
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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
  
  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
  
  // Drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        background: 'linear-gradient(to right, #1a73e8, #0d47a1)',
        color: 'white'
      }}>
        <TrainIcon fontSize="large" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          TrainBooker
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/" 
            selected={isActiveRoute('/')}
            sx={{
              borderLeft: isActiveRoute('/') ? '4px solid #1a73e8' : '4px solid transparent',
              backgroundColor: isActiveRoute('/') ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(26, 115, 232, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <HomeIcon color={isActiveRoute('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{
                fontWeight: isActiveRoute('/') ? 600 : 400,
                color: isActiveRoute('/') ? 'primary' : 'inherit',
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/trains" 
            selected={isActiveRoute('/trains')}
            sx={{
              borderLeft: isActiveRoute('/trains') ? '4px solid #1a73e8' : '4px solid transparent',
              backgroundColor: isActiveRoute('/trains') ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(26, 115, 232, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <TrainIcon color={isActiveRoute('/trains') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Find Trains"
              primaryTypographyProps={{
                fontWeight: isActiveRoute('/trains') ? 600 : 400,
                color: isActiveRoute('/trains') ? 'primary' : 'inherit',
              }}
            />
          </ListItemButton>
        </ListItem>
        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/bookings" 
                selected={isActiveRoute('/bookings')}
                sx={{
                  borderLeft: isActiveRoute('/bookings') ? '4px solid #1a73e8' : '4px solid transparent',
                  backgroundColor: isActiveRoute('/bookings') ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 115, 232, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  <BookmarkIcon color={isActiveRoute('/bookings') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="My Bookings"
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute('/bookings') ? 600 : 400,
                    color: isActiveRoute('/bookings') ? 'primary' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/profile" 
                selected={isActiveRoute('/profile')}
                sx={{
                  borderLeft: isActiveRoute('/profile') ? '4px solid #1a73e8' : '4px solid transparent',
                  backgroundColor: isActiveRoute('/profile') ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 115, 232, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  <PersonIcon color={isActiveRoute('/profile') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="My Profile"
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute('/profile') ? 600 : 400,
                    color: isActiveRoute('/profile') ? 'primary' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List sx={{ pt: 1 }}>
        {!isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/login"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(26, 115, 232, 0.04)',
                },
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login / Register" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(26, 115, 232, 0.04)',
                },
              }}
            >
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
      <CssBaseline />
      
      {/* App Bar */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={scrolled ? 4 : 0}
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: 'all 0.3s ease',
            background: scrolled 
              ? 'linear-gradient(to right, #1a73e8, #0d47a1)' 
              : 'linear-gradient(to right, rgba(26, 115, 232, 0.95), rgba(13, 71, 161, 0.95))',
            backdropFilter: 'blur(8px)',
            borderBottom: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'all 0.3s ease',
                mr: { xs: 0, md: 3 }
              }}>
                <TrainIcon sx={{ 
                  fontSize: { xs: '1.8rem', sm: '2rem' },
                  mr: 1,
                  transition: 'all 0.3s ease'
                }} />
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', sm: '1.4rem' },
                    letterSpacing: '-0.5px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  TrainBooker
                </Typography>
              </Box>
              
              {/* Desktop Navigation */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: 1,
                ml: { md: 4 }
              }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    fontWeight: isActiveRoute('/') ? 600 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: '50px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isActiveRoute('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&::after': isActiveRoute('/') ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
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
                    fontWeight: isActiveRoute('/trains') ? 600 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: '50px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isActiveRoute('/trains') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&::after': isActiveRoute('/trains') ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
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
                      fontWeight: isActiveRoute('/bookings') ? 600 : 500,
                      px: 2,
                      py: 1,
                      borderRadius: '50px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isActiveRoute('/bookings') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&::after': isActiveRoute('/bookings') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
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
              
              {/* Flexible spacer */}
              <Box sx={{ flexGrow: 1 }} />
              
              {/* Auth buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        borderRadius: '50px',
                        px: 2,
                        py: 0.8,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/register"
                      sx={{ 
                        ml: { xs: 0, sm: 1.5 },
                        background: 'linear-gradient(to right, #1a73e8, #0d47a1)',
                        color: 'white',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          background: 'linear-gradient(to right, #1557b0, #0a3578)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                        borderRadius: '50px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        display: { xs: 'none', sm: 'block' },
                        transition: 'all 0.3s ease'
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
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Responsive drawer */}
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
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 0, 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)' // Subtract the height of the AppBar
      }}>
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout; 