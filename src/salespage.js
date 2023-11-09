import React, { useState, useEffect } from 'react';
import './salespage.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { CountryDropdown } from 'react-country-region-selector';
import Sidebar from './sidebar_sales';
import { Button, TextField, Select, MenuItem, FormControl,InputLabel, Container, Grid, Paper, Typography } from '@mui/material';
import { Modal, Box } from '@mui/material';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';


const containerStyle = {
  padding: '20px',
};

const paperStyle = {
  padding: '20px',
  marginBottom: '20px',
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1500,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const modalStyler = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function SalesPage() {
  const [country, setCountry] = useState('');
  const [userOrdersData, setUserOrdersData] = useState([]);
  const [isUserOrdersPopupVisible, setUserOrdersPopupVisibility] = useState(false);
  const location = useLocation();
  const { userId } = location.state;
  const [isMessageModalVisible, setMessageModalVisibility] = useState(false);
  const [message, setMessage] = useState('');
  
  

  const showMessageModal = () => {
    setMessageModalVisibility(true);
  };
  
  const hideMessageModal = () => {
    setMessageModalVisibility(false);
  };
  
  const [formData, setFormData] = useState({
    month: '',
    orderDate: '',
    orderNo: '',
    POC: userId,
    oldNewClient: '',
    orderType: '',
    clientName: '',
    countryRegion: '',
    contactNumber: '',
    currencyOfPayment: '',
    quotation: '',
    totalAmountPaid: '',
    shippingCosts: '',
    totalAmount: '',
    paymentSenderName: '',
    modeOfPayment: '',
    shippingAddress: '',
    shippingService: '',
  });

  const paymentOptions = [
    'MEDICARE UBI',
    'MEDISELLER KOTAK',
    'MEDICARE KOTAK',
    'MEDISELLER UBI',
    'MEDISELLER IDFC',
    'MANISHA GUPTA UBI',
    'SANDEEP GUPTA UBI',
    '%%%',
    '$$$',
    'UK BANK ACCOUNT',
    'WESTERN UNION',
    'IN PERSON',
    'UPI AND OTHER',
  ];

  const [searchQuery, setSearchQuery] = useState('');


  const [isConfirmationModalVisible, setConfirmationModalVisibility] = useState(false);
 

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    const filteredOrders = userOrdersData.filter((order) => {
      return (
        order.orderNo.includes(query) ||
        order.clientName.toLowerCase().includes(query.toLowerCase()) ||
        order.oldNewClient.toLowerCase().includes(query.toLowerCase())
      );
    });
  
    setUserOrdersData(filteredOrders);
  };
  
  const [newRequestData, setNewRequestData] = useState({
    POC: userId, // Example value
    orderNo: formData.orderNo, // Example value
    orderDate: formData.orderDate, // Example value
    // Include other request data properties as needed
  });

  const handleFetchUserOrders = () => {
    axios.get('/api/sales/userOrders', { params: { userId } })
    .then((response) => {
      setUserOrdersData(response.data);
      showUserOrdersPopup();
    })
    .catch((error) => {
      // Handle any errors
    });
  }
  
  
  

  useEffect(() => {
    // Define a function to fetch the orderNo, orderDate, and month
    const fetchOrderData = () => {
      axios.get('/api/sales/nextOrderNo')
        .then((response) => {
          const { nextOrderNo, month, orderDate } = response.data;
          // Update only the specific fields in the formData object
          setFormData((prevFormData) => ({
            ...prevFormData,
            orderNo: nextOrderNo,
            month: month,
            orderDate: orderDate,
          }));
        })
        .catch((error) => {
          // Handle any errors
        });
    };

    // Call the fetchOrderData function initially
    fetchOrderData();

    // Set up an interval to fetch the data every second
    const intervalId = setInterval(fetchOrderData, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "month" || name === "orderDate" || name === "POC") {
      return; // Do not update read-only fields
    }
    const totalAmountPaid = parseFloat(formData.totalAmountPaid) || 0;
    const shippingCosts = parseFloat(formData.shippingCosts) || 0;
    const updatedTotalAmount = (totalAmountPaid + shippingCosts).toFixed(2);
    setFormData({
      ...formData,
      [name]: value,
      totalAmount: updatedTotalAmount,
    });
  };

  const showUserOrdersPopup = () => {
    setUserOrdersPopupVisibility(true);
  };

  const showConfirmationModal = () => {
    setConfirmationModalVisibility(true);
  };

  const hideConfirmationModal = () => {
    setConfirmationModalVisibility(false);
  };

  const handleSubmit = () => {
    const missingFields = [];

    if (!formData.month) missingFields.push('Month');
    if (!formData.orderDate) missingFields.push('Order Date');
    if (!formData.orderNo) missingFields.push('Order No');
    if (!formData.POC) missingFields.push('POC');
    if (!formData.clientName) missingFields.push('Client Name');
    if (!formData.orderType) missingFields.push('Order Type');
    if (!country) missingFields.push('Country/Region');
    if (!formData.contactNumber) missingFields.push('Contact Number');
    if (!formData.currencyOfPayment) missingFields.push('Currency of Payment');
    if (!formData.quotation) missingFields.push('Quotation');
    if (!formData.totalAmountPaid) missingFields.push('Total Amount Paid (Excluding Shipping Costs)');
    if (!formData.shippingCosts) missingFields.push('Shipping Costs');
    if (!formData.totalAmount) missingFields.push('Total Amount');
    if (!formData.paymentSenderName) missingFields.push('Payment Sender Name');
    if (!formData.modeOfPayment) missingFields.push('Mode of Payment');
    if (!formData.shippingAddress) missingFields.push('Shipping Address');
    if (!formData.shippingService) missingFields.push('Shipping Service');

    if (missingFields.length > 0) {
      toast.error(`The following fields are missing: ${missingFields.join(', ')}`);
    } else { 
      showConfirmationModal();
    }
  };

  const confirmSubmit = () => {
    console.log("Submit Button Pressed")
    axios.post('/api/sales', formData)
      .then((response) => {
        console.log('Form submitted successfully:', response.data);
        toast.success('Form submitted successfully', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });

        axios.get('/api/sales/nextOrderNo')
      .then((response) => {
        const { nextOrderNo } = response.data

        const currentDate = new Date();
        const options = { month: 'long' };
        const currentMonth = currentDate.toLocaleString('en-US', options);
        const currentMonthnum = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentDay = currentDate.getDate().toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        const formattedDate = `${currentYear}-${currentMonthnum}-${currentDay}`;
        setFormData({
          month: currentMonth,
          orderDate: formattedDate,
          orderNo: nextOrderNo,
          POC: userId,
          oldNewClient: '',
          orderType: '',
          clientName: '',
          countryRegion: '',
          contactNumber: '',
          currencyOfPayment: '',
          quotation: '',
          totalAmountPaid: '',
          shippingCosts: '',
          totalAmount: '',
          paymentSenderName: '',
          modeOfPayment: '',
          shippingAddress: '',
          shippingService: '',
        });
        hideConfirmationModal();
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
    });
  };

  const sendRequest = () => {
    showMessageModal();
  };

  const confirmSendRequest = (orderNo, orderDate) => {
    // Send a request with data and message to the server
    axios
      .post('/api/sales/sendRequest', {
        // Include the message in the request data as 'request_text'
        request_text: message,
        // Include the specific orderNo and orderDate from userOrdersData
        POC: userId,
        orderNo,
        orderDate,
        // ...
      }) // Adjust the endpoint as per your server route
      .then((response) => {
        // Handle success
        toast.success('Request sent successfully!');
        setMessage('');
        hideMessageModal();

      })
      .catch((error) => {
        // Handle errors
        toast.error('Error sending request. Please try again later.');
      });
  };
  
  

  const cancelSubmit = () => {
    hideConfirmationModal();
  };

  return (
    <Container style={containerStyle}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h4" align="center" gutterBottom>
              Add Sales Information
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Sidebar onFetchUserOrders={handleFetchUserOrders} />
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={3} style={paperStyle}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    readOnly={true}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Order Date"
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Order No"
                    name="orderNo"
                    value={formData.orderNo}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="POC"
                    name="POC"
                    value={formData.POC}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Existing / New Client</InputLabel>
                    <Select
                      name="oldNewClient"
                      value={formData.oldNewClient}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="Existing">Existing</MenuItem>
                      <MenuItem value="New">New</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="C2C">C2C</MenuItem>
                      <MenuItem value="NORMAL">NORMAL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                <CountryDropdown
                fullWidth
                label="Country / Region"
                value={country}
                onChange={(selectedCountry) => {
                  setCountry(selectedCountry);
                  setFormData({
                    ...formData,
                    countryRegion: selectedCountry, // Update the countryRegion field in the state
                  });
                }}
                required
                />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Currency of Payment</InputLabel>
                    <Select
                      name="currencyOfPayment"
                      value={formData.currencyOfPayment}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="AUD">AUD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="$$$">$$$</MenuItem>
                      <MenuItem value="%%%">%%%</MenuItem>
                      <MenuItem value="CAD">CAD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Quotation"
                    name="quotation"
                    value={formData.quotation}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Total Amount Paid (Excluding Shipping Costs)"
                    name="totalAmountPaid"
                    value={formData.totalAmountPaid}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Shipping Costs"
                    name="shippingCosts"
                    value={formData.shippingCosts}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Total Amount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Payment Sender Name (as per Payment details)"
                    name="paymentSenderName"
                    value={formData.paymentSenderName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Mode of Payment</InputLabel>
                    <Select
                      name="modeOfPayment"
                      value={formData.modeOfPayment}
                      onChange={handleChange}
                      required
                    >
                      {paymentOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Shipping Address (Name: Address: Country: Pincode)"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Shipping Service to be used</InputLabel>
                    <Select
                      name="shippingService"
                      value={formData.shippingService}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="LP">LP</MenuItem>
                      <MenuItem value="PBE">PBE</MenuItem>
                      <MenuItem value="ED">ED</MenuItem>
                      <MenuItem value="ARAMEX">ARAMEX</MenuItem>
                      <MenuItem value="FEDEX">FEDEX</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
  
      {/* Confirmation Modal */}
      <Modal open={isConfirmationModalVisible} onClose={hideConfirmationModal}>
      <Box className="modal-content" style={modalStyler}>
          <Typography variant="h4">Confirm Submission</Typography>
          <Typography variant='h5'>Data to be submitted:</Typography>
          <Typography>Customer Name: {formData.clientName}</Typography>
          <Typography>Order Number: {formData.orderNo}</Typography>
          <Typography>Total Amount: {formData.totalAmount}</Typography>
          <Typography>Quotation: {formData.quotation}</Typography>
          <Typography>Shipping Address: {formData.shippingAddress}</Typography>
          <Button variant="contained" color="primary"  onClick={confirmSubmit}>
            Confirm
          </Button>
          <Button variant="contained" color="secondary" onClick={cancelSubmit}>
            Cancel
          </Button>
        </Box>
      </Modal>
  
      {/* User Orders Popup */}

<Modal open={isUserOrdersPopupVisible} onClose={() => setUserOrdersPopupVisibility(false)}>
  <Box className="modal-content" style={modalStyle}>
    <Typography variant="h6">My Orders</Typography>
    <TextField
        fullWidth
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchQuery}
        onChange={(e) => handleSearch(e)}
        />
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order No</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Client Type</TableCell>
            
            <TableCell>Quotation</TableCell>
            <TableCell>Total Amount</TableCell>
            
            <TableCell>Mode Of Payment</TableCell>
            <TableCell>Shipping Service</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Shipping Status</TableCell>
            
            {/* Add more table headers for other fields */}
          </TableRow>
        </TableHead>
        <TableBody>
          {userOrdersData.map((order, index) => (
            <TableRow key={index}>
              <TableCell>{order.orderNo}</TableCell>
              <TableCell>{order.clientName}</TableCell>
              <TableCell>{order.oldNewClient}</TableCell>
              
              <TableCell>{order.quotation}</TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              
              <TableCell>{order.modeOfPayment}</TableCell>
              <TableCell>{order.shippingService}</TableCell>
              <TableCell>{order.paymentconfirmed}</TableCell>
              <TableCell>{order.trackingStatus}</TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => confirmSendRequest(order.orderNo, order.orderDate)}
              >
                Send Request
              </Button>


              {/* Add more table cells for other fields */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button variant="contained" color="primary" onClick={() => setUserOrdersPopupVisibility(false)}>
      Close
    </Button>
  </Box>
</Modal>

  
      <ToastContainer />
    </Container>
  );
  
            }

export default SalesPage;


