# CoWorkSpace Project Setup Guide

Welcome to the **CoWorkSpace** project! This is a comprehensive, full-stack application designed to manage workspace listings, user bookings, and administrative dashboards.

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB Atlas**: A free tier account for the database

---

### 2. Backend Setup (`/server`)

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` root and add your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *Note: Ensure your IP address is whitelisted in your MongoDB Atlas Network Access settings.*

4. **Run the Server**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

---

### 3. Frontend Setup (`/client`)

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the `client` root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

### 4. Database Configuration (Critical)

To ensure the backend can communicate with your database:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.net/).
2. Go to **Network Access** > **Add IP Address**.
3. Choose **"Add Current IP Address"** or **"Allow Access From Anywhere"** (for development).
4. Wait for the status to become "Active".

---

## 🛠 Features Implemented
- **Authentication**: Secure JWT-based registration and login system.
- **Role-Based Access**: Specialized dashboards for **Users** (bookers) and **Owners** (space managers).
- **Workspace Discovery**: Dynamic search functionality with real-time filtering.
- **Booking Engine**: Automated price calculation, duration management, and history tracking.
- **Responsive Design**: Premium UI built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

---

## 📂 Project Structure
- `/client`: Next.js frontend with App Router and Lucide Icons.
- `/server`: Node.js/Express API with Mongoose and Role-based middleware.

---

## 💡 Troubleshooting
- **Buffer Timeout Error**: Usually means the backend cannot connect to MongoDB. Check your `.env` string and Atlas IP Whitelist.
- **CORS Errors**: Ensure the backend's `cors()` middleware is active and pointing to your frontend URL.
