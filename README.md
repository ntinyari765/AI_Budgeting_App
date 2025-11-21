# AI Budgeting App

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%26%20Render-success)

A full-stack AI-powered budgeting application that helps users manage personal finances, track expenses, set budgets, and receive intelligent financial insights. Built with modern technologies and deployed on industry-leading platforms.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [AI Features](#-ai-features)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Credits](#-credits)

---

## 🎯 Overview

The **AI Budgeting App** is a comprehensive financial management platform designed to empower users with tools and insights for better money management. Users can track transactions, set budgets across multiple categories, visualize spending patterns through dynamic charts, and leverage AI-driven recommendations to optimize their finances.

**Live Demo:**
- Frontend: Deployed on [Vercel](https://ai-budgeting-app-gilt.vercel.app/)
- Backend: Deployed on [Render](https://ai-budgeting-app-1.onrender.com)

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure JWT-based authentication with bcrypt password hashing |
| **Transaction Management** | Add, edit, and delete transactions with ease |
| **Category Tracking** | Organize expenses into predefined categories: Food, Travel, Bills, Entertainment, Shopping, and more |
| **Budget Setting** | Set monthly budgets per category and monitor progress in real-time |
| **Dashboard Analytics** | Interactive charts and visualizations of spending patterns |
| **AI-Powered Insights** | Receive personalized savings suggestions and financial recommendations |
| **Responsive Design** | Seamless experience across desktop, tablet, and mobile devices |
| **Elegant UI** | Light pink-themed interface with modern, intuitive design |
| **Production Deployment** | Fully deployed and accessible online |

---

## 🛠️ Tech Stack

### Frontend
- **React** — UI library for building interactive components
- **Vite** — Fast build tool and development server
- **Axios** — HTTP client for API communication
- **Context API** — State management
- **Chart.js** — Data visualization and charting
- **CSS3** — Modern styling with responsive design

### Backend
- **Node.js** — JavaScript runtime environment
- **Express.js** — Web framework for APIs
- **MongoDB** — NoSQL database for flexible data storage
- **Mongoose** — ODM for MongoDB schema validation
- **JWT (jsonwebtoken)** — Secure token-based authentication
- **bcryptjs** — Password hashing and encryption

### Deployment
- **Vercel** — Frontend hosting and deployment
- **Render** — Backend API hosting and deployment
- **MongoDB Atlas** — Cloud-hosted MongoDB database

---

## 📥 Installation

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A **MongoDB Atlas** account

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ai-budgeting-app.git
cd ai-budgeting-app
```

### Step 2: Setup Backend

```bash
cd server
npm install
```

### Step 3: Setup Frontend

```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables

#### Backend `.env` File

Create a `.env` file in the `/server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-budgeting-app?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

#### Frontend `.env` File

Create a `.env.local` file in the `/client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# For Production
# VITE_API_URL=https://ai-budgeting-app-backend.onrender.com/api
```

### Step 5: Connect MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user and get the connection string
4. Replace `<username>` and `<password>` in your `.env` `MONGO_URI`
5. Whitelist your IP address in the Network Access settings

### Step 6: Run the Application

#### Development Mode

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`

#### Production Build

```bash
# Frontend
cd client
npm run build

# Backend production start
cd ../server
npm start
```

---

## 📁 Project Structure

```
ai-budgeting-app/
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── BudgetTracker.jsx
│   │   │   ├── Chart.jsx
│   │   │   └── ...
│   │   ├── context/                # Context API state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                  # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.local                  # Environment variables (local)
│   ├── vite.config.js              # Vite configuration
│   └── package.json
│
├── server/                          # Backend (Node.js + Express)
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/                     # API endpoints
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── budgetRoutes.js
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── budgetController.js
│   ├── middleware/                 # Custom middleware
│   │   └── authMiddleware.js
│   ├── .env                        # Environment variables
│   ├── server.js                   # Entry point
│   └── package.json
│
└── README.md                       # Project documentation
```

---

## ⚙️ Configuration

### CORS Setup (Backend)

Ensure your backend `server.js` includes proper CORS configuration:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

### Update API Base URL for Production

When deploying, update the frontend `.env` file with your Render backend URL:

```env
VITE_API_URL=https://your-app-backend.onrender.com/api
```

---

## 📊 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend.onrender.com/api`

### Authentication Endpoints

#### Register User
```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### Login User
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Transaction Endpoints

#### Get All Transactions
```
GET /transactions
Headers: Authorization: Bearer jwt_token_here

Response (200):
{
  "success": true,
  "transactions": [
    {
      "_id": "transaction_id",
      "description": "Grocery shopping",
      "amount": 50.00,
      "category": "Food",
      "date": "2025-01-15T10:30:00Z",
      "userId": "user_id"
    }
  ]
}
```

#### Create Transaction
```
POST /transactions
Headers: Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "description": "Gas refill",
  "amount": 45.00,
  "category": "Travel",
  "date": "2025-01-15"
}

Response (201):
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": { ... }
}
```

#### Update Transaction
```
PUT /transactions/:id
Headers: Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "description": "Gas refill",
  "amount": 50.00,
  "category": "Travel"
}

