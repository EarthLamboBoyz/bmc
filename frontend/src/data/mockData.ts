import { Campaign, Application, Submission, CreatorStats, Notification, User } from '../types';

// Mock Users for Auth
export const mockBrandUser: User = {
  id: 'brand1',
  email: 'brand@example.com',
  name: 'Brand Admin',
  role: 'brand',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
};

export const mockCreatorUser: User = {
  id: 'creator1',
  email: 'creator@example.com',
  name: 'Creator User',
  role: 'creator',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  phone: '0812345678',
  addressLine1: '123/45 ถนนสุขุมวิท',
  addressLine2: 'แขวงคลองเตย',
  district: 'คลองเตย',
  province: 'กรุงเทพมหานคร',
  postalCode: '10110',
};

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'สามสิบ ตรา คุณสัมฤทธิ์ 365 วัน Challenge',
    description: 'ร่วมเป็นส่วนหนึ่งของ Challenge สุขภาพที่ยิ่งใหญ่ที่สุดแห่งปี! สร้างคอนเทนต์รีวิวสินค้าสามสิบทุกวันเป็นเวลา 365 วัน ลุ้นรางวัลรวมกว่า 500,000 บาท',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    brandId: 'brand1',
    brandName: 'สามสิบ',
    status: 'live',
    type: 'challenge',
    budget: 60000,
    budgetUsed: 0,
    maxCreators: 300,
    currentCreators: 97,
    minFollowers: 10000,
    platforms: ['TikTok', 'Instagram'],
    categories: ['Beauty', 'Health', 'Lifestyle'],
    startDate: '2026-01-26',
    endDate: '2027-01-26',
    announceDate: '2027-01-27',
    rewards: [
      {
        id: 'r1',
        type: 'sales_milestone',
        title: 'Sales Milestones',
        budget: 20000,
        config: {
          tiers: [
            { rank: 1, amount: 8000 },
            { rank: 2, amount: 5000 },
            { rank: 3, amount: 3000 },
            { rank: 4, amount: 2000 },
            { rank: 5, amount: 2000 }
          ]
        }
      },
      {
        id: 'r2',
        type: 'top_volume',
        title: 'Top Volume',
        budget: 15000,
        config: {
          tiers: [
            { rank: 1, amount: 6000 },
            { rank: 2, amount: 4000 },
            { rank: 3, amount: 2000 },
            { rank: 4, amount: 1500 },
            { rank: 5, amount: 1500 }
          ]
        }
      },
      {
        id: 'r3',
        type: 'streak_bonus',
        title: 'Streak Bonus',
        budget: 15000,
        config: {
          streaks: [
            { days: 10, winners: 10, amount: 500 },
            { days: 20, winners: 10, amount: 1000 }
          ]
        }
      },
      {
        id: 'r4',
        type: 'lucky_draw',
        title: 'Lucky Draw',
        budget: 10000,
        config: {
          winners: 20,
          amount: 500,
          minVideos: 10
        }
      },
      {
        id: 'r5',
        type: 'custom',
        title: 'รางวัลพิเศษ',
        budget: 0,
        config: {
          prizes: [
            {
              description: 'iPhone 17 Pro',
              condition: 'ยอดขายสูงสุด'
            },
            {
              description: 'ทองคำ 1 บาท',
              condition: 'วิดีโอที่มียอด engagement สูงสุด'
            }
          ]
        }
      }
    ],
    contentGuidelines: {
      contentStructure: `ความยาววิดีโอ: 15-60 วินาที
รูปแบบ: แนวตั้ง (9:16)

ขั้นตอนการนำเสนอ:
1. Hook - เกริ่นเรื่อง หยุดนิ้ว เริ่มต้นด้วยคำถามที่ดึงดูดความสนใจ เช่น "รู้ไหมว่าทำไมคนวัย 30+ ต้องดูแลตัวเอง?"
2. Story - เล่าประสบการณ์จริง แชร์ปัญหาสุขภาพที่เคยเจอ เช่น เหนื่อยง่าย นอนไม่หลับ ผิวหมองคล้ำ
3. Product Intro - แนะนำสินค้า บอกว่าสามสิบช่วยแก้ปัญหาอย่างไร พร้อมโชว์สินค้า
4. Result - แสดงผลลัพธ์ แสดงการเปลี่ยนแปลงที่เห็นได้ชัด ก่อน-หลัง หรือความรู้สึกที่ดีขึ้น
5. CTA - ชวนให้ลอง ชวนดูลิงก์ในโปรไฟล์ ใช้โค้ดส่วนลด ไม่ Hard Sell`,
      keyMessages: `✓ ต้องพูด/กล่าวถึง:
• สามสิบ ตรา คุณสัมฤทธิ์
• ดูแลสุขภาพจากภายใน
• ใช้โค้ด SAMSIB30 รับส่วนลด 30%

✗ ห้ามพูด/กล่าวอ้าง:
• รักษาโรค / ป้องกันโรค
• ผลลัพธ์ 100%
• ดีกว่ายา
• ไม่มีผลข้างเคียง

💡 จุดขายที่แนะนำ:
• สารสกัดจากธรรมชาติ 30 ชนิด
• ผ่าน อย. รับรอง
• เหมาะสำหรับคนวัย 30+
• ทานง่าย วันละ 1 แคปซูล`,
      dosAndDonts: `✓ สิ่งที่ควรทำ:
• ดูเป็นธรรมชาติ ไม่เหมือนอ่านสคริปต์
• แสดงสินค้าให้เห็นชัดเจน
• พิมพ์ข้อความสำคัญบนจอ
• ใส่เสียงเพลงประกอบที่เหมาะสม
• ตอบคอมเมนต์ผู้ชม

✗ สิ่งที่ไม่ควรทำ:
• กล่าวอ้างทางการแพทย์
• เปรียบเทียบกับแบรนด์คู่แข่ง
• พูดเร็วเกินไป / อ่านสคริปต์
• ใช้ภาพ Before-After ที่เกินจริง
• ลบวิดีโอก่อนจบแคมเปญ`,
      hashtagsAndLinks: `Hashtags ที่ต้องใช้ (บังคับ):
#สามสิบ #คุณสัมฤทธิ์ #365วันChallenge

Hashtags แนะนำ:
#ดูแลสุขภาพ #วัย30 #อาหารเสริม #TikTokHealth

Account ที่ต้อง Mention:
@samsib_official

Promo Code: SAMSIB30
Landing Page: https://shop.samsib.com/promo
วิธีใส่ลิงก์: ใส่ลิงก์ใน Bio และ Comment แรก

CTA แนะนำ:
• "ลองดูลิงก์ใน Bio เลย"
• "ใช้โค้ด SAMSIB30 รับส่วนลด 30%"
• "คลิกลิงก์ใต้คลิปนี้เลยนะ"`,
      visualGuidelines: `• ถ่ายแสงธรรมชาติหรือแสงที่สว่างเพียงพอ
• โชว์สินค้าให้เห็นชัดเจน ทั้งกล่องและตัวผลิตภัณฑ์
• สไตล์การนำเสนอแบบ friendly และเป็นธรรมชาติ
• ใช้เพลงประกอบที่ไม่มีลิขสิทธิ์
• พื้นหลังสะอาด ไม่รก`,
      legalNotes: `• ต้องใส่ Disclosure: #ad #sponsored
• ข้อจำกัด: ผลลัพธ์อาจแตกต่างกันในแต่ละบุคคล ควรปรึกษาแพทย์ก่อนใช้`,
    },
    hasSamples: true,
    sampleInfo: {
      description: 'ผลิตภัณฑ์เสริมอาหาร สามสิบ 1 กล่อง (30 แคปซูล)',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      totalSamples: 300,
      samplesPerCreator: 1,
    },
  },
  {
    id: '2',
    title: 'Beauty Glow Up Challenge',
    description: 'แคมเปญรีวิวผลิตภัณฑ์บำรุงผิวหน้า แชร์ routine สกินแคร์ของคุณ พร้อมรับค่าตอบแทนสุดพิเศษ',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
    brandId: 'brand2',
    brandName: 'GlowSkin',
    status: 'live',
    type: 'single',
    budget: 150000,
    budgetUsed: 45000,
    maxCreators: 100,
    currentCreators: 34,
    minFollowers: 5000,
    platforms: ['TikTok', 'Instagram'],
    categories: ['Beauty', 'Skincare'],
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    announceDate: '2026-03-01',
    rewards: [
      {
        id: 'r6',
        type: 'sales_milestone',
        title: 'Sales Bonus',
        budget: 85000,
        config: {
          tiers: [
            { rank: 1, amount: 30000 },
            { rank: 2, amount: 20000 },
            { rank: 3, amount: 15000 },
            { rank: 4, amount: 10000 },
            { rank: 5, amount: 10000 }
          ]
        }
      },
      {
        id: 'r7',
        type: 'top_volume',
        title: 'Top Creators',
        budget: 50000,
        config: {
          tiers: [
            { rank: 1, amount: 20000 },
            { rank: 2, amount: 15000 },
            { rank: 3, amount: 10000 },
            { rank: 4, amount: 5000 }
          ]
        }
      },
      {
        id: 'r8',
        type: 'streak_bonus',
        title: 'Consistency Bonus',
        budget: 15000,
        config: {
          streaks: [
            { days: 7, winners: 15, amount: 500 },
            { days: 14, winners: 10, amount: 750 }
          ]
        }
      }
    ],
    contentGuidelines: {
      contentStructure: `ความยาววิดีโอ: 30-90 วินาที
รูปแบบ: แนวตั้ง (9:16)

ขั้นตอนการนำเสนอ:
1. Before - แสดงสภาพผิวก่อนใช้ ไม่ต้องแต่งหน้า แสงธรรมชาติ
2. Routine - สาธิตการใช้ผลิตภัณฑ์ ล้างหน้า, ทา serum, moisturizer
3. Texture - โชว์เนื้อผลิตภัณฑ์ ความรู้สึกเมื่อทา กลิ่น
4. After - แสดงผลลัพธ์ ผิวหลังทา ความชุ่มชื้น`,
      keyMessages: `✓ ต้องพูด/กล่าวถึง:
• GlowSkin
• เซรั่มวิตามินซี

✗ ห้ามพูด/กล่าวอ้าง:
• รักษาสิว
• ผิวขาวใน 7 วัน

💡 จุดขายที่แนะนำ:
• สูตรอ่อนโยน ไม่ระคายเคือง
• ผิวแพ้ง่ายใช้ได้
• ไม่มีพาราเบน`,
      dosAndDonts: `✓ สิ่งที่ควรทำ:
• ถ่ายด้วยแสงธรรมชาติ
• แสดงผิวจริงไม่ใช้ฟิลเตอร์
• อธิบายความรู้สึกขณะใช้

✗ สิ่งที่ไม่ควรทำ:
• ใช้ฟิลเตอร์ปรับผิว
• กล่าวอ้างผลลัพธ์เกินจริง
• เปรียบเทียบกับแบรนด์อื่น`,
      hashtagsAndLinks: `Hashtags ที่ต้องใช้ (บังคับ):
#GlowSkin #GlowUpChallenge

Hashtags แนะนำ:
#สกินแคร์ #รีวิวสกินแคร์ #ผิวสวย

Account ที่ต้อง Mention:
@glowskin.th

Promo Code: GLOW20
Landing Page: https://glowskin.com/shop
วิธีใส่ลิงก์: ใส่ลิงก์ใน Bio`,
      legalNotes: `• ต้องใส่ Disclosure: #ad`,
    },
    hasSamples: true,
    sampleInfo: {
      description: 'ชุดผลิตภัณฑ์บำรุงผิวหน้า GlowSkin (Cleanser + Serum + Moisturizer)',
      imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
      totalSamples: 100,
      samplesPerCreator: 1,
    },
  },
  {
    id: '3',
    title: 'Healthy Snack Review',
    description: 'รีวิวขนมสุขภาพยี่ห้อใหม่ สร้างคอนเทนต์สนุกๆ พร้อมรับค่าตอบแทน',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400',
    brandId: 'brand3',
    brandName: 'HealthyBite',
    status: 'completed',
    type: 'single',
    budget: 80000,
    budgetUsed: 80000,
    maxCreators: 50,
    currentCreators: 50,
    minFollowers: 3000,
    platforms: ['TikTok'],
    categories: ['Food', 'Health'],
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    announceDate: '2026-01-02',
    rewards: [
      {
        id: 'r9',
        type: 'top_volume',
        title: 'Best Creators',
        budget: 80000,
        config: {
          tiers: [
            { rank: 1, amount: 30000 },
            { rank: 2, amount: 20000 },
            { rank: 3, amount: 15000 },
            { rank: 4, amount: 10000 },
            { rank: 5, amount: 5000 }
          ]
        }
      }
    ],
  },
];

