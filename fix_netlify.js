import fs from 'fs';
import path from 'path';

const possiblePaths = [
  path.join(process.env.APPDATA || '', 'netlify', 'Config', 'config.json'),
  path.join(process.env.LOCALAPPDATA || '', 'netlify', 'Config', 'config.json'),
  path.join(process.env.LOCALAPPDATA || '', 'netlify-cli', 'nodejs', 'config.json'),
  path.join(process.env.USERPROFILE || '', '.netlify', 'config.json'),
  path.join(process.env.LOCALAPPDATA || '', 'netlify', 'config.json')
];

let token = null;

for (const p of possiblePaths) {
  if (p && fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data.users) {
        const userId = Object.keys(data.users)[0];
        if (userId && data.users[userId].auth) {
          token = data.users[userId].auth.token;
          console.log("Found token in", p);
          break;
        }
      }
    } catch(e) { }
  }
}

if (!token) {
  console.log("Could not find Netlify auth token");
  process.exit(1);
}

const SITE_ID = "7382dcd9-d657-4cc6-9c54-6a31ee0240ef";
const DOMAIN = "calorietracker.xyz";

async function run() {
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ custom_domain: DOMAIN })
    });
    const data = await res.json();
    console.log(data.custom_domain ? "SUCCESS: " + data.custom_domain : "FAIL: " + JSON.stringify(data));
  } catch (e) {
    console.log("Error:", e);
  }
}
run();
