const fs = require('fs');
const path = require('path');

const blogsPath = path.join(__dirname, 'src', 'data', 'blogs.json');
const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

// Start scheduling from today at 9:00 AM PST
// PST is UTC-8 (ignoring daylight savings for simplicity, or just use fixed hours)
let currentDate = new Date();
currentDate.setUTCHours(17, 0, 0, 0); // 9 AM PST = 17:00 UTC

const hoursPST = [17, 22, 2]; // 9 AM PST (17:00 UTC), 2 PM PST (22:00 UTC), 6 PM PST (02:00 UTC next day)

let dayOffset = 0;

for (let i = 0; i < blogs.length; i++) {
  const timeSlot = i % 3;
  
  if (i > 0 && timeSlot === 0) {
    dayOffset++;
  }

  let pubDate = new Date();
  pubDate.setDate(pubDate.getDate() + dayOffset);
  
  // Set the specific hour based on the slot
  if (timeSlot === 0) {
    pubDate.setUTCHours(17, 0, 0, 0); // 9 AM PST
  } else if (timeSlot === 1) {
    pubDate.setUTCHours(22, 0, 0, 0); // 2 PM PST
  } else if (timeSlot === 2) {
    // 6 PM PST is technically 2 AM UTC the next day
    pubDate.setDate(pubDate.getDate() + 1);
    pubDate.setUTCHours(2, 0, 0, 0);
  }

  blogs[i].publishDate = pubDate.toISOString();
}

fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));
console.log(`Successfully scheduled ${blogs.length} blogs at 3/day!`);
