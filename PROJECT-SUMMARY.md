# BrandMeetCreator - Project Summary

## 📋 Project Overview

**Project Name:** BrandMeetCreator  
**Type:** Two-Sided SaaS Marketplace  
**Purpose:** Connect Brands with Creators/Influencers for campaign collaborations  
**Target Market:** Thailand (Thai language)  
**Platform:** Web (Desktop + Mobile Responsive)

---

## 🎯 Core Concept

A platform where:
- **Brands** create campaigns and recruit creators
- **Creators** apply to campaigns, submit work, and earn rewards
- **System** tracks performance, manages rewards, and processes payments

---

## 👥 User Types

### 1. Brand (แบรนด์)
- Create campaigns
- Set budgets and requirements
- Review submissions
- Upload GMV data
- Manage rewards and payments

### 2. Creator (ครีเอเตอร์)
- Browse and apply to campaigns
- Submit work (videos + links)
- Track performance
- Earn rewards
- View earnings

---

## 🎪 Campaign Types

### Type 1: Single Campaign
- One-time submission
- Fixed deadline
- Simple reward structure

### Type 2: Challenge Campaign (Focus)
- **365-day continuous challenge**
- Daily submissions required
- Complex reward structure with:
  - Daily rewards
  - Milestone bonuses
  - Streak bonuses
  - Leaderboard rankings
  - Special prizes

**Primary Example:** "สามสิบ ตรา คุณสัมฤทธิ์" - 365 วัน Challenge

---

## 💰 Reward System (Key Feature)

### Payment Timing
- **All rewards paid AFTER campaign ends**
- Calculation: 1-2 days after campaign completion
- Payment: 3-5 days after calculation
- **NO daily payments**

### Reward Templates (5 Types)

#### 1. Sales Milestones 💰
```json
{
  "type": "sales_milestone",
  "criteria": "gmv",
  "tiers": [
    {"rank": 1, "amount": 8000},
    {"rank": 2, "amount": 5000},
    {"rank": 3, "amount": 3000},
    {"rank": 4, "amount": 2000},
    {"rank": 5, "amount": 2000}
  ]
}
```
- Based on GMV (Gross Merchandise Value)
- Top 5 performers
- Upload sales data via CSV

#### 2. Top Volume 📹
```json
{
  "type": "top_volume",
  "criteria": "video_count",
  "tiers": [
    {"rank": 1, "amount": 6000},
    {"rank": 2, "amount": 4000},
    {"rank": 3, "amount": 1500},
    {"rank": 4, "amount": 1500},
    {"rank": 5, "amount": 1500}
  ]
}
```
- Based on number of approved videos
- Top 5 performers
- Auto-tracked by system

#### 3. Streak Bonus 🔥 (Random Draw Only)
```json
{
  "type": "streak_bonus",
  "criteria": "streak_days",
  "streaks": [
    {"days": 10, "winners": 10, "amount_per_winner": 500},
    {"days": 20, "winners": 5, "amount_per_winner": 1000}
  ]
}
```
- Submit videos X days consecutively
- **Random draw from qualified participants**
- NOT "everyone who qualifies"
- System tracks streaks automatically

#### 4. Lucky Draw 🎲
```json
{
  "type": "lucky_draw",
  "criteria": "random",
  "min_videos": 10,
  "winners": 10,
  "amount_per_winner": 500,
  "method": "equal" // or "per_video"
}
```
- Random draw with conditions
- Options:
  - Equal chance (1 person = 1 ticket)
  - Per video (1 video = 1 ticket)
  - Minimum videos required

#### 5. Custom Reward 🎁
```json
{
  "type": "custom",
  "criteria": "gmv",
  "condition": "gmv >= 1000000",
  "reward_description": "iPhone 17 Pro 256GB",
  "reward_value": 43900,
  "quantity": 1
}
```
- Physical rewards (iPhone, gadgets, etc.)
- Conditional (GMV/videos/streak)
- Or Top Ranking
- Not counted in budget

---

## 🤖 AI Auto Allocation

### Feature
When Brand sets total budget, AI automatically:
1. Distributes budget across selected templates
2. Calculates optimal percentages
3. Suggests tier amounts
4. Provides reasoning

### Algorithm
```
Campaign Type: Long-term (365 days)
Selected: Sales + Volume + Streak + Lucky

AI Suggests:
- Sales: 40% (Most important for ROI)
- Volume: 30% (Awareness building)
- Streak: 20% (Maintain continuity)
- Lucky: 10% (Consolation prizes)
```

### Example
```
Budget: ฿50,000
→ Sales: ฿20,000 (Top 5: 8K/5K/3K/2K/2K)
→ Volume: ฿15,000 (Top 5: 6K/4K/1.5K/1.5K/1.5K)
→ Streak: ฿10,000 (10 days: 10×500, 20 days: 5×1000)
→ Lucky: ฿5,000 (10 winners × 500)
```

