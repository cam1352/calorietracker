import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Initialize Stripe (optional key support)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// Initialize Google Generative AI (Gemini Vision)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Helper: Extract JSON from AI markdown response
function extractJSON(text) {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON from AI response:', text);
    throw new Error('AI response was not valid JSON');
  }
}

// 1. AI Plate Analysis API Endpoint
app.post('/api/analyze-plate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', presetId } = req.body;

    if (!imageBase64 && !presetId) {
      return res.status(400).json({ error: 'Image base64 data or presetId is required' });
    }

    // Special preset matching user's exact example: Corn 250 cals, Potatoes 400 cals, Meat 500 cals = 1150 cals
    if (presetId === 'steak-corn-potatoes') {
      await new Promise((r) => setTimeout(r, 1200));
      return res.json({
        dishName: "Grilled Steak, Roasted Potatoes & Sweet Corn",
        explanation: "A hearty, wholesome plate featuring a seasoned grilled ribeye steak (500 kcal), oven-roasted gold potato wedges (400 kcal), and buttered sweet corn on the cob (250 kcal). High in protein and iron.",
        items: [
          { name: "Grilled Ribeye Steak (Meat)", portionSize: "220g", calories: 500, protein: 48, carbs: 0, fat: 34 },
          { name: "Oven-Roasted Potato Wedges", portionSize: "250g", calories: 400, protein: 6, carbs: 64, fat: 14 },
          { name: "Buttered Sweet Corn on the Cob", portionSize: "180g", calories: 250, protein: 5, carbs: 42, fat: 8 }
        ],
        totalCalories: 1150,
        protein: 59,
        carbs: 106,
        fat: 56,
        healthScore: 8,
        dietaryTags: ["High Protein", "Hearty Dinner"],
        isMock: true
      });
    }

    const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';

    // If no GEMINI_API_KEY is configured, fallback to intelligent estimation preset
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.log('No GEMINI_API_KEY configured. Returning intelligent mock food breakdown.');
      await new Promise((r) => setTimeout(r, 1500));
      return res.json({
        dishName: "Grilled Steak, Roasted Potatoes & Sweet Corn",
        explanation: "A rich dinner plate with seasoned grilled meat, crisp oven potatoes, and sweet corn. Calorie estimates per item: Corn (250 kcal), Potatoes (400 kcal), Meat (500 kcal) totaling 1,150 kcal.",
        items: [
          { name: "Grilled Meat / Steak", portionSize: "220g", calories: 500, protein: 48, carbs: 0, fat: 34 },
          { name: "Roasted Potatoes", portionSize: "250g", calories: 400, protein: 6, carbs: 64, fat: 14 },
          { name: "Sweet Corn", portionSize: "180g", calories: 250, protein: 5, carbs: 42, fat: 8 }
        ],
        totalCalories: 1150,
        protein: 59,
        carbs: 106,
        fat: 56,
        healthScore: 8,
        dietaryTags: ["High Protein", "Balanced Plate"],
        isMock: true
      });
    }

    // Call Gemini Vision API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a world-class nutritionist and food AI analyzer. 
Analyze the provided food image carefully. Read what is on the plate, identify each distinct item, estimate its portion size, and calculate the calories and macronutrients per item as accurately as possible.

Respond strictly with a JSON object in this exact schema:
\`\`\`json
{
  "dishName": "Short descriptive name of the meal",
  "explanation": "Detailed 2-3 sentences explaining the items found on the plate, ingredients, cooking style, and calorie estimation rationale.",
  "items": [
    {
      "name": "Specific item name (e.g. Sweet Corn, Roasted Potatoes, Grilled Meat)",
      "portionSize": "estimated weight/volume e.g. 180g or 1 cup",
      "calories": number (kcal),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams)
    }
  ],
  "totalCalories": number (sum of items calories),
  "protein": number (total protein in grams),
  "carbs": number (total carbs in grams),
  "fat": number (total fat in grams),
  "healthScore": number (1 to 10 score),
  "dietaryTags": ["tag1", "tag2"]
}
\`\`\``;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([systemPrompt, imagePart]);
    const responseText = result.response.text();
    const parsedData = extractJSON(responseText);
    res.json(parsedData);

  } catch (error) {
    console.error('Error analyzing plate:', error);
    res.status(500).json({
      error: 'Failed to analyze food image',
      details: error.message
    });
  }
});

// 2. Stripe Checkout Session Creation ($4.99/mo)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan = 'monthly' } = req.body;
    const amount = plan === 'yearly' ? 3999 : 499; // $39.99/yr or $4.99/mo

    if (!stripe) {
      return res.json({
        url: null,
        isMock: true,
        message: 'Stripe keys not configured. Simulating instant Pro upgrade for demo mode!'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Calorie Tracker Pro - Unlimited AI Calorie Scanning',
              description: 'Unlimited AI food recognition, per-item calorie breakdowns, and daily/weekly/monthly analytics export.',
              images: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80']
            },
            unit_amount: amount,
            recurring: {
              interval: plan === 'yearly' ? 'year' : 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:3000'}?payment=success`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY)
  });
});

app.listen(PORT, () => {
  console.log(`🥗 Calorie Tracker Express Server running on http://localhost:${PORT}`);
});
