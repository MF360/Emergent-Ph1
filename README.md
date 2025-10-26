# Dr MF - Investor CRM & AI Analysis

A production-ready MVP for Mutual Fund Distributors (MFDs) providing a Zoho-style CRM dashboard and AI-powered portfolio analysis.

## Features

### 1. Authentication
- Email/password sign up and login
- JWT-based authentication
- Password reset functionality (mocked for demo)
- Role-based access (MFD role)

### 2. Investor CRM
- **Dashboard**: View total investors, KYC pending, total AUM, and AI analyses count
- **Investor Management**: 
  - View all investors in table format
  - Filter by KYC status, risk profile, and city
  - Global search across name, ARN, email, folio
  - View detailed investor profiles
  - CRUD operations for investor data
- **CSV Import**: Upload bulk investor data with column mapping
- **Seed Data**: 50 realistic dummy investors pre-populated on first signup

### 3. AI Analysis Module
Two demo analyses available:
- **Risk Summary**: Analyzes investor risk profile, KYC status, and identifies red flags
- **Investment Allocation Check**: Reviews portfolio allocation and diversification

**AI Modes**:
- **Mock AI** (default): Uses rule-based analysis for demonstration
- **Live AI**: Uses GPT-4o-mini via Emergent Universal Key for real analysis

**Features**:
- Select multiple investors for batch analysis
- View executive summary, action items, and risk alerts
- Download analysis reports as PDF
- View analysis history

### 4. Settings
- Feature flag management (toggle live AI, CSV import)
- Seed data regeneration
- API documentation for third-party integrations

## Tech Stack

- **Backend**: FastAPI (Python) with Motor (async MongoDB driver)
- **Frontend**: React 19 with Tailwind CSS + shadcn/ui components
- **Database**: MongoDB
- **AI Integration**: Emergent LLM Universal Key (OpenAI GPT-4o-mini)
- **PDF Generation**: ReportLab

## Getting Started

### First Time Setup

1. **Sign Up**: Create an account at the signup page
   - 50 dummy investors will be automatically seeded on first signup
   
2. **Login**: Use your credentials to access the dashboard

## Environment Configuration

### Backend (.env)
```bash
MONGO_URL=\"mongodb://localhost:27017\"
DB_NAME=\"drmf_crm\"
CORS_ORIGINS=\"*\"
EMERGENT_LLM_KEY=sk-emergent-bD2B8B2BcAbEdBb583
JWT_SECRET=drmf_secret_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

## Switching to Real LLM

### Option 1: Using Emergent Universal Key (Current Setup)
The app is already configured with the Emergent Universal Key. To enable:
1. Go to Settings page
2. Toggle \"Use Live AI\" to ON
3. Run an analysis from the AI Analysis page

### Option 2: Using Your Own OpenAI Key
1. Update `EMERGENT_LLM_KEY` in `/app/backend/.env` with your OpenAI API key
2. Restart backend: `sudo supervisorctl restart backend`
3. Go to Settings and enable \"Use Live AI\"

### Option 3: Using Other LLM Providers
The app uses `emergentintegrations` library which supports:
- **OpenAI**: gpt-4o, gpt-4o-mini, gpt-5, etc.
- **Anthropic**: claude-3-5-sonnet, claude-4-sonnet, etc.
- **Google**: gemini-2.0-flash, gemini-2.5-pro, etc.

To switch providers, modify `/app/backend/server.py` around line 452 in run_live_analysis function.

## Seed Data Management

### Regenerate Seed Data
1. Go to Settings page
2. Click \"Regenerate Seed Data\"
3. Confirm the action (this will delete all existing investors)
4. 50 new dummy investors will be created

### Customize Seed Data
Edit `/app/backend/server.py` function `generate_seed_investors()` to modify seed data generation.

## API Documentation

All REST API endpoints require Bearer token authentication:
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

Key endpoints:
- `GET /api/investors` - List all investors
- `POST /api/analysis/run` - Run AI analysis
- `GET /api/dashboard/stats` - Get dashboard statistics

Full API documentation is available in the Settings page of the application.

## Deployment

### Custom Domain Setup
To connect a custom domain, add a CNAME record in your DNS provider pointing to your Emergent app URL.

## Troubleshooting

### Backend not starting
1. Check logs: `tail -n 100 /var/log/supervisor/backend.err.log`
2. Verify MongoDB is running
3. Check environment variables

### AI Analysis not working
1. Verify `EMERGENT_LLM_KEY` is set
2. Check if \"Use Live AI\" is enabled in Settings
3. Review backend logs for API errors

## Support

For issues or questions, refer to the Emergent platform documentation.
