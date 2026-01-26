const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbOperations } = require('../db/database');

// Generate UPI payment string
const generateUPIString = (upiId, amount, payerName, note) => {
  const txnId = `TXN${Date.now()}`;
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payerName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&tr=${txnId}`;
};

// POST - Create new payment request
router.post('/create', (req, res) => {
  try {
    const { upi_id, amount, payer_name, note } = req.body;

    // Validation
    if (!upi_id || !amount || !payer_name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: upi_id, amount, payer_name'
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }

    // Generate unique transaction ID
    const transactionId = uuidv4();
    
    // Generate UPI string
    const upiString = generateUPIString(upi_id, amount, payer_name, note || 'Payment');

    // Create transaction object
    const transaction = {
      id: transactionId,
      upi_id,
      amount: parseFloat(amount),
      payer_name,
      note: note || '',
      upi_string: upiString,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to database
    const created = dbOperations.createTransaction(transaction);

    if (created) {
      res.status(201).json({
        success: true,
        message: 'Payment request created successfully',
        data: transaction
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create payment request'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all transactions
router.get('/', (req, res) => {
  try {
    const transactions = dbOperations.getAllTransactions();
    res.json({ 
      success: true, 
      count: transactions.length,
      data: transactions 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single transaction by ID
router.get('/:id', (req, res) => {
  try {
    const transaction = dbOperations.getTransactionById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }
    
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET transactions by status (PENDING, SUCCESS, FAILED)
router.get('/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['PENDING', 'SUCCESS', 'FAILED'];
    
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be PENDING, SUCCESS, or FAILED'
      });
    }

    const allTransactions = dbOperations.getAllTransactions();
    const filtered = allTransactions.filter(t => t.status === status.toUpperCase());

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET payment statistics
router.get('/stats/summary', (req, res) => {
  try {
    const transactions = dbOperations.getAllTransactions();
    
    const stats = {
      total: transactions.length,
      pending: transactions.filter(t => t.status === 'PENDING').length,
      success: transactions.filter(t => t.status === 'SUCCESS').length,
      failed: transactions.filter(t => t.status === 'FAILED').length,
      total_amount: transactions
        .filter(t => t.status === 'SUCCESS')
        .reduce((sum, t) => sum + t.amount, 0),
      pending_amount: transactions
        .filter(t => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.amount, 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Update transaction status
router.post('/:id/update-status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const validStatuses = ['PENDING', 'SUCCESS', 'FAILED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be PENDING, SUCCESS, or FAILED'
      });
    }

    // Check if transaction exists
    const transaction = dbOperations.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Update status
    const updated = dbOperations.updateTransactionStatus(id, status.toUpperCase());

    if (updated) {
      const updatedTransaction = dbOperations.getTransactionById(id);
      res.json({
        success: true,
        message: 'Status updated successfully',
        data: updatedTransaction
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update status'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Simulate payment webhook (for testing)
router.post('/:id/simulate-payment', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if transaction exists
    const transaction = dbOperations.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Only simulate for PENDING transactions
    if (transaction.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'Can only simulate payment for PENDING transactions'
      });
    }

    // Randomly decide success or failure (70% success rate)
    const isSuccess = Math.random() > 0.3;
    const newStatus = isSuccess ? 'SUCCESS' : 'FAILED';

    // Update status
    dbOperations.updateTransactionStatus(id, newStatus);

    const updatedTransaction = dbOperations.getTransactionById(id);

    res.json({
      success: true,
      message: `Payment ${newStatus}`,
      data: updatedTransaction,
      simulation: {
        random_check: isSuccess ? 'passed' : 'failed',
        note: 'This is a simulated payment verification'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;