---

## 📊 GMV Upload System

### Purpose
Track sales performance for Sales Milestones rewards

### Process
1. Brand exports CSV from TikTok Affiliate Dashboard
2. Brand uploads CSV to platform
3. System parses and updates creator stats
4. Real-time leaderboard updates
5. Rankings auto-calculated

### CSV Format
```csv
creator_id,creator_name,gmv,orders,last_updated
uuid1,@beauty_sara,450000,1200,2026-01-27
uuid2,@skincare_lover,380000,980,2026-01-27
```

---

## 🗂️ Key Database Tables

### Core Tables
1. **users** - All users (Brand + Creator)
2. **brand_profiles** - Brand information
3. **creator_profiles** - Creator information + social accounts
4. **campaigns** - Campaign details
5. **campaign_rewards** - Flexible reward configs (JSONB)
6. **applications** - Creator applications to campaigns
7. **submissions** - Work submissions
8. **creator_campaign_stats** - Real-time performance stats
9. **reward_winners** - Final calculated winners
10. **payments** - Payment tracking
11. **gmv_uploads** - Sales data uploads
12. **notifications** - User notifications

### Key Features
- JSONB for flexible reward configs
- Triggers for auto-updates
- Views for common queries
- Real-time stats tracking

---

## 🎨 UI/UX Design Decisions

### Navigation
- **Desktop:** Fixed sidebar (left side)
- **Mobile:** Hamburger menu
- Top bar with logo + user profile
- No popups for campaign details (full page navigation)

### Design System
- Modern gradient design
- Purple/Pink primary colors
- Clean, professional interface
- Smooth animations
- Responsive grid layouts

### Key Screens

#### Brand Dashboard
```
├─ 📊 Dashboard (Overview stats)
├─ 🏢 แคมเปญ
│  ├─ ทั้งหมด
│  ├─ กำลังดำเนินการ (with badge count)
│  ├─ จบแล้ว
│  └─ สร้างใหม่
├─ 👥 Creators
│  ├─ ทั้งหมด
│  ├─ รอตรวจสอบ (with badge count)
│  └─ Leaderboard
├─ 💰 การเงิน
│  ├─ งบประมาณ
│  └─ ประวัติการจ่าย
└─ ⚙️ ตั้งค่า
```

#### Creator Dashboard
```
├─ 📊 Dashboard (Overview + Streak)
├─ 🔍 หาแคมเปญ
│  ├─ ทั้งหมด
│  ├─ แนะนำ
│  └─ Challenge
├─ 📋 แคมเปญของฉัน
│  ├─ กำลังทำ
│  ├─ รออนุมัติ
│  ├─ ส่งงานแล้ว
│  └─ เสร็จแล้ว
├─ 💰 รายได้
│  ├─ สรุป
│  ├─ ประวัติ
│  └─ ถอนเงิน
├─ 👤 โปรไฟล์
└─ ⚙️ ตั้งค่า
```

---

## 🔄 User Flows

### Brand Flow: Create Campaign
1. Dashboard → Create Campaign
2. Fill basic info (title, description, dates, requirements)
3. Set total budget
4. Choose reward templates OR use AI Auto Allocation
5. Configure each reward tier/amount
6. Review summary
7. Publish campaign

### Creator Flow: Join & Submit
1. Browse campaigns
2. View campaign details + rewards
3. Check eligibility
4. Apply to campaign
5. Wait for approval
6. Submit work daily (video URL + promo code link)
7. Track streak + stats
8. View potential rewards
9. Receive payment after campaign ends

### Brand Flow: Review Submissions
1. Campaign Dashboard → Submissions tab
2. View pending submissions
3. Check video + performance
4. Approve / Reject / Request Revision
5. System updates creator stats automatically

### Brand Flow: Upload GMV & Calculate Rewards
1. Campaign ends
2. Upload GMV CSV
3. System updates leaderboard
4. Click "Calculate Rewards"
5. System determines all winners
6. Review winners list
7. Announce winners (sends notifications)
8. Process payments

---

## 📱 Content Guidelines Feature

Brands can provide content structure to creators:

### 5-Step Framework (Optional)
1. **Hook** - เปิดเรื่อง หยุดนิ้ว
2. **Story** - เล่าประสบการณ์จริง
3. **Product Intro** - แนะนำสินค้า
4. **Result** - แสดงผลลัพธ์
5. **CTA** - ชวนให้ลอง

### Do's and Don'ts
```
✅ สิ่งที่ควรพูด:
- ดูแลผิวทั้งในและนอก
- ผิวพิงจากข้างใน

❌ สิ่งที่ไม่ควรพูด:
- ผิวไม่สม่ำเสมอ โทรมง่าย
- เน้นข้างในแค่ตัวเดียว
```

