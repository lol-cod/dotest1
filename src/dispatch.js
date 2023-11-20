import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dispatch.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';



function DispatchPage() {
  const location = useLocation();
  const { userId } = location.state;
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState({ trackingNumber: '', dispatchedOn: '', trackingStatus: '' });
    const [showDispatched, setShowDispatched] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const filterOrders = (query) => {
      const lowerCaseQuery = query.toLowerCase(); // Convert the search query to lowercase
    
      if (lowerCaseQuery === '') {
        return confirmedOrders; // Return all orders if the query is empty
      }
    
      return confirmedOrders.filter((order) =>
        order.orderNo.toLowerCase().includes(lowerCaseQuery)
      );
    };
    

    
    const handleSearch = () => {
      const dispatched = showDispatched;
      fetchOrders(dispatched);
    };
    



  const fetchOrders = (dispatched) => {
    axios.get(dispatched ? '/api/dispatch/dispatched' : '/api/dispatch/orders')
      .then((response) => {
        setConfirmedOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };



  useEffect(() => {
    // Fetch initial list of orders (yet to be dispatched by default)
    fetchOrders(false);
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setSelectedOrder(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      // Remove the event listener when the component unmounts to prevent memory leaks
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      trackingNumber: order.trackingNumber || '',
      dispatchedOn: order.dispatchedOn || '',
      trackingStatus: order.trackingStatus || '',
    });
  };

  const handleTrackingSubmit = () => {
    const { orderDate, orderNo, quotation, clientName, POC, shippingAddress, timestamp } = selectedOrder;
    const { trackingNumber, dispatchedOn, trackingStatus } = trackingInfo;
  
    axios
      .post('/api/dispatch/insertDispatch', {
        orderDate,
        orderNo,
        quotation,
        clientName,
        POC,
        shippingAddress,
        timestamp,
        trackingNumber,
        dispatchedOn,
        trackingStatus,
      })
      .then((response) => {
        // Handle the response if needed
        console.log('Tracking info submitted successfully:', response.data);
  
        // Clear the selected order
        setSelectedOrder(null);
  
        // After submitting, re-fetch the confirmed orders to refresh the table
        fetchOrders(showDispatched);
  
        toast.success('Form submitted successfully', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error('Error submitting tracking information:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrackingInfo({ ...trackingInfo, [name]: value });
  };

  return (
    <Container maxWidth="lg" className="dispatch-container">
      <h1>Dispatch Page</h1>
      <h2 className="UserGreeting">Hello {userId}</h2>
  <Grid container spacing={2}>
    <Grid item xs={12} className="button-container">
      <Button
        variant={!showDispatched ? "contained" : "outlined"}
        onClick={() => {
          setShowDispatched(false);
          fetchOrders(false);
        }}
      >
        Yet to be Dispatched
      </Button>
      <Button
        variant={showDispatched ? "contained" : "outlined"}
        onClick={() => {
          setShowDispatched(true);
          fetchOrders(true);
        }}
      >
        Dispatched
      </Button>
    </Grid>
    <Grid item xs={12} className="search-bar">
      <TextField
        fullWidth
        variant="outlined"
        label="Search by Order No"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: <Search />,
        }}
      />
    </Grid>
    <Grid item xs={12} className="order-table-container">
      <Typography variant="h5">Dispatch Page</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Date</TableCell>
              <TableCell>Order No</TableCell>
              <TableCell>Quotation</TableCell>
              <TableCell>POC</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterOrders(searchQuery).map((order) => (
              <TableRow
                key={order.orderId}
                className={selectedOrder === order ? 'selected-order' : ''}
                onClick={() => handleOrderSelect(order)}
              >
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.quotation}</TableCell>
                <TableCell>{order.POC}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOrderSelect(order)}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    <Grid item xs={12} className="selected-order-container">
      {selectedOrder && (
        <div>
          <Typography variant="h6">Selected Order Details</Typography>
          <p>Order Date: {selectedOrder.orderDate}</p>
          <p>Order No: {selectedOrder.orderNo}</p>
          <p>Quotation: {selectedOrder.quotation}</p>
          <p>POC: {selectedOrder.POC}</p>
          <p>Shipping Address: {selectedOrder.shippingAddress}</p>
          <p>Time Stamp: {selectedOrder.timestamp}</p>

          <div className="tracking-info-container">
            <Typography variant="h6">Enter Tracking Information</Typography>
            <TextField
              fullWidth
              label="Tracking Number"
              name="trackingNumber"
              value={trackingInfo.trackingNumber}
              onChange={handleChange}
            />
              
            <TextField
              fullWidth
              label="Dispatched On"
              type="date"
              name="dispatchedOn"
              InputLabelProps={{ shrink: true }}
              value={trackingInfo.dispatchedOn}
              onChange={handleChange}
            />
            <div className="input-container">
  <FormControl variant="outlined" fullWidth>
    <InputLabel>Tracking Status</InputLabel>
    <Select
      name="trackingStatus"
      value={trackingInfo.trackingStatus}
      onChange={handleChange}
      required
    >
      <MenuItem value="Select Option" disabled>
        Select Option
      </MenuItem>
      <MenuItem value="Delivered">Delivered</MenuItem>
      <MenuItem value="Dispatched">Dispatched</MenuItem>
      <MenuItem value="In Transit">In Transit</MenuItem>
    </Select>
  </FormControl>
</div>



              <Button variant="outlined" onClick={handleTrackingSubmit}>
                {selectedOrder?.trackingNumber ? 'Update' : 'Submit'} Tracking Info
              </Button>
          </div>
        </div>
      )}
    </Grid>
  </Grid>
  <ToastContainer />
</Container>

  );
}

export default DispatchPage;
