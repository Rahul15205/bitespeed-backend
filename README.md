Bitespeed Backend Task: Identity Reconciliation

Overview

This project implements an Identity Reconciliation system, which consolidates user identities based on shared phone numbers and emails. The system processes incoming user records, linking them to existing identities or creating new ones when necessary.

Features

Identify and link users based on phone numbers and emails.

Merge user records to maintain a single source of truth.

Efficient querying for retrieving linked identities.


Tech Stack

Backend: Node.js with Express

Database: PostgreSQL / MongoDB (choose based on preference)

ORM: Sequelize / Mongoose

Authentication: Not required for this task

API Format: REST


API Endpoints

1. Reconcile Identity

Endpoint: POST /identify
Request Body:

{
  "email": "john@example.com",
  "phoneNumber": "+1234567890"
}

Response:

{
  "primaryContactId": 1,
  "emails": ["john@example.com"],
  "phoneNumbers": ["+1234567890"],
  "secondaryContactIds": [2, 3]
}

2. Fetch Identity Details (Optional)

Endpoint: GET /contacts/:id
Returns the merged identity for a given contact ID.

Database Schema

Contacts Table (SQL) / Collection (NoSQL)

id: Unique identifier

email: Email address

phone_number: Phone number

linked_id: ID of the primary contact (if it's a secondary contact)

link_precedence: "primary" or "secondary"

created_at: Timestamp

updated_at: Timestamp


Identity Reconciliation Logic

1. Check if the provided email or phone number exists in the database.


2. If both are new, create a new primary contact.


3. If either exists, link the new record to the existing primary contact.


4. If multiple primary contacts exist, merge them, keeping the older one as primary.


5. Return the consolidated identity details.



Setup Instructions

1. Clone the repository:

git clone https://github.com/your-repo.git
cd your-repo


2. Install dependencies:

npm install


3. Setup environment variables (.env)

DATABASE_URL=your_database_url
PORT=3000


4. Run database migrations (for SQL-based setup):

npx sequelize-cli db:migrate


5. Start the server:

npm start



Testing

Use Postman or cURL to test the API.

Run unit tests:

npm test