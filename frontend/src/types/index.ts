export type UserRole = 'brand' | 'creator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  // Shipping info for creators
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

export interface ContentGuidelines {
  // แนวทางการสร้างคอนเทนต์ (free text)
  contentStructure?: string;    // โครงสร้างคอนเทนต์ ขั้นตอน ความยาว
  keyMessages?: string;         // สิ่งที่ต้องพูด/ห้ามพูด จุดขาย
  dosAndDonts?: string;         // สิ่งที่ควรทำ/ไม่ควรทำ
  hashtagsAndLinks?: string;    // Hashtags, mentions, promo code, links
  visualGuidelines?: string;    // แนวทางด้านภาพ เสียง สไตล์
  legalNotes?: string;          // ข้อกฎหมาย disclosure
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  brandId: string;
  brandName: string;
  status: 'draft' | 'live' | 'completed' | 'cancelled' | 'DRAFT' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  type: 'single' | 'challenge';
  budget: number;
  budgetUsed: number;
  maxCreators: number;
  currentCreators: number;
  minFollowers: number;
  platforms: string[];
  categories: string[];
  startDate: string;
  endDate: string;
  announceDate: string;
  rewards: Reward[];
  // Content Guidelines
  contentGuidelines?: ContentGuidelines;
  // Sample fields
  hasSamples?: boolean;
  sampleInfo?: {
    description: string;
    imageUrl?: string;
    totalSamples: number;
    samplesPerCreator: number;
  };
}

export interface Reward {
  id: string;
  type: 'sales_milestone' | 'top_volume' | 'streak_bonus' | 'lucky_draw' | 'custom';
  title: string;
  budget: number;
  config: Record<string, unknown>;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  followers: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  message?: string;
  campaign?: Campaign;
}

export interface Submission {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  videoUrl: string;
  promoLink: string;
  notes?: string;
  day: number;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  submittedAt: string;
  reviewedAt?: string;
  rejectReason?: string;
  // Performance Metrics (Content Intelligence)
  performance?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    gmv: number;
    engagementRate: number;
  };
}

export interface CreatorStats {
  campaignId: string;
  creatorId: string;
  totalVideos: number;
  approvedVideos: number;
  currentStreak: number;
  maxStreak: number;
  gmv: number;
  orders: number;
  rank: {
    gmv: number;
    volume: number;
    streak: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application_approved' | 'application_rejected' | 'submission_approved' | 'submission_rejected' | 'reward_won' | 'reminder' | 'sample_requested' | 'sample_approved' | 'sample_rejected' | 'sample_shipped' | 'payment_received' | 'payment_confirmed' | 'payment_disputed' | 'submission_received' | 'payment_reminder' | 'new_application' | 'new_submission' | 'submission_revision' | 'new_campaign' | 'campaign_ending' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SampleRequest {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorFollowers: number;
  status: 'pending' | 'approved' | 'rejected' | 'shipped';
  quantity: number;
  message?: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    district: string;
    province: string;
    postalCode: string;
  };
  requestedAt: string;
  reviewedAt?: string;
  shippedAt?: string;
  rejectionReason?: string;
}
