# AISearch - AI Tools Directory

A comprehensive search engine and directory for AI tools, products, and agents built with React, Node.js, and PostgreSQL.

## 🚀 Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/aisearch)

## ✨ Features

- **Comprehensive Search**: Find AI tools across 37+ categories
- **Admin Panel**: Full content management system
- **Advertisement System**: Monetization with click/impression tracking
- **User Reviews**: Community ratings and feedback
- **Mobile Responsive**: Works perfectly on all devices
- **SEO Optimized**: Meta tags and structured data
- **Real-time Analytics**: Track performance and engagement

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Netlify (Serverless Functions)
- **State Management**: TanStack Query
- **Authentication**: Session-based admin system

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aisearch
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5000
   - Admin: http://localhost:5000/admin-login

## 🌐 Deployment

### Netlify Deployment (Recommended)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**
1. Fork this repository
2. Connect to Netlify
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ADMIN_SESSION_TOKEN`: `aisearch-admin-2024`
4. Deploy!

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `ADMIN_SESSION_TOKEN` | Admin authentication token | `aisearch-admin-2024` |
| `NODE_ENV` | Application environment | `production` |

## 🔐 Admin Access

- **URL**: `/admin-login`
- **Username**: `admin`
- **Password**: `aisearch2024!`

### Admin Features
- Manage submissions (approve/reject/edit)
- Create and manage advertisements
- View analytics and performance metrics
- Monitor user activity and engagement
- Configure monetization settings

## 📊 Database Schema

The application uses 4 main tables:
- `submissions`: AI tool listings with metadata
- `advertisements`: Advertisement campaigns with tracking
- `reviews`: User reviews and ratings
- `search_queries`: Search analytics

## 🎨 Categories Supported

- **Core AI**: LLMs, Computer Vision, NLP, ML Platforms
- **Creative**: Art Generators, Video Tools, Audio, Design
- **Professional**: Writing Assistants, Code Assistants, Analytics
- **Industry**: Healthcare, Finance, Education, Marketing
- **Emerging**: Gaming, Robotics, Cybersecurity, E-commerce

## 💰 Monetization Features

- **Featured Listings**: Highlight top AI tools
- **Sponsored Content**: Premium placement options
- **Advertisement System**: Banner ads with targeting
- **Affiliate Integration**: Commission-based referrals
- **Analytics Dashboard**: Revenue and performance tracking

## 🔧 Development

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── netlify/         # Netlify functions
└── dist/            # Built application
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run db:push`: Push database schema
- `npm run check`: TypeScript type checking

### Adding New Features

1. **Database Changes**: Update `shared/schema.ts`
2. **API Routes**: Add to `server/routes.ts`
3. **Frontend**: Create components in `client/src/components`
4. **Admin Features**: Extend `client/src/components/admin-panel.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run check`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Start a GitHub Discussion

## 🌟 Showcase

Perfect for:
- AI tool directories
- SaaS marketplaces
- Product hunt clones
- Review platforms
- Affiliate marketing sites

---

**Built with ❤️ for the AI community**