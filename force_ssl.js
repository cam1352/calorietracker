import fs from 'fs';
import path from 'path';

const possiblePaths = [
  path.join(process.env.APPDATA || '', 'netlify', 'Config', 'config.json'),
  path.join(process.env.LOCALAPPDATA || '', 'netlify', 'Config', 'config.json'),
  path.join(process.env.USERPROFILE || '', '.netlify', 'config.json')
];

let token = null;
for (const p of possiblePaths) {
  if (p && fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      token = data.users[Object.keys(data.users)[0]].auth.token;
      if (token) break;
    } catch(e) { }
  }
}

const SITE_ID = "7382dcd9-d657-4cc6-9c54-6a31ee0240ef";

async function run() {
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/ssl`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("SSL Provisioning Triggered:", data);
  } catch (e) {
    console.log("Error:", e);
  }
}
run();
