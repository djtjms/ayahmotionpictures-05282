# Hostinger Deployment Guide

This guide will help you deploy your Creatures of Faith website to Hostinger hosting using FTP or Git.

## Prerequisites

1. Hostinger hosting account (hPanel access)
2. Node.js and npm installed locally
3. FTP credentials OR Git repository connected

## Deployment Methods

### Method 1: FTP Deployment (Automated)

This is the fastest way to deploy using the built-in FTP script.

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your FTP password:

```
FTP_PASSWORD=your_actual_ftp_password
```

**IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

#### 3. Build and Deploy

Run the deployment command:

```bash
npm run deploy:hostinger
```

This will:
1. Build the project for production
2. Upload all files to your Hostinger hosting via FTP
3. Deploy to the `public_html` directory
4. Include `.htaccess` for proper routing

#### 4. Verify Deployment

After successful deployment, visit your website:
- **URL**: https://ayahmotionpictures.com
- **FTP Hostname**: ftp://ayahmotionpictures.com
- **Upload Path**: public_html

---

### Method 2: Git Deployment (Hostinger hPanel)

Connect your GitHub repository directly to Hostinger for automatic deployments.

#### 1. Connect Git in hPanel

1. Log in to your Hostinger hPanel
2. Go to **Git** section
3. Click **Create new repository** or **Connect to Git**
4. Choose GitHub and authorize Hostinger
5. Select your repository: `ayahmotionpictures/creatures-of-faith`
6. Set deployment path: `/public_html`

#### 2. Configure Build Settings in hPanel

After connecting, configure these build settings:

```bash
# Build command
npm install && npm run build

# Output directory
dist

# Environment variables (add in hPanel)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

#### 3. Deploy

Every push to your default branch will trigger automatic deployment.

**Manual deployment**: Click **Pull & Deploy** in hPanel Git section.

---

### Method 3: Manual FTP Upload

If you prefer manual FTP upload:

#### 1. Build the project:
```bash
npm run build
```

#### 2. Upload via FileZilla or hPanel File Manager

**Using FileZilla:**
- Host: ftp.ayahmotionpictures.com
- Username: Your FTP username
- Password: Your FTP password
- Port: 21

**Upload these files from the `dist` folder to `public_html`:**
- index.html
- assets/ (entire folder)
- .htaccess (critical for routing!)
- robots.txt
- favicon.ico

**Using hPanel File Manager:**
1. Log in to hPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Upload all files from the `dist` folder
5. Ensure `.htaccess` is uploaded

---

## Important Files for Hostinger

### .htaccess (Critical!)

The `.htaccess` file in `public/` is automatically copied to `dist/` during build and is **CRITICAL** for:
- React Router to work properly
- Handling client-side routing
- SEO and proper URL structure
- GZIP compression and caching

**If routing doesn't work**, verify `.htaccess` is in `public_html/`.

### Environment Variables

For production, set these in your `.env` file OR in hPanel:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**Never commit `.env` to Git!**

---

## Troubleshooting

### Common Issues

1. **404 Errors on Page Refresh**
   - **Cause**: Missing `.htaccess` file
   - **Solution**: Ensure `.htaccess` is uploaded to `public_html/`
   - **Verify**: Check File Manager in hPanel

2. **FTP Connection Failed**
   - Verify your FTP credentials in hPanel > FTP Accounts
   - Check if your IP is not blocked
   - Try using IP address instead of hostname
   - Ensure the password is correct in your `.env` file

3. **Git Deployment Not Working**
   - Check build logs in hPanel > Git section
   - Verify build command: `npm install && npm run build`
   - Ensure output directory is set to: `dist`
   - Check environment variables are set

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors: `npm run lint`
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

5. **White Screen / Blank Page**
   - Check browser console for errors
   - Verify environment variables are set correctly
   - Check if assets are loading (Network tab)
   - Ensure base path in vite.config.ts is "/"

6. **Styling Issues**
   - Clear browser cache
   - Verify CSS files are in `public_html/assets/`
   - Check for missing font files

### Support

For deployment issues:
1. Hostinger support documentation: https://support.hostinger.com
2. Hostinger live chat (24/7)
3. Check FTP client logs
4. Review build output for errors
5. Check hPanel error logs

---

## File Structure After Deployment

```
public_html/
├── index.html              # Main HTML file
├── .htaccess              # Apache configuration (CRITICAL!)
├── _redirects             # Fallback for routing
├── robots.txt             # SEO
├── favicon.ico            # Site icon
└── assets/
    ├── js/                # JavaScript bundles
    │   ├── index-[hash].js
    │   └── vendor-[hash].js
    ├── images/            # Images
    └── [name]-[hash].css  # Stylesheets
```

---

## Post-Deployment Checklist

✅ Website loads at your domain  
✅ All pages accessible (routing works)  
✅ Donation form displays correctly  
✅ Admin panel accessible at `/admin`  
✅ Images and videos load properly  
✅ Theme toggle works (light/dark mode)  
✅ Mobile responsive design works  
✅ SSL certificate active (https://)  
✅ Supabase connection working  

---

## Updating Your Website

### Using FTP Deployment:
```bash
npm run deploy:hostinger
```

### Using Git Deployment:
```bash
git add .
git commit -m "Update website"
git push origin main
```
Hostinger will automatically rebuild and deploy.

---

Your website will be accessible at `https://ayahmotionpictures.com` once deployed successfully! 🚀