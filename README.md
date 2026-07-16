TBS Backend Documentation

This backend handles the logic for the Tshwane Bus Service project, including Aiven MySQL database management and Paystack payment integration.
Prerequisites
Node.js installed.
The ca.pem file must be placed inside the backend folder for SSL connection.
Setup Instructions
Navigate to the folder
Open your terminal and enter:
cd backend
Install libraries
Run the following command to install the required tools:
npm install
Create .env file
Create a file named .env in the backend folder. Paste the following keys and fill in the values provided by the backend lead:
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
AIVEN_CA_PATH=ca.pem
PAYSTACK_SECRET_KEY=
Start the server
node index.js
The backend will run on: http://localhost:5000
Available API Endpoints
Authentication
POST /api/register
Sends user details and address to the database.
POST /api/login
Accepts either ID Number or Bus Card Number as the identifier.
Card Management
GET /api/balance/:cardNumber
Fetches the current balance for a specific card.
Payments
POST /api/pay
Initializes a Paystack transaction. Requires email, amount, and cardNumber.
GET /api/verify/:ref
Verifies the payment with Paystack and updates the balance in MySQL.
User Settings
POST /api/change-password
Updates the user password after verifying the current password.
Database Notes
Cloud Hosting: We are using Aiven MySQL.
Security: SSL is enabled. Ensure your ca.pem file is not deleted.
Double Payments: The system uses a reference check to ensure money is only added once per transaction.
