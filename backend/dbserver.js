const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
require("dotenv").config();


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Change this to your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Define API endpoints

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




app.get('/api/edit/approved', (req, res) => {
  // Fetch all requests from the 'requests' table
  db.query('SELECT * FROM requests where is_approved=1', (err, results) => {
    if (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ message: 'Error fetching requests' });
    } else {
      res.json(results);
    }
  });
});




app.get('/api/requests', (req, res) => {
  // Fetch all requests from the 'requests' table
  db.query('SELECT * FROM requests where is_approved=0', (err, results) => {
    if (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ message: 'Error fetching requests' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/requests/approve', (req, res) => {
  const { orderNO,POC,orderDate } = req.body;
  const editsql='UPDATE requests SET is_approved = ? WHERE orderNO = ? AND POC=? AND orderDate=?';
  const editvalues=[true,orderNO,POC,orderDate];

  // Update the request with the specified ID to be approved
  db.query(editsql, editvalues, (err, results) => {
    if (err) {
      console.error('Error approving request:', err);
      res.status(500).json({ message: 'Error approving request' });
    } else {
      console.log(editvalues);
      res.json({ message: 'Request approved successfully' });
    }
  });
});

app.post('/api/requests/deny', (req, res) => {
  const { orderNO,POC,orderDate } = req.body;
  const delsql='DELETE FROM requests WHERE orderNO = ? AND POC = ? AND orderDate=?'
  const delvalues=[orderNO,POC,orderDate]

  // Delete the request with the specified ID
  db.query(delsql,delvalues, (err, results) => {
    if (err) {
      console.error('Error denying request:', err);
      res.status(500).json({ message: 'Error denying request' });
    } else {
      console.log("Values to delete: ", delvalues)
      res.json({ message: 'Request denied and removed successfully' });
    }
  });
});





app.post('/api/sales/sendRequest', (req, res) => {
  const { POC,orderNo,orderDate } = req.body;
  

  db.query(
    'INSERT INTO requests ( POC, orderNO, orderDate, is_approved) VALUES (?,?,?,?)',
    [POC,orderNo,orderDate,false], // Set is_approved to false by default
    (err, results) => {
      if (err) {
        console.error('Error creating request:', err);
        res.status(500).json({ message: 'Error creating request' });
      } else {
        res.json({ message: 'Request created successfully' });
      }
    }
  );
});




// Get all sales records
app.get('/api/sales/new', (req, res) => {
  const sql = 'SELECT * FROM sales';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving sales data: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Get all sales records for finance
app.get('/api/finance/orders', (req, res) => {
  const sql = 'select orderDate, orderNo, quotation, clientName, POC, shippingService, shippingAddress, modeOfPayment, totalAmount, totalAmountPaid, paymentconfirmed from sales;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching sales records: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});



app.post('/api/finance/confirmPayment', (req, res) => {
  const {
    orderId,
    orderDate,
    orderNo,
    quotation,
    clientName,
    POC,
    shippingService,
    shippingAddress,
    modeOfPayment,
    totalAmount,
    totalAmountPaid,
    timestamp,
    confirmedPayment,
    paymentType,
    payeeName,
    actualAmountReceived,
    paymentReceivedOn,
    paymentShortage,
    inrAmountCreditedInBank,
    dateOfCredit,
    transactionCode,
    remarks
  } = req.body;

  const sqlInsertFinance = 'INSERT INTO finance (orderId, orderDate, orderNo, quotation,clientName, POC, shippingService, shippingAddress, modeOfPayment, totalAmount, totalAmountPaid, confirmedPayment, timestamp, paymentType, payeeName, actualAmountReceived, paymentReceivedOn, paymentShortage, inrAmountCreditedInBank, dateOfCredit, transactionCode, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  // Adjust the values array to include the new fields
  const valuesInsertFinance = [
    orderId,
    orderDate,
    orderNo,
    quotation,
    clientName,
    POC,
    shippingService,
    shippingAddress,
    modeOfPayment,
    totalAmount,
    totalAmountPaid,
    confirmedPayment,
    timestamp,
    paymentType,
    payeeName,
    actualAmountReceived,
    paymentReceivedOn,
    paymentShortage,
    inrAmountCreditedInBank,
    dateOfCredit,
    transactionCode,
    remarks,
  ];
  
  const sqlUpdateSales = 'UPDATE sales SET paymentconfirmed = ?, modeOfPayment=?, totalAmount=?, totalAmountPaid=?, confirmedPayment=?, timestamp=?, paymentType=?, payeeName=?, actualAmountReceived=?, paymentReceivedOn=?, paymentShortage=?, inrAmountCreditedInBank=?, dateOfCredit=?, transactionCode=?, remarks=? WHERE orderNo = ? and POC = ?';
  const valuesUpdateSales = [confirmedPayment, 
    modeOfPayment,
    totalAmount,
    totalAmountPaid,
    confirmedPayment,
    timestamp,
    paymentType,
    payeeName,
    actualAmountReceived,
    paymentReceivedOn,
    paymentShortage,
    inrAmountCreditedInBank,
    dateOfCredit,
    transactionCode,
    remarks,
    orderNo, 
    POC,];

  db.query(sqlInsertFinance, valuesInsertFinance, (err, results) => {
    if (err) {
      console.error('Error inserting payment confirmation into finance:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    db.query(sqlUpdateSales, valuesUpdateSales, (err, results) => {
      console.log('Insert SQL:', sqlUpdateSales);
      console.log('Insert Values:', valuesUpdateSales);
      if (err) {
        console.error('Error updating paymentConfirmed in sales:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ message: 'Payment confirmed successfully' });
    });
  });
});


// Add a new API endpoint for fetching user-specific orders
app.get('/api/sales/userOrders', (req, res) => {
  const { userId } = req.query; // Get the userId from the query parameters

  // Query the database to retrieve orders for the specific user
  const sql = 'SELECT * FROM sales WHERE POC = ?';
  console.log(sql);
  db.query(sql, [userId], (err, results) => {
    console.log(results);
    if (err) {
      console.error('Error retrieving user-specific orders: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});




app.get('/api/orders', (req, res) => {
  const sql = 'SELECT * FROM sales ';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching confirmed orders:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


// Fetch confirmed orders with paymentConfirmation set to 1
app.get('/api/dispatch/orders', (req, res) => {
  const sql = 'SELECT orderDate, orderNo, quotation, clientName, POC, shippingAddress, timestamp FROM finance where trackingNumber is NULL and confirmedPayment=1 ';
  console.log("sql query for not dispatched:", sql);
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching confirmed orders:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
    console.log(results);
  });
});

app.get('/api/dispatch/dispatched', (req, res) => {
  const sql = 'SELECT orderDate, orderNo, quotation, clientName, POC, shippingAddress, timestamp, trackingStatus, dispatchedOn, trackingNumber FROM finance where trackingNumber is not NULL and confirmedPayment=1 ';
  db.query(sql, (err, results) => {
    if (err) {
      
      console.error('Error fetching confirmed orders:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log("SQL query to fetch: ", sql);
    res.json(results);
    console.log(results);
  });
});

//ordermonth and date autofetch

function incrementOrderNumber(orderNo) {
  const numericPart = parseInt(orderNo.substring(2), 10);
  const nextNumericPart = (numericPart + 1).toString().padStart(3, '0');
  return `MS${nextNumericPart}`;
}

// Fetch the next orderNo
app.get('/api/sales/nextOrderNo', (req, res) => {
  // Fetch the current month and date
  const currentDate = new Date();
  const options = { month: 'long' };
  const currentMonth = currentDate.toLocaleString('en-US', options);
  const currentMonthNum = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const currentYear = currentDate.getFullYear();
  const orderDate = `${currentYear}-${currentMonthNum}-${currentDay}`;

  // Now, let's fetch the next orderNo
  const query = 'SELECT MAX(orderNo) AS maxOrderNo FROM sales WHERE orderDate = ?';
  db.query(query, [orderDate], (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const maxOrderNo = results[0].maxOrderNo;

    if (!maxOrderNo) {
      // Handle the case where no orderNo is found for the day
      const nextOrderNo = 'MS001'; // Initial order number
      res.json({ nextOrderNo, month: currentMonth, orderDate });
    } else {
      // Increment the existing order number format
      const nextOrderNo = incrementOrderNumber(maxOrderNo);
      res.json({ nextOrderNo, month: currentMonth, orderDate });
    }
  });
});




// Update tracking information and insert into the dispatch table


app.post('/api/dispatch/insertDispatch', (req, res) => {
  const {
    orderDate,
    orderNo,
    quotation,
    POC,
    trackingNumber,
    dispatchedOn,
    trackingStatus,
    timestamp
  } = req.body;

  const checkSql = 'SELECT * FROM dispatch WHERE trackingNumber = ?';
  db.query(checkSql, [trackingNumber], (err, results) => {
    if (err) {
      console.error('Error checking the dispatch table: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      // A record with the given tracking number already exists; update it.
      const updateSql = 'UPDATE dispatch SET trackingNumber=?, dispatchedOn=?, trackingStatus=?, timestamp=? WHERE trackingNumber=?';
      const updateValues = [trackingNumber, dispatchedOn, trackingStatus, timestamp, trackingNumber];

      const updateFinanceSql = 'UPDATE finance SET trackingNumber=?, dispatchedOn=?, trackingStatus=? WHERE orderNo=? and POC=?';
      const updateFinanceValues = [trackingNumber, dispatchedOn, trackingStatus, orderNo, POC];

      const updateSalesSql = 'UPDATE sales SET trackingNumber=?, dispatchedOn=?, trackingStatus=? WHERE orderNo=? and POC=?';
      const updateSalesValues = [trackingNumber, dispatchedOn, trackingStatus, orderNo, POC];

      db.query(updateSql, updateValues, (err, results) => {
        if (err) {
          console.error('Error updating the dispatch record: ' + err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        db.query(updateFinanceSql, updateFinanceValues, (err, results) => {
          if (err) {
            console.error('Error updating the finance record: ' + err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          db.query(updateSalesSql, updateSalesValues, (err, results) => {
            console.log("SQL sales: ", updateSalesSql);
            console.log("SQL sales values: ", updateSalesValues)
            if (err) {
              console.error('Error updating the sales record: ' + err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            res.json({ message: 'Dispatch information updated successfully' });
          });
        });
      });
    } else {
      // No record with the given tracking number exists; insert a new record.
      const insertSql = 'INSERT INTO dispatch (orderDate, orderNo, quotation, POC, trackingNumber, dispatchedOn, trackingStatus, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const insertValues = [orderDate, orderNo, quotation, POC, trackingNumber, dispatchedOn, trackingStatus, timestamp];

      const updateFinanceSql = 'UPDATE finance SET trackingNumber=?, dispatchedOn=?, trackingStatus=? WHERE orderNo=? and POC=?';
      const updateFinanceValues = [trackingNumber, dispatchedOn, trackingStatus, orderNo, POC];

      const updateSalesSql = 'UPDATE sales SET trackingNumber=?, dispatchedOn=?, trackingStatus=? WHERE orderNo=? and POC=?';
      const updateSalesValues = [trackingNumber, dispatchedOn, trackingStatus, orderNo, POC];

      db.query(insertSql, insertValues, (err, results) => {
        if (err) {
          console.error('Error inserting into Dispatch table: ' + err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        db.query(updateFinanceSql, updateFinanceValues, (err, results) => {
          if (err) {
            console.error('Error updating the finance record: ' + err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          db.query(updateSalesSql, updateSalesValues, (err, results) => {
            if (err) {
              console.error('Error updating the sales record: ' + err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            res.json({ message: 'Dispatch information inserted successfully' });
          });
        });
      });
    }
  });
});


// Update a sales record by ID
app.put('/api/sales/:id', (req, res) => {
  const { id } = req.params;
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

  const sql =
    'UPDATE sales SET month=?, orderDate=?, orderNo=?, POC=?, oldNewClient=?, orderType=?, clientName=?, countryRegion=?, contactNumber=?, currencyOfPayment=?, quotation=?, totalAmountPaid=?, shippingCosts=?, totalAmount=?, paymentSenderName=?, modeOfPayment=?, shippingAddress=?, shippingService=? WHERE id=?';

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
    id,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error updating the sales record: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Sales record updated successfully' });
  });
});

// Delete a sales record by ID
app.delete('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM sales WHERE id=?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting the sales record: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Sales record deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

