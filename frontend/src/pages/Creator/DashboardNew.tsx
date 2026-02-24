import { useState } from 'react';
import { TrendingUp, Video, Eye, Flame, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CampaignCard from '../../components/Creator/CampaignCard';
import RewardsPanel from '../../components/Creator/RewardsPanel';

// Mock data for creator's campaigns
const mockCreatorCampaigns = [
    {
        id: '1',
        name: 'Summer Sale 2026',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        daysRemaining: 18,
        endDate: '2026-02-19',
        totalBudget: 50000,

        // Today's status
        currentDay: 12,
        submittedToday: true,
        submittedAt: '10:30',
        todayViews: 1200,

        // Streak
        currentStreak: 12,
        nextStreakMilestone: 20,
        nextStreakReward: 1000,
        daysToNextStreak: 8,

        // Ranking
        currentRank: 2,
        totalParticipants: 97,
        gmv: 45200,
        gapToRank1: 12300,
        gapFromRank3: 8500,

        // Stats
        videosSubmitted: 12,
        totalViews: 234000,
        totalOrders: 89,
        conversionRate: 7.8,
    },
    {
        id: '2',
        name: 'New Year Campaign',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
        daysRemaining: 5,
        endDate: '2026-02-06',
        totalBudget: 30000,

        // Today's status
        currentDay: 8,
        submittedToday: false,
        hoursRemaining: 10,
        minutesRemaining: 34,

        // Streak
        currentStreak: 7,
        nextStreakMilestone: 20,
        nextStreakReward: 1000,
        daysToNextStreak: 13,

        // Ranking
        currentRank: 3,
        totalParticipants: 45,
        gmv: 12000,
        gapToRank2: 3500,
        gapFromRank4: 2100,

        // Stats
        videosSubmitted: 8,
        totalViews: 89000,
        totalOrders: 34,
        conversionRate: 6.2,
    },
];

// Mock rewards data
const mockRewards = {
    totalMin: 8500,
    totalMax: 13500,
    campaignCount: 2,

    guaranteed: [
        {
            id: 'r1',
            type: 'sales_rank',
            rank: 2,
            amount: 5000,
            campaignName: 'Summer Sale 2026',
            campaignId: '1',
            status: 'guaranteed' as const,
            description: 'คุณอยู่อันดับ 2 ตอนนี้!',
        },
        {
            id: 'r2',
            type: 'lucky_draw',
            amount: 500,
            campaignName: 'Summer Sale 2026',
            campaignId: '1',
            status: 'guaranteed' as const,
            description: 'ผ่านเกณฑ์: ส่ง >10 คลิป',
        },
        {
            id: 'r3',
            type: 'lucky_draw',
            amount: 500,
            campaignName: 'New Year Campaign',
            campaignId: '2',
            status: 'guaranteed' as const,
            description: 'ผ่านเกณฑ์: ส่ง >10 คลิป',
        },
    ],

    possible: [
        {
            id: 'r4',
            type: 'streak_bonus',
            days: 20,
            amount: 1000,
            campaignName: 'Summer Sale 2026',
            campaignId: '1',
            status: 'possible' as const,
            daysNeeded: 8,
            probability: 80,
            currentProgress: 60,
        },
        {
            id: 'r5',
            type: 'top_volume',
            rank: 3,
            amount: 2000,
            campaignName: 'New Year Campaign',
            campaignId: '2',
            status: 'possible' as const,
            videosNeeded: 5,
            currentRank: 5,
            probability: 60,
            currentProgress: 30,
        },
    ],

    difficult: [
        {
            id: 'r6',
            type: 'sales_rank',
            rank: 1,
            amount: 10000,
            campaignName: 'Summer Sale 2026',
            campaignId: '1',
            status: 'difficult' as const,
            gmvNeeded: 12300,
            probability: 30,
            currentProgress: 10,
        },
    ],

    recommendations: [
        {
            priority: 'urgent' as const,
            text: 'ส่งงาน New Year Day 8',
            detail: 'เหลือ 10 ชม.',
            action: 'submit',
            campaignId: '2',
        },
        {
            priority: 'high' as const,
            text: 'ส่งอีก 5 คลิป',
            detail: '→ +฿2,000 (New Year)',
            action: 'create',
            campaignId: '2',
        },
        {
            priority: 'medium' as const,
            text: 'Streak ต่อเนื่อง 8 วัน',
            detail: '→ +฿1,000',
            action: 'maintain',
            campaignId: '1',
        },
    ],
};

export default function CreatorDashboardNew() {
    // Calculate overall stats
    const totalGMV = mockCreatorCampaigns.reduce((sum, c) => sum + c.gmv, 0);
    const totalVideos = mockCreatorCampaigns.reduce((sum, c) => sum + c.videosSubmitted, 0);
    const maxStreak = Math.max(...mockCreatorCampaigns.map(c => c.currentStreak));

    return (
        <DashboardLayout>
            {/* Header with overall stats */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">👋 สวัสดี, Creator Name</h1>

                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">📊 สถิติรวมทั้งหมด</h2>
                        <button className="text-sm text-white/80 hover:text-white">ดูทั้งหมด →</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Video className="w-4 h-4" />
                                <span className="text-sm opacity-80">แคมเปญ</span>
                            </div>
                            <p className="text-2xl font-bold">{mockCreatorCampaigns.length}</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm opacity-80">GMV รวม</span>
                            </div>
                            <p className="text-2xl font-bold">฿{(totalGMV / 1000).toFixed(1)}K</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm opacity-80">วิดีโอ</span>
                            </div>
                            <p className="text-2xl font-bold">{totalVideos}</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="w-4 h-4" />
                                <span className="text-sm opacity-80">Streak สูงสุด</span>
                            </div>
                            <p className="text-2xl font-bold">🔥 {maxStreak}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content: Campaigns + Rewards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Campaign Cards (2 columns on large screens) */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">🎯 แคมเปญที่กำลังทำ ({mockCreatorCampaigns.length})</h2>
                    </div>

                    <div className="space-y-4">
                        {mockCreatorCampaigns.map(campaign => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onSubmit={() => console.log('Submit', campaign.id)}
                                onViewDetails={() => console.log('View details', campaign.id)}
                            />
                        ))}

                        <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors">
                            + ดูแคมเปญทั้งหมด
                        </button>
                    </div>
                </div>

                {/* Right: Rewards Panel */}
                <div className="lg:col-span-1">
                    <RewardsPanel rewards={mockRewards} />
                </div>
            </div>
        </DashboardLayout>
    );
}
