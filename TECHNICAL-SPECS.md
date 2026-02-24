# Technical Specifications

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│  React Frontend │
│  (Vercel)       │
└────────┬────────┘
         │ REST API
         │
┌────────▼────────┐
│  Express API    │
│  (Railway)      │
└────────┬────────┘
         │ SQL
         │
┌────────▼────────┐
│  PostgreSQL     │
│  (Railway)      │
└─────────────────┘
```

---

## 📦 Tech Stack Details

### Frontend

**Framework:** React 18.2+ with TypeScript 5.0+
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.0.0"
}
```

**UI/Styling:**
```json
{
  "tailwindcss": "^3.4.0",
  "@headlessui/react": "^1.7.0",
  "framer-motion": "^10.16.0"
}
```

**State Management:**
```json
{
  "zustand": "^4.4.0"
}
```

**Forms & Validation:**
```json
{
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0"
}
```

**Data Fetching:**
```json
{
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.8.0"
}
```

**Charts & Visualization:**
```json
{
  "recharts": "^2.10.0"
}
```

**Date/Time:**
```json
{
  "date-fns": "^2.30.0"
}
```

**CSV Parsing:**
```json
{
  "papaparse": "^5.4.0",
  "@types/papaparse": "^5.3.0"
}
```

---

### Backend

**Framework:** Express.js with TypeScript
```json
{
  "express": "^4.18.0",
  "typescript": "^5.0.0",
  "@types/express": "^4.17.0",
  "@types/node": "^20.0.0"
}
```

**Database:**
```json
{
  "pg": "^8.11.0",
  "pg-hstore": "^2.3.0"
}
```

**ORM (Optional):**
```json
{
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0"
}
```

**Authentication:**
```json
{
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "@types/jsonwebtoken": "^9.0.0",
  "@types/bcrypt": "^5.0.0"
}
```

**Validation:**
```json
{
  "joi": "^17.11.0",
  "express-validator": "^7.0.0"
}
```

**File Upload:**
```json
{
  "multer": "^1.4.0",
  "@types/multer": "^1.4.0"
}
```

**CSV Processing:**
```json
{
  "csv-parse": "^5.5.0",
  "papaparse": "^5.4.0"
}
```

**Security:**
```json
{
  "helmet": "^7.1.0",
  "cors": "^2.8.0",
  "express-rate-limit": "^7.1.0"
}
```

**Environment:**
```json
{
  "dotenv": "^16.3.0"
}
```

**Development:**
```json
{
  "nodemon": "^3.0.0",
  "ts-node": "^10.9.0"
}
```

---

## 🗄️ Database Schema Implementation

### Using Prisma (Recommended)

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  brand
  creator
}

enum VerificationStatus {
  pending
  verified
  rejected
}

enum CampaignStatus {
  draft
  live
  completed
  cancelled
}

enum CampaignType {
  single
  challenge
}

enum ApplicationStatus {
  pending
  approved
  rejected
}

enum SubmissionStatus {
  pending
  approved
  rejected
}

enum RewardType {
  sales_milestone
  top_volume
  streak_bonus
  lucky_draw
  custom
}

enum RewardWinnerStatus {
  pending
  announced
  paid
}

enum PaymentStatus {
  pending
  processing
  paid
  failed
}

model User {
  id                 String              @id @default(uuid())
  email              String              @unique
  passwordHash       String              @map("password_hash")
  role               UserRole
  name               String
  profileImage       String?             @map("profile_image")
  emailVerified      Boolean             @default(false) @map("email_verified")
  verificationStatus VerificationStatus  @default(pending) @map("verification_status")
  createdAt          DateTime            @default(now()) @map("created_at")
  updatedAt          DateTime            @updatedAt @map("updated_at")
  lastLoginAt        DateTime?           @map("last_login_at")

  brandProfile   BrandProfile?
  creatorProfile CreatorProfile?
  campaigns      Campaign[]
  applications   Application[]
  submissions    Submission[]
  stats          CreatorCampaignStats[]
  rewards        RewardWinner[]
  payments       Payment[]
  notifications  Notification[]

  @@map("users")
}

