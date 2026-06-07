#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  { path: '.env', source: '.env.example', type: 'backend' },
];

files.forEach((file) => {
  const backendPath = path.join(__dirname, '../.env');
  
  if (!fs.existsSync(backendPath)) {
    const examplePath = path.join(__dirname, '../.env.example');
    fs.copyFileSync(examplePath, backendPath);
    console.log('✅ Created backend .env file');
  }
});

const frontendEnvPath = path.join(__dirname, '../../frontend/.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  const content = 'NEXT_PUBLIC_API_URL=http://localhost:5000/api\n';
  fs.writeFileSync(frontendEnvPath, content);
  console.log('✅ Created frontend .env.local file');
}

console.log('\n✨ Environment setup complete!');
console.log('Please update the .env files with your configuration.');
