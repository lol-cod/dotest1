const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mediseller_sales', // Change this to your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});



app.post('/api/sales', (req, res) => {
    console.log('Received a POST request to /api/sales/newserver');

  const {
    month,
    orderDate,
    orderNo,
    POC,
    oldNewClient,
    orderType,
    clientName,
    countryRegion,
    contactNumber,
    currencyOfPayment,
    quotation,
    totalAmountPaid,
    shippingCosts,
    totalAmount,
    paymentSenderName,
    modeOfPayment,
    shippingAddress,
    shippingService,
  } = req.body;

  const sql = 'INSERT INTO sales (month, orderDate, orderNo, POC, oldNewClient, orderType, clientName, countryRegion, contactNumber, currencyOfPayment, quotation, totalAmountPaid, shippingCosts, totalAmount, paymentSenderName, modeOfPayment, shippingAddress, shippingService) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const values = [
    month,
    orderDate,
    orderNo,
    POC,
    oldNewClient,
    orderType,
    clientName,
    countryRegion,
    contactNumber,
    currencyOfPayment,
    quotation,
    totalAmountPaid,
    shippingCosts,
    totalAmount,
    paymentSenderName,
    modeOfPayment,
    shippingAddress,
    shippingService,
  ];
  const custsql='INSERT INTO cutomer (clientName,countryRegion,contactNumber,paymentSenderName,modeOfPayment,shippingAddress) values(?,?,?,?,?,?);'
  const custvalues=[clientName,
    countryRegion,
    contactNumber,
    paymentSenderName,
    modeOfPayment,
    shippingAddress]

    console.log('Form data received:', req.body);

    db.query(custsql, custvalues, (err, results) => {
      if (err) {
        console.error('Error inserting into Dispatch table:', err);
        res.status(300).json({ error: 'Internal Server Error' });
        return;
      }
  
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error updating Finance table:', err);
          res.status(300).json({ error: 'Internal Server Error' });
          return;
        }
  
        res.json({ message: 'Information inserted into Sales table successfully' });
      });
    });
  });
