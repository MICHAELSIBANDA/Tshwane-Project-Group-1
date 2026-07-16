# Tshwane Bus Service (TBS) Backend

This backend powers the Tshwane Bus Service (TBS) application. It manages user authentication, bus card balances, payment processing through Paystack, and communication with the Aiven MySQL database.

---

# Prerequisites

Before running the project, ensure you have the following:

- Node.js installed
- The `ca.pem` certificate file provided by the backend lead
- Access to the project's environment variables

Place the `ca.pem` file inside the root of the backend project directory before starting the application.

---

# Project Setup

## 1. Navigate to the backend folder

```bash
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create the environment file

Create a file named `.env` in the backend directory.

Add the following variables and replace the empty values with the credentials provided by the backend lead.

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

AIVEN_CA_PATH=ca.pem

PAYSTACK_SECRET_KEY=
```

---

# Running the Server

Start the application with:

```bash
node index.js
```

The backend server will start on:

```
http://localhost:5000
```

---

# API Endpoints

## Authentication

### Register User

**POST** `/api/register`

Registers a new user and stores their personal details and address in the database.

---

### Login

**POST** `/api/login`

Authenticates a user using either:

- ID Number
- Bus Card Number

---

## Card Management

### Get Card Balance

**GET** `/api/balance/:cardNumber`

Returns the current balance of the specified bus card.

---

## Payments

### Initialize Payment

**POST** `/api/pay`

Initializes a Paystack payment transaction.

Required request fields:

- `email`
- `amount`
- `cardNumber`

---

### Verify Payment

**GET** `/api/verify/:ref`

Verifies the Paystack transaction and updates the user's bus card balance in the database.

---

## User Settings

### Change Password

**POST** `/api/change-password`

Allows a user to change their password after successfully verifying their current password.

---

# Database

The project uses **Aiven MySQL** as the cloud-hosted database.

The connection is secured using SSL.

The application requires the `ca.pem` certificate to establish a secure connection to the database.

Do not remove or rename the `ca.pem` file unless it is being replaced with an updated certificate.

---

# Payment Protection

To prevent duplicate transactions, every Paystack payment is validated using its unique transaction reference.

A payment reference can only be processed once, ensuring that funds are not credited multiple times for the same transaction.

---

# Technologies Used

- Node.js
- Express.js
- MySQL (Aiven)
- Paystack Payment Gateway
- dotenv
- SSL (ca.pem)

---

# Project Structure

```
backend/
│
├── index.js
├── package.json
├── .env
├── ca.pem
├── routes/
├── controllers/
├── models/
└── ...
```

---

# Notes

- Keep your `.env` file private and never commit it to GitHub.
- Do not share your Paystack Secret Key.
- Ensure the `ca.pem` certificate is present before starting the server.
- Install all dependencies with `npm install` before running the project.
