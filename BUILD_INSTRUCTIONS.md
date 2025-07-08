# Netlify Deployment Instructions

## Prerequisites

1. **Database Setup**: You need a PostgreSQL database. We recommend using [Neon](https://neon.tech/) for a serverless PostgreSQL database.

2. **Environment Variables**: Set up the following environment variables in your Netlify dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ADMIN_SESSION_TOKEN`: A secure token for admin authentication (e.g., `aisearch-admin-2024`)

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

3. **Environment Variables**: Add the required environment variables in Netlify dashboard under Site Settings > Environment Variables

4. **Deploy**: Netlify will automatically build and deploy your application

### Option 2: Manual Deployment

1. **Build Locally**:
   ```bash
   npm install
   npm run build
   node build.js
   ```

2. **Deploy**: Upload the `dist` folder to Netlify or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## Database Migration

After deployment, you need to set up your database schema:

1. Run the database migration:
   ```bash
   npm run db:push
   ```

2. The application will automatically seed sample data on first run.

## Configuration Files

- `netlify.toml`: Main configuration for Netlify deployment
- `_redirects`: Handles routing for the single-page application
- `.env.example`: Template for environment variables

## Troubleshooting

### Common Issues:

1. **Database Connection**: Ensure your `DATABASE_URL` is correct and the database is accessible
2. **Build Failures**: Check that all dependencies are installed and Node version is 20
3. **API Routes**: Verify that serverless functions are properly configured in `netlify.toml`

### Support

For deployment issues, check:
- Netlify build logs
- Browser console for client-side errors
- Function logs for API issues

## Production Considerations

1. **Performance**: The app uses React Query for efficient data fetching
2. **SEO**: Meta tags and descriptions are configured for better search visibility  
3. **Security**: CORS and security headers are configured in `netlify.toml`
4. **Monitoring**: Set up error tracking and performance monitoring as needed