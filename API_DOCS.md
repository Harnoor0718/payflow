# 📡 PayFlow API Documentation

Complete API reference for PayFlow backend services.

---

## Table of Contents
1. [Base URL](#base-url)
2. [Response Format](#response-format)
3. [Error Codes](#error-codes)
4. [Endpoints](#endpoints)
5. [Data Models](#data-models)
6. [Testing with cURL](#testing-with-curl)

---

## Base URL

**Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://your-domain.com/api
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Endpoints

### 1. Health Check

Check if API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:5000/api/health
```

---

### 2. Create Payment Request

Create a new payment request with UPI QR code.

**Endpoint:** `POST /payments/create`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "upi_id": "merchant@upi",
  "amount": 500,
  "payer_name": "John Doe",
  "note": "Membership Fee 2025"
}
```

**Field Validation:**
- `upi_id` (required): Valid UPI ID (must contain @)
- `amount` (required): Number > 0
- `payer_name` (required): String, min 1 character
- `note` (optional): String

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Payment request created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "upi_id": "merchant@upi",
    "amount": 500,
    "payer_name": "John Doe",
    "note": "Membership Fee 2025",
    "upi_string": "upi://pay?pa=merchant@upi&pn=John%20Doe&am=500&cu=INR&tn=Membership%20Fee%202025&tr=TXN1706349600000",
    "status": "PENDING",
    "created_at": "2025-01-27T10:30:00.000Z",
    "updated_at": "2025-01-27T10:30:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Missing required fields: upi_id, amount, payer_name"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "upi_id": "merchant@upi",
    "amount": 500,
    "payer_name": "John Doe",
    "note": "Membership Fee"
  }'
```

---

### 3. Get All Payments

Retrieve all payment transactions.

**Endpoint:** `GET /payments`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "uuid-1",
      "upi_id": "merchant@upi",
      "amount": 500,
      "payer_name": "John Doe",
      "note": "Membership Fee",
      "upi_string": "upi://pay?...",
      "status": "SUCCESS",
      "created_at": "2025-01-27T10:00:00.000Z",
      "updated_at": "2025-01-27T10:05:00.000Z"
    },
    // ... more transactions
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/payments
```

---

### 4. Get Single Payment

Retrieve a specific payment by ID.

**Endpoint:** `GET /payments/:id`

**URL Parameters:**
- `id` (required): Transaction UUID

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "upi_id": "merchant@upi",
    "amount": 500,
    "payer_name": "John Doe",
    "note": "Membership Fee",
    "status": "PENDING",
    "created_at": "2025-01-27T10:30:00.000Z",
    "updated_at": "2025-01-27T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Transaction not found"
}
```

**Example:**
```bash
curl http://localhost:5000/api/payments/a1b2c3d4-e5f6-7890-1234-567890abcdef
```

---

### 5. Filter Payments by Status

Get payments filtered by status.

**Endpoint:** `GET /payments/status/:status`

**URL Parameters:**
- `status` (required): One of `PENDING`, `SUCCESS`, `FAILED`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    // Array of transactions with specified status
  ]
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid status. Must be PENDING, SUCCESS, or FAILED"
}
```

**Example:**
```bash
curl http://localhost:5000/api/payments/status/PENDING
```

---

### 6. Get Payment Statistics

Get aggregated payment statistics.

**Endpoint:** `GET /payments/stats/summary`

**Success Response:** `200 OK`
```json
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

**Example:**
```bash
curl http://localhost:5000/api/payments/stats/summary
```

---

### 7. Update Payment Status

Update the status of a payment transaction.

**Endpoint:** `POST /payments/:id/update-status`

**URL Parameters:**
- `id` (required): Transaction UUID

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SUCCESS"
}
```

**Field Validation:**
- `status` (required): One of `PENDING`, `SUCCESS`, `FAILED`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "status": "SUCCESS",
    "updated_at": "2025-01-27T10:35:00.000Z",
    // ... other fields
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Transaction not found"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/payments/a1b2c3d4-e5f6-7890/update-status \
  -H "Content-Type: application/json" \
  -d '{"status": "SUCCESS"}'
```

---

### 8. Simulate Payment (Testing Only)

Simulate a payment verification for testing purposes.

**⚠️ This endpoint is for testing only and should be disabled in production.**

**Endpoint:** `POST /payments/:id/simulate-payment`

**URL Parameters:**
- `id` (required): Transaction UUID

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment SUCCESS",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "status": "SUCCESS",
    "updated_at": "2025-01-27T10:40:00.000Z"
  },
  "simulation": {
    "random_check": "passed",
    "note": "This is a simulated payment verification"
  }
}
```

**Logic:**
- 70% chance of SUCCESS
- 30% chance of FAILED
- Only works on PENDING transactions

**Example:**
```bash
curl -X POST http://localhost:5000/api/payments/a1b2c3d4-e5f6/simulate-payment
```

---

## Data Models

### Transaction Model
```typescript
{
  id: string;              // UUID v4
  upi_id: string;          // UPI ID (e.g., merchant@upi)
  amount: number;          // Amount in INR
  payer_name: string;      // Name of the payer
  note: string;            // Optional note/description
  upi_string: string;      // Generated UPI payment string
  status: string;          // PENDING | SUCCESS | FAILED
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### UPI String Format
```
upi://pay?pa={UPI_ID}&pn={PAYER_NAME}&am={AMOUNT}&cu=INR&tn={NOTE}&tr={TXN_ID}
```

**Parameters:**
- `pa` - Payee address (UPI ID)
- `pn` - Payee name (URL encoded)
- `am` - Amount
- `cu` - Currency (INR)
- `tn` - Transaction note (URL encoded)
- `tr` - Transaction reference ID

---

## Testing with cURL

### Complete Testing Flow
```bash
# 1. Create a payment
RESPONSE=$(curl -s -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "upi_id": "test@upi",
    "amount": 100,
    "payer_name": "Test User",
    "note": "Test Payment"
  }')

# Extract transaction ID
TXN_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo "Created transaction: $TXN_ID"

# 2. Get the transaction
curl http://localhost:5000/api/payments/$TXN_ID

# 3. Simulate payment
curl -X POST http://localhost:5000/api/payments/$TXN_ID/simulate-payment

# 4. Check updated status
curl http://localhost:5000/api/payments/$TXN_ID

# 5. Get all transactions
curl http://localhost:5000/api/payments

# 6. Get statistics
curl http://localhost:5000/api/payments/stats/summary
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Recommended: 100 requests per minute per IP
- Implement using `express-rate-limit`

---

## Security Considerations

**Current Implementation:**
- ✅ CORS enabled
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ❌ No authentication (add for production)
- ❌ No API keys (add for production)
- ❌ No HTTPS (required for production)

**Production Recommendations:**
1. Add authentication (JWT tokens)
2. Implement API keys
3. Use HTTPS only
4. Add rate limiting
5. Validate all inputs server-side
6. Disable simulate-payment endpoint

---

## Integration Examples

### JavaScript/React
```javascript
const createPayment = async (paymentData) => {
  const response = await fetch('http://localhost:5000/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};
```

### Python
```python
import requests

def create_payment(payment_data):
    response = requests.post(
        'http://localhost:5000/api/payments/create',
        json=payment_data
    )
    return response.json()
```

---

**Last Updated:** January 2025  
**API Version:** 1.0  
**Maintained By:** PayFlow Development Team