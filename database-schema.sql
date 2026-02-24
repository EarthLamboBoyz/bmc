-- ============================================
-- BrandMeetCreator MVP - Database Schema
-- PostgreSQL 14+
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

CREATE TYPE user_role AS ENUM ('brand', 'creator');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_image TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_status verification_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. BRAND PROFILES
-- ============================================

CREATE TABLE brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);

-- ============================================
-- 3. CREATOR PROFILES
-- ============================================

CREATE TYPE platform_type AS ENUM ('tiktok', 'instagram', 'youtube', 'facebook');
CREATE TYPE category_type AS ENUM ('beauty', 'fashion', 'food', 'tech', 'lifestyle', 'health', 'travel', 'gaming', 'education', 'other');

CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platforms JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["tiktok", "instagram"]
    followers INTEGER DEFAULT 0,
    categories JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["beauty", "lifestyle"]
    bio TEXT,
    bank_account_info JSONB, -- { "bank_name": "...", "account_number": "...", "account_name": "..." }
    tiktok_handle VARCHAR(255),
    instagram_handle VARCHAR(255),
    youtube_handle VARCHAR(255),
    facebook_handle VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_followers ON creator_profiles(followers);

-- ============================================
-- 4. CAMPAIGNS
-- ============================================

CREATE TYPE campaign_status AS ENUM ('draft', 'live', 'completed', 'cancelled');
CREATE TYPE campaign_type AS ENUM ('single', 'challenge');

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    
    -- Budget & Limits
    budget DECIMAL(12,2) NOT NULL,
    max_creators INTEGER NOT NULL,
    current_creators INTEGER DEFAULT 0,
    
    -- Requirements
    required_followers INTEGER DEFAULT 0,
    platforms JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["tiktok", "instagram"]
    categories JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["beauty", "lifestyle"]
    
    -- Timeline
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    announcement_date DATE, -- วันประกาศผล
    
    -- Campaign Type
    campaign_type campaign_type DEFAULT 'single',
    duration_days INTEGER, -- For challenge campaigns
    submission_frequency VARCHAR(50), -- 'daily', 'weekly', etc.
    
    -- Content Guidelines
    content_guidelines JSONB, -- { "structure": "5-step", "dos": [], "donts": [], "hashtags": [] }
    
    -- Status
    status campaign_status DEFAULT 'draft',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_end_date ON campaigns(end_date);

-- ============================================
-- 5. CAMPAIGN REWARDS
-- ============================================

CREATE TYPE reward_type AS ENUM ('sales_milestone', 'top_volume', 'streak_bonus', 'lucky_draw', 'custom');
CREATE TYPE reward_criteria AS ENUM ('gmv', 'video_count', 'streak_days', 'random');

CREATE TABLE campaign_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    
    -- Reward Details
    reward_order INTEGER NOT NULL, -- รางวัลที่ 1, 2, 3...
    reward_type reward_type NOT NULL,
    reward_name VARCHAR(255), -- For custom rewards
    
    -- Configuration (JSONB for flexibility)
    config JSONB NOT NULL,
    /* Example configs:
    
    Sales Milestone:
    {
      "criteria": "gmv",
      "tiers": [
        { "rank": 1, "amount": 10000 },
        { "rank": 2, "amount": 5000 },
        { "rank": 3, "amount": 3000 }
      ]
    }
    
    Top Volume:
    {
      "criteria": "video_count",
      "tiers": [
        { "rank": 1, "amount": 10000 },
        { "rank": 2, "amount": 5000 }
      ]
    }
    
    Streak Bonus:
    {
      "criteria": "streak_days",
      "streaks": [
        { "days": 10, "winners": 10, "amount_per_winner": 500 },
        { "days": 20, "winners": 5, "amount_per_winner": 1000 }
      ]
    }
    
    Lucky Draw:
    {
      "criteria": "random",
      "min_videos": 10,
      "winners": 10,
      "amount_per_winner": 500,
      "method": "equal" | "per_video"
    }
    
    Custom:
    {
      "criteria": "gmv" | "video_count" | "custom",
      "condition": "gmv >= 1000000",
      "reward_description": "iPhone 17 Pro 256GB",
      "reward_value": 43900,
      "image_url": "...",
      "quantity": 1
    }
    */
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_rewards_campaign_id ON campaign_rewards(campaign_id);
CREATE INDEX idx_campaign_rewards_order ON campaign_rewards(campaign_id, reward_order);

-- ============================================
-- 6. APPLICATIONS
-- ============================================

CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    status application_status DEFAULT 'pending',
    
    -- Application data
    message TEXT, -- Creator's application message
    
    -- Timestamps
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    
    UNIQUE(campaign_id, creator_id)
);

CREATE INDEX idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX idx_applications_creator_id ON applications(creator_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- 7. SUBMISSIONS
-- ============================================

CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Submission data
    video_url TEXT NOT NULL,
    promo_code_url TEXT,
    description TEXT,
    
    -- For challenge campaigns
    submission_number INTEGER DEFAULT 1, -- Day 1, Day 2, ...
    submission_date DATE DEFAULT CURRENT_DATE,
    is_on_streak BOOLEAN DEFAULT TRUE,
    
    -- Status
    status submission_status DEFAULT 'pending',
    
    -- Review
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_application_id ON submissions(application_id);
CREATE INDEX idx_submissions_campaign_id ON submissions(campaign_id);
CREATE INDEX idx_submissions_creator_id ON submissions(creator_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_date ON submissions(submission_date);

-- ============================================
-- 8. CREATOR CAMPAIGN STATS (for Challenge Campaigns)
-- ============================================

CREATE TABLE creator_campaign_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stats
    total_submissions INTEGER DEFAULT 0,
    approved_submissions INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- GMV Data (uploaded by Brand)
    gmv DECIMAL(12,2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    last_gmv_update TIMESTAMP,
    
    -- Performance Metrics
    total_views BIGINT DEFAULT 0,
    total_likes BIGINT DEFAULT 0,
    total_comments BIGINT DEFAULT 0,
    total_shares BIGINT DEFAULT 0,
    
    -- Milestones achieved
    milestones_achieved JSONB DEFAULT '[]'::jsonb, -- [10, 20, 30]
    
    -- Current rank
    current_rank INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, creator_id)
);

CREATE INDEX idx_creator_stats_campaign_id ON creator_campaign_stats(campaign_id);
CREATE INDEX idx_creator_stats_creator_id ON creator_campaign_stats(creator_id);
CREATE INDEX idx_creator_stats_gmv ON creator_campaign_stats(campaign_id, gmv DESC);
CREATE INDEX idx_creator_stats_submissions ON creator_campaign_stats(campaign_id, total_submissions DESC);

-- ============================================
-- 9. REWARD WINNERS
-- ============================================

CREATE TYPE reward_winner_status AS ENUM ('pending', 'announced', 'paid');

CREATE TABLE reward_winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES campaign_rewards(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reward details
    reward_type reward_type NOT NULL,
    reward_description TEXT, -- "Top 1 GMV", "Streak 10 days", "Lucky Draw"
    amount DECIMAL(12,2), -- For cash rewards
    custom_reward_details JSONB, -- For custom rewards (iPhone, etc.)
    
    -- Criteria met
    criteria_value JSONB, -- { "gmv": 1500000, "rank": 1 } or { "streak": 20 }
    
    -- Status
    status reward_winner_status DEFAULT 'pending',
    announced_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reward_winners_campaign_id ON reward_winners(campaign_id);
CREATE INDEX idx_reward_winners_creator_id ON reward_winners(creator_id);
CREATE INDEX idx_reward_winners_status ON reward_winners(status);

-- ============================================
-- 10. PAYMENTS (Tracking)
-- ============================================

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(12,2) NOT NULL,
    description TEXT, -- "Sales Milestone Rank 1 + Streak Bonus"
    
    -- Related rewards
    reward_winner_ids JSONB, -- [uuid1, uuid2, ...] - multiple rewards can be combined
    
    -- Status
    status payment_status DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Payment info
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_reference VARCHAR(255)
);

CREATE INDEX idx_payments_campaign_id ON payments(campaign_id);
CREATE INDEX idx_payments_creator_id ON payments(creator_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- 11. GMV UPLOADS (Sales Data)
-- ============================================

CREATE TABLE gmv_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- File info
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    
    -- Stats
    total_creators INTEGER,
    total_gmv DECIMAL(12,2),
    total_orders INTEGER,
    
    -- Status
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_gmv_uploads_campaign_id ON gmv_uploads(campaign_id);

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================

CREATE TYPE notification_type AS ENUM ('application_approved', 'application_rejected', 'submission_approved', 'submission_rejected', 'reward_won', 'payment_sent', 'campaign_ending', 'streak_reminder', 'milestone_reached');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Campaign Dashboard Stats
CREATE VIEW campaign_dashboard_stats AS
SELECT 
    c.id as campaign_id,
    c.title,
    c.status,
    c.budget,
    c.max_creators,
    c.current_creators,
    COUNT(DISTINCT s.id) as total_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.id END) as pending_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'approved' THEN s.id END) as approved_submissions,
    COALESCE(SUM(ccs.gmv), 0) as total_gmv,
    COALESCE(SUM(ccs.total_views), 0) as total_views,
    COALESCE(SUM(ccs.total_likes + ccs.total_comments + ccs.total_shares), 0) as total_engagement
