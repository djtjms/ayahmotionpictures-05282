# Hostinger Deployment Guide

This guide will help you deploy your Creatures of Faith website to Hostinger hosting.

## Prerequisites

1. Hostinger hosting account with FTP access
2. Node.js and npm installed locally
3. Your FTP password

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your FTP password:

```
FTP_PASSWORD=your_actual_ftp_password
```

### 3. Build and Deploy

Run the deployment command:

```bash
npm run deploy:hostinger
```

This will:
1. Build the project for production
2. Upload all files to your Hostinger hosting via FTP
3. Deploy to the `public_html` directory

### 4. Verify Deployment

After successful deployment, visit your website:
- **URL**: https://ayahmotionpictures.com
- **FTP Hostname**: ftp://ayahmotionpictures.com
- **Upload Path**: public_html

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. Build the project:
   ```bash
   npm run build:hostinger
   ```

2. Upload the contents of the `dist` folder to your Hostinger `public_html` directory via FTP

## Troubleshooting

### Common Issues

1. **FTP Connection Failed**
   - Verify your FTP credentials
   - Check if your Hostinger account allows FTP access
   - Ensure the password is correct in your `.env` file

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors: `npm run lint`

3. **Files Not Uploading**
   - Check your internet connection
   - Verify the remote directory path (`/public_html/`)
   - Ensure you have write permissions

### Support

For deployment issues, check:
1. Hostinger support documentation
2. FTP client logs
3. Build output for errors

## File Structure After Deployment

```
public_html/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── favicon.ico
└── robots.txt
```

Your website will be accessible at `https://ayahmotionpictures.com` once deployed successfully.