### Required Hashtags
```
#ปจด #สามสิบคุณสัมฤทธิ์ #วันนี้นของเดือน
```

---

## 🔍 Real-World Campaign Examples Analyzed

### 1. Shining (ภาพที่ 1)
- Tiered sales commission
- 30K → 1K, 50K → 1.9K, up to 800K+ → 40K

### 2. Mrs.wow (ภาพที่ 2)
- 15% commission + milestone bonuses
- 50/100/150 videos → 2K/3.5K/5K

### 3. Venera Skin (ภาพที่ 3)
- Sales milestones with physical rewards
- 10K → cash, 30K → Starbucks, 50K → DIOR lip

### 4. Chuti (ภาพที่ 4)
- 15% commission + GMV MAX 5%
- Sales milestones: 500K/300K/100K/50K

### 5. MABEL ORGANIC (ภาพที่ 5)
- 30% commission + GMV MAX 10-15%
- Same structure as Chuti

### 6. NutriFlow (ภาพที่ 6)
- 3% commission
- Sales milestones up to 1M → 60K bonus

### 7. ALP Kids (ภาพที่ 7)
- 3% commission
- Video milestones: 20/30/50 videos

### 8. RECap (ภาพที่ 8)
- 20% commission
- Sales: 1M → iPhone, 500K → 5K cash
- Videos: 30/60/100 → bonuses

### Key Insights
- Most campaigns: 15-20% commission
- Hybrid model (commission + bonuses) is most effective
- Sales-based rewards need GMV tracking system
- Video-based rewards are simpler to implement

---

## 🚀 Technology Stack (Recommended)

### Frontend
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit or Zustand
- **Forms:** React Hook Form
- **Charts:** Recharts or Chart.js
- **HTTP:** Axios
- **Routing:** React Router

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** Zod or Joi
- **File Upload:** Multer
- **CSV Parser:** PapaParse

### Database
- **Primary:** PostgreSQL 14+
- **Extensions:** uuid-ossp, pgcrypto
- **Hosting:** Railway / Supabase / Neon

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway / Render
- **Database:** Railway / Supabase
- **File Storage:** Cloudflare R2 / AWS S3

### Development Tools
- **Code Editor:** VS Code
- **API Testing:** Postman / Thunder Client
- **Git:** GitHub
- **CI/CD:** GitHub Actions

---

## 📁 Project File Structure

