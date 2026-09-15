const fs = require('fs');
let blogs = JSON.parse(fs.readFileSync('src/data/blogs.json', 'utf8'));
let startDate = new Date('2026-09-14T17:00:00Z');

blogs.forEach((blog, index) => {
  // 4 per day logic
  let dayOffset = Math.floor(index / 4);
  let hourOffset = (index % 4) * 4; // space them by 4 hours
  let d = new Date(startDate.getTime());
  d.setDate(d.getDate() + dayOffset);
  d.setHours(d.getHours() + hourOffset);
  blog.publishDate = d.toISOString();

  // Inject internal and external links
  if (!blog.content.includes('href="/"')) {
     blog.content = blog.content.replace(/calorie tracker/i, '<a href="/" title="Calorie Tracker App" class="text-emerald-400 font-bold hover:underline">Calorie Tracker</a>');
  }
  if (!blog.content.includes('who.int')) {
     blog.content += '<p class="mt-4 text-sm text-slate-500">For more general nutritional guidelines, refer to the <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="nofollow" class="text-emerald-400 hover:underline">World Health Organization</a>.</p>';
  }
});

fs.writeFileSync('src/data/blogs.json', JSON.stringify(blogs, null, 2));
console.log('Successfully updated 100 blogs with 4/day dripping and internal/external SEO links!');