// Mock Sample Requests
export const mockSampleRequests = [
  {
    id: 'sr1',
    campaignId: '1',
    creatorId: 'creator_1',
    creatorName: 'Sarah Beauty',
    creatorHandle: '@sarah.beauty',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    creatorFollowers: 125000,
    status: 'pending' as const,
    quantity: 1,
    message: 'ตื่นเต้นมากค่ะ! อยากลองผลิตภัณฑ์และรีวิวให้ทุกคนได้รู้จัก',
    shippingAddress: {
      recipientName: 'สาราห์ บิวตี้',
      phone: '0812345678',
      addressLine1: '123/45 ถนนสุขุมวิท',
      addressLine2: 'แขวงคลองเตย',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
    },
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'sr2',
    campaignId: '1',
    creatorId: 'creator_5',
    creatorName: 'Emma Lifestyle',
    creatorHandle: '@emma.lifestyle',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    creatorFollowers: 89000,
    status: 'approved' as const,
    quantity: 1,
    message: 'พร้อมสร้างคอนเทนต์คุณภาพให้แบรนด์ค่ะ',
    shippingAddress: {
      recipientName: 'เอ็มม่า ไลฟ์สไตล์',
      phone: '0823456789',
      addressLine1: '456/78 ถนนพระราม 4',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
    },
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    reviewedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
  },
  {
    id: 'sr3',
    campaignId: '1',
    creatorId: 'creator_10',
    creatorName: 'James Daily',
    creatorHandle: '@james.daily',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    creatorFollowers: 156000,
    status: 'shipped' as const,
    quantity: 1,
    shippingAddress: {
      recipientName: 'เจมส์ เดลี่',
      phone: '0834567890',
      addressLine1: '789/12 ถนนเพชรบุรี',
      district: 'ราชเทวี',
      province: 'กรุงเทพมหานคร',
      postalCode: '10400',
    },
    requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    reviewedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'sr4',
    campaignId: '1',
    creatorId: 'creator_15',
    creatorName: 'Ploy Reviews',
    creatorHandle: '@ploy.reviews',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    creatorFollowers: 67000,
    status: 'rejected' as const,
    quantity: 1,
    message: 'อยากรีวิวให้ผู้ติดตามได้รู้จักผลิตภัณฑ์ดีๆ',
    shippingAddress: {
      recipientName: 'พลอย รีวิว',
      phone: '0845678901',
      addressLine1: '321/56 ถนนรัชดาภิเษก',
      district: 'ห้วยขวาง',
      province: 'กรุงเทพมหานคร',
      postalCode: '10310',
    },
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'ขออภัยค่ะ ตัวอย่างสินค้าหมดแล้ว',
  },
  {
    id: 'sr5',
    campaignId: '2',
    creatorId: 'creator_3',
    creatorName: 'Kanya Health',
    creatorHandle: '@kanya.health',
    creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
    creatorFollowers: 98000,
    status: 'pending' as const,
    quantity: 1,
    message: 'สนใจทดลองใช้และแชร์ประสบการณ์จริงค่ะ',
    shippingAddress: {
      recipientName: 'กัญญา เฮลท์',
      phone: '0856789012',
      addressLine1: '654/32 ถนนลาดพร้าว',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900',
    },
    requestedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: 'sr6',
    campaignId: '2',
    creatorId: 'creator_8',
    creatorName: 'Anna Daily',
    creatorHandle: '@anna.daily',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    creatorFollowers: 112000,
    status: 'approved' as const,
    quantity: 1,
    shippingAddress: {
      recipientName: 'แอนนา เดลี่',
      phone: '0867890123',
      addressLine1: '987/65 ถนนพหลโยธิน',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900',
    },
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// --- Massive Data Generator ---

const firstNames = ['Sarah', 'Mike', 'Kanya', 'John', 'Emma', 'David', 'Lisa', 'Tom', 'Anna', 'James', 'Ploy', 'Nont', 'Bell', 'Win', 'Fah'];
const lastNames = ['Beauty', 'Lifestyle', 'Health', 'Tech', 'Foodie', 'Travel', 'Gamer', 'Fit', 'Style', 'Cook', 'Review', 'Vlog', 'Daily', 'Happy'];
const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', // Women
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', // Men
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
];

const generateCreators = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `creator_${i + 1}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    handle: `@user_${i + 1}`,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    followers: Math.floor(Math.random() * 900000) + 10000, // 10k - 1M
  }));
};

const creators = generateCreators(50); // Generate 50 unique creators

export const mockApplications: Application[] = creators.map((creator, i) => ({
  id: `app_${i + 1}`,
  campaignId: '1', // All apply to campaign 1 for demo
  creatorId: creator.id,
  creatorName: creator.name,
  creatorHandle: creator.handle,
  creatorAvatar: creator.avatar,
  followers: creator.followers,
  status: Math.random() > 0.3 ? 'approved' : 'pending', // 70% approved
  appliedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
  message: 'พร้อมลุยครับ/ค่ะ!',
}));

export const mockSubmissions: Submission[] = [];
export const mockCreatorStats: CreatorStats[] = [];

// Add guaranteed pending submissions for testing Inbox
const pendingCreators = [
  { id: 'pending_1', name: 'Bella Beauty', handle: '@bella.beauty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 'pending_2', name: 'Mike Lifestyle', handle: '@mike.life', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: 'pending_3', name: 'Ploy Reviews', handle: '@ploy.reviews', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: 'pending_4', name: 'Tom Fitness', handle: '@tom.fit', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 'pending_5', name: 'Anna Daily', handle: '@anna.daily', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
];

pendingCreators.forEach((creator, idx) => {
  mockSubmissions.push({
    id: `pending_sub_${idx + 1}`,
    campaignId: '1',
    creatorId: creator.id,
    creatorName: creator.name,
    creatorHandle: creator.handle,
    creatorAvatar: creator.avatar,
    videoUrl: `https://tiktok.com/${creator.handle}/video/pending${idx + 1}`,
    promoLink: `https://shop.com/ref/${creator.handle}`,
    notes: idx === 0 ? 'รีวิวสินค้าแบบละเอียด พร้อมสาธิตวิธีใช้งาน' :
      idx === 1 ? 'คอนเทนต์แนว lifestyle ใช้ในชีวิตประจำวัน' :
        idx === 2 ? 'รีวิวเปรียบเทียบกับแบรนด์อื่น' :
          idx === 3 ? 'ใช้หลังออกกำลังกาย ผลลัพธ์ดีมาก!' :
            'แชร์ประสบการณ์ใช้จริง 1 สัปดาห์',
    day: idx + 1,
    status: 'pending',
    submittedAt: new Date(Date.now() - (idx * 3600000)).toISOString(),
  });
});

