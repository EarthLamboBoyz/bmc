# BrandMeetCreator MVP - Full Stack

## 📦 What's Included

1. **database-schema.sql** - Complete PostgreSQL schema ready to use
2. **API-DOCUMENTATION.md** - Full REST API documentation
3. **brand-create-campaign-mockup.html** - Interactive campaign creation UI
4. **Project Structure** (below)

## 🚀 Quick Start

### 1. Database Setup
```bash
psql -U postgres -d brandmeetcreator < database-schema.sql
```

### 2. Backend (Node.js + Express)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend (React + TypeScript)
```bash
cd frontend
npm install
npm start
```

## 📁 Recommended Project Structure

```
brandmeetcreator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Campaign.ts
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── campaigns.ts
│   │   │   ├── submissions.ts
│   │   │   └── ...
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── CampaignController.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── RewardCalculationService.ts
│   │   │   ├── AIAllocationService.ts
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── index.ts
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Brand/
│   │   │   │   ├── CampaignForm.tsx
│   │   │   │   ├── RewardBuilder.tsx
│   │   │   │   └── ...
│   │   │   ├── Creator/
│   │   │   │   └── ...
│   │   │   └── Shared/
│   │   ├── pages/
│   │   │   ├── Brand/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── CreateCampaign.tsx
│   │   │   │   └── ...
│   │   │   └── Creator/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
└── database-schema.sql
```

## 🎯 Key Features Implemented

### Database
✅ Complete schema with 12+ tables
✅ Flexible reward system (JSONB configs)
✅ Real-time stats tracking
✅ Triggers for auto-updates
✅ Views for common queries
✅ Sample seed data

### API
✅ RESTful endpoints
✅ JWT authentication
✅ Campaign CRUD
✅ Reward management
✅ AI Auto Allocation
✅ GMV upload system
✅ Leaderboard
✅ Payment tracking

### Reward Templates
✅ Sales Milestones (GMV-based)
✅ Top Volume (Video count)
✅ Streak Bonus (Consecutive days - Random draw)
✅ Lucky Draw (With conditions)
✅ Custom Rewards (iPhone, etc.)

## 💾 Database Key Tables

1. **users** - Brand & Creator accounts
2. **campaigns** - Campaign information
3. **campaign_rewards** - Flexible reward structure
4. **applications** - Creator applications
5. **submissions** - Work submissions
6. **creator_campaign_stats** - Real-time stats
7. **reward_winners** - Final winners
8. **gmv_uploads** - Sales data tracking

## 🤖 AI Features

### AI Auto Allocation
Automatically distributes budget across reward templates based on:
- Campaign type (long-term, short-term, awareness)
- Selected templates
- Industry best practices

Example:
```
Budget: ฿50,000
Templates: Sales + Volume + Streak + Lucky
→ AI suggests: 40% + 30% + 20% + 10%
```

## 🎁 Reward System

### Template 1: Sales Milestones
```json
{
  "criteria": "gmv",
  "tiers": [
    {"rank": 1, "amount": 8000},
    {"rank": 2, "amount": 5000}
  ]
}
```

### Template 2: Top Volume
```json
{
  "criteria": "video_count",
  "tiers": [
    {"rank": 1, "amount": 6000}
  ]
}
```

### Template 3: Streak Bonus (Random)
```json
{
  "criteria": "streak_days",
  "streaks": [
    {"days": 10, "winners": 10, "amount_per_winner": 500}
  ]
}
```

### Template 4: Lucky Draw
```json
{
  "criteria": "random",
  "min_videos": 10,
  "winners": 10,
  "amount_per_winner": 500
}
```

### Template 5: Custom
```json
{
  "criteria": "gmv",
  "condition": "gmv >= 1000000",
  "reward_description": "iPhone 17 Pro",
  "reward_value": 43900
}
```

## 📊 GMV Upload System

Brand uploads CSV from TikTok Affiliate:
```csv
creator_id,creator_name,gmv,orders
uuid1,@creator1,450000,1200
uuid2,@creator2,380000,980
```

System automatically:
1. Updates creator_campaign_stats
2. Recalculates rankings
3. Updates leaderboard
4. Shows real-time dashboard

## 🔐 Security

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- SQL injection prevention (parameterized queries)
- Rate limiting
- Input validation

## 📱 Responsive Design

- Desktop-first (1226px+)
- Tablet (768px - 1225px)
- Mobile (< 768px)
- Sidebar navigation
- Hamburger menu on mobile

## 🚀 Next Steps

1. Copy all files to your project
2. Set up PostgreSQL database
3. Initialize Node.js backend
4. Set up React frontend
5. Configure environment variables
6. Run migrations
7. Start development servers

## 📞 Support

For questions or issues, refer to:
- database-schema.sql (comments in code)
- API-DOCUMENTATION.md (full API reference)
- Mock-up HTML files (UI examples)

---

Built with ❤️ for BrandMeetCreator
