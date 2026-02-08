# Environment Variables Configuration Guide

This document explains all environment variables used in the CoWorkSpace application.

## Server Configuration (Backend)

### Quick Setup
1. Copy `.env.example` to `.env` in the `server` directory
2. Replace placeholder values with your actual credentials
3. Never commit `.env` file to version control

---

## Required Environment Variables

### 🌐 Server Settings
```env
PORT=5000
```
- **Description**: Port number for the Express server
- **Default**: 5000
- **Required**: Yes

---

### 🗄️ Database Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp
```
- **Description**: MongoDB Atlas connection string
- **Required**: Yes
- **How to get**:
  1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a cluster
  3. Get connection string from "Connect" button
  4. Replace `<username>` and `<password>` with your credentials

---

### 🔐 JWT Authentication
```env
JWT_SECRET=your_super_secret_random_string_here
```
- **Description**: Secret key for signing JWT tokens
- **Required**: Yes
- **Recommendation**: Use a long, random string (min 32 characters)
- **Generate**: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

### ☁️ Cloudinary (File Uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- **Description**: Cloudinary credentials for image/file uploads
- **Required**: Yes (for profile pictures, KYC documents, workspace images)
- **How to get**:
  1. Sign up at [Cloudinary](https://cloudinary.com/)
  2. Go to Dashboard
  3. Copy Cloud Name, API Key, and API Secret

---

### 💳 Razorpay (Payment Gateway)
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
- **Description**: Razorpay payment gateway credentials
- **Required**: Yes (for payment processing)
- **How to get**:
  1. Sign up at [Razorpay](https://razorpay.com/)
  2. Go to Settings → API Keys
  3. Generate Test/Live keys
  4. Use test keys for development (`rzp_test_*`)

---

### 📧 SMTP Email Configuration
```env
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_NAME=CoWorkSpace Event
SMTP_FROM_EMAIL=your_email@gmail.com
```
- **Description**: Email service configuration for sending notifications
- **Required**: Yes (for booking confirmations)
- **Supported Services**: gmail, outlook, yahoo, etc.

#### How to Setup Gmail SMTP:
1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Scroll to "App passwords"
   - Generate password for "Mail" → "Other (Custom name)"
   - Use the 16-character password as `SMTP_PASSWORD`

#### Email Variables:
- `SMTP_SERVICE`: Email provider (default: gmail)
- `SMTP_EMAIL`: Your email address
- `SMTP_PASSWORD`: App password (NOT your regular password!)
- `SMTP_FROM_NAME`: Display name in "From" field
- `SMTP_FROM_EMAIL`: Email address in "From" field

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Keep `.env` file in `.gitignore`
- ✅ Use different credentials for development and production
- ✅ Use strong, random JWT secrets
- ✅ Use Razorpay test keys in development
- ✅ Rotate credentials periodically
- ✅ Use App Passwords for Gmail (not regular password)

### ❌ DON'T:
- ❌ Commit `.env` file to Git
- ❌ Share credentials in public repositories
- ❌ Use production keys in development
- ❌ Use weak or predictable secrets
- ❌ Hardcode credentials in source code

---

## 📝 Example Configuration

See `.env.example` for a complete template with all required variables.

---

## 🐛 Troubleshooting

### Email not sending?
- Check SMTP credentials are correct
- Verify Gmail App Password (16 characters, no spaces)
- Check "Less secure app access" is NOT enabled (use App Password instead)
- Check email logs in server console

### Payment not working?
- Verify Razorpay keys are correct
- Use test keys for development
- Check Razorpay dashboard for webhooks

### File upload failing?
- Verify Cloudinary credentials
- Check file size limits (5MB default)
- Verify allowed formats in `upload.js`

---

## 🚀 Deployment Notes

When deploying to production:
1. Create new `.env` file on server
2. Use production credentials (not test/dev keys)
3. Set stronger JWT_SECRET
4. Use Razorpay live keys (`rzp_live_*`)
5. Configure production MongoDB cluster
6. Update SMTP email if needed
7. Set appropriate PORT (check hosting provider)

---

## 📞 Support

If you need help with environment variables:
- Check server logs for specific errors
- Verify all required variables are set
- Ensure values don't have quotes or extra spaces
- Test credentials individually

---

**Last Updated**: February 2026
