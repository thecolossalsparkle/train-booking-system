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
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Train as TrainIcon,
  ArrowRightAlt as ArrowIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  FlightTakeoff as TakeoffIcon,
  FlightLand as LandIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock function to get ticket data
const getTicketByPNR = (pnr) => {
  // In a real app, this would be an API call
  return {
    pnr,
    status: 'Confirmed',
    bookingId: 'BK' + Math.floor(10000000 + Math.random() * 90000000),
    bookingDate: new Date().toISOString(),
    journeyDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    train: {
      number: 'EXP1234',
      name: 'Rajdhani Express',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '06:00',
      arrivalTime: '22:30',
      platform: '5',
      distance: '1385 km',
      duration: '16h 30m',
    },
    boardingPoint: {
      station: 'New Delhi',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '06:00',
      platform: '5',
    },
    reservationInfo: {
      coach: 'A2',
      class: '2A',
      quota: 'General',
    },
    passengers: [
      {
        name: 'John Doe',
        age: 32,
        gender: 'Male',
        seatNumber: 23,
        berth: 'Lower',
        seatStatus: 'Confirmed',
        foodPreference: 'Veg',
      },
      {
        name: 'Jane Doe',
        age: 28,
        gender: 'Female',
        seatNumber: 24,
        berth: 'Upper',
        seatStatus: 'Confirmed',
        foodPreference: 'Non-Veg',
      },
    ],
    fare: {
      baseFare: 3800,
      gst: 190,
      serviceCharge: 0,
      totalFare: 3990,
      paymentMethod: 'Credit Card',
      paymentId: 'PAY' + Math.floor(1000000000 + Math.random() * 9000000000),
    },
    contactInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
    },
  };
};