FROM campaigns c
LEFT JOIN submissions s ON c.id = s.campaign_id
LEFT JOIN creator_campaign_stats ccs ON c.id = ccs.campaign_id
GROUP BY c.id, c.title, c.status, c.budget, c.max_creators, c.current_creators;

-- Creator Earnings Summary
CREATE VIEW creator_earnings_summary AS
SELECT 
    u.id as creator_id,
    u.name,
    COUNT(DISTINCT rw.campaign_id) as campaigns_participated,
    COALESCE(SUM(rw.amount), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN rw.status = 'paid' THEN rw.amount ELSE 0 END), 0) as paid_earnings,
    COALESCE(SUM(CASE WHEN rw.status = 'pending' THEN rw.amount ELSE 0 END), 0) as pending_earnings
FROM users u
LEFT JOIN reward_winners rw ON u.id = rw.creator_id
WHERE u.role = 'creator'
GROUP BY u.id, u.name;

-- Campaign Leaderboard
CREATE VIEW campaign_leaderboard AS
SELECT 
    ccs.campaign_id,
    ccs.creator_id,
    u.name as creator_name,
    cp.tiktok_handle,
    cp.followers,
    ccs.total_submissions,
    ccs.current_streak,
    ccs.longest_streak,
    ccs.gmv,
    ccs.orders,
    ccs.total_views,
    (ccs.total_likes + ccs.total_comments + ccs.total_shares) as total_engagement,
    CASE 
        WHEN ccs.total_views > 0 
        THEN ROUND(((ccs.total_likes + ccs.total_comments + ccs.total_shares)::NUMERIC / ccs.total_views * 100), 2)
        ELSE 0 
    END as engagement_rate,
    ROW_NUMBER() OVER (PARTITION BY ccs.campaign_id ORDER BY ccs.gmv DESC) as gmv_rank,
    ROW_NUMBER() OVER (PARTITION BY ccs.campaign_id ORDER BY ccs.total_submissions DESC) as volume_rank,
    ROW_NUMBER() OVER (PARTITION BY ccs.campaign_id ORDER BY ccs.longest_streak DESC) as streak_rank
FROM creator_campaign_stats ccs
JOIN users u ON ccs.creator_id = u.id
JOIN creator_profiles cp ON u.id = cp.user_id
ORDER BY ccs.campaign_id, ccs.gmv DESC;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_rewards_updated_at BEFORE UPDATE ON campaign_rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creator_campaign_stats_updated_at BEFORE UPDATE ON creator_campaign_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_winners_updated_at BEFORE UPDATE ON reward_winners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment current_creators on campaign
CREATE OR REPLACE FUNCTION increment_campaign_creators()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        UPDATE campaigns 
        SET current_creators = current_creators + 1 
        WHERE id = NEW.campaign_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_creators_on_approval
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION increment_campaign_creators();

