// FinancePage.js
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './finance.css'; // Import your CSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinanceFields from './finance_fields';
import moment from 'moment';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';



function FinancePage() {

  const location = useLocation();
  const { userId } = location.state;

  const [filterOption, setFilterOption] = useState('All'); // Initialize with 'All'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [confirmedPayment, setConfirmedPayment] = useState('Confirmed');
  const [totalAmount, setTotalAmount] = useState(0); // Initialize totalAmount state


  const [searchField, setSearchField] = useState('orderDate');
  const [searchInput, setSearchInput] = useState('');
  const [originalOrders, setOriginalOrders] = useState([]);


  
  // Fields for finance team
  
  const [paymentType, setPaymentType] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [actualAmountReceived, setActualAmountReceived] = useState('');
  const [paymentReceivedOn, setPaymentReceivedOn] = useState('');
  const [paymentShortage, setPaymentShortage] = useState('');
  const [inrAmountCreditedInBank, setInrAmountCreditedInBank] = useState('');
  const [dateOfCredit, setDateOfCredit] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [exchangeRate, setExchangeRate] = useState(''); // Define exchangeRate state


  // Fetch order data from the server when the component mounts
  useEffect(() => {
    axios.get('/api/finance/orders')
      .then((response) => {
        setOrders(response.data);
        setOriginalOrders(response.data);
        // Set the original orders when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          setSelectedOrder(null);
          setTimestamp('');
          setRemarks('');
          setPaymentType('');
          setPayeeName('');
          setActualAmountReceived('');
          setPaymentReceivedOn('');
          setPaymentShortage('');
          setInrAmountCreditedInBank('');
          setDateOfCredit('');
          setTransactionCode('');
        }
      };
  
      document.addEventListener('keydown', handleEscapeKey);
  
      return () => {
        // Remove the event listener when the component unmounts to prevent memory leaks
        document.removeEventListener('keydown', handleEscapeKey);
      };
      }, []);
  

  const handleOrderSelect = (order) => {
    setTotalAmount(order.totalAmount); 
    setSelectedOrder(order);
    setTimestamp('');
    setConfirmedPayment('Confirmed');
    
    setPaymentType('');
    setPayeeName('');
    setActualAmountReceived('');
    setPaymentReceivedOn('');
    setPaymentShortage('');
    setInrAmountCreditedInBank('');
    setDateOfCredit('');
    setTransactionCode('');
    setRemarks('');
  };

  const handleFilter = (filter) => {
    setFilterOption(filter);
  };

// Inside the component function...

const filteredOrders = orders.filter((order) => {
 /* console.log('Filter Option:', filterOption);
  console.log('Confirmed Payment:', order.confirmedPayment);
  console.log('Order Object:', order); // Log the entire order object
  console.log('Order Confirmed:', order.paymentconfirmed); // Add this line for debugging*/

  if (filterOption === 'All') {
    return true; // Show all orders
  } else if (filterOption === 'Confirmed' && order.paymentconfirmed === "1") {
    return true; // Show confirmed orders (confirmedPayment = 1)
  } else if (filterOption === 'NotConfirmed' && order.paymentconfirmed === "0") {
    return true; // Show not confirmed orders (confirmedPayment = 0)
  } else if (filterOption === 'Yet to Confirm' && order.paymentconfirmed === null) {
    return true; // Show orders yet to be confirmed (confirmedPayment is null)
  }
  return false; // For other cases
});

const updateSearchInput = (value) => {
  setSearchInput(value);
  searchOrders(value);
};

const searchOrders = (searchValue) => {
  const filteredOrders = originalOrders.filter((order) => {
    const fieldValue = order[searchField] ? order[searchField].toString().toLowerCase() : ''; // Convert to lowercase for case-insensitive search
    return fieldValue.includes(searchValue.toLowerCase());
  });

  // Update the orders displayed in the table
  setOrders(filteredOrders);
};

const generateTimestamp = () => {
  const now = moment();
  const formattedTime = now.format('HH:mm'); // 'HH' for 24-hour format, 'hh' for 12-hour format
  return formattedTime;
};



  const handlePaymentConfirmation = (confirmed) => {
    console.log(`Button clicked with value: ${confirmed}`);
    console.log('handlePaymentConfirmation called with confirmed:', confirmed);
      console.log('selectedOrder:', selectedOrder);

    if (selectedOrder) {
      
      const inrCredited = exchangeRate * actualAmountReceived;
      const confirmationData = {
        orderId: selectedOrder.id,
        orderDate: selectedOrder.orderDate,
        orderNo: selectedOrder.orderNo,
        quotation: selectedOrder.quotation,
        clientName: selectedOrder.clientName,
        POC: selectedOrder.POC,
        shippingService: selectedOrder.shippingService,
        shippingAddress: selectedOrder.shippingAddress,
        modeOfPayment: selectedOrder.modeOfPayment,
        totalAmount: selectedOrder.totalAmount,
        totalAmountPaid: selectedOrder.totalAmountPaid,
        timestamp: generateTimestamp(),
        confirmedPayment: confirmed,
        paymentType,
        payeeName,
        actualAmountReceived,
        paymentReceivedOn,
        paymentShortage : totalAmount-actualAmountReceived,
        inrAmountCreditedInBank : inrCredited,
        dateOfCredit,
        transactionCode,
        remarks
      };

      console.log('handlePaymentConfirmation called with confirmed:', confirmed);
      console.log('selectedOrder:', selectedOrder);
      

      axios.post('/api/finance/confirmPayment', confirmationData)
        .then((response) => {
          console.log('Payment confirmed successfully');
          toast.success('Form submitted successfully', {
            autoClose: 2000,
            position: toast.POSITION.TOP_RIGHT,
          });

          // After successful confirmation, clear the selected order and input fields
          setSelectedOrder(null);
          setTimestamp('');
          setRemarks('');
          setPaymentType('');
          setPayeeName('');
          setActualAmountReceived('');
          setPaymentReceivedOn('');
          setPaymentShortage('');
          setInrAmountCreditedInBank('');
          setDateOfCredit('');
          setTransactionCode('');

          // Fetch the updated order list from the server
          axios.get('/api/finance/orders')
            .then((response) => {
              setOrders(response.data);
            })
            .catch((error) => {
              console.error('Error fetching orders:', error);
            });
        })
        .catch((error) => {
          console.error('Error confirming payment:', error);
        });
    }
  };

  
  return (
    <Container>
      <h1>Finance Page</h1>
      <h2>Hello {userId}</h2>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="filter-container">
            <Button variant="outlined" onClick={() => handleFilter('All')}>
              All
            </Button>
            <Button variant="outlined" onClick={() => handleFilter('Confirmed')}>
              Confirmed
            </Button>
            <Button variant="outlined" onClick={() => handleFilter('NotConfirmed')}>
              Not Confirmed
            </Button>
            <Button variant="outlined" onClick={() => handleFilter('Yet to Confirm')}>
              Yet to Confirm
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="search-container">
            <FormControl fullWidth>
              <InputLabel>Select Search Field</InputLabel>
              <Select
              InputLabelProps={{ shrink: true }}
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
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
            <TextField
              type="text"
              placeholder="Search..."
              fullWidth
              value={searchInput}
              onChange={(e) => updateSearchInput(e.target.value)}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Order No</TableCell>
                  <TableCell>Quotation</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>POC</TableCell>
                  <TableCell>Shipping Service</TableCell>
                  <TableCell>Shipping Address</TableCell>
                  <TableCell>Mode of Payment</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Total Amount Paid</TableCell>
                  <TableCell>Payment Confirmed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={`order ${
                      selectedOrder === order ? 'selected selected-order-row' : ''
                    }`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.quotation}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.POC}</TableCell>
                    <TableCell>{order.shippingService}</TableCell>
                    <TableCell>{order.shippingAddress}</TableCell>
                    <TableCell>{order.modeOfPayment}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>{order.totalAmountPaid}</TableCell>
                    <TableCell>
                      {order.paymentconfirmed === '1' ? 'Confirmed' :
                        order.paymentconfirmed === '0' ? 'Not Confirmed' : 'Yet to Confirm'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <div className="selected-order">
            {selectedOrder && (
              <div>
                <h2>Selected Order</h2>
                <FinanceFields
                  totalAmount={totalAmount}
                  modeOfPayment={selectedOrder.modeOfPayment}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  payeeName={payeeName}
                  setPayeeName={setPayeeName}
                  actualAmountReceived={actualAmountReceived}
                  setActualAmountReceived={setActualAmountReceived}
                  paymentReceivedOn={paymentReceivedOn}
                  setPaymentReceivedOn={setPaymentReceivedOn}
                  paymentShortage={paymentShortage}
                  setPaymentShortage={setPaymentShortage}
                  inrAmountCreditedInBank={inrAmountCreditedInBank}
                  setInrAmountCreditedInBank={setInrAmountCreditedInBank}
                  dateOfCredit={dateOfCredit}
                  setDateOfCredit={setDateOfCredit}
                  transactionCode={transactionCode}
                  setTransactionCode={setTransactionCode}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  exchangeRate={exchangeRate}
                  setExchangeRate={setExchangeRate}
                />
                <div className="timestamp-field">
                  <p>Timestamp:</p>
                  <TextField
                    type="text"
                    value={generateTimestamp()}
                    readOnly
                  />
                </div>
                <div className="confirmed-payment-button-container">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePaymentConfirmation(true)}
                  >
                    Confirm Payment
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handlePaymentConfirmation(false)}
                  >
                    Reject Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default FinancePage;