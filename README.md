# Seu Melhor Cassino (Your Best Casino)

## Project Overview
- **Name**: Seu Melhor Cassino (您的最佳賭場)
- **Goal**: Comprehensive Brazilian online casino review and comparison platform
- **Features**: Multi-language support (PT/EN/ZH), casino comparisons, blog system, player type matching
- **Target Audience**: Brazilian and international online casino players

## URLs
- **Production**: https://your-project.pages.dev (pending deployment)
- **GitHub**: https://github.com/wchenyou/BestAposta
- **Local Development**: http://localhost:3000

## Key Features

### ✅ Completed Features
1. **Multi-Language Support** - Complete PT/EN/ZH translations
2. **12 Brazilian Casinos** - Full information for all major casinos:
   - Betwinner, 22BET, BETANO, BET365, 1xBET
   - Estrela Bet, Blaze, BR4BET, Lottoland
   - Seguro Bet, Bateu Bet, Brazino777
3. **Player Type Matching** - 5 player categories with casino recommendations
4. **Blog System** - Multi-language blog with tabbed editor
5. **Admin Panel** - Complete management interface with:
   - Casino management with logo upload
   - Blog post editor with language tabs
   - Player type management
   - Category management
   - Contact settings
6. **Responsive Design** - Mobile-friendly interface
7. **SEO Optimized** - Proper meta tags and structure

### 🔄 Features In Progress
- None currently

### 📋 Recommended Next Steps
1. **Deploy to Cloudflare Pages** for production
2. **Add more blog content** to improve SEO
3. **Implement user reviews/ratings** system
4. **Add casino comparison tool** for side-by-side comparisons
5. **Integrate analytics** (Google Analytics or similar)
6. **Add newsletter subscription** functionality
7. **Implement affiliate link tracking**

## Data Architecture
- **Database**: Cloudflare D1 (SQLite)
- **Storage Services**: 
  - D1 for relational data (casinos, blog posts, player types)
  - Future: KV for session data, R2 for image storage
- **Data Models**:
  - `casino_info` - Casino details in 3 languages
  - `blog_posts` - Blog articles with multi-language support
  - `blog_categories` - Blog categorization
  - `player_types` - Player categorization
  - `player_type_casinos` - Casino associations
  - `contact_settings` - Site contact information

## Tech Stack
- **Framework**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1
- **Frontend**: Vanilla JS + HTM (Preact) for admin
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Font Awesome
- **Deployment**: Cloudflare Pages
- **Development**: Vite + Wrangler

## User Guide

### For Visitors
1. Browse casinos on the homepage
2. Click "View Details" to see full casino information
3. Use language switcher (PT/EN/ZH) at top right
4. Find casinos by player type in "Player Types" section
5. Read blog articles for tips and guides
6. Click "Play Now" to visit casino sites

### For Administrators
1. Access admin panel at `/admin`
2. Manage casinos, blog posts, and settings
3. Upload casino logos directly in the form
4. Use language tabs for multi-language content
5. Preview changes before publishing

## Development

### Setup
```bash
npm install
npm run build
```

### Local Development
```bash
# Start with PM2
pm2 start ecosystem.config.cjs

# Or use wrangler directly
npm run dev:sandbox
```

### Database Management
```bash
# Apply migrations locally
npm run db:migrate:local

# Reset database
npm run db:reset
```

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Ready for deployment
- **Branch**: master
- **Last Updated**: 2024-01-17

### Deploy Commands
```bash
# Build project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name seu-melhor-cassino
```

## Recent Updates (2024-01-17)
- ✅ Renamed site from "Best Apostas" to "Seu Melhor Cassino"
- ✅ Added complete information for 12 Brazilian casinos
- ✅ Implemented blog system with 3 sample articles
- ✅ Added language tabs to blog editor
- ✅ Added logo upload functionality for casinos
- ✅ Fixed player type associations (no minimum requirement)
- ✅ Updated homepage with new tagline and CTA
- ✅ Added "Play Now" button at bottom of casino pages

## Contact
For questions or support, please contact through the admin panel contact settings.