const TicketPage = () => {
  const { pnr } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPdf, setProcessingPdf] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ticketRef = useRef(null);
  
  useEffect(() => {
    // Simulate API call to fetch ticket details
    setLoading(true);
    try {
      setTimeout(() => {
        const ticketData = getTicketByPNR(pnr);
        setTicket(ticketData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError('Failed to fetch ticket details');
      setLoading(false);
    }
  }, [pnr]);
  
  // Set document title using useEffect
  useEffect(() => {
    if (ticket && ticket.train) {
      document.title = `Ticket - ${ticket.train.name} | Train Booking System`;
    } else {
      document.title = 'Ticket | Train Booking System';
    }
  }, [ticket]);
  
  // Add a new function to directly handle browser printing
  const handleDirectPrint = () => {
    const contentToPrint = document.getElementById('ticket-printable');
    
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

  const handleDownloadTicket = async () => {
    try {
      setProcessingPdf(true);
      toast.info('Generating PDF, please wait...');
      
      const content = ticketRef.current;
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
      
      pdf.save(`E-Ticket_${pnr}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setProcessingPdf(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '50%', mb: 4 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Retrieving your ticket...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments
          </Typography>
        </Box>
      </Container>
    );
  }
  
  if (error || !ticket) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Ticket not found. Please check the PNR number.'}
          </Alert>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <>
      <Container maxWidth="md" sx={{ pb: 8 }}>
        {/* Ticket header with animation */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 5, 
            textAlign: 'center',
            position: 'relative',
            animation: 'fadeIn 0.6s ease-out',
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
          <TicketIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }} className="gradient-text">
            Your E-Ticket
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mb: 3 }}>
            Valid for travel. Please carry your ID proof during the journey.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={`PNR: ${ticket.pnr}`} 
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

        {/* Printable content */}
        <Box 
          id="ticket-printable" 
          ref={ticketRef}
          sx={{ 
            mb: 4,
            '@media print': {
              margin: 0,
              padding: 0,
              width: '100%',
            }
          }}
        >
          {/* Ticket card */}
          <Paper 
            elevation={3} 
            sx={{ 
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
            {/* Background pattern */}
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
            
            {/* Ticket Header */}
            <Box 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'center', sm: 'flex-start' },
                mb: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: { xs: 2, sm: 0 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  E-Ticket
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Booking ID: {ticket.bookingId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Booked on: {new Date(ticket.bookingDate).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
              }}>
                <Chip 
                  label={`PNR: ${ticket.pnr}`} 
                  color="primary" 
                  sx={{ 
                    borderRadius: 1,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    px: 1,
                    mb: 1,
                  }} 
                />
                <Box sx={{ mt: 1, p: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <QRCodeSVG value={`${window.location.origin}/tickets/${ticket.pnr}`} size={100} />
                </Box>
              </Box>
            </Box>
            
            {/* Ticket Watermark */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              opacity: 0.03,
              zIndex: 0,
            }}>
              <TicketIcon sx={{ fontSize: 400 }} />
            </Box>
            
            {/* Train Details */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2, 
                bgcolor: 'rgba(63, 81, 181, 0.05)', 
                border: '1px solid rgba(63, 81, 181, 0.1)',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <TrainIcon color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" fontWeight="bold">
                      {ticket.train.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip 
                      label={ticket.train.number} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Class:</strong> {ticket.train.class} | <strong>Coach:</strong> {ticket.train.coach} | <strong>Platform:</strong> {ticket.train.platform || 'TBA'}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TakeoffIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                      Departure
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {ticket.train.departureTime}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">{ticket.train.source}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(ticket.journeyDate)}
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
                      <ArrowIcon color="primary" />
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
                      {ticket.train.arrivalTime}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">{ticket.train.destination}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(ticket.journeyDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Passenger Information */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                Passenger Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <TableContainer component={Paper} elevation={0} sx={{ 
                borderRadius: 2,
                background: 'rgba(26, 115, 232, 0.02)', 
                border: '1px solid rgba(26, 115, 232, 0.1)'
              }}>
                <Table aria-label="passenger information">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Seat</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticket.passengers.map((passenger, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:nth-of-type(odd)': { bgcolor: 'rgba(26, 115, 232, 0.03)' },
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: 'rgba(26, 115, 232, 0.06)' },
                        }}
                      >
                        <TableCell>{passenger.name}</TableCell>
                        <TableCell>{passenger.age}</TableCell>
                        <TableCell>{passenger.gender}</TableCell>
                        <TableCell>{passenger.seatNumber}</TableCell>
                        <TableCell>
                          <Chip 
                            label={passenger.seatStatus} 
                            size="small" 
                            color={passenger.seatStatus === 'Confirmed' ? 'success' : 'warning'}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            
            {/* Important Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Important Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2">
                  • Please carry a valid government Photo ID (Aadhar/PAN/Passport) with you during the journey.
                </Typography>
                <Typography variant="body2">
                  • Arrive at the station at least 30 minutes before departure.
                </Typography>
                <Typography variant="body2">
                  • This e-ticket is valid only when accompanied by a valid photo ID.
                </Typography>
                <Typography variant="body2">
                  • In case of any emergency, contact customer support at 1800-123-4567.
                </Typography>
              </Stack>
            </Box>
            
            {/* Contact Information */}
            <Box 
              sx={{ 
                p: 2, 
                borderTop: '1px dashed', 
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Passenger Contact
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {ticket.contactInfo.phone}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {ticket.contactInfo.email}
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Helpline
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  1800-123-4567
                </Typography>
                <Typography variant="body2">
                  support@trainbooker.com
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* Action Buttons */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
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
            Ticket Actions
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
              startIcon={<PrintIcon />}
              onClick={handleDirectPrint}
              fullWidth={isMobile}
              sx={{
                backgroundImage: 'linear-gradient(to bottom, #1a73e8, #0d65d9)',
                boxShadow: '0 4px 10px rgba(26, 115, 232, 0.3)',
              }}
            >
              Print Ticket
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
          </Box>
        </Paper>
        
        {/* Ticket Disclaimer */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            background: 'rgba(26, 115, 232, 0.02)',
            border: '1px solid rgba(26, 115, 232, 0.1)',
            mt: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" color="primary.main">Important Information</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            This e-ticket is valid for travel and must be presented along with a valid government-issued photo ID. Please arrive at least 30 minutes before departure.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Cancellation and refund policies apply as per the terms and conditions. For any assistance, please contact our customer support.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            Thank you for choosing our train booking service!
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default TicketPage; 