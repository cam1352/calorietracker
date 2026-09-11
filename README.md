# 🥗 NutriSnap - AI Photo Calorie & Plate Analyzer

NutriSnap is a modern AI-powered food tracking application. Users snap or upload a photo of their plate, and Gemini Vision reads every food item on the plate, provides calories per item along with a culinary explanation, and saves intake history across **Daily**, **Weekly**, and **Monthly** views. Includes a built-in **Stripe Payment Gateway** for customer subscriptions ($4.99/month).

![NutriSnap Banner](https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80)

## ✨ Key Features
- 📸 **Camera & File Dropzone**: Capture food live or upload pictures.
- 🧠 **AI Plate Reader**: Reads everything on the plate and breaks down calories per individual item + culinary explanation.
- 📊 **Per Day / Per Week / Per Month Tracking**: Interactive charts powered by Recharts.
- 💳 **Stripe Subscription ($4.99/mo)**: Seamless checkout flow for premium access.
- 💾 **Local Storage Persistence**: Save history locally with instant offline capability.

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
- `GEMINI_API_KEY`: Get a free key from Google AI Studio.
- `STRIPE_SECRET_KEY` & `VITE_STRIPE_PUBLIC_KEY`: (Optional) Get test keys from Stripe Dashboard.

### 3. Run Development Server
```bash
# Starts both Express API server (port 5000) and Vite React app (port 3000)
npm run start
```

Open `http://localhost:3000` in your browser!

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express, Stripe SDK, `@google/genai` (Gemini 2.5 Flash Vision)
