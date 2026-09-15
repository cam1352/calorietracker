const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log("Starting automated deployment of Bricks, Walker, and Pharmacy...");

  try {
    const configPath = path.join(process.env.APPDATA, 'netlify', 'Config', 'config.json');
    const netlifyConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const token = netlifyConfig.users[netlifyConfig.userId].auth.token;

    const projects = [
      { name: 'bricks-dev', dir: '../bricks-dev', buildCmd: '', deployDir: '.' },
      { name: 'walker-general-contractors', dir: '../walker-general-contractors', buildCmd: 'npm run build', deployDir: 'dist' },
      { name: 'pharmacy-platform', dir: '../pharmacy-platform', buildCmd: 'npm run build', deployDir: '.next' }
    ];

    for (const proj of projects) {
      console.log(`\n--- Deploying ${proj.name} ---`);
      
      // 1. Create Site
      const resp = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `agentic-${proj.name}-${Math.floor(Math.random()*10000)}` })
      });
      
      const site = await resp.json();
      if (!site.id) {
        console.log("Failed to create site:", site);
        continue;
      }
      console.log(`Created Netlify site: ${site.url} (ID: ${site.id})`);
      
      const projDir = path.join(__dirname, proj.dir);
      
      // 2. Build Project
      if (proj.buildCmd) {
        console.log(`Running build: ${proj.buildCmd}`);
        execSync(proj.buildCmd, { cwd: projDir, stdio: 'inherit' });
      }

      // 3. Deploy to Netlify
      console.log(`Deploying directory: ${proj.deployDir}`);
      execSync(`npx netlify-cli deploy --prod --dir ${proj.deployDir} --site ${site.id} --auth ${token}`, { cwd: projDir, stdio: 'inherit' });
      
      console.log(`SUCCESS! ${proj.name} is live at ${site.url}`);
    }

    console.log("\nAll deployments complete!");

  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
