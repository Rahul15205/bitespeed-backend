# Bitespeed Backend Task: Identity Reconciliation

## Overview
This project manages **identity reconciliation** by linking user records based on shared emails and phone numbers. It ensures a **unified source of truth** for user identities by consolidating multiple records into a single contact.

## Tech Stack
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (Hosted on Render)
- **ORM:** Sequelize
- **Hosting:** Render

## API Endpoints
### 1. Identify and Link User Records
**POST** `/identify`  
Determines and associates user records using shared emails and phone numbers.

#### Request Body (JSON):
```json
{
  "email": "user@example.com",
  "phoneNumber": "+1234567890"
}
```

#### Response (JSON):
```json
{
  "primaryContactId": 1,
  "emails": ["user@example.com"],
  "phoneNumbers": ["+1234567890"],
  "secondaryContactIds": []
}
```

### 2. Retrieve Linked User Details
**GET** `/contacts/:id`  
Fetches all associated details for a given contact ID.

#### Response (JSON):
```json
{
  "primaryContactId": 1,
  "emails": ["user@example.com", "alternate@example.com"],
  "phoneNumbers": ["+1234567890", "+9876543210"],
  "secondaryContactIds": [2, 3]
}
```

## Setup Guide
### 1. Clone & Install Dependencies
```sh
git clone https://github.com/your-repo.git
cd your-repo
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and define the following variables:
```sh
DATABASE_URL=your_render_postgresql_url
PORT=3000
```

### 3. Run Migrations & Launch Server
```sh
npx sequelize-cli db:migrate
npm start
```

## Deployment
The application is hosted on **Render** (Backend & Database). Ensure migrations execute on startup.



