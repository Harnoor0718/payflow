const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./db/database');

// Initialize database
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'PayFlow API is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 PayFlow Server running on http://localhost:${PORT}`);
});