model BrandProfile {
  id          String   @id @default(uuid())
  userId      String   @unique @map("user_id")
  companyName String   @map("company_name")
  companyLogo String?  @map("company_logo")
  industry    String?
  website     String?
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("brand_profiles")
}

model CreatorProfile {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")
  platforms       Json     @default("[]")
  followers       Int      @default(0)
  categories      Json     @default("[]")
  bio             String?
  bankAccountInfo Json?    @map("bank_account_info")
  tiktokHandle    String?  @map("tiktok_handle")
  instagramHandle String?  @map("instagram_handle")
  youtubeHandle   String?  @map("youtube_handle")
  facebookHandle  String?  @map("facebook_handle")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("creator_profiles")
}

model Campaign {
  id                    String         @id @default(uuid())
  brandId               String         @map("brand_id")
  title                 String
  description           String
  imageUrl              String?        @map("image_url")
  budget                Decimal        @db.Decimal(12, 2)
  maxCreators           Int            @map("max_creators")
  currentCreators       Int            @default(0) @map("current_creators")
  requiredFollowers     Int            @default(0) @map("required_followers")
  platforms             Json           @default("[]")
  categories            Json           @default("[]")
  startDate             DateTime       @map("start_date") @db.Date
  endDate               DateTime       @map("end_date") @db.Date
  announcementDate      DateTime?      @map("announcement_date") @db.Date
  campaignType          CampaignType   @default(single) @map("campaign_type")
  durationDays          Int?           @map("duration_days")
  submissionFrequency   String?        @map("submission_frequency")
  contentGuidelines     Json?          @map("content_guidelines")
  status                CampaignStatus @default(draft)
  createdAt             DateTime       @default(now()) @map("created_at")
  updatedAt             DateTime       @updatedAt @map("updated_at")
  publishedAt           DateTime?      @map("published_at")
  completedAt           DateTime?      @map("completed_at")

  brand        User                   @relation(fields: [brandId], references: [id], onDelete: Cascade)
  rewards      CampaignReward[]
  applications Application[]
  submissions  Submission[]
  stats        CreatorCampaignStats[]
  winners      RewardWinner[]
  payments     Payment[]
  gmvUploads   GmvUpload[]

  @@map("campaigns")
}

model CampaignReward {
  id          String     @id @default(uuid())
  campaignId  String     @map("campaign_id")
  rewardOrder Int        @map("reward_order")
  rewardType  RewardType @map("reward_type")
  rewardName  String?    @map("reward_name")
  config      Json
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  campaign Campaign       @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  winners  RewardWinner[]

  @@map("campaign_rewards")
}

model Application {
  id         String            @id @default(uuid())
  campaignId String            @map("campaign_id")
  creatorId  String            @map("creator_id")
  status     ApplicationStatus @default(pending)
  message    String?
  appliedAt  DateTime          @default(now()) @map("applied_at")
  reviewedAt DateTime?         @map("reviewed_at")
  reviewedBy String?           @map("reviewed_by")

  campaign    Campaign     @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  creator     User         @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  submissions Submission[]

  @@unique([campaignId, creatorId])
  @@map("applications")
}

model Submission {
  id                String           @id @default(uuid())
  applicationId     String           @map("application_id")
  campaignId        String           @map("campaign_id")
  creatorId         String           @map("creator_id")
  videoUrl          String           @map("video_url")
  promoCodeUrl      String?          @map("promo_code_url")
  description       String?
  submissionNumber  Int              @default(1) @map("submission_number")
  submissionDate    DateTime         @default(now()) @map("submission_date") @db.Date
  isOnStreak        Boolean          @default(true) @map("is_on_streak")
  status            SubmissionStatus @default(pending)
  reviewedAt        DateTime?        @map("reviewed_at")
  reviewedBy        String?          @map("reviewed_by")
  rejectionReason   String?          @map("rejection_reason")
  submittedAt       DateTime         @default(now()) @map("submitted_at")
  updatedAt         DateTime         @updatedAt @map("updated_at")

  application Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  campaign    Campaign    @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  creator     User        @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@map("submissions")
}

