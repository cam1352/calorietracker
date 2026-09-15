const fs = require('fs');
const path = require('path');

const keywords = ["Calorie Tracker", "Macro Counting", "Weight Loss", "AI Diet", "Protein Intake", "Fat Loss", "Bulking", "Nutrition App", "Food Scanner", "Healthy Eating"];
const templatesFAQ = [
  "How does {keyword} work?",
  "What is the best {keyword} method?",
  "Can I use {keyword} for free?",
  "Is {keyword} accurate?",
  "Why is {keyword} important for my goals?",
  "How to start with {keyword} today?",
  "What are the benefits of {keyword}?",
  "Does {keyword} actually help you lose weight?",
  "What is the difference between {keyword} and manual tracking?",
  "How does the AI handle {keyword}?"
];

const templatesBlog = [
  "The Ultimate Guide to {keyword} in 2026",
  "5 Myths About {keyword} Busted",
  "How {keyword} Transformed My Fitness Journey",
  "The Secret to Mastering {keyword} Every Day",
  "Why Manual Tracking is Dead: The Rise of {keyword}",
  "Top 10 Tips for {keyword} Success",
  "{keyword} for Beginners: A Step-by-Step Guide",
  "How AI is Revolutionizing {keyword}",
  "The Science Behind {keyword}",
  "Common Mistakes People Make With {keyword}"
];

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const faqs = [];
const blogs = [];

let faqId = 1;
let blogId = 1;

for (let k of keywords) {
  for (let t of templatesFAQ) {
    const title = t.replace("{keyword}", k);
    faqs.push({
      id: `faq-${faqId++}`,
      title,
      slug: generateSlug(title),
      content: `When it comes to ${k}, our AI vision technology makes it completely effortless. Traditionally, people struggled with this, but by using Calorie Tracker, you can simply point your camera and let the system handle the complex calculations instantly. We cross-reference thousands of nutritional databases to ensure your ${k.toLowerCase()} experience is accurate and seamless.`
    });
  }
  for (let t of templatesBlog) {
    const title = t.replace("{keyword}", k);
    blogs.push({
      id: `blog-${blogId++}`,
      title,
      slug: generateSlug(title),
      date: '2026-09-13',
      content: `<h2>Understanding ${k}</h2><p>In recent years, the approach to ${k.toLowerCase()} has fundamentally shifted. Gone are the days of manual entry and guessing portion sizes. With the advent of AI food scanners, you can achieve unprecedented accuracy.</p><h3>Why it Matters</h3><p>Your success is heavily dependent on accurate data. If you are serious about your health goals, leveraging technology for ${k.toLowerCase()} is no longer optional—it is a necessity.</p><p>By utilizing our smart tracking algorithms, you ensure every single meal is logged perfectly, helping you stay in a caloric deficit or surplus depending on your unique metabolic goals.</p>`
    });
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'faqs.json'), JSON.stringify(faqs, null, 2));
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'blogs.json'), JSON.stringify(blogs, null, 2));

console.log("Successfully generated 100 FAQs and 100 Blogs!");
