const Database = require('better-sqlite3');
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, '../../payflow.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create transactions table
const createTransactionsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      upi_id TEXT NOT NULL,
      amount REAL NOT NULL,
      payer_name TEXT NOT NULL,
      note TEXT,
      upi_string TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;
  
  db.exec(sql);
  console.log('✅ Database table created successfully');
};

// Initialize database
const initDatabase = () => {
  try {
    createTransactionsTable();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

// Database operations
const dbOperations = {
  // Get all transactions
  getAllTransactions: () => {
    const sql = 'SELECT * FROM transactions ORDER BY created_at DESC';
    return db.prepare(sql).all();
  },

  // Get transaction by ID
  getTransactionById: (id) => {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    return db.prepare(sql).get(id);
  },

  // Create new transaction
  createTransaction: (transaction) => {
    const sql = `
      INSERT INTO transactions (id, upi_id, amount, payer_name, note, upi_string, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = db.prepare(sql).run(
      transaction.id,
      transaction.upi_id,
      transaction.amount,
      transaction.payer_name,
      transaction.note,
      transaction.upi_string,
      transaction.status,
      transaction.created_at,
      transaction.updated_at
    );
    
    return result.changes > 0;
  },

  // Update transaction status
  updateTransactionStatus: (id, status) => {
    const sql = `
      UPDATE transactions 
      SET status = ?, updated_at = ?
      WHERE id = ?
    `;
    
    const result = db.prepare(sql).run(
      status,
      new Date().toISOString(),
      id
    );
    
    return result.changes > 0;
  }
};

module.exports = { initDatabase, dbOperations };