// Generate Submissions for Approved Applications
const approvedApps = mockApplications.filter(a => a.status === 'approved');

approvedApps.forEach((app) => {
  const submissionCount = Math.floor(Math.random() * 15) + 1; // 1-15 videos per person
  let totalViews = 0;
  let totalGMV = 0;

  for (let i = 0; i < submissionCount; i++) {
    const isApproved = Math.random() > 0.2; // 80% approved submissions
    const views = Math.floor(Math.random() * 500000) + 1000;
    const likes = Math.floor(views * (Math.random() * 0.1)); // 0-10% likes
    const gmv = Math.floor(Math.random() * 20000);

    mockSubmissions.push({
      id: `sub_${app.creatorId}_${i}`,
      campaignId: app.campaignId,
      creatorId: app.creatorId,
      creatorName: app.creatorName,
      creatorHandle: app.creatorHandle,
      creatorAvatar: app.creatorAvatar,
      videoUrl: `https://tiktok.com/@${app.creatorHandle}/video/${Math.random().toString(36).substr(2, 9)}`,
      promoLink: `https://shop.com/ref/${app.creatorHandle}`,
      notes: `Video day ${i + 1}`,
      day: i + 1,
      status: isApproved ? 'approved' : 'pending',
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      performance: {
        views,
        likes,
        shares: Math.floor(likes * 0.1),
        comments: Math.floor(likes * 0.05),
        gmv,
        engagementRate: (likes / views) * 100
      }
    });

    if (isApproved) {
      totalViews += views;
      totalGMV += gmv;
    }
  }

  // Generate Stats
  mockCreatorStats.push({
    campaignId: app.campaignId,
    creatorId: app.creatorId,
    totalVideos: submissionCount,
    approvedVideos: mockSubmissions.filter(s => s.creatorId === app.creatorId && s.status === 'approved').length,
    currentStreak: Math.floor(Math.random() * 10),
    maxStreak: Math.floor(Math.random() * 15),
    gmv: totalGMV,
    orders: Math.floor(totalGMV / 500),
    rank: { gmv: 0, volume: 0, streak: 0 } // Rank will be calculated dynamically in detailed views
  });
});