model CreatorCampaignStats {
  id                   String    @id @default(uuid())
  campaignId           String    @map("campaign_id")
  creatorId            String    @map("creator_id")
  totalSubmissions     Int       @default(0) @map("total_submissions")
  approvedSubmissions  Int       @default(0) @map("approved_submissions")
  currentStreak        Int       @default(0) @map("current_streak")
  longestStreak        Int       @default(0) @map("longest_streak")
  gmv                  Decimal   @default(0) @map("gmv") @db.Decimal(12, 2)
  orders               Int       @default(0)
  lastGmvUpdate        DateTime? @map("last_gmv_update")
  totalViews           BigInt    @default(0) @map("total_views")
  totalLikes           BigInt    @default(0) @map("total_likes")
  totalComments        BigInt    @default(0) @map("total_comments")
  totalShares          BigInt    @default(0) @map("total_shares")
  milestonesAchieved   Json      @default("[]") @map("milestones_achieved")
  currentRank          Int?      @map("current_rank")
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  creator  User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@unique([campaignId, creatorId])
  @@map("creator_campaign_stats")
}

model RewardWinner {
  id                   String              @id @default(uuid())
  campaignId           String              @map("campaign_id")
  rewardId             String              @map("reward_id")
  creatorId            String              @map("creator_id")
  rewardType           RewardType          @map("reward_type")
  rewardDescription    String?             @map("reward_description")
  amount               Decimal?            @db.Decimal(12, 2)
  customRewardDetails  Json?               @map("custom_reward_details")
  criteriaValue        Json?               @map("criteria_value")
  status               RewardWinnerStatus  @default(pending)
  announcedAt          DateTime?           @map("announced_at")
  paidAt               DateTime?           @map("paid_at")
  createdAt            DateTime            @default(now()) @map("created_at")
  updatedAt            DateTime            @updatedAt @map("updated_at")

  campaign Campaign       @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  reward   CampaignReward @relation(fields: [rewardId], references: [id], onDelete: Cascade)
  creator  User           @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@map("reward_winners")
}

