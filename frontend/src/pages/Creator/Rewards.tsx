import { Trophy, Gift, Calendar, Check, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { Link } from 'react-router-dom';

// Mock rewards data
const mockRewards = [
    {
        id: '1',
        campaignId: '4',
        campaignName: 'New Year Fitness Challenge',
        brandName: 'FitLife',
        type: 'sales_milestone' as const,
        title: 'รางวัลยอดขาย GMV สูงสุด',
        rank: 3,
        amount: 3000,
        status: 'received' as const,
        receivedDate: new Date('2026-01-31'),
        description: 'อันดับที่ 3 - ยอดขาย GMV สูงสุด',
    },
    {
        id: '2',
        campaignId: '4',
        campaignName: 'New Year Fitness Challenge',
        brandName: 'FitLife',
        type: 'streak_bonus' as const,
        title: 'โบนัส Streak 28 วัน',
        rank: null,
        amount: 1000,
        status: 'received' as const,
        receivedDate: new Date('2026-01-31'),
        description: 'ส่งงานติดต่อกัน 28 วัน',
    },
    {
        id: '3',
        campaignId: '1',
        campaignName: 'สามสิบ ดรา คุณสัมฤทธิ์ 365 วัน Challenge',
        brandName: 'สามสิบ ดรา',
        type: 'top_volume' as const,
        title: 'รางวัลจำนวนวิดีโอมากที่สุด',
        rank: 5,
        amount: 1500,
        status: 'pending' as const,
        receivedDate: null,
        description: 'อันดับที่ 5 - จำนวนวิดีโอที่อนุมัติ (คาดการณ์)',
    },
    {
        id: '4',
        campaignId: '5',
        campaignName: 'Tech Gadget Review',
        brandName: 'TechStore',
        type: 'lucky_draw' as const,
        title: 'รางวัลสุ่ม',
        rank: null,
        amount: 500,
        status: 'received' as const,
        receivedDate: new Date('2026-01-22'),
        description: 'ถูกสุ่มจากผู้ที่ส่งงานครบ',
    },
];

const mockUpcomingRewards = [
    {
        campaignId: '1',
        campaignName: 'สามสิบ ดรา คุณสัมฤทธิ์ 365 วัน Challenge',
        brandName: 'สามสิบ ดรา',
        rewards: [
            { type: 'sales_milestone', title: 'รางวัลยอดขาย GMV', maxAmount: 10000, currentRank: 5 },
            { type: 'top_volume', title: 'รางวัลจำนวนวิดีโอ', maxAmount: 5000, currentRank: 5 },
            { type: 'streak_bonus', title: 'โบนัส Streak 365 วัน', maxAmount: 5000, currentStreak: 12 },
        ],
        announceDate: new Date('2027-01-20'),
    },
    {
        campaignId: '2',
        campaignName: 'Summer Sale 2026',
        brandName: 'Fashion Brand',
        rewards: [
            { type: 'sales_milestone', title: 'รางวัลยอดขาย', maxAmount: 5000, currentRank: 8 },
            { type: 'lucky_draw', title: 'รางวัลสุ่ม', maxAmount: 1000, eligible: true },
        ],
        announceDate: new Date('2026-02-27'),
    },
];

export default function Rewards() {
    const totalReceived = mockRewards
        .filter(r => r.status === 'received')
        .reduce((sum, r) => sum + r.amount, 0);

    const totalPending = mockRewards
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0);

    const getRewardIcon = (type: string) => {
        switch (type) {
            case 'sales_milestone':
                return '💰';
            case 'top_volume':
                return '📹';
            case 'streak_bonus':
                return '🔥';
            case 'lucky_draw':
                return '🎲';
            default:
                return '🎁';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold mb-2 dark:text-white">🏆 รางวัลที่ได้</h1>
                    <p className="text-gray-600 dark:text-gray-400">รางวัลและโบนัสจากแคมเปญต่างๆ</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Received */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5" />
                            <span className="text-sm opacity-90">รางวัลที่ได้รับแล้ว</span>
                        </div>
                        <p className="text-3xl font-bold mb-1">฿{totalReceived.toLocaleString()}</p>
                        <p className="text-sm opacity-75">
                            {mockRewards.filter(r => r.status === 'received').length} รางวัล
                        </p>
                    </div>

                    {/* Pending */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm opacity-90">รางวัลที่รอประกาศ</span>
                        </div>
                        <p className="text-3xl font-bold mb-1">฿{totalPending.toLocaleString()}</p>
                        <p className="text-sm opacity-75">
                            {mockRewards.filter(r => r.status === 'pending').length} รางวัล (คาดการณ์)
                        </p>
                    </div>
                </div>

                {/* Received Rewards */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                    <h3 className="font-bold text-lg mb-6 dark:text-white">✅ รางวัลที่ได้รับแล้ว</h3>
                    {mockRewards.filter(r => r.status === 'received').length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏆</div>
                            <p className="text-gray-600 dark:text-gray-400">ยังไม่มีรางวัลที่ได้รับ</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mockRewards
                                .filter(r => r.status === 'received')
                                .map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="relative group flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-500/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/40"
                                    >
                                        <div className="text-4xl filter drop-shadow-md">{getRewardIcon(reward.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium dark:text-emerald-50 group-hover:dark:text-emerald-400 transition-colors">{reward.title}</h4>
                                                {reward.rank && (
                                                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-500/30">
                                                        อันดับ {reward.rank}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                to={`/creator/campaigns/${reward.campaignId}`}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                            >
                                                {reward.campaignName} • {reward.brandName}
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                ได้รับเมื่อ: {reward.receivedDate?.toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                                                ฿{reward.amount.toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1 justify-end">
                                                <Check className="w-3 h-3" />
                                                <span>จ่ายแล้ว</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Pending Rewards */}
                {mockRewards.filter(r => r.status === 'pending').length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <h3 className="font-bold text-lg mb-6 dark:text-white">⏳ รางวัลที่รอประกาศ</h3>
                        <div className="space-y-4">
                            {mockRewards
                                .filter(r => r.status === 'pending')
                                .map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="relative group flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-500/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/40"
                                    >
                                        <div className="text-4xl filter drop-shadow-md">{getRewardIcon(reward.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium dark:text-amber-50 group-hover:dark:text-amber-400 transition-colors">{reward.title}</h4>
                                                {reward.rank && (
                                                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-500/30">
                                                        อันดับ {reward.rank} (ปัจจุบัน)
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                to={`/creator/campaigns/${reward.campaignId}`}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                            >
                                                {reward.campaignName} • {reward.brandName}
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{reward.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 drop-shadow-sm">
                                                ~฿{reward.amount.toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1 justify-end">
                                                <Clock className="w-3 h-3" />
                                                <span>คาดการณ์</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Rewards */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                    <h3 className="font-bold text-lg mb-6 dark:text-white">🎯 รางวัลที่กำลังแข่งขัน</h3>
                    <div className="space-y-6">
                        {mockUpcomingRewards.map((campaign) => (
                            <div key={campaign.campaignId} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <Link
                                            to={`/creator/campaigns/${campaign.campaignId}`}
                                            className="font-medium hover:text-primary transition-colors dark:text-white"
                                        >
                                            {campaign.campaignName}
                                        </Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">by {campaign.brandName}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>ประกาศ: {campaign.announceDate.toLocaleDateString('th-TH')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {campaign.rewards.map((reward, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-900/30"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{getRewardIcon(reward.type)}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium dark:text-white">{reward.title}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">สูงสุด ฿{reward.maxAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {'currentRank' in reward && (
                                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                                    อันดับปัจจุบัน: #{reward.currentRank}
                                                </p>
                                            )}
                                            {'currentStreak' in reward && (
                                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                                    Streak ปัจจุบัน: {reward.currentStreak} วัน
                                                </p>
                                            )}
                                            {'eligible' in reward && reward.eligible && (
                                                <p className="text-xs text-emerald-700 dark:text-emerald-300">✓ มีสิทธิ์เข้าร่วม</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <h3 className="font-bold text-lg mb-4 dark:text-blue-100 flex items-center gap-2 relative z-10">
                        💡 เคล็ดลับการได้รางวัล
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        <div className="flex gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="text-2xl">🔥</div>
                            <div>
                                <h4 className="font-medium mb-1 dark:text-blue-50">รักษา Streak</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    ส่งงานทุกวันติดต่อกันเพื่อโบนัส Streak
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="text-2xl">💰</div>
                            <div>
                                <h4 className="font-medium mb-1 dark:text-blue-50">เพิ่มยอดขาย</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    ทำคอนเทนต์ที่ดึงดูดและมี CTA ชัดเจน
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="text-2xl">📹</div>
                            <div>
                                <h4 className="font-medium mb-1 dark:text-blue-50">คุณภาพสูง</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    ทำวิดีโอคุณภาพดีเพื่อเพิ่มโอกาสอนุมัติ
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="text-2xl">🎯</div>
                            <div>
                                <h4 className="font-medium mb-1 dark:text-white">ติดตาม Leaderboard</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    เช็คอันดับบ่อยๆ เพื่อปรับกลยุทธ์
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
