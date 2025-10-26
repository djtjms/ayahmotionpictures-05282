import FtpDeploy from 'ftp-deploy';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables from .env file
const envFile = readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Set environment variables
Object.assign(process.env, envVars);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ftpDeploy = new FtpDeploy();

const config = {
  user: "u581183335.ayahmotionpictures", // Full username
  password: process.env.FTP_PASSWORD, // Set this in environment
  host: "185.232.14.138", // Use IP address instead of hostname
  port: 21,
  localRoot: join(__dirname, "dist"),
  remoteRoot: "/home/u581183335/domains/ayahmotionpictures.com/public_html/",
  include: ["*", "**/*"],
  exclude: [
    "dist/**/*.map",
    "node_modules/**",
    "node_modules/**/.*",
    ".git/**"
  ],
  deleteRemote: true,
  forcePasv: true
};

console.log('Starting deployment to Hostinger...');
console.log('Local root:', config.localRoot);
console.log('Remote root:', config.remoteRoot);

ftpDeploy
  .deploy(config)
  .then(res => {
    console.log('✅ Deployment completed successfully!');
    console.log('Files uploaded:', res.length);
    console.log('🌐 Your site should be live at: https://ayahmotionpictures.com');
  })
  .catch(err => {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  });

// Log deployment progress
ftpDeploy.on('uploading', function(data) {
  console.log(`📤 Uploading: ${data.filename} (${data.transferredFileCount}/${data.totalFilesCount})`);
});

ftpDeploy.on('uploaded', function(data) {
  console.log(`✅ Uploaded: ${data.filename}`);
});

ftpDeploy.on('log', function(data) {
  console.log('📝 Log:', data);
});