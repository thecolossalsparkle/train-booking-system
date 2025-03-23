import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  LinearProgress,
  Stack,
  useMediaQuery,
  useTheme,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Train as TrainIcon,
  ConfirmationNumber as TicketIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  CreditCard as PaymentIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  FlightTakeoff as TakeoffIcon,
  FlightLand as LandIcon,
  ArrowRightAlt as ArrowRightIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data for booking confirmation
const generateMockBooking = (bookingId) => {
  return {
    bookingId: bookingId,
    status: 'Confirmed',
    pnr: 'PNR' + Math.floor(10000000 + Math.random() * 90000000),
    bookingDate: new Date().toISOString(),
    journeyDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trainDetails: {
      trainNo: 'EXP1234',
      name: 'Rajdhani Express',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '06:00',
      arrivalTime: '22:30',
      class: '2A',
      coach: 'A2',
    },
    passengers: [
      {
        name: 'John Doe',
        age: 32,
        gender: 'Male',
        seatNumber: 23,
        berth: 'Lower',
        status: 'Confirmed',
      },
      {
        name: 'Jane Doe',
        age: 28,
        gender: 'Female',
        seatNumber: 24,
        berth: 'Upper',
        status: 'Confirmed',
      },
    ],
    fare: {
      baseFare: 3800,
      gst: 190,
      totalFare: 3990,
      paymentMethod: 'Credit Card',
      paymentId: 'PAY' + Math.floor(1000000000 + Math.random() * 9000000000),
    }
  };
};

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPdf, setProcessingPdf] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const confirmationRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    // Simulate API call to fetch booking details
    setLoading(true);
    setTimeout(() => {
      try {
      const mockBooking = generateMockBooking(bookingId);
      setBooking(mockBooking);
      setLoading(false);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("There was an error retrieving your booking details");
        setLoading(false);
      }
    }, 1500);
  }, [bookingId]);
  
  const handleViewTicket = () => {
    // Navigate to ticket page
    if (booking && booking.pnr) {
    navigate(`/tickets/${booking.pnr}`);
    } else {
      toast.error("Ticket information is not available");
    }
  };
  
  // Add a new function to directly handle browser printing
  const handleDirectPrint = () => {
    const contentToPrint = document.getElementById('booking-confirmation-printable');
    
    if (!contentToPrint) {
      toast.error('Print content not found');
      return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site to print.');
      return;
    }
    
    const printDocument = printWindow.document;
    const originalStyles = document.getElementsByTagName('style');
    
    // Copy all styles from the original document
    for (let i = 0; i < originalStyles.length; i++) {
      printDocument.head.appendChild(originalStyles[i].cloneNode(true));
    }
    
    // Add specific print styles
    const printStyle = printDocument.createElement('style');
    printStyle.textContent = `
      @page { 
        size: A4; 
        margin: 15mm;
      }
      body { 
        font-family: 'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        color: #212121;
        background-color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-container {
        width: 100%;
        max-width: 100%;
        padding: 0;
        margin: 0;
      }
      .no-print { 
        display: none !important; 
      }
    `;
    printDocument.head.appendChild(printStyle);
    
    // Set the content to print
    printDocument.body.innerHTML = `
      <div class="print-container">${contentToPrint.innerHTML}</div>
    `;
    
    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
    
    toast.success('Print dialog opened');
  };
  
  // Unused function - keeping for potential future use
  /* const handlePrintTicket = useReactToPrint({
    content: () => confirmationRef.current,
    documentTitle: `Booking_Confirmation_${booking?.pnr || 'ticket'}`,
    onBeforeGetContent: () => {
      toast.info('Preparing to print...');
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    onAfterPrint: () => toast.success('Booking confirmation printed successfully'),
    onPrintError: () => toast.error('There was an error printing your ticket'),
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  }); */
  
  const handleDownloadTicket = async () => {
    try {
      setProcessingPdf(true);
      toast.info('Generating PDF, please wait...');
      
      const content = confirmationRef.current;
      if (!content) {
        throw new Error('Content not found');
      }
      
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Booking_Confirmation_${booking?.pnr || 'ticket'}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setProcessingPdf(false);
    }
  };
  
  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Train Booking Confirmation - ${booking?.pnr}`,
        text: `My train booking from ${booking?.trainDetails.source} to ${booking?.trainDetails.destination} on ${formatDate(booking?.journeyDate)} has been confirmed. PNR: ${booking?.pnr}`,
        url: window.location.href,
      })
      .then(() => toast.success('Booking shared successfully'))
      .catch((error) => {
        console.error('Share error:', error);
        toast.error('Failed to share booking');
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      const shareText = `My train booking from ${booking?.trainDetails.source} to ${booking?.trainDetails.destination} on ${formatDate(booking?.journeyDate)} has been confirmed. PNR: ${booking?.pnr} - ${window.location.href}`;
      
      try {
        navigator.clipboard.writeText(shareText);
        toast.success('Booking details copied to clipboard');
      } catch (error) {
        console.error('Clipboard error:', error);
        toast.error('Failed to copy to clipboard');
      }
    }
  };
  
  const handleShareViaEmail = () => {
    const subject = `Train Booking Confirmation - ${booking?.pnr}`;
    const body = `My train booking from ${booking?.trainDetails.source} to ${booking?.trainDetails.destination} on ${formatDate(booking?.journeyDate)} has been confirmed. PNR: ${booking?.pnr}\n\nView details: ${window.location.href}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    toast.success('Email client opened');
  };
  
  const handleShareViaWhatsApp = () => {
    const text = `My train booking from ${booking?.trainDetails.source} to ${booking?.trainDetails.destination} on ${formatDate(booking?.journeyDate)} has been confirmed. PNR: ${booking?.pnr}. View details: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    toast.success('WhatsApp opened for sharing');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '50%', mb: 4 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Retrieving your booking details...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments
          </Typography>
        </Box>
      </Container>
    );
  }
  
  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Booking not found. Please check the booking ID.
        </Alert>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/')}
            startIcon={<TrainIcon />}
            sx={{ mt: 2 }}
          >
            Return to Home
        </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Backdrop for PDF processing */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={processingPdf}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Generating PDF...
          </Typography>
        </Box>
      </Backdrop>
    
      {/* Success Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 5, 
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '180px',
            height: '180px',
            background: theme.palette.primary.lightest,
            borderRadius: '50%',
            zIndex: -1,
            opacity: 0.7,
            top: '-30px',
          }
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }} className="gradient-text">
          Booking Confirmed!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mb: 3 }}>
          Your transaction was successful and your tickets are ready. We've sent a confirmation to your email.
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`PNR: ${booking.pnr}`} 
            color="primary" 
            variant="outlined" 
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '1.1rem', 
              px: 2, 
              py: 3, 
              borderWidth: 2,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          />
        </Box>
      </Box>
      
      {/* Content to be printed/downloaded */}
      <Box 
        id="booking-confirmation-printable"
        ref={confirmationRef} 
        sx={{ 
          mb: 4,
          '@media print': {
            margin: 0,
            padding: 0,
            width: '100%',
          }
        }}
      >
      {/* Booking Details */}
        <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            },
            overflow: 'hidden',
            position: 'relative',
          }}
          className="hover-lift"
        >
        {/* Add a subtle geometric background pattern */}
        <Box sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(26, 115, 232, 0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '0 0 0 100%',
          zIndex: 0,
        }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <TicketIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
            Booking Details
          </Typography>
          <Chip 
            label={booking.status} 
            color="success" 
            size="small"
              sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(63, 81, 181, 0.05)',
                  border: '1px solid rgba(63, 81, 181, 0.1)',
                }}>
                <Typography variant="body2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {booking.bookingId}
                </Typography>
              </Box>
              
              <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                  Booking Date & Time
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(booking.bookingDate)}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                  Journey Date
                </Typography>
                  <Typography variant="body1" fontWeight="medium">
                  {formatDate(booking.journeyDate)}
                </Typography>
              </Box>
              
              <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {booking.fare.paymentMethod} (ID: {booking.fare.paymentId})
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Train Details */}
        <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(249,249,252,1) 100%)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: '-50px',
              bottom: '-50px',
              width: '200px',
              height: '200px',
              background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="%23e8eaf6" d="M138-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h280v60H138v680h684v-280h60v280q0 24-18 42t-42 18H138Zm594-434v-128h-128v-60h128v-128h60v128h128v60H792v128h-60Z"/></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              opacity: 0.1,
              zIndex: 0,
            }
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrainIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Train Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
          <Box sx={{ mb: 3 }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <Typography variant="h6" fontWeight="bold">
                {booking.trainDetails.name}
              </Typography>
            </Grid>
            <Grid item>
              <Chip 
                label={booking.trainDetails.trainNo} 
                size="small" 
                variant="outlined" 
              />
            </Grid>
          </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Class:</strong> {booking.trainDetails.class} | <strong>Coach:</strong> {booking.trainDetails.coach}
          </Typography>
        </Box>
        
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'rgba(63, 81, 181, 0.05)', 
              border: '1px solid rgba(63, 81, 181, 0.1)',
              mb: 3 
            }}
          >
            <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TakeoffIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                    Departure
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                {booking.trainDetails.departureTime}
              </Typography>
                  <Typography variant="body1" fontWeight="medium">{booking.trainDetails.source}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(booking.journeyDate)}
              </Typography>
            </Box>
          </Grid>
          
              <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ 
                  width: '100%', 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Divider orientation="horizontal" flexItem sx={{ position: 'absolute' }} />
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'white',
                      zIndex: 1,
                    }}
                  >
                    <ArrowRightIcon color="primary" />
                  </Paper>
                </Box>
          </Grid>
          
          <Grid item xs={5}>
            <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LandIcon fontSize="small" sx={{ ml: 0.5, color: theme.palette.primary.main }} />
                    Arrival
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                {booking.trainDetails.arrivalTime}
              </Typography>
                  <Typography variant="body1" fontWeight="medium">{booking.trainDetails.destination}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(booking.journeyDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
          </Paper>
          
          <Alert 
            severity="info" 
            variant="outlined"
            icon={<TimeIcon />}
            sx={{ mb: 2 }}
          >
          <Typography variant="body2">
            Please arrive at least 30 minutes before the scheduled departure time.
          </Typography>
        </Alert>
      </Paper>
      
      {/* Passenger Details */}
        <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(249,249,252,1) 100%)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Passenger Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {booking.passengers.map((passenger, index) => (
            <Grid item xs={12} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderColor: theme.palette.primary.main,
                    } 
                  }}
                >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" fontWeight="medium">
                        {passenger.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {passenger.age} years, {passenger.gender}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Seat
                      </Typography>
                        <Typography variant="subtitle1" fontWeight="medium">
                        {passenger.seatNumber}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Berth
                      </Typography>
                        <Typography variant="subtitle1" fontWeight="medium">
                        {passenger.berth}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Chip 
                        label={passenger.status} 
                        color={passenger.status === 'Confirmed' ? 'success' : 'warning'} 
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Fare Details */}
        <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            },
            overflow: 'hidden',
            position: 'relative',
          }}
          className="hover-lift"
        >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaymentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Fare Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: 'background.light', 
                  border: '1px solid rgba(26, 115, 232, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '70px',
                height: '70px',
                background: 'radial-gradient(circle, rgba(26, 115, 232, 0.08) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0,
              }} />
            <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Base Fare</Typography>
                <Typography variant="body1">₹{booking.fare.baseFare}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">GST (5%)</Typography>
                <Typography variant="body1">₹{booking.fare.gst}</Typography>
              </Box>
                  <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  ₹{booking.fare.totalFare}
                </Typography>
              </Box>
            </Box>
              </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
              <Alert 
                severity="success" 
                variant="filled"
                sx={{ 
                  mb: 2, 
                  borderRadius: 2, 
                  boxShadow: '0 4px 12px rgba(52, 168, 83, 0.2)',
                }}
              >
              <Typography variant="body2">
                  Payment of <strong>₹{booking.fare.totalFare}</strong> has been successfully processed via {booking.fare.paymentMethod}.
              </Typography>
            </Alert>
            
            {/* Add payment verification icon */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              bgcolor: 'rgba(52, 168, 83, 0.05)', 
              borderRadius: 2,
              border: '1px dashed rgba(52, 168, 83, 0.3)',
            }}>
              <CheckCircleIcon color="success" sx={{ mr: 1.5, fontSize: '1.3rem' }} />
              <Typography variant="body2">
                Secure transaction verified by our payment gateway
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      </Box>
      
      {/* Action Buttons */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          mb: 4, 
          background: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        }} 
        className="no-print"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '4px', 
          background: 'linear-gradient(90deg, #1a73e8 0%, #0d47a1 100%)'
        }} />
        
        <Typography variant="h6" gutterBottom align="center">
          Booking Actions
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          justifyContent: 'center', 
          mt: 2 
        }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<TicketIcon />}
          onClick={handleViewTicket}
          fullWidth={isMobile}
          sx={{
            backgroundImage: 'linear-gradient(to bottom, #1a73e8, #0d65d9)',
            boxShadow: '0 4px 10px rgba(26, 115, 232, 0.3)',
          }}
        >
          View Ticket
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handleDirectPrint}
          fullWidth={isMobile}
        >
          Print
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadTicket}
          fullWidth={isMobile}
          disabled={processingPdf}
        >
          Download PDF
        </Button>
          
        <Button
          variant="outlined"
          size="large"
          startIcon={<ShareIcon />}
          onClick={() => setShareOpen(true)}
          fullWidth={isMobile}
        >
          Share
        </Button>
      </Box>
      </Paper>
      
      {/* Share Dialog */}
      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: 360,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Share Booking
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          <List sx={{ pt: 0 }}>
            <ListItem button onClick={handleShareViaEmail} sx={{ py: 2 }}>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItem>
            
            <ListItem button onClick={handleShareViaWhatsApp} sx={{ py: 2 }}>
              <ListItemIcon>
                <WhatsAppIcon style={{ color: '#25D366' }} />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItem>
            
            <ListItem button onClick={handleCopyLink} sx={{ py: 2 }}>
              <ListItemIcon>
                <CopyIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Copy Link" />
            </ListItem>
            
            <ListItem button onClick={handleShareTicket} sx={{ py: 2 }}>
              <ListItemIcon>
                <ShareIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Native Share" />
            </ListItem>
          </List>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setShareOpen(false)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Help Info */}
      <Paper elevation={1} sx={{ 
          p: 4, 
          borderRadius: 2, 
          bgcolor: theme.palette.primary.lightest,
          position: 'relative',
          overflow: 'hidden',
        }} 
        className="no-print"
      >
        <Box sx={{ 
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '150px',
          height: '150px',
          background: theme.palette.primary.light,
          opacity: 0.1,
          borderRadius: '50%',
        }} />
        
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Need Help?
        </Typography>
        <Typography variant="body2" paragraph>
          If you have any questions about your booking, please contact our customer support at <strong>support@trainbooker.com</strong> or call <strong>1800-123-4567</strong>.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          disableElevation
          sx={{ mt: 1 }}
        >
            Return to Home
          </Button>
      </Paper>
    </Container>
  );
};

export default BookingConfirmationPage; 