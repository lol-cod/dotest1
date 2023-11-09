const express = require('express');
const mysql = require('mysql');
const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mediseller_sales',  // Use the name of your database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.use(express.json());

// API endpoint to create a new request
app.post('/api/requests', (req, res) => {
  const { request_text } = req.body;

  db.query(
    'INSERT INTO requests (request_text, is_approved) VALUES (?, ?)',
    [request_text, false], // Set is_approved to false by default
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

app.get('/api/approved-requests', (req, res) => {
    db.query('SELECT * FROM requests WHERE is_approved = 1', (err, results) => {
      if (err) {
        console.error('Error fetching approved requests:', err);
        res.status(500).json({ message: 'Error fetching approved requests' });
      } else {
        res.json(results);
      }
    });
  });

// API endpoint to fetch all requests
app.get('/api/requests', (req, res) => {
  db.query('SELECT * FROM requests WHERE is_approved = 0', (err, results) => {
    if (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ message: 'Error fetching requests' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to update the approval status of a request
app.put('/api/requests/:id', (req, res) => {
  const requestId = req.params.id;
  const { is_approved } = req.body;

  db.query(
    'UPDATE requests SET is_approved = ? WHERE id = ?',
    [is_approved, requestId],
    (err, results) => {
      if (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request' });
      } else {
        res.json({ message: 'Request updated successfully' });
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
