# 🧪 PayFlow Testing Guide

Comprehensive testing checklist for PayFlow application.

---

## Table of Contents
1. [Manual Testing Checklist](#manual-testing-checklist)
2. [Feature Testing](#feature-testing)
3. [Edge Cases](#edge-cases)
4. [Browser Compatibility](#browser-compatibility)
5. [Mobile Testing](#mobile-testing)
6. [Performance Testing](#performance-testing)

---

## Manual Testing Checklist

### ✅ Backend API Testing

Use Thunder Client, Postman, or cURL for these tests:

#### Health Check
- [ ] GET `/api/health` returns 200
- [ ] Response contains `status: "healthy"`

#### Create Payment
- [ ] POST `/api/payments/create` with valid data returns 201
- [ ] Response contains transaction ID
- [ ] UPI string is generated correctly
- [ ] Status is "PENDING"
- [ ] Missing fields return 400 error
- [ ] Invalid amount (0 or negative) returns 400
- [ ] Invalid UPI ID (no @) returns 400

#### Get Payments
- [ ] GET `/api/payments` returns all transactions
- [ ] Response includes count field
- [ ] Transactions are ordered by created_at DESC

#### Get Single Payment
- [ ] GET `/api/payments/:id` with valid ID returns 200
- [ ] GET with invalid ID returns 404
- [ ] Response contains all transaction fields

#### Filter by Status
- [ ] GET `/api/payments/status/PENDING` returns only pending
- [ ] GET `/api/payments/status/SUCCESS` returns only successful
- [ ] GET `/api/payments/status/FAILED` returns only failed
- [ ] GET with invalid status returns 400

#### Statistics
- [ ] GET `/api/payments/stats/summary` returns correct counts
- [ ] `total_amount` includes only SUCCESS transactions
- [ ] `pending_amount` includes only PENDING transactions

#### Update Status
- [ ] POST `/api/payments/:id/update-status` with valid status works
- [ ] Invalid status returns 400
- [ ] Non-existent ID returns 404
- [ ] `updated_at` timestamp changes

#### Simulate Payment
- [ ] POST `/api/payments/:id/simulate-payment` updates status
- [ ] Only works on PENDING transactions
- [ ] Returns either SUCCESS or FAILED
- [ ] Simulation note is included

---

### ✅ Frontend UI Testing

#### Dashboard
- [ ] All 6 stat cards display correctly
- [ ] Stats show correct numbers (0 initially)
- [ ] Stats update after creating payments
- [ ] Stats auto-refresh every 10 seconds
- [ ] Hover effect works on stat cards

#### Payment Form
- [ ] All input fields render correctly
- [ ] UPI ID field has default value
- [ ] Form validation works:
  - [ ] Empty payer name shows error
  - [ ] Empty amount shows error
  - [ ] Amount ≤ 0 shows error
  - [ ] Amount > 100,000 shows error
  - [ ] Invalid UPI ID (no @) shows error
- [ ] "Generate QR Code" button is clickable
- [ ] Button shows loading state during submission
- [ ] Success toast appears after creation
- [ ] Form clears after successful submission
- [ ] QR code displays below form
- [ ] QR code is scannable (test with UPI app if possible)

#### Transaction List
- [ ] Header shows "Transactions" with count badge
- [ ] Auto-refresh toggle works (🔄 Live / Paused)
- [ ] Manual refresh button works
- [ ] CSV export button downloads file
- [ ] Empty state shows when no transactions
- [ ] Transactions display in cards
- [ ] Each card shows:
  - [ ] Payer name
  - [ ] Note
  - [ ] Amount
  - [ ] Status badge with color
  - [ ] Transaction ID (truncated)
  - [ ] Relative time
  - [ ] Test button (only on PENDING)
  - [ ] PDF download icon

#### Filters
- [ ] Status filter buttons (ALL/PENDING/SUCCESS/FAILED)
- [ ] Active filter has yellow background
- [ ] Search bar filters by name/note/ID
- [ ] Date filter dropdown works
- [ ] All filters work together
- [ ] Results counter updates correctly
- [ ] Empty state shows appropriate message for filters

#### Actions
- [ ] Test button simulates payment
- [ ] Status updates in real-time
- [ ] Toast notification appears on status change
- [ ] Copy ID button copies to clipboard
- [ ] PDF download generates receipt
- [ ] CSV export includes filtered data only

#### Notifications
- [ ] Success toasts are yellow/black
- [ ] Error toasts are red
- [ ] Loading toasts appear
- [ ] Toasts auto-dismiss after 3 seconds
- [ ] Multiple toasts stack correctly

#### Animations
- [ ] Transaction cards slide in
- [ ] Stat cards scale on hover
- [ ] QR code fades in
- [ ] Loading skeletons pulse
- [ ] Smooth transitions everywhere

---

## Feature Testing

### Complete Flow Test

**Scenario: Create and complete a payment**

1. **Setup**
   - [ ] Backend running on port 5000
   - [ ] Frontend running on port 5173
   - [ ] Browser open to localhost:5173

2. **Create Payment**
   - [ ] Fill form: Name="Test User", Amount=100, Note="Test"
   - [ ] Click "Generate QR Code"
   - [ ] Verify: Success toast appears
   - [ ] Verify: QR code displays
   - [ ] Verify: Transaction appears in list
   - [ ] Verify: Status is PENDING
   - [ ] Verify: Stats update (Total +1, Pending +1)

3. **Simulate Payment**
   - [ ] Click "Test" button on transaction
   - [ ] Verify: Status changes (SUCCESS or FAILED)
   - [ ] Verify: Toast notification appears
   - [ ] Verify: Stats update accordingly
   - [ ] Verify: Color changes in card

4. **Export Data**
   - [ ] Click PDF icon on transaction
   - [ ] Verify: PDF downloads
   - [ ] Verify: PDF contains all details
   - [ ] Click CSV button
   - [ ] Verify: CSV downloads
   - [ ] Verify: CSV contains transaction data

5. **Filter & Search**
   - [ ] Create multiple payments (5+)
   - [ ] Simulate some to different statuses
   - [ ] Filter by PENDING
   - [ ] Verify: Only PENDING shown
   - [ ] Search for specific name
   - [ ] Verify: Only matching results
   - [ ] Change date filter
   - [ ] Verify: Results update

---

## Edge Cases

### Input Validation

- [ ] **Empty form submission** → Shows validation errors
- [ ] **Very long name (100+ chars)** → Displays correctly, truncates in UI
- [ ] **Special characters in name** → Handled correctly
- [ ] **Decimal amounts (100.50)** → Accepted and displayed correctly
- [ ] **Very large amount (999999)** → Rejected (over limit)
- [ ] **Negative amount (-100)** → Rejected
- [ ] **Zero amount** → Rejected
- [ ] **HTML/script in note** → Sanitized/escaped

### Network Issues

- [ ] **Backend offline** → Shows network error toast
- [ ] **Slow network** → Loading states appear
- [ ] **Failed request** → Error handling works
- [ ] **Offline mode** → Shows "No internet" banner

### Data Issues

- [ ] **Empty transaction list** → Shows nice empty state
- [ ] **No filtered results** → Shows appropriate message
- [ ] **Corrupted QR data** → Handles gracefully
- [ ] **Invalid transaction ID** → Shows 404 error

### Concurrent Operations

- [ ] **Multiple simultaneous creations** → All succeed
- [ ] **Auto-refresh during manual refresh** → No conflicts
- [ ] **Status update during auto-refresh** → Updates correctly
- [ ] **Multiple status filters quickly** → Smooth transitions

---

## Browser Compatibility

Test in these browsers:

### Desktop Browsers
- [ ] **Chrome (latest)** - All features work
- [ ] **Firefox (latest)** - All features work
- [ ] **Safari (latest)** - All features work
- [ ] **Edge (latest)** - All features work

### Known Issues
- Document any browser-specific issues here

---

## Mobile Testing

### Responsive Design

**Test on these viewports:**

#### Mobile (375px)
- [ ] Header fits on screen
- [ ] Stats show 2 columns
- [ ] Form and transactions stack vertically
- [ ] All buttons are touch-friendly (44x44px min)
- [ ] Text is readable (min 14px)
- [ ] No horizontal scrolling
- [ ] Filter buttons scroll horizontally
- [ ] Modals/toasts display correctly

#### Tablet (768px)
- [ ] Stats show 3-4 columns
- [ ] Two-column layout for main content
- [ ] Comfortable touch targets
- [ ] Good use of space

#### Desktop (1920px)
- [ ] Content centered with max-width
- [ ] Proper spacing and padding
- [ ] Hover states work
- [ ] Multi-column layouts

### Mobile Browsers
- [ ] **Safari iOS** - Test on iPhone
- [ ] **Chrome Android** - Test on Android device
- [ ] **Chrome DevTools mobile emulation** - Quick test

### Touch Interactions
- [ ] Buttons respond to touch
- [ ] No accidental double-taps
- [ ] Swipe scrolling works
- [ ] Copy/paste works in inputs
- [ ] Virtual keyboard doesn't break layout

---

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Backend response < 500ms
- [ ] QR generation < 100ms
- [ ] Smooth 60fps animations

### Large Data Sets
- [ ] 100+ transactions display without lag
- [ ] Filters work quickly with many transactions
- [ ] Scroll performance is smooth
- [ ] Memory usage stays reasonable

### Auto-refresh
- [ ] No memory leaks after 1 hour
- [ ] CPU usage stays low
- [ ] Network requests are efficient

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter key submits form
- [ ] Escape closes modals/toasts
- [ ] No keyboard traps

### Screen Readers
- [ ] Form labels are present
- [ ] Status messages announced
- [ ] Button purposes clear

### Visual
- [ ] Sufficient color contrast
- [ ] Text is readable at 200% zoom
- [ ] Focus indicators visible

---

## Security Testing

### Input Security
- [ ] XSS attempts blocked
- [ ] SQL injection prevented
- [ ] CSRF protection (if implemented)

### API Security
- [ ] CORS configured correctly
- [ ] No sensitive data exposed
- [ ] Error messages don't leak info

---

## Regression Testing

After any code changes, re-test:

**Critical Path:**
1. Create payment → QR appears → Transaction in list
2. Simulate payment → Status updates → Toast appears
3. Export PDF → Downloads correctly
4. Export CSV → Contains correct data
5. Filters work → Results update

**Quick Smoke Test (5 minutes):**
- [ ] Page loads
- [ ] Create payment works
- [ ] Transaction appears
- [ ] Test button works
- [ ] No console errors

---

## Bug Report Template

When you find a bug, document it:
```markdown
**Bug Title:** Clear, concise description

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen

**Actual Result:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]

**Severity:**
Critical / High / Medium / Low
```

---

## Test Data

### Sample Valid Payments
```json
{
  "upi_id": "merchant@upi",
  "amount": 500,
  "payer_name": "Test User 1",
  "note": "Membership Fee"
}

{
  "upi_id": "college@paytm",
  "amount": 1000,
  "payer_name": "Test User 2",
  "note": "Event Registration"
}

{
  "upi_id": "club@upi",
  "amount": 250,
  "payer_name": "Test User 3",
  "note": "Annual Subscription"
}
```

### Sample Invalid Payments
```json
// Missing required fields
{
  "upi_id": "merchant@upi",
  "amount": 500
}

// Invalid amount
{
  "upi_id": "merchant@upi",
  "amount": -100,
  "payer_name": "Test"
}

// Invalid UPI ID
{
  "upi_id": "merchantupi",
  "amount": 500,
  "payer_name": "Test"
}
```

---

## Automated Testing (Future)

For future implementation:

**Backend Tests:**
- Unit tests for database operations
- Integration tests for API endpoints
- Test coverage > 80%

**Frontend Tests:**
- Component tests with React Testing Library
- E2E tests with Cypress/Playwright
- Visual regression tests

---

## Sign-Off Checklist

Before considering testing complete:

- [ ] All manual tests passed
- [ ] No critical bugs
- [ ] Tested on multiple browsers
- [ ] Tested on mobile
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] All features work as expected

---

**Testing completed by:** _______________  
**Date:** _______________  
**Notes:** _______________