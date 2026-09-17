const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://calorietracker.xyz';

const blogs = JSON.parse(fs.readFileSync('./src/data/blogs.json', 'utf8'));
const faqs = JSON.parse(fs.readFileSync('./src/data/faqs.json', 'utf8'));

// Only include published blog posts and dripped FAQs
const now = new Date();
const publishedBlogs = blogs.filter(b => new Date(b.publishDate) <= now);
const publishedFaqs = faqs.filter(f => new Date(f.publishDate) <= now);

console.log(`Generating feeds for ${publishedBlogs.length} blogs and ${publishedFaqs.length} FAQs...`);

// 1. Generate Sitemap XML
let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

// Add Blogs to Sitemap
publishedBlogs.forEach(blog => {
  sitemapXML += `  <url>
    <loc>${DOMAIN}/?blog=${blog.slug}</loc>
    <lastmod>${new Date(blog.publishDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add FAQs to Sitemap
publishedFaqs.forEach(faq => {
  sitemapXML += `  <url>
    <loc>${DOMAIN}/?faq=${faq.slug}</loc>
    <lastmod>${new Date(faq.publishDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
});

// --- PROGRAMMATIC SEO (FOODS) ---
const popularFoods = [
  "apple", "banana", "chicken-breast", "salmon", "egg", "avocado", "almonds", 
  "brown-rice", "sweet-potato", "broccoli", "spinach", "greek-yogurt", "oatmeal", 
  "peanut-butter", "steak", "tuna", "blueberries", "strawberries", "watermelon", 
  "pineapple", "mango", "peach", "orange", "grapefruit", "grapes", "carrot", 
  "cucumber", "tomato", "onion", "garlic", "bell-pepper", "mushroom", "zucchini", 
  "cauliflower", "asparagus", "green-beans", "peas", "corn", "potato", "quinoa", 
  "pasta", "bread", "cheese", "milk", "butter", "olive-oil", "coconut-oil", "honey", 
  "maple-syrup", "sugar", "salt", "pepper", "ketchup", "mustard", "mayonnaise", 
  "soy-sauce", "hot-sauce", "salsa", "hummus", "guacamole", "pesto", "pizza", 
  "burger", "hot-dog", "fries", "chips", "popcorn", "pretzel", "cracker", "cookie", 
  "cake", "pie", "ice-cream", "chocolate", "candy", "gum", "soda", "juice", "coffee", 
  "tea", "beer", "wine", "liquor", "cocktail", "water", "smoothie", "protein-shake", 
  "salad", "soup", "sandwich", "wrap", "taco", "burrito", "quesadilla", "nachos", 
  "sushi", "ramen", "pho", "curry", "stir-fry", "cereal"
];

popularFoods.forEach(food => {
  sitemapXML += `  <url>
    <loc>${DOMAIN}/?food=${food}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

sitemapXML += `</urlset>`;
fs.writeFileSync('./public/sitemap.xml', sitemapXML, 'utf8');
console.log('✅ sitemap.xml generated with pSEO Food routes');


// 2. Generate RSS Feed XML
let rssXML = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Calorie Tracker Blog</title>
  <link>${DOMAIN}</link>
  <description>AI-Powered Food &amp; Plate Analyzer Blog &amp; Guides</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

publishedBlogs.forEach(blog => {
  rssXML += `  <item>
    <title>${blog.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
    <link>${DOMAIN}/?blog=${blog.slug}</link>
    <guid>${DOMAIN}/?blog=${blog.slug}</guid>
    <pubDate>${new Date(blog.publishDate).toUTCString()}</pubDate>
    <description><![CDATA[${blog.content.substring(0, 300)}...]]></description>
  </item>\n`;
});

rssXML += `</channel>\n</rss>`;
fs.writeFileSync('./public/rss.xml', rssXML, 'utf8');
console.log('✅ rss.xml generated');
