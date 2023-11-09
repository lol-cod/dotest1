import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dispatch.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

function DispatchPages() {

  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState({ trackingNumber: '', dispatchedOn: '', trackingStatus: '' });
  const [showDispatched, setShowDispatched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePaths, setImagePaths] = useState([]);


  const filterOrders = (query) => {
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery === '') {
      return confirmedOrders;
    }

    return confirmedOrders.filter((order) => order.orderNo.toLowerCase().includes(lowerCaseQuery));
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
    fetchOrders(showDispatched);
  }, [showDispatched]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      trackingNumber: order.trackingNumber || '',
      dispatchedOn: order.dispatchedOn || '',
      trackingStatus: order.trackingStatus || '',
    });

    fetchImagePaths(order.id);
  };



  const handleImageUpload = () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('salesId', selectedOrder.id); // Pass the sales record ID
  
      axios.post('/api/sales/uploadImage', formData)
        .then((response) => {
          // Handle the response if needed
          console.log('Image uploaded successfully:', response.data);
  
          // Fetch the updated image paths for the selected sales record
          fetchImagePaths(selectedOrder.id);
  
          toast.success('Image uploaded successfully', {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    } else {
      toast.error('Please select an image to upload', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  

  const fetchImagePaths = (salesId) => {
    axios.get(`/api/sales/images/${salesId}`)
      .then((response) => {
        setImagePaths(response.data);
      })
      .catch((error) => {
        console.error('Error fetching image paths:', error);
      });
  };
  


  const handleTrackingSubmit = () => {
    const { orderDate, orderNo, quotation, POC, shippingAddress, timestamp } = selectedOrder;
    const { trackingNumber, dispatchedOn, trackingStatus } = trackingInfo;
  
    axios
      .post('/api/dispatch/insertDispatch', {
        orderDate,
        orderNo,
        quotation,
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

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <Container className="dispatch-container">
      <h1>Dispatch Page</h1>
     
      <Button variant="outlined" onClick={() => toggleDrawer(true)}>
        Open Drawer
      </Button>

      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => setShowDispatched(false)}>
            <ListItemText primary="Yet to be Dispatched" />
          </ListItem>
          <ListItem button onClick={() => setShowDispatched(true)}>
            <ListItemText primary="Dispatched" />
          </ListItem>
        </List>
      </Drawer>

      <Container className="search-bar">
        <TextField
          label="Search by Order No"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Container>

      <Paper className="order-table-container">
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Date</TableCell>
              <TableCell>Order No</TableCell>
              <TableCell>Quotation</TableCell>
              <TableCell>POC</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Tracking Status</TableCell>
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
                <TableCell>{order.trackingStatus}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOrderSelect(order)}>
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Container className="selected-order-container">
        {selectedOrder && (
          <div>
            <h2>Selected Order Details</h2>
            <p>Order Date: {selectedOrder.orderDate}</p>
            <p>Order No: {selectedOrder.orderNo}</p>
            <p>Quotation: {selectedOrder.quotation}</p>
            <p>POC: {selectedOrder.POC}</p>
            <p>Shipping Address: {selectedOrder.shippingAddress}</p>
            <p>Time Stamp: {selectedOrder.timestamp}</p>
            <div>
                {imagePaths.map((path) => (
                <img key={path} src={path} alt="Sales Record" />
                ))}
            </div>

            {/* Input for image upload */}
            <div className="input-container">
                <label>
                Upload Image:
                <input
                    type="file"
                    name="image"
                    onChange={handleImageUpload}
                />
                </label>
            </div>

            <div className="tracking-info-container">
              <h2>Enter Tracking Information</h2>
              <div className="input-container">
                <label>
                  Tracking Number:
                  <input
                    type="text"
                    name="trackingNumber"
                    value={trackingInfo.trackingNumber}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="input-container">
                <label>
                  Dispatched On:
                  <input
                    type="date"
                    name="dispatchedOn"
                    value={trackingInfo.dispatchedOn}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="input-container">
                <label>
                  Tracking Status:
                  <select
                    name="trackingStatus"
                    value={trackingInfo.trackingStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="Select Option">Select Option</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                  </select>
                </label>
              </div>

              <Button variant="outlined" onClick={handleTrackingSubmit}>
                Submit Tracking Info
              </Button>
            </div>
          </div>
        )}
      </Container>
      <ToastContainer />
    </Container>
  );
}

export default DispatchPages;
