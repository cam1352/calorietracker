# 🥗 Calorie Tracker - AI Photo Calorie & Plate Analyzer

Calorie Tracker is a modern AI-powered food tracking application. Users snap or upload a photo of their plate, and Gemini Vision reads every food item on the plate, provides calories per item along with a culinary explanation, and saves intake history across **Daily**, **Weekly**, and **Monthly** views. Includes a built-in **Stripe Payment Gateway** for customer subscriptions ($4.99/month) and user authentication.

## ✨ Key Features
- 📸 **Camera & File Dropzone**: Capture food live or upload pictures.
- 🧠 **AI Plate Reader**: Reads everything on the plate and breaks down calories per individual item + culinary explanation.
- 🔐 **User Sign Up & Password Auth**: Secure user login & account management.
- 📊 **Per Day / Per Week / Per Month Tracking**: Interactive charts powered by Recharts.
- 💳 **Stripe Subscription ($4.99/mo)**: Seamless checkout flow for premium access.

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API Keys:
- `GEMINI_API_KEY`: Get a key from Google AI Studio.
- `STRIPE_SECRET_KEY` & `VITE_STRIPE_PUBLIC_KEY`: Get keys from Stripe Dashboard.

### 3. Run Development Server
```bash
npm start
```

Open `http://localhost:3000` in your browser!