```
brandmeetcreator/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Brand/
│   │   │   │   ├── CampaignForm/
│   │   │   │   ├── RewardBuilder/
│   │   │   │   ├── SubmissionReview/
│   │   │   │   └── Dashboard/
│   │   │   ├── Creator/
│   │   │   │   ├── CampaignBrowser/
│   │   │   │   ├── SubmissionForm/
│   │   │   │   ├── StatsDisplay/
│   │   │   │   └── Dashboard/
│   │   │   └── Shared/
│   │   │       ├── Sidebar/
│   │   │       ├── Navbar/
│   │   │       ├── Card/
│   │   │       └── Modal/
│   │   ├── pages/
│   │   │   ├── Brand/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── CreateCampaign.tsx
│   │   │   │   ├── CampaignDetail.tsx
│   │   │   │   ├── Applications.tsx
│   │   │   │   ├── Submissions.tsx
│   │   │   │   └── Leaderboard.tsx
│   │   │   ├── Creator/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── BrowseCampaigns.tsx
│   │   │   │   ├── CampaignDetail.tsx
│   │   │   │   ├── MyCampaigns.tsx
│   │   │   │   └── Earnings.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   └── Landing.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCampaign.ts
│   │   │   └── useRewards.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── campaign.service.ts
│   │   │   └── reward.service.ts
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   └── campaignSlice.ts
│   │   ├── types/
│   │   │   ├── campaign.types.ts
│   │   │   ├── reward.types.ts
│   │   │   └── user.types.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimit.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Campaign.ts
│   │   │   ├── Reward.ts
│   │   │   └── Submission.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── campaigns.routes.ts
│   │   │   ├── rewards.routes.ts
│   │   │   ├── submissions.routes.ts
│   │   │   ├── gmv.routes.ts
│   │   │   └── payments.routes.ts
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── CampaignController.ts
│   │   │   ├── RewardController.ts
│   │   │   ├── SubmissionController.ts
│   │   │   ├── GMVController.ts
│   │   │   └── PaymentController.ts
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   ├── CampaignService.ts
│   │   │   ├── RewardCalculationService.ts
│   │   │   ├── AIAllocationService.ts
│   │   │   ├── GMVUploadService.ts
│   │   │   ├── NotificationService.ts
│   │   │   └── PaymentService.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   ├── csvParser.ts
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/
│   ├── API-DOCUMENTATION.md
│   ├── DATABASE-SCHEMA.md
│   ├── PROJECT-SUMMARY.md
│   ├── REWARD-SYSTEM.md
│   └── DEPLOYMENT.md
│
├── database/
│   └── schema.sql
│
├── demo/
│   └── brandmeetcreator-demo-complete.html
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🎯 MVP Features (Phase 1)

### Must Have
✅ User authentication (Brand + Creator)  
✅ Campaign CRUD  
✅ 5 Reward Templates  
✅ AI Auto Allocation  
✅ Application system  
✅ Submission system  
✅ GMV Upload  
✅ Streak tracking  
✅ Reward calculation  
✅ Leaderboard  
✅ Dashboard (both roles)  
✅ Payment tracking  

### Should Have (Phase 2)
⏳ Email notifications  
⏳ Advanced analytics  
⏳ Multi-language support  
⏳ Mobile app  
⏳ Payment gateway integration  
⏳ TikTok API integration  
⏳ Advanced filters  

### Could Have (Phase 3)
⏳ Creator portfolio  
⏳ Brand verification  
⏳ Campaign templates  
⏳ AI content suggestions  
⏳ Performance predictions  

---

## 🔐 Security Considerations

### Authentication
- JWT tokens with expiry
- Refresh token mechanism
- Password hashing (bcrypt)
- Email verification

### Authorization
- Role-based access control (RBAC)
- Resource ownership checks
- API rate limiting

### Data Protection
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens
- Input validation and sanitization
- File upload restrictions

### Privacy
- GDPR compliance considerations
- Data encryption at rest
- Secure API communication (HTTPS)

---

## 📊 Key Metrics to Track

### Platform Metrics
- Total campaigns created
- Total creators registered
- Total GMV processed
- Total rewards distributed

### Campaign Metrics
- Application rate
- Approval rate
- Submission completion rate
- Average streak length
- Drop-off points

### Creator Metrics
- Earnings per campaign
- Approval rate
- Average streak
- Platform loyalty

### Brand Metrics
- Campaign ROI
- Creator engagement
- Cost per submission
- Repeat campaign rate

---

## 💡 Business Model

### Revenue Streams (Future)
1. **Platform Fee:** 5-10% of campaign budget
2. **Premium Features:** Advanced analytics, priority support
3. **Subscription:** Monthly plans for brands
4. **Featured Campaigns:** Promoted listings
5. **API Access:** For large enterprises

### Current Phase
- **MVP:** Free for both parties
- **Focus:** Product-market fit
- **Goal:** 100+ campaigns, 1000+ creators

---

## 🎓 Learning from Real Campaigns

### What Works
✅ Hybrid rewards (commission + bonuses)  
✅ Multiple reward tiers  
✅ Physical prizes (iPhone, etc.)  
✅ Random draws for engagement  
✅ Streak bonuses for continuity  

### What to Avoid
❌ Complex commission calculations  
❌ Daily payments (too much overhead)  
❌ Unclear reward conditions  
❌ Manual ranking (use auto-calculation)  

---

## 📝 Next Steps for Development

### Immediate (Week 1-2)
1. Set up project structure
2. Initialize Git repository
3. Set up PostgreSQL database
4. Run database migrations
5. Create basic API endpoints
6. Build authentication system

### Short-term (Week 3-4)
1. Implement campaign CRUD
2. Build reward system
3. Create submission flow
4. Implement GMV upload
5. Build dashboards

### Medium-term (Month 2)
1. Add AI allocation
2. Implement payment tracking
3. Build notification system
4. Add analytics
5. Polish UI/UX

### Long-term (Month 3+)
1. Beta testing
2. Bug fixes
3. Performance optimization
4. Marketing site
5. Launch

---

## 🤝 Team Roles Needed

### Technical
- **Full-stack Developer** (2-3 people)
- **UI/UX Designer** (1 person)
- **QA Tester** (1 person)

### Business
- **Product Manager**
- **Marketing Lead**
- **Customer Support**

---

## 📞 Support & Resources

### Documentation
- Database Schema (schema.sql)
- API Documentation (API-DOCUMENTATION.md)
- This Project Summary
- Interactive Demo (HTML)

### External Resources
- PostgreSQL Docs
- Express.js Docs
- React Docs
- Tailwind CSS Docs

---

## ✅ Success Criteria

### Technical Success
- Platform uptime > 99%
- API response time < 500ms
- Zero data loss
- Secure authentication

### Business Success
- 100+ active campaigns in 6 months
- 1000+ registered creators
- 80%+ creator satisfaction
- 90%+ brand satisfaction

---

**Last Updated:** 2026-01-30  
**Version:** 1.0  
**Status:** Ready for Development
