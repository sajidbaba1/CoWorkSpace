# 🚀 Quick Start Guide - CoWorkSpace

Get your CoWorkSpace application running in 5 minutes!

---

## ⚡ Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v18+)
- ✅ Git installed
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/Command Prompt

---

## 📥 Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/sajidbaba1/CoWorkSpace.git
cd CoWorkSpace

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

---

## 🔐 Step 2: Setup Environment Variables (2 minutes)

### Server Configuration

```bash
# Copy example file
cd server
cp .env.example .env
```

**Minimum required variables** (edit `server/.env`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/
JWT_SECRET=any-long-random-string-here-minimum-32-characters
```

💡 **Quick JWT Secret Generator:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Client Configuration

```bash
# Create client env file
cd ../client
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
cd ..
```

---

## ▶️ Step 3: Run the Application (1 minute)

### Option A: Run Both Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Client running on http://localhost:3000

### Option B: Quick Test (Backend Only)

```bash
cd server
npm run dev
```

Test with: http://localhost:5000/api/workspaces

---

## 🎯 Step 4: Access the Application

1. **Open Browser**: http://localhost:3000
2. **Register**: Create a new account
3. **Explore**: Browse workspaces and features

---

## 🔧 Optional: Full Feature Setup

For complete functionality (payments, emails, file uploads), you'll need:

### MongoDB Atlas (Database)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `MONGODB_URI`

### Cloudinary (Image Upload)
1. Sign up: https://cloudinary.com
2. Get credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Razorpay (Payments)
1. Sign up: https://razorpay.com
2. Get test keys
3. Add to `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

### Gmail SMTP (Emails)
1. Enable 2FA on Gmail
2. Generate App Password
3. Add to `.env`:
```env
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
SMTP_FROM_NAME=CoWorkSpace
SMTP_FROM_EMAIL=your_email@gmail.com
```

📖 **Detailed Setup**: See [ENV_SETUP.md](server/ENV_SETUP.md)

---

## ✅ Verify Installation

### Check Server
```bash
curl http://localhost:5000/api/workspaces
```
Should return JSON data

### Check Client
Open http://localhost:3000 in browser
Should see landing page

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port
npx kill-port 5000
npx kill-port 3000
```

### MongoDB Connection Failed
- Check your connection string format
- Ensure IP is whitelisted in MongoDB Atlas
- Verify credentials

### Module Not Found
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

---

## 📚 Next Steps

1. ✅ **Read Full Documentation**: [README.md](README.md)
2. ✅ **Setup All Features**: [ENV_SETUP.md](server/ENV_SETUP.md)
3. ✅ **Review Security**: [SECURITY_SCAN.md](SECURITY_SCAN.md)
4. ✅ **Create Admin Account**: Run `node server/scripts/seedAdmin.js`

---

## 🎉 You're All Set!

Your CoWorkSpace application is now running!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api

Happy coding! 🚀
