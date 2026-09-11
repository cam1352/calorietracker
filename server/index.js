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
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    // Strip header prefix if included (e.g. data:image/png;base64,)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // If no GEMINI_API_KEY is configured, fallback to high-quality smart mock response
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.log('No GEMINI_API_KEY configured. Returning intelligent mock food breakdown.');
      await new Promise((r) => setTimeout(r, 1500)); // Simulate AI processing delay
      return res.json({
        dishName: "Mediterranean Salmon & Quinoa Bowl",
        explanation: "A balanced, colorful meal featuring pan-seared salmon fillet over fluffy quinoa, served alongside steamed broccoli florets and drizzled with extra virgin olive oil.",
        items: [
          { name: "Pan-Seared Salmon Fillet", portionSize: "170g", calories: 340, protein: 34, carbs: 0, fat: 22 },
          { name: "Fluffy Cooked Quinoa", portionSize: "130g", calories: 155, protein: 5, carbs: 28, fat: 2.5 },
          { name: "Steamed Seasoned Broccoli", portionSize: "90g", calories: 35, protein: 3, carbs: 7, fat: 0.5 },
          { name: "Olive Oil Drizzle & Herbs", portionSize: "1 tbsp", calories: 119, protein: 0, carbs: 0, fat: 13.5 }
        ],
        totalCalories: 649,
        protein: 42,
        carbs: 35,
        fat: 38.5,
        healthScore: 9,
        dietaryTags: ["High Protein", "Omega-3", "Gluten-Free"],
        isMock: true
      });
    }

    // Call Gemini Vision API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a world-class nutritionist and food AI analyzer. 
Analyze the provided food image carefully. Read what is on the plate, identify each distinct item, estimate its portion size, and calculate the calories and macronutrients per item.

Respond strictly with a JSON object in this exact schema:
\`\`\`json
{
  "dishName": "Short descriptive name of the meal",
  "explanation": "2-3 detailed sentences describing the plate, ingredients, cooking style, and nutritional highlights.",
  "items": [
    {
      "name": "Specific item name",
      "portionSize": "estimated weight/volume e.g. 150g or 1 cup",
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
              name: 'NutriSnap Pro - Unlimited AI Calorie Scanning',
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
  console.log(`🥗 NutriSnap Express Server running on http://localhost:${PORT}`);
});
