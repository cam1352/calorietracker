const fs = require('fs');

const DOMAIN = 'https://calorietracker.xyz';
const LANGUAGES = ['en', 'es', 'zh', 'hi', 'fr', 'pt']; 

const blogs = JSON.parse(fs.readFileSync('./src/data/blogs.json', 'utf8'));
const faqs = JSON.parse(fs.readFileSync('./src/data/faqs.json', 'utf8'));

const now = new Date();
const publishedBlogs = blogs.filter(b => new Date(b.publishDate) <= now);
const publishedFaqs = faqs.filter(f => new Date(f.publishDate) <= now);

console.log(`Building Global SEO Sitemap for ${LANGUAGES.length} languages...`);

let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

// Helper to generate hreflang blocks
const generateHreflang = (path) => {
  return LANGUAGES.map(lang => 
    `      <xhtml:link rel="alternate" hreflang="${lang}" href="${DOMAIN}/${lang}${path}" />`
  ).join('\n');
};

// Add Home Pages
LANGUAGES.forEach(lang => {
  sitemapXML += `  <url>\n    <loc>${DOMAIN}/${lang}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n${generateHreflang('/')}\n  </url>\n`;
});

// Add Blogs
publishedBlogs.forEach(blog => {
  LANGUAGES.forEach(lang => {
    sitemapXML += `  <url>\n    <loc>${DOMAIN}/${lang}/blog/${blog.slug}</loc>\n    <lastmod>${blog.publishDate}</lastmod>\n${generateHreflang(`/blog/${blog.slug}`)}\n  </url>\n`;
  });
});

// Add FAQs
publishedFaqs.forEach(faq => {
  LANGUAGES.forEach(lang => {
    sitemapXML += `  <url>\n    <loc>${DOMAIN}/${lang}/food/${faq.slug}</loc>\n    <lastmod>${faq.publishDate}</lastmod>\n${generateHreflang(`/food/${faq.slug}`)}\n  </url>\n`;
  });
});

sitemapXML += `</urlset>`;

fs.writeFileSync('./public/sitemap_global.xml', sitemapXML);

const totalPages = (1 + publishedBlogs.length + publishedFaqs.length) * LANGUAGES.length;
console.log(`SUCCESS: Global Sitemap generated with ${totalPages} localized SEO pages!`);
