# 🏢 CoWorkSpace - Workspace Booking Platform

A modern, full-stack coworking space booking platform built with Next.js, Express, and MongoDB. Features include workspace search, AI-powered recommendations, secure payments, and email notifications.

![CoWorkSpace](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-5.2.1-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Razorpay](https://img.shields.io/badge/Payment-Razorpay-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### 🏠 User Features
- 🔍 **Smart Search** - Find workspaces by location, amenities, and price
- 🤖 **AI Recommendations** - Get personalized workspace suggestions
- 📅 **Easy Booking** - Book workspaces with flexible time slots
- 💳 **Secure Payments** - Integrated Razorpay payment gateway
- 📧 **Email Notifications** - Automatic booking confirmations
- ❤️ **Wishlist** - Save your favorite workspaces
- 📱 **QR Codes** - Digital entry tickets for bookings
- 👤 **Profile Management** - Upload profile pictures and KYC documents
- 🌓 **Dark Mode** - Beautiful light and dark themes

### 🏢 Owner Features
- ➕ **List Spaces** - Add your workspaces with images and details
- 📊 **Dashboard** - Manage bookings and view analytics
- 💰 **Revenue Tracking** - Monitor earnings and payments
- ✅ **Booking Management** - Approve/reject booking requests

### 👑 Admin Features
- 👥 **User Management** - Manage customers and owners
- 🏢 **Workspace Management** - Moderate listings
- 🔐 **KYC Verification** - Approve identity documents
- 📊 **Analytics** - Platform-wide statistics and insights

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **File Upload**: Cloudinary (via Multer)
- **Payments**: Razorpay
- **Email**: Nodemailer (Gmail SMTP)

### DevOps
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Development**: Nodemon (hot reload)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Razorpay Account** - [Sign up](https://razorpay.com/)
- **Gmail Account** (for SMTP)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sajidbaba1/CoWorkSpace.git
cd CoWorkSpace
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
cd ..
```

### 4. Configure Environment Variables

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in your credentials:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMTP Email Configuration
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_NAME=CoWorkSpace Event
SMTP_FROM_EMAIL=your_email@gmail.com

# Render Deployment (Optional)
RENDER_API_KEY=your_render_api_key
```

#### Client Environment Variables

Create a `.env.local` file in the `client` directory:

```bash
cd ../client
touch .env.local
```

Add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables Setup Guide

### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret

### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate **Test Keys** for development
4. Copy: Key ID and Key Secret

### Gmail SMTP (App Password)
1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Click "2-Step Verification"
4. Scroll to "App passwords"
5. Generate password for "Mail" → "Other (Custom name)"
6. Copy the 16-character password (no spaces)

### JWT Secret
Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

📖 **For detailed setup instructions**, see [`server/ENV_SETUP.md`](server/ENV_SETUP.md)

---

## ▶️ Running the Application

### Development Mode

#### Option 1: Run Both Services Concurrently (Recommended)

From the root directory, you can run both services:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

#### Option 2: Individual Services

**Backend Only:**
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

**Frontend Only:**
```bash
cd client
npm run dev
```
Client will run on `http://localhost:3000`

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
npm start
```

**Run Backend:**
```bash
cd server
npm start
```

---

## 📁 Project Structure

```
CoWorkSpace/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── page.tsx   # Landing page
│   │   │   ├── login/     # Authentication pages
│   │   │   ├── register/
│   │   │   ├── search/    # Workspace search
│   │   │   ├── dashboard/ # User/Owner/Admin dashboards
│   │   │   ├── workspace/ # Workspace details
│   │   │   └── payment/   # Payment pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── lib/          # Utilities (API client)
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   ├── .env.local        # Client environment variables
│   └── package.json
│
├── server/               # Express Backend
│   ├── config/          # Configuration files
│   │   └── cloudinary.js
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   └── upload.js    # File upload (Multer + Cloudinary)
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Workspace.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   └── Review.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── workspaceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/           # Utility functions
│   │   └── emailService.js
│   ├── scripts/         # Helper scripts
│   │   └── seedAdmin.js
│   ├── .env             # Server environment variables
│   ├── .env.example     # Environment template
│   ├── ENV_SETUP.md     # Detailed env setup guide
│   ├── index.js         # Server entry point
│   └── package.json
│
├── .gitignore           # Git ignore rules
├── deploy_render.js     # Render deployment script
├── README.md           # This file
└── package.json        # Root package.json
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |

### Workspace Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/workspaces` | Get all workspaces | No |
| GET | `/workspaces/:id` | Get workspace by ID | No |
| POST | `/workspaces` | Create workspace | Owner/Admin |
| PUT | `/workspaces/:id` | Update workspace | Owner/Admin |
| DELETE | `/workspaces/:id` | Delete workspace | Owner/Admin |
| POST | `/workspaces/:id/reviews` | Add review | Customer |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/bookings/my` | Get user's bookings | Yes |
| POST | `/bookings` | Create booking | Customer |
| PATCH | `/bookings/:id/status` | Update booking status | Owner/Admin |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/payments` | Get user's payments | Yes |
| POST | `/payments/create-order` | Create Razorpay order | Yes |
| POST | `/payments/verify` | Verify payment | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user | Yes |
| POST | `/users/upload-profile` | Upload profile picture | Yes |
| POST | `/users/upload-kyc` | Upload KYC document | Yes |
| PUT | `/users/change-password` | Change password | Yes |
| GET | `/users/wishlist` | Get wishlist | Yes |
| POST | `/users/wishlist/:id` | Add to wishlist | Yes |
| DELETE | `/users/wishlist/:id` | Remove from wishlist | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | Admin |
| PUT | `/admin/users/:id/kyc` | Update KYC status | Admin |
| GET | `/admin/analytics` | Get platform analytics | Admin |

---

## 🚢 Deployment

### Deploy to Render (Backend)

1. Push your code to GitHub
2. Create account on [Render](https://render.com/)
3. Create new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
6. Add environment variables from `.env`
7. Deploy!

### Deploy to Vercel (Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from client directory:
   ```bash
   cd client
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = your backend URL

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 3000 (Frontend)
npx kill-port 3000
```

#### MongoDB Connection Error
- Check your MongoDB URI in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify database credentials

#### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check SMTP credentials in `.env`
- Ensure 2FA is enabled on Google Account

#### Payment Failing
- Use Razorpay **test keys** in development
- Check Razorpay dashboard for webhooks
- Verify key format: `rzp_test_...` for test mode

#### Profile Picture Upload Failing
- Check Cloudinary credentials
- Verify file size limit (5MB max)
- Ensure allowed formats: jpg, png, jpeg, pdf

---

## 🔒 Security Best Practices

- ✅ Never commit `.env` files to Git
- ✅ Use different credentials for development and production
- ✅ Use Razorpay test keys in development
- ✅ Rotate secrets periodically
- ✅ Use strong, random JWT secrets (32+ characters)
- ✅ Keep dependencies updated: `npm audit`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sajid Shaikh**
- Email: ss2727303@gmail.com
- GitHub: [@sajidbaba1](https://github.com/sajidbaba1)

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Built with ❤️ using Next.js and Express

---

## 📞 Support

If you need help or have questions:
- 📧 Email: support@coworkspace.com
- 📖 Read the [Environment Setup Guide](server/ENV_SETUP.md)
- 🐛 [Report Issues](https://github.com/sajidbaba1/CoWorkSpace/issues)

---

**⭐ If you found this project helpful, please consider giving it a star!**