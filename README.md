# Personal Finance Assistant

The Personal Finance Assistant is a full-stack application designed to help users track, manage, and understand their financial activities. Users can log income and expenses, categorize transactions, and view summaries of their spending habits.

## Features
- Ability to create an income/expenses entry through the web app.
- List all income/expenses in a time range through the web app.
- Show graphs (e.g., expenses by category, expenses by date, etc.).
- Extract expenses from an uploaded receipt (images, PDFs). These are POS receipts.
- User authentication (register/login)
- Upload PDF bank statements
- Automatic transaction extraction and parsing
- Dashboard with charts and analytics
- Transaction table with pagination
- Support upload of transaction history from PDF (tabular format).
- Pagination support for the list API.
- Support for multiple users who can use the web app.

---

## Directory Structure
```
/ (project root)
  |-- frontend/   # React app (port 3000)
  |-- backend/    # Node.js/Express API (port 5000)
```

---

## Screenshots

**1. Login Page**  
![Login Page](Login.png)

**2. Register Page**  
![Register Page](Register.png)

**3. Dashboard Page**  
![Dashboard Page](Dashboard.png)

**4. Transactions Table**  
![Transactions Table](Transactionstable.png)

**5. Upload Section**  
![Upload Section](UploadSection.png)

**6. Graph Page**  
![Graph Visuals](Graph.png)


---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Environment variables:**
   - Copy or edit `.env` in `backend/`:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
3. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000)

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend app:**
   ```bash
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## Usage Flow
1. Register or log in.
2. Upload a PDF bank statement or receipt.
3. View parsed transactions in a table.
4. Explore analytics and charts on the dashboard.

---

## Tech Stack
- **Frontend:** React, Material-UI, Nivo Charts, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, pdf-parse, tesseract.js, JWT

---

## License
[MIT](LICENSE) 
