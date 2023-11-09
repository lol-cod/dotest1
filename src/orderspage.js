import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Box, Button } from '@mui/material';
import './orderspage.css';
import { useLocation } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import Modal from '@mui/material/Modal';






function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('orderDate'); // Default filter
  const [filterStatus, setFilterStatus] = useState('All'); // Default status filter
  const [filterStatuspayment, setFilterStatuspayment] = useState('All'); // Default payment status filter
  const [trackingInfo, setTrackingInfo] = useState({
    trackingStatus: '', // Initial value is an empty string
  });
  const location = useLocation();
  const { userId } = location.state;
  const [editRequests, setEditRequests] = useState([]); // State variable to store edit requests
  const [isEditRequestsModalVisible, setEditRequestsModalVisibility] = useState(false);

 
  

  useEffect(() => {
    axios.get('/api/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
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
  };

  // Filter orders based on the selected filter and search query
  const filteredOrders = orders.filter((order) => {
    const filterField = order[selectedFilter];
    return filterField.toLowerCase().includes(searchQuery.toLowerCase());
  });



  const fetchEditRequests = () => {
    axios.get('/api/requests') // Replace with your server endpoint
      .then((response) => {
        setEditRequests(response.data);
        console.log("Data Received: ", response.data);
      })
      .catch((error) => {
        console.error('Error fetching edit requests:', error);
      });
  };


  const handleAllowEditRequest = (orderNO,POC,orderDate) => {
    axios
      .put(`/api/requests/approve`, {orderNO,POC,orderDate})
      .then((response) => {
        
      console.log('Request approved successfully:', response.data);
      
        axios.get('/api/requests') // Replace with your server endpoint
          .then((response) => {
            setEditRequests(response.data);
            console.log("Data Received: ", response.data);
          })
          .catch((error) => {
            console.error('Error fetching edit requests:', error);
          });
      
        
      })
      .catch((error) => {
        // Handle the error, show an error message, or perform any error handling logic
        console.error('Error approving request:', error);
      });
  };
  
  

  const handleDenyEditRequest = (orderNO,POC,orderDate) => {
    axios
      .post(`/api/requests/deny`, {orderNO,POC,orderDate})
      .then((response) => {
        console.log(orderNO);
        console.log('Request denied and removed successfully:', response.data);
        
          axios.get('/api/requests') // Replace with your server endpoint
            .then((response) => {
              setEditRequests(response.data);
              console.log("Data Received: ", response.data);
            })
            .catch((error) => {
              console.error('Error fetching edit requests:', error);
            });
        
        // Optionally, you can refresh the list of edit requests here
      })
      .catch((error) => {
        // Handle the error, show an error message, or perform any error handling logic
        console.error('Error denying request:', error);
      });
  };
  

  const showEditRequestsModal = () => {
    setEditRequestsModalVisibility(true);
    // Fetch edit requests when showing the modal
    fetchEditRequests();
  };

  const hideEditRequestsModal = () => {
    setEditRequestsModalVisibility(false);
  };




  function prepareOrdersForExport(orders) {
    return orders.map((order) => ({
     "Order No": order.orderNo, 
     "Quotation": order.quotation,
     "Client Name": order.clientName, 
     "POC":   order.POC, 
     "Shipping Service": order.shippingService, 
     "Shipping Address": order.shippingAddress, 
     "Mode Of Payment": order.modeOfPayment, 
     "Total Amount": order.totalAmount, 
     "Total Amount Paid": order.totalAmountPaid, 
     "Confirmed Payment": order.confirmedPayment, 
     "Time Stamp": order.timestamp, 
     "Payment Type": order.paymentType, 
     "Payee Name": order.payeeName, 
     "Actual Amount Received": order.actualAmountReceived, 
     "Payment Received On": order.paymentReceivedOn, 
     "Payment Shortage": order.paymentShortage, 
     "Amount Credited In Bank": order.inrAmountCreditedInBank, 
     "Date of Credit": order.dateOfCredit, 
     "Transaction Code": order.transactionCode, 
     "Remarks": order.remarks, 
     "Tracking Number": order.trackingNumber, 
     "Dispatched On": order.dispatchedOn, 
     "Tracking Status": order.trackingStatus,
            
      
    }));
  }


  const csvLink = React.createRef();


  // Filter orders based on the trackingStatus
  const filteredOrdersByStatus = filteredOrders.filter((order) => {
    if (filterStatus === 'All') {
      return true; // Show all orders
    }
    if (filterStatus === 'Null') {
      return !order.trackingStatus; // Show orders with null status
    }
    return order.trackingStatus === filterStatus;
  });

  // Filter orders based on the payment confirmation status
  const filteredOrdersByPayment = filteredOrdersByStatus.filter((order) => {
    if (filterStatuspayment === 'All') {
      return true; // Show all orders
    }
    if (filterStatuspayment === 'Null') {
      return !order.confirmedPayment; // Show orders with null payment confirmation
    }
    return order.confirmedPayment === filterStatuspayment;
  });

  return (
    <div className="orders-page-container">
      <Typography variant="h4">Hello {userId}</Typography>
      <Button variant="contained" color="primary" onClick={showEditRequestsModal}>
        Edit Requests
      </Button>


      <Modal open={isEditRequestsModalVisible} onClose={hideEditRequestsModal}>
        <Box className="edit-requests-modal" p={3}>
          <Typography variant="h5">Edit Requests</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order No</TableCell>
                  <TableCell>POC</TableCell>
                  
                  <TableCell>Date of Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editRequests.map((request) => (
                  
                  <TableRow key={request.id}>
                   <TableCell>{request.orderNO}</TableCell>
                   
                    <TableCell>{request.POC}</TableCell>
                    
                    <TableCell>{request.orderDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAllowEditRequest(request.orderNO,request.POC,request.orderDate)}
                      >
                        Allow
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDenyEditRequest(request.orderNO,request.POC, request.orderDate)}
                      >
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>




      <div className="export-button">
      <Button
        variant="contained"
        color="primary"
        onClick={() => csvLink.current.link.click()}
      >
        Export Orders to CSV
      </Button>
      </div>

      <CSVLink
        data={prepareOrdersForExport(orders)}
        filename="orders.csv"
        ref={csvLink}
        style={{ display: 'none' }}
      />
      
      <div className="filter-dropdown">
        <FormControl>
          <InputLabel>Filter by:</InputLabel>
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <MenuItem value="orderDate">Order Date</MenuItem>
            <MenuItem value="orderNo">Order No</MenuItem>
            <MenuItem value="quotation">Quotation</MenuItem>
            <MenuItem value="POC">POC</MenuItem>
            <MenuItem value="shippingService">Shipping Service</MenuItem>
            <MenuItem value="shippingAddress">Shipping Address</MenuItem>
            <MenuItem value="modeOfPayment">Mode of Payment</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TextField
        label="Search orders"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="filter-buttons">
        <Button
          variant={filterStatus === 'All' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('All')}
        >
          All Orders
        </Button>
        <Button
          variant={filterStatus === 'Delivered' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('Delivered')}
        >
          Delivered
        </Button>
        <Button
          variant={filterStatus === 'In Transit' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('In Transit')}
        >
          In Transit
        </Button>
        <Button
          variant={filterStatus === 'Dispatched' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('Dispatched')}
        >
          Dispatched
        </Button>
        <Button
          variant={filterStatus === 'Null' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('Null')}
        >
          Not Dispatched
        </Button>
      </div>
      <div className="filter-buttons">
        <Button
          variant={filterStatuspayment === 'All' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatuspayment('All')}
        >
          All Payments
        </Button>
        <Button
          variant={filterStatuspayment === '1' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatuspayment('1')}
        >
          Payment Confirmed
        </Button>
        <Button
          variant={filterStatuspayment === '0' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatuspayment('0')}
        >
          Payment Not Confirmed
        </Button>
        <Button
          variant={filterStatuspayment === 'Null' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatuspayment('Null')}
        >
          Not Yet Checked
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Date</TableCell>
              <TableCell>Order No</TableCell>
              <TableCell>Quotation</TableCell>
              <TableCell>POC</TableCell>
              <TableCell>Shipping Service</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Mode of Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrdersByPayment.map((order) => (
              <TableRow
                key={order.orderId}
                onClick={() => handleOrderSelect(order)}
                className={selectedOrder === order ? 'selected-order-row' : ''}
              >
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.quotation}</TableCell>
                <TableCell>{order.POC}</TableCell>
                <TableCell>{order.shippingService}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>{order.modeOfPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedOrder && (
        <div className="selected-order-details">
          <Typography variant="h5">Selected Order Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box border={1} borderRadius={5} p={2}>
                <Typography>Order Date: {selectedOrder.orderDate}</Typography>
                <Typography>Order No: {selectedOrder.orderNo}</Typography>
                <Typography>Quotation: {selectedOrder.quotation}</Typography>
                <Typography>POC: {selectedOrder.POC}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box border={1} borderRadius={5} p={2}>
                <Typography>Shipping Service: {selectedOrder.shippingService}</Typography>
                <Typography>Shipping Address: {selectedOrder.shippingAddress}</Typography>
                <Typography>Mode of Payment: {selectedOrder.modeOfPayment}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box border={1} borderRadius={5} p={2}>
                <Typography>Tracking Number: {selectedOrder.trackingNumber}</Typography>
                <Typography>Tracking Status: {selectedOrder.trackingStatus}</Typography>
                <Typography>Payment Confirmation: {selectedOrder.confirmedPayment}</Typography>
                {/* Add more order details here */}
              </Box>
            </Grid>
          </Grid>
        </div>

        
      )}
    </div>
  );
}

export default OrdersPage;