-- Auto-create creator_campaign_stats when application approved
CREATE OR REPLACE FUNCTION create_creator_stats_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        INSERT INTO creator_campaign_stats (campaign_id, creator_id)
        VALUES (NEW.campaign_id, NEW.creator_id)
        ON CONFLICT (campaign_id, creator_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_stats_on_approval
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION create_creator_stats_on_approval();

-- Update creator stats on submission
CREATE OR REPLACE FUNCTION update_creator_stats_on_submission()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE creator_campaign_stats
        SET total_submissions = total_submissions + 1
        WHERE campaign_id = NEW.campaign_id AND creator_id = NEW.creator_id;
        
        IF NEW.status = 'approved' THEN
            UPDATE creator_campaign_stats
            SET approved_submissions = approved_submissions + 1
            WHERE campaign_id = NEW.campaign_id AND creator_id = NEW.creator_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
            UPDATE creator_campaign_stats
            SET approved_submissions = approved_submissions + 1
            WHERE campaign_id = NEW.campaign_id AND creator_id = NEW.creator_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_submission
AFTER INSERT OR UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_creator_stats_on_submission();

-- ============================================
-- SEED DATA (for testing)
-- ============================================

-- Sample Brand User
INSERT INTO users (id, email, password_hash, role, name, email_verified)
VALUES 
('b1111111-1111-1111-1111-111111111111', 'brand@test.com', '$2a$10$DUMMY_HASH', 'brand', 'สามสิบ คุณสัมฤทธิ์', TRUE);

INSERT INTO brand_profiles (user_id, company_name, company_logo, industry)
VALUES 
('b1111111-1111-1111-1111-111111111111', 'สามสิบ คุณสัมฤทธิ์', 'https://via.placeholder.com/150', 'Health & Wellness');

-- Sample Creator Users
INSERT INTO users (id, email, password_hash, role, name, email_verified)
VALUES 
('c2222222-2222-2222-2222-222222222222', 'creator1@test.com', '$2a$10$DUMMY_HASH', 'creator', 'Makeup Kanya', TRUE),
('c3333333-3333-3333-3333-333333333333', 'creator2@test.com', '$2a$10$DUMMY_HASH', 'creator', 'Natural Pim', TRUE);

INSERT INTO creator_profiles (user_id, platforms, followers, categories, tiktok_handle)
VALUES 
('c2222222-2222-2222-2222-222222222222', '["tiktok", "instagram"]'::jsonb, 50200, '["beauty", "lifestyle"]'::jsonb, '@makeup_kanya'),
('c3333333-3333-3333-3333-333333333333', '["tiktok"]'::jsonb, 23800, '["beauty", "health"]'::jsonb, '@natural_pim');

-- Sample Campaign
INSERT INTO campaigns (
    id, brand_id, title, description, budget, max_creators, 
    required_followers, platforms, categories, start_date, end_date, announcement_date,
    campaign_type, duration_days, submission_frequency, status
)
VALUES (
    'a4444444-4444-4444-4444-444444444444',
    'b1111111-1111-1111-1111-111111111111',
    'สามสิบ ตรา คุณสัมฤทธิ์',
    'แคมเปญรีวิวผลิตภัณฑ์เสริมอาหารสำหรับผู้หญิง Challenge 365 วัน',
    500000,
    300,
    10000,
    '["tiktok", "instagram"]'::jsonb,
    '["beauty", "health", "lifestyle"]'::jsonb,
    '2026-01-27',
    '2027-01-26',
    '2027-01-27',
    'challenge',
    365,
    'daily',
    'live'
);

-- Sample Campaign Rewards
INSERT INTO campaign_rewards (campaign_id, reward_order, reward_type, config)
VALUES 
(
    'a4444444-4444-4444-4444-444444444444',
    1,
    'sales_milestone',
    '{
        "criteria": "gmv",
        "tiers": [
            {"rank": 1, "amount": 8000},
            {"rank": 2, "amount": 5000},
            {"rank": 3, "amount": 3000},
            {"rank": 4, "amount": 2000},
            {"rank": 5, "amount": 2000}
        ]
    }'::jsonb
),
(
    'a4444444-4444-4444-4444-444444444444',
    2,
    'top_volume',
    '{
        "criteria": "video_count",
        "tiers": [
            {"rank": 1, "amount": 6000},
            {"rank": 2, "amount": 4000},
            {"rank": 3, "amount": 1500},
            {"rank": 4, "amount": 1500},
            {"rank": 5, "amount": 1500}
        ]
    }'::jsonb
),
(
    'a4444444-4444-4444-4444-444444444444',
    3,
    'streak_bonus',
    '{
        "criteria": "streak_days",
        "streaks": [
            {"days": 10, "winners": 10, "amount_per_winner": 500},
            {"days": 20, "winners": 5, "amount_per_winner": 1000}
        ]
    }'::jsonb
),
(
    'a4444444-4444-4444-4444-444444444444',
    4,
    'lucky_draw',
    '{
        "criteria": "random",
        "min_videos": 10,
        "winners": 10,
        "amount_per_winner": 500,
        "method": "equal"
    }'::jsonb
),
(
    'a4444444-4444-4444-4444-444444444444',
    5,
    'custom',
    '{
        "criteria": "gmv",
        "condition": "gmv >= 1000000",
        "reward_description": "iPhone 17 Pro 256GB",
        "reward_value": 43900,
        "quantity": 1
    }'::jsonb
);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Main users table for both brands and creators';
COMMENT ON TABLE campaigns IS 'Campaign information created by brands';
COMMENT ON TABLE campaign_rewards IS 'Flexible reward structure supporting multiple reward types';
COMMENT ON TABLE creator_campaign_stats IS 'Real-time stats for each creator in each campaign';
COMMENT ON TABLE reward_winners IS 'Final winners calculated at campaign end';
COMMENT ON TABLE gmv_uploads IS 'Track CSV uploads of sales data from TikTok Affiliate';

-- ============================================
-- END OF SCHEMA
-- ============================================