model Payment {
  id               String        @id @default(uuid())
  campaignId       String        @map("campaign_id")
  creatorId        String        @map("creator_id")
  amount           Decimal       @db.Decimal(12, 2)
  description      String?
  rewardWinnerIds  Json?         @map("reward_winner_ids")
  status           PaymentStatus @default(pending)
  createdAt        DateTime      @default(now()) @map("created_at")
  processedAt      DateTime?     @map("processed_at")
  paidAt           DateTime?     @map("paid_at")
  paymentMethod    String?       @map("payment_method")
  transactionId    String?       @map("transaction_id")
  paymentReference String?       @map("payment_reference")

  campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  creator  User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model GmvUpload {
  id           String    @id @default(uuid())
  campaignId   String    @map("campaign_id")
  uploadedBy   String    @map("uploaded_by")
  fileName     String    @map("file_name")
  fileUrl      String?   @map("file_url")
  totalCreators Int?     @map("total_creators")
  totalGmv     Decimal?  @map("total_gmv") @db.Decimal(12, 2)
  totalOrders  Int?      @map("total_orders")
  processed    Boolean   @default(false)
  errorMessage String?   @map("error_message")
  uploadedAt   DateTime  @default(now()) @map("uploaded_at")
  processedAt  DateTime? @map("processed_at")

  campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  @@map("gmv_uploads")
}

model Notification {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  type         String
  title        String
  message      String
  campaignId   String?  @map("campaign_id")
  submissionId String?  @map("submission_id")
  read         Boolean  @default(false)
  readAt       DateTime? @map("read_at")
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=BrandMeetCreator
```

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/brandmeetcreator

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Future)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
```

---

## 📁 API Endpoint Structure

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Campaigns
```
GET    /api/v1/campaigns
POST   /api/v1/campaigns
GET    /api/v1/campaigns/:id
PATCH  /api/v1/campaigns/:id
DELETE /api/v1/campaigns/:id
POST   /api/v1/campaigns/:id/publish
POST   /api/v1/campaigns/:id/complete
GET    /api/v1/campaigns/:id/dashboard
```

### Rewards
```
POST   /api/v1/campaigns/:id/rewards
PUT    /api/v1/campaigns/:id/rewards/:rewardId
DELETE /api/v1/campaigns/:id/rewards/:rewardId
POST   /api/v1/campaigns/:id/rewards/ai-allocate
POST   /api/v1/campaigns/:id/calculate-rewards
GET    /api/v1/campaigns/:id/winners
```

### Applications
```
POST   /api/v1/campaigns/:id/apply
GET    /api/v1/campaigns/:id/applications
PATCH  /api/v1/applications/:id/approve
PATCH  /api/v1/applications/:id/reject
```

### Submissions
```
POST   /api/v1/campaigns/:id/submissions
GET    /api/v1/campaigns/:id/submissions
GET    /api/v1/submissions/:id
PATCH  /api/v1/submissions/:id/approve
PATCH  /api/v1/submissions/:id/reject
```

### GMV
```
POST   /api/v1/campaigns/:id/gmv/upload
GET    /api/v1/campaigns/:id/gmv
GET    /api/v1/campaigns/:id/gmv/template
```

### Leaderboard
```
GET    /api/v1/campaigns/:id/leaderboard
GET    /api/v1/campaigns/:id/my-stats
```

---

## 🎯 Key Service Implementations

### AIAllocationService.ts
```typescript
interface AllocationInput {
  budget: number;
  templates: string[];
  campaignType: 'long-term' | 'short-term' | 'awareness';
}

export class AIAllocationService {
  static allocate(input: AllocationInput) {
    const ratios = this.getRatios(input.campaignType);
    const allocation = {};
    
    input.templates.forEach(template => {
      if (template !== 'custom') {
        allocation[template] = this.distributeTemplate(
          template,
          input.budget * ratios[template]
        );
      }
    });
    
    return {
      allocation,
      reasoning: this.generateReasoning(input.campaignType)
    };
  }
}
```

### RewardCalculationService.ts
```typescript
export class RewardCalculationService {
  static async calculateAllRewards(campaignId: string) {
    const campaign = await this.getCampaignWithRewards(campaignId);
    const winners = [];
    
    for (const reward of campaign.rewards) {
      const rewardWinners = await this.calculateReward(reward);
      winners.push(...rewardWinners);
    }
    
    return winners;
  }
  
  private static async calculateReward(reward: CampaignReward) {
    switch (reward.rewardType) {
      case 'sales_milestone':
        return this.calculateSalesMilestones(reward);
      case 'top_volume':
        return this.calculateTopVolume(reward);
      case 'streak_bonus':
        return this.calculateStreakBonus(reward);
      case 'lucky_draw':
        return this.calculateLuckyDraw(reward);
      default:
        return [];
    }
  }
}
```

### StreakTrackingService.ts
```typescript
export class StreakTrackingService {
  static async updateStreak(submission: Submission) {
    const stats = await this.getCreatorStats(
      submission.campaignId,
      submission.creatorId
    );
    
    if (this.isConsecutiveDay(stats.lastSubmission, submission.submissionDate)) {
      stats.currentStreak++;
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    } else {
      stats.currentStreak = 1; // Reset
    }
    
    await stats.save();
  }
}
```

---

## 🔒 Authentication Flow

```typescript
// middleware/auth.ts
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role: 'brand' | 'creator') => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

---

## 📊 Frontend State Management (Zustand)

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    set({ user: response.data.user, token: response.data.token });
    localStorage.setItem('token', response.data.token);
  },
  
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  }
}));
```

---

## 🎨 Styling Guidelines

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        secondary: '#ec4899',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Build optimization
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] Analytics integrated

### Backend (Railway)
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] Health check endpoint
- [ ] Logging configured

### Database (Railway/Supabase)
- [ ] Backups enabled
- [ ] Connection pooling configured
- [ ] Indexes created
- [ ] Performance monitoring

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-30