export const mockNotifications: Notification[] = [
  // Creator Notifications
  {
    id: '1',
    userId: 'creator1',
    type: 'payment_received',
    title: '💰 Brand โอนเงินแล้ว',
    message: 'Brand A โอนเงิน ฿5,000 สำหรับแคมเปญ Summer Sale 2026 แล้ว กรุณายืนยันการรับเงิน',
    read: false,
    link: '/creator/earnings',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    userId: 'creator1',
    type: 'payment_received',
    title: '💰 Brand โอนเงินแล้ว',
    message: 'Brand B โอนเงิน ฿3,500 สำหรับแคมเปญ Valentine Special แล้ว กรุณายืนยันการรับเงิน',
    read: false,
    link: '/creator/earnings',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    userId: 'creator1',
    type: 'application_approved',
    title: '✅ ใบสมัครได้รับอนุมัติ',
    message: 'ใบสมัครของคุณสำหรับแคมเปญ Beauty Glow Up Challenge ได้รับการอนุมัติแล้ว',
    read: true,
    link: '/creator/campaigns',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    userId: 'creator1',
    type: 'reminder',
    title: '⏰ ใกล้ครบกำหนดส่งงาน',
    message: 'อย่าลืมส่งงานสำหรับแคมเปญ Summer Sale 2026 ภายในวันนี้',
    read: true,
    link: '/creator/campaigns',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },

  // Brand Notifications
  {
    id: '5',
    userId: 'brand1',
    type: 'payment_confirmed',
    title: '✅ Creator ยืนยันรับเงินแล้ว',
    message: 'Sarah Beauty ยืนยันรับเงิน ฿5,000 สำหรับแคมเปญ Summer Sale 2026 แล้ว',
    read: false,
    link: '/brand/payments',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: '6',
    userId: 'brand1',
    type: 'payment_disputed',
    title: '⚠️ Creator รายงานปัญหาการจ่ายเงิน',
    message: 'Mike Lifestyle รายงานปัญหาการจ่ายเงิน ฿3,500 กรุณาตรวจสอบ',
    read: false,
    link: '/brand/payments',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: '7',
    userId: 'brand1',
    type: 'submission_received',
    title: '📹 Creator ส่งงานแล้ว',
    message: 'Emma Lifestyle ส่งงานวันที่ 5 สำหรับแคมเปญ Beauty Glow Up Challenge',
    read: true,
    link: '/brand/inbox',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: '8',
    userId: 'brand1',
    type: 'payment_reminder',
    title: '💸 คุณมีการจ่ายเงินที่รอดำเนินการ',
    message: '3 Creator รอรับเงิน ยอดรวม ฿10,500 กรุณาดำเนินการโอนเงิน',
    read: true,
    link: '/brand/payments',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

