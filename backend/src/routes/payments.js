const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbOperations } = require('../db/database');

// Generate UPI payment string
const generateUPIString = (upiId, amount, payerName, note) => {
  const txnId = `TXN${Date.now()}`;
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payerName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&tr=${txnId}`;
};

// GET all transactions
router.get('/', (req, res) => {
  try {
    const transactions = dbOperations.getAllTransactions();
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single transaction
router.get('/:id', (req, res) => {
  try {
    const transaction = dbOperations.getTransactionById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;