Response (200):
{
  "success": true,
  "message": "Transaction updated successfully"
}
```

#### Delete Transaction
```
DELETE /transactions/:id
Headers: Authorization: Bearer jwt_token_here

Response (200):
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

### Budget Endpoints

#### Set Monthly Budget
```
POST /budgets
Headers: Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "category": "Food",
  "amount": 500.00,
  "month": "January",
  "year": 2025
}

Response (201):
{
  "success": true,
  "message": "Budget set successfully"
}
```

#### Get Budget Progress
```
GET /budgets/:category
Headers: Authorization: Bearer jwt_token_here

Response (200):
{
  "success": true,
  "category": "Food",
  "budgetAmount": 500.00,
  "spentAmount": 320.50,
  "remaining": 179.50,
  "percentageUsed": 64
}
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
4. Deploy with one click — Vercel auto-deploys on every push

### Backend Deployment (Render)

1. Push your backend code to GitHub
2. Sign up on [Render](https://render.com)
3. Create a new **Web Service**
4. Connect your GitHub repository
5. Configure build and start commands:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables in Render dashboard:
   ```
   PORT=5000
   MONGO_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<your_secret>
   CLIENT_URL=<your_vercel_frontend_url>
   NODE_ENV=production
   ```
7. Deploy and monitor logs

### Important Notes

- Update the frontend `.env` file with your Render backend URL after deployment
- Ensure MongoDB Atlas network access allows Render's IP addresses
- Use strong JWT secrets in production (avoid default values)

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard Screenshot](client\src\assets\dashboard.png)

### Transaction Management
![Transactions Screenshot](client\src\assets\transactions.png)

### Budget Tracking
![Budget Tracking Screenshot](AI_Budgeting_App\client\src\assets\tracking.png)

---

## 🤖 AI Features

The AI Budgeting App leverages machine learning algorithms to provide intelligent financial recommendations:

### Smart Savings Suggestions
The AI analyzes your spending patterns over time and identifies areas where you can cut costs without compromising lifestyle. It compares your spending habits against category averages and suggests realistic savings targets.

### Spending Pattern Analysis
The system automatically categorizes transactions and detects trends, such as increased spending during certain months or recurring patterns in specific categories. Users receive alerts when spending exceeds normal patterns.

### Personalized Budget Recommendations
Based on your historical spending data and income information, the AI generates customized budget recommendations for each category, helping you create realistic and achievable financial goals.

### Anomaly Detection
The app flags unusual transactions or spending spikes, helping you identify fraudulent activities or unexpected expenses quickly.

---

## 🧠 Future Enhancements

We're continuously improving the app. Planned features include:

- **Google OAuth Integration** — One-click login with Google account
- **Data Export** — Download financial reports as CSV or PDF files
- **AI Budget Coach** — Interactive chatbot for personalized financial advice
- **Recurring Payments** — Automatic tracking of subscription and recurring expenses
- **Multi-Currency Support** — Manage finances in different currencies
- **Investment Tracking** — Monitor investment portfolios alongside expenses
- **Bill Reminders** — Notifications for upcoming bill due dates
- **Collaboration Features** — Share budgets and expense tracking with family members

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Credits

**Developed by:** Winjoy Ntinyari

**Special Thanks To:**
- The React and Node.js communities
- MongoDB Atlas for reliable database hosting
- Vercel and Render for seamless deployment solutions
- Chart.js for beautiful data visualizations

For questions, feedback, or contributions, please feel free to open an issue or pull request on [GitHub](https://github.com/yourusername/ai-budgeting-app).

---

**Happy Budgeting! 💰**