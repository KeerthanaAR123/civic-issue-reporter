const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// 1. ALLOW CONNECTIONS (CORS FIX)
app.use(cors({
  origin: 'http://localhost:4200', // Allow Angular Client
  credentials: true
})); 

app.use(express.json());

// 2. SERVE IMAGES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. DEFINE ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

// 4. CONNECT DB & START
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch(err => {
    console.error('Database Connection Error:', err);
  });
