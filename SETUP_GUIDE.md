# 🚀 PayFlow Setup Guide

Step-by-step guide to set up PayFlow on your local machine.

---

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- [ ] **npm** (comes with Node.js) or **yarn**
- [ ] **Git** - [Download here](https://git-scm.com/)
- [ ] **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)
- [ ] **Terminal/Command Prompt**

### Verify Installation

Open terminal and run:
```bash
node --version   # Should show v16.x.x or higher
npm --version    # Should show 8.x.x or higher
git --version    # Should show 2.x.x or higher
```

---

## Installation Steps

### Step 1: Clone or Download

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/yourusername/payflow.git
cd payflow
```

**Option B: Download ZIP**
1. Download ZIP from GitHub
2. Extract to a folder
3. Open terminal in that folder

---

### Step 2: Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

This will install:
- express
- cors
- better-sqlite3
- dotenv
- uuid

**Wait for installation to complete** (1-2 minutes)

3. **Create environment file:**

Create a file named `.env` in the `backend` folder:
```env
PORT=5000
NODE_ENV=development
```

4. **Start the backend server:**
```bash
npm run dev
```

**Expected output:**
```
✅ Database table created successfully
✅ Database initialized
🚀 PayFlow Server running on http://localhost:5000
```

**✅ Backend is now running!** Keep this terminal open.

---

### Step 3: Frontend Setup

1. **Open a NEW terminal window/tab**

2. **Navigate to frontend folder:**
```bash
cd frontend
```

3. **Install dependencies:**
```bash
npm install
```

This will install:
- react
- vite
- tailwindcss
- axios
- qrcode.react
- jspdf
- react-hot-toast
- lucide-react

**Wait for installation to complete** (2-3 minutes)

4. **Start the frontend development server:**
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend is now running!**

---

### Step 4: Open in Browser

1. Open your browser
2. Go to: `http://localhost:5173/`
3. You should see the PayFlow interface!

---

## Verification Checklist

Test these to make sure everything works:

### Backend Tests
- [ ] Backend terminal shows no errors
- [ ] Can access: `http://localhost:5000/api/health`
- [ ] Response shows: `{"status":"healthy",...}`

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] Can see PayFlow header and dashboard
- [ ] Stats cards are visible (showing 0s initially)

### Integration Tests
- [ ] Create a payment request
- [ ] QR code appears
- [ ] Transaction appears in the list
- [ ] Status shows "PENDING"

---

## Common Issues & Solutions

### Issue: Port 5000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Stop any other application using port 5000
2. Or change port in `backend/.env`:
```env
PORT=5001
```
3. Update frontend API URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

---

### Issue: npm install fails

**Error:**
```
npm ERR! network request to ... failed
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

### Issue: Module not found

**Error:**
```
Cannot find module 'express'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### Issue: Database locked

**Error:**
```
Error: database is locked
```

**Solution:**
1. Stop the backend server (Ctrl+C)
2. Delete `backend/payflow.db`
3. Restart backend: `npm run dev`
4. Database will be recreated automatically

---

### Issue: CORS error in browser

**Error:**
```
Access to fetch at 'http://localhost:5000' has been blocked by CORS policy
```

**Solution:**
1. Make sure backend is running
2. Check `backend/src/server.js` has:
```javascript
app.use(cors());
```
3. Restart backend server

---

### Issue: Blank page in browser

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify both servers are running
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Development Workflow

### Daily Startup
```bash
# Terminal 1 - Backend
cd payflow/backend
npm run dev

# Terminal 2 - Frontend
cd payflow/frontend
npm run dev
```

### Stopping the servers
- Press `Ctrl+C` in each terminal

---

## Next Steps

Now that everything is set up:

1. 📖 Read the [README.md](README.md) for features overview
2. 📡 Check [API_DOCS.md](API_DOCS.md) for API reference
3. 🎮 Try creating payments and testing features
4. 🧪 Test the simulation feature
5. 📄 Download PDF receipts and CSV exports

---

## VS Code Extensions (Recommended)

Install these for better development experience:

- **ES7+ React/Redux/React-Native snippets** - React snippets
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Thunder Client** - API testing (alternative to Postman)

---

## Getting Help

If you're stuck:

1. Check the [Troubleshooting](#common-issues--solutions) section
2. Review terminal errors carefully
3. Make sure all prerequisites are installed
4. Verify both servers are running
5. Check browser console for frontend errors

---

**Happy coding! 🚀**