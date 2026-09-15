const { execSync } = require('child_process');
try {
  execSync(`npx netlify-cli api updateSite --data '{"site_id":"7382dcd9-d657-4cc6-9c54-6a31ee0240ef", "custom_domain":"calorietracker.xyz"}'`, { stdio: 'inherit' });
} catch (e) {
  console.log("Failed", e);
}
