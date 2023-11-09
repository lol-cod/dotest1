// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const users = require('./users.json');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { employeeID, password } = req.body;

  const user = users.find((u) => u.employeeID === employeeID);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
