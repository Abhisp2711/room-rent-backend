```API Endpoints
1. Auth APIs
Register (Send OTP)

URL: POST /api/auth/register

Body (JSON):

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "message": "OTP sent to email"
}

Verify OTP

URL: POST /api/auth/verify-otp

Body (JSON):

{
  "email": "john@example.com",
  "otp": "123456"
}


Response:

{
  "message": "Registration completed",
  "user": {
    "_id": "64f1a8a8e1f1...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Login

URL: POST /api/auth/login

Body (JSON):

{
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "token": "jwt_token_here",
  "user": {
    "_id": "64f1a8a8e1f1...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

2. Room APIs
Create Room (Admin)

URL: POST /api/rooms/create

Headers: Authorization: Bearer <token>

Body: form-data

roomNumber: "101"

monthlyRent: 5000

photos: upload images

Response:

{
  "message": "Room added successfully",
  "room": {
    "_id": "64f1b9a8e2f1...",
    "roomNumber": "101",
    "monthlyRent": 5000,
    "isAvailable": true,
    "photos": [
      { "url": "cloudinary_url", "public_id": "room_photos/abc123" }
    ]
  }
}

Get All Rooms (Public)

URL: GET /api/rooms

Response:

[
  {
    "id": "64f1b9a8e2f1...",
    "roomNumber": "101",
    "monthlyRent": 5000,
    "isAvailable": true,
    "status": "Available",
    "tenant": null
  }
]

Assign Tenant (Admin)

URL: POST /api/rooms/assign/:roomId

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "userId": "64f1a8a8e1f1...",
  "name": "John Doe",
  "email": "john@example.com",
  "startDate": "2025-11-01"
}


Response:

{
  "message": "Tenant assigned successfully",
  "room": {
    "roomNumber": "101",
    "isAvailable": false,
    "tenant": { "name": "John Doe", "email": "john@example.com" }
  }
}

Delete Room (Admin)

URL: DELETE /api/rooms/delete/:roomId

Headers: Authorization: Bearer <token>

Response:

{
  "message": "Room and its images deleted successfully"
}

1. Create Razorpay Order (Online Payment)

URL: POST /api/payments/create-order

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "amount": 5000,
  "roomId": "ROOM_ID",
  "month": "November 2025"
}


Response Example:

{
  "id": "order_RjcA8rgve0kBWs",
  "amount": 500000,
  "currency": "INR",
  "receipt": "rent_ROOMID_November2025",
  "status": "created"
}

2. Verify Payment (Online)

URL: POST /api/payments/verify

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "razorpay_order_id": "order_id_from_previous_step",
  "razorpay_payment_id": "payment_id_from_frontend",
  "razorpay_signature": "signature_from_frontend",
  "roomId": "ROOM_ID",
  "amount": 5000,
  "month": "November 2025"
}


Response Example:

{
  "message": "Payment Saved",
  "payment": {
    "roomId": "ROOM_ID",
    "amount": 5000,
    "month": "November 2025",
    "paymentMethod": "razorpay",
    "razorpayPaymentId": "payment_id_from_frontend"
  }
}

3. Record Cash Payment (Admin Only)

URL: POST /api/payments/cash

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "roomId": "ROOM_ID",
  "amount": 5000,
  "month": "November 2025"
}


Response Example:

{
  "message": "Cash payment recorded",
  "payment": {
    "roomId": "ROOM_ID",
    "amount": 5000,
    "month": "November 2025",
    "paymentMethod": "cash",
    "paidOn": "2025-11-24T15:10:20.123Z"
  }
}

4. Get All Payments (Admin Only)

URL: GET /api/payments/

Headers: Authorization: Bearer <token>

Response Example:

[
  {
    "roomId": "ROOM_ID",
    "tenantName": "Tenant Name",
    "month": "November 2025",
    "amount": 5000,
    "paymentMethod": "razorpay",
    "paidOn": "2025-11-24T15:10:20.123Z"
  },
  {
    "roomId": "ROOM_ID2",
    "tenantName": "Tenant Name 2",
    "month": "November 2025",
    "amount": 5000,
    "paymentMethod": "cash",
    "paidOn": "2025-11-24T15:12:40.456Z"
  }
]

```
