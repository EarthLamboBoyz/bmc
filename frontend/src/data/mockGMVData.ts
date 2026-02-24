// Mock GMV Data for TikTok Shop Analytics
export interface CreatorPerformance {
    id: string;
    name: string;
    username: string;
    avatar: string;
    gmv: number;
    orders: number;
    videos: number;
    conversionRate: number;
    commission: number;
    contentType: 'video' | 'livestream' | 'mixed';
}

export interface ProductPerformance {
    id: string;
    name: string;
    sku: string;
    gmv: number;
    orders: number;
    quantity: number;
    price: number;
}

export interface DailyGMV {
    date: string;
    gmv: number;
    orders: number;
    creators: number;
}

export interface GMVSummary {
    totalGMV: number;
    totalOrders: number;
    activeCreators: number;
    avgOrderValue: number;
    conversionRate: number;
    totalCommission: number;
    lastUpdated: string;
}

export interface ContentTypeDistribution {
    type: 'Video' | 'Livestream';
    value: number;
    percentage: number;
}

// Mock Creator Performance Data
export const mockCreatorPerformance: CreatorPerformance[] = [
    {
        id: '1',
        name: 'Sarah Beauty',
        username: '@beauty_sara',
        avatar: 'https://i.pravatar.cc/150?img=1',
        gmv: 450000,
        orders: 1200,
        videos: 12,
        conversionRate: 8.5,
        commission: 45000,
        contentType: 'mixed',
    },
    {
        id: '2',
        name: 'Mike Lifestyle',
        username: '@mike_life',
        avatar: 'https://i.pravatar.cc/150?img=2',
        gmv: 380000,
        orders: 980,
        videos: 14,
        conversionRate: 7.2,
        commission: 38000,
        contentType: 'video',
    },
    {
        id: '3',
        name: 'Anya Health',
        username: '@anya_health',
        avatar: 'https://i.pravatar.cc/150?img=3',
        gmv: 320000,
        orders: 850,
        videos: 10,
        conversionRate: 9.1,
        commission: 32000,
        contentType: 'livestream',
    },
    {
        id: '4',
        name: 'David Tech',
        username: '@david_tech',
        avatar: 'https://i.pravatar.cc/150?img=4',
        gmv: 280000,
        orders: 720,
        videos: 8,
        conversionRate: 6.8,
        commission: 28000,
        contentType: 'video',
    },
    {
        id: '5',
        name: 'Emma Fashion',
        username: '@emma_fashion',
        avatar: 'https://i.pravatar.cc/150?img=5',
        gmv: 250000,
        orders: 650,
        videos: 15,
        conversionRate: 7.5,
        commission: 25000,
        contentType: 'mixed',
    },
    {
        id: '6',
        name: 'Tom Food',
        username: '@tom_foodie',
        avatar: 'https://i.pravatar.cc/150?img=6',
        gmv: 220000,
        orders: 580,
        videos: 11,
        conversionRate: 8.2,
        commission: 22000,
        contentType: 'video',
    },
    {
        id: '7',
        name: 'Lisa Travel',
        username: '@lisa_travel',
        avatar: 'https://i.pravatar.cc/150?img=7',
        gmv: 180000,
        orders: 480,
        videos: 9,
        conversionRate: 6.5,
        commission: 18000,
        contentType: 'livestream',
    },
    {
        id: '8',
        name: 'John Gaming',
        username: '@john_gamer',
        avatar: 'https://i.pravatar.cc/150?img=8',
        gmv: 150000,
        orders: 420,
        videos: 13,
        conversionRate: 5.9,
        commission: 15000,
        contentType: 'video',
    },
];

// Mock Product Performance Data
export const mockProductPerformance: ProductPerformance[] = [
    {
        id: 'P001',
        name: 'Vitamin C Serum',
        sku: 'VIT-C-001',
        gmv: 380000,
        orders: 950,
        quantity: 1200,
        price: 299,
    },
    {
        id: 'P002',
        name: 'Hyaluronic Acid Moisturizer',
        sku: 'HA-MOI-002',
        gmv: 320000,
        orders: 800,
        quantity: 1000,
        price: 399,
    },
    {
        id: 'P003',
        name: 'Retinol Night Cream',
        sku: 'RET-NC-003',
        gmv: 280000,
        orders: 560,
        quantity: 700,
        price: 499,
    },
    {
        id: 'P004',
        name: 'Niacinamide Toner',
        sku: 'NIA-TON-004',
        gmv: 240000,
        orders: 960,
        quantity: 1200,
        price: 199,
    },
    {
        id: 'P005',
        name: 'Sunscreen SPF50',
        sku: 'SUN-SPF-005',
        gmv: 220000,
        orders: 880,
        quantity: 1100,
        price: 249,
    },
    {
        id: 'P006',
        name: 'Collagen Face Mask',
        sku: 'COL-FM-006',
        gmv: 180000,
        orders: 720,
        quantity: 900,
        price: 199,
    },
    {
        id: 'P007',
        name: 'Peptide Eye Cream',
        sku: 'PEP-EC-007',
        gmv: 160000,
        orders: 400,
        quantity: 500,
        price: 399,
    },
    {
        id: 'P008',
        name: 'AHA/BHA Exfoliator',
        sku: 'AHA-EXF-008',
        gmv: 140000,
        orders: 560,
        quantity: 700,
        price: 249,
    },
];

// Mock Daily GMV Data (Last 30 days)
export const mockDailyGMV: DailyGMV[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));

    // Generate realistic fluctuating data
    const baseGMV = 80000;
    const variation = Math.sin(i / 5) * 20000 + Math.random() * 15000;
    const gmv = Math.round(baseGMV + variation);

    return {
        date: date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
        gmv,
        orders: Math.round(gmv / 350), // Average order value ~350
        creators: Math.min(97, 80 + Math.floor(Math.random() * 20)),
    };
});

// Mock GMV Summary
export const mockGMVSummary: GMVSummary = {
    totalGMV: 2450000,
    totalOrders: 8234,
    activeCreators: 97,
    avgOrderValue: 298,
    conversionRate: 7.8,
    totalCommission: 245000,
    lastUpdated: '27 ม.ค. 2026, 14:30',
};

// Mock Content Type Distribution
export const mockContentTypeDistribution: ContentTypeDistribution[] = [
    {
        type: 'Video',
        value: 1470000,
        percentage: 60,
    },
    {
        type: 'Livestream',
        value: 980000,
        percentage: 40,
    },
];

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
    return `฿${amount.toLocaleString('th-TH')}`;
};

// Helper function to format percentage
export const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
};
