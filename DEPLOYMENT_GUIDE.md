# AISearch Netlify Deployment Guide

This guide will help you deploy the AISearch application to Netlify with full functionality.

## Prerequisites

### 1. Database Setup (Required)
You need a PostgreSQL database. We recommend **Neon** (free tier available):

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### 2. Netlify Account
- Sign up at [netlify.com](https://netlify.com) (free tier available)

## Quick Deployment Steps

### 1. Fork/Clone Repository
```bash
git clone <your-repo-url>
cd aisearch
```

### 2. Connect to Netlify

**Option A: GitHub Integration (Recommended)**
1. Push your code to GitHub
2. Go to Netlify dashboard → "Add new site" → "Import from Git"
3. Connect your GitHub account and select the repository

**Option B: Manual Upload**
1. Run `npm install && npm run build && node build.js`
2. Upload the `dist` folder to Netlify

### 3. Configure Build Settings

In Netlify dashboard → Site Settings → Build & Deploy:

```
Build command: npm run build && node build.js
Publish directory: dist
Functions directory: netlify/functions
Node version: 20
```

### 4. Set Environment Variables

In Netlify dashboard → Site Settings → Environment Variables, add:

| Variable | Value | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your Neon database connection string |
| `ADMIN_SESSION_TOKEN` | `aisearch-admin-2024` | Admin authentication token |
| `NODE_ENV` | `production` | Application environment |

### 5. Deploy

1. Click "Deploy site" in Netlify
2. Wait for build to complete (2-3 minutes)
3. Your site will be available at `https://your-site-name.netlify.app`

## Database Migration

After first deployment, initialize your database:

1. Install Drizzle CLI: `npm install -g drizzle-kit`
2. Run migration: `DATABASE_URL="your-connection-string" drizzle-kit push`

The application will automatically seed sample data on first API call.

## Admin Access

- Admin login: `https://your-site.netlify.app/admin-login`
- Username: `admin`
- Password: `aisearch2024!`

## File Structure for Deployment

```
├── netlify.toml          # Netlify configuration
├── _redirects            # URL routing rules
├── netlify/functions/    # Serverless functions
│   └── api.js           # Main API handler
├── build.js             # Server build script
├── server/serverless.ts # Serverless Express app
└── dist/                # Built application (auto-generated)
```

## Features Included

✅ Full-stack React + Node.js application
✅ PostgreSQL database with Drizzle ORM
✅ Admin panel for content management
✅ Advertisement system with tracking
✅ Search functionality
✅ Mobile responsive design
✅ SEO optimization
✅ User authentication
✅ Real-time analytics

## Troubleshooting

### Build Fails
- Check Node version is 20
- Verify all dependencies are installed
- Check build logs in Netlify dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible (not behind firewall)
- Check database credentials

### Functions Not Working
- Verify `netlify.toml` configuration
- Check function logs in Netlify dashboard
- Ensure serverless-http is installed

### Common Solutions

1. **"Module not found" errors**: Usually missing dependencies
   ```bash
   npm install
   ```

2. **Database connection timeout**: Check if your database provider requires specific settings

3. **Build timeout**: Large dependencies might need optimization

## Performance Optimization

The deployment includes:
- Code splitting for faster loading
- Compressed assets
- CDN distribution via Netlify
- Optimized database queries
- Efficient React Query caching

## Cost Estimation

**Netlify (Free Tier):**
- 100GB bandwidth/month
- 300 build minutes/month
- Usually sufficient for small-medium traffic

**Neon Database (Free Tier):**
- 0.5GB storage
- 3GB data transfer/month
- Perfect for development and small apps

**Total: $0/month** for most use cases

## Security Features

- HTTPS enabled by default
- CORS properly configured
- SQL injection protection via Drizzle ORM
- XSS protection headers
- Secure session management

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test database connection
4. Check function logs

For technical support, check the project repository issues.