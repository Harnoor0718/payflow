# 💳 PayFlow - Automated Payment Tracking System

A modern, full-stack payment tracking application that generates UPI QR codes and tracks payment statuses in real-time. Built for educational institutions, clubs, and organizations to streamline membership fees and event payments.

![PayFlow Banner](https://via.placeholder.com/1200x400/000000/FCD34D?text=PayFlow+-+Payment+Tracking+System)

## ✨ Features

### 🎯 Core Features
- **UPI QR Code Generation** - Create scannable payment QR codes instantly
- **Real-time Status Tracking** - Monitor payment status with auto-refresh
- **Live Dashboard** - View statistics and analytics at a glance
- **Mock Payment Simulation** - Test payment flows without real transactions

### 🔍 Advanced Features
- **Smart Search** - Search by payer name, note, or transaction ID
- **Multi-level Filtering** - Filter by status (PENDING/SUCCESS/FAILED) and date range
- **PDF Receipts** - Generate and download professional receipts
- **CSV Export** - Export filtered transaction data
- **Auto-refresh** - Live updates every 5 seconds
- **Copy Transaction ID** - One-click clipboard copy

### 🎨 User Experience
- **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **Toast Notifications** - Real-time feedback on actions
- **Smooth Animations** - Polished transitions and hover effects
- **Loading Skeletons** - Better perceived performance
- **Error Handling** - Graceful error boundaries and network detection
- **Custom Color Scheme** - Black, White, Yellow, and Lavender theme

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/payflow.git
cd payflow
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

5. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

6. **Open in Browser**
Navigate to `http://localhost:5173`

---

## 📁 Project Structure
```
payflow/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js          # SQLite database setup
│   │   ├── routes/
│   │   │   └── payments.js          # Payment API routes
│   │   └── server.js                # Express server
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── payflow.db                   # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx        # Stats dashboard
│   │   │   ├── PaymentForm.jsx      # Payment creation form
│   │   │   ├── TransactionList.jsx  # Transaction list with filters
│   │   │   ├── LoadingSkeleton.jsx  # Loading state
│   │   │   ├── ErrorBoundary.jsx    # Error handling
│   │   │   └── NetworkStatus.jsx    # Network indicator
│   │   ├── utils/
│   │   │   └── exportHelpers.js     # PDF & CSV export utilities
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles + animations
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔧 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **QRCode.react** - QR code generation
- **jsPDF** - PDF generation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Create Payment Request
```http
POST /payments/create
Content-Type: application/json

{
  "upi_id": "merchant@upi",
  "amount": 500,
  "payer_name": "John Doe",
  "note": "Membership Fee"
}

Response: 201 Created
{
  "success": true,
  "message": "Payment request created successfully",
  "data": {
    "id": "uuid",
    "upi_string": "upi://pay?pa=merchant@upi&...",
    "status": "PENDING",
    ...
  }
}
```

#### 2. Get All Payments
```http
GET /payments

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### 3. Get Single Payment
```http
GET /payments/:id

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

#### 4. Filter by Status
```http
GET /payments/status/:status
# status: PENDING | SUCCESS | FAILED

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### 5. Get Statistics
```http
GET /payments/stats/summary

Response: 200 OK
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 3,
    "success": 5,
    "failed": 2,
    "total_amount": 5000,
    "pending_amount": 1500
  }
}
```

#### 6. Update Payment Status
```http
POST /payments/:id/update-status
Content-Type: application/json

{
  "status": "SUCCESS"
}

Response: 200 OK
{
  "success": true,
  "message": "Status updated successfully",
  "data": {...}
}
```

#### 7. Simulate Payment (Testing Only)
```http
POST /payments/:id/simulate-payment

Response: 200 OK
{
  "success": true,
  "message": "Payment SUCCESS",
  "data": {...},
  "simulation": {
    "random_check": "passed",
    "note": "This is a simulated payment verification"
  }
}
```

---

## 🎮 Usage Guide

### Creating a Payment Request

1. Fill in the payment form:
   - **UPI ID**: Merchant's UPI ID (default: college@upi)
   - **Payer Name**: Person making the payment (required)
   - **Amount**: Payment amount in ₹ (required)
   - **Note**: Optional description

2. Click **"Generate QR Code"**

3. A QR code will appear - users can scan this with any UPI app

4. The transaction appears in the list with status **PENDING**

### Testing Payment Flow

1. Create a payment request
2. Click the **"Test"** button on the transaction card
3. The system will randomly mark it as SUCCESS or FAILED
4. Watch the status update in real-time
5. Receive a toast notification

### Exporting Data

**PDF Receipt:**
- Click the document icon (📄) on any transaction
- A professional PDF receipt downloads automatically

**CSV Export:**
- Apply filters if needed (status, search, date)
- Click the **"CSV"** button
- Filtered transactions download as CSV

### Using Filters

**Status Filter:**
- ALL, PENDING, SUCCESS, FAILED
- Click any status button

**Search:**
- Type in search box
- Searches: payer name, note, transaction ID

**Date Filter:**
- All Time, Today, Last 7 Days, Last 30 Days
- Select from dropdown

**Combine Filters:**
- All filters work together
- Results counter shows: "X of Y transactions"

---

## 🧪 Testing

### Manual Testing Steps

1. **Create Multiple Payments**
   - Test with different amounts
   - Test with/without notes
   - Verify QR codes generate

2. **Test Status Updates**
   - Use "Test" button on pending transactions
   - Verify status changes
   - Check toast notifications

3. **Test Filters**
   - Filter by each status
   - Search by various terms
   - Try date filters
   - Combine multiple filters

4. **Test Exports**
   - Download PDF receipts
   - Export CSV with filters
   - Verify file contents

5. **Test Responsive Design**
   - Open DevTools (F12)
   - Toggle device toolbar
   - Test on mobile, tablet, desktop views

6. **Test Error Handling**
   - Submit invalid form data
   - Turn off backend server
   - Check offline mode (DevTools Network tab)

---

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
```

### Frontend
No environment variables required for development.

For production, update API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-production-api.com/api';
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create account on Railway.app or Render.com
2. Connect your GitHub repository
3. Set environment variables:
   - `PORT` (usually auto-set)
   - `NODE_ENV=production`
4. Deploy from `backend` folder
5. Note the production URL

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Connect GitHub repository
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Update API URL in code to production backend URL
5. Deploy

---

## 🐛 Troubleshooting

### Backend not starting?
- Check if port 5000 is available
- Verify all dependencies installed: `npm install`
- Check `.env` file exists

### Frontend not connecting to backend?
- Verify backend is running on port 5000
- Check CORS is enabled in backend
- Verify API URL in `src/services/api.js`

### Database errors?
- Database file `payflow.db` will be created automatically
- If corrupted, delete `payflow.db` and restart backend

### QR codes not generating?
- Check `qrcode.react` is installed
- Verify UPI string format is correct
- Check console for errors

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

---

## 📄 License

MIT License - feel free to use for learning and personal projects.

---

## 👨‍💻 Author

Built as a learning project to master full-stack development.

**Tech Stack Learned:**
- React with Hooks
- Node.js & Express
- SQLite Database
- RESTful API Design
- Tailwind CSS
- Responsive Design
- State Management
- Error Handling

---

## 🙏 Acknowledgments

- UPI payment standard documentation
- React and Vite communities
- Tailwind CSS for styling
- Lucide React for beautiful icons

---

## 📞 Support

For questions or issues:
1. Check the Troubleshooting section
2. Review the API Documentation
3. Open an issue on GitHub

---

**Made with ❤️ for learning full-stack development**