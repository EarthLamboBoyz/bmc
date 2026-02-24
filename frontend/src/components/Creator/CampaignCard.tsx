import { Clock, Flame, TrendingUp, Eye, Video, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CampaignCardProps {
    campaign: {
        id: string;
        name: string;
        image: string;
        daysRemaining: number;
        endDate: string;
        totalBudget: number;
        currentDay: number;
        submittedToday: boolean;
        submittedAt?: string;
        todayViews?: number;
        hoursRemaining?: number;
        minutesRemaining?: number;
        currentStreak: number;
        nextStreakMilestone: number;
        nextStreakReward: number;
        daysToNextStreak: number;
        currentRank: number;
        totalParticipants: number;
        gmv: number;
        gapToRank1?: number;
        gapToRank2?: number;
        gapFromRank3?: number;
        gapFromRank4?: number;
        videosSubmitted: number;
        totalViews: number;
        totalOrders: number;
        conversionRate: number;
    };
    onSubmit: () => void;
    onViewDetails: () => void;
}

export default function CampaignCard({ campaign, onSubmit, onViewDetails }: CampaignCardProps) {
    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const streakProgress = (campaign.currentStreak / campaign.nextStreakMilestone) * 100;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header with Campaign Name */}
            <div className="relative h-32">
                <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{campaign.name}</h3>
                    <p className="text-white/80 text-sm">
                        📅 เหลือ {campaign.daysRemaining} วัน • สิ้นสุด {new Date(campaign.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Today's Status */}
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">📍 สถานะวันนี้ (Day {campaign.currentDay})</h4>
                    {campaign.submittedToday ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-semibold text-emerald-800">✅ ส่งงานแล้ว</span>
                            </div>
                            <p className="text-sm text-emerald-600 mb-2">
                                เมื่อ {campaign.submittedAt} น. • 👀 {campaign.todayViews?.toLocaleString()} views
                            </p>
                            <button
                                onClick={onSubmit}
                                className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                ส่งงานอีกครั้ง
                            </button>
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-amber-800">⚠️ ยังไม่ส่ง Day {campaign.currentDay}</span>
                            </div>
                            <p className="text-sm text-amber-600 mb-2">
                                ⏰ เหลือ {campaign.hoursRemaining} ชม. {campaign.minutesRemaining} น.
                            </p>
                            <button
                                onClick={onSubmit}
                                className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                ส่งงานเลย
                            </button>
                        </div>
                    )}
                </div>

                {/* Streak */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold">Streak: {campaign.currentStreak} วันติด</span>
                        </div>
                        <span className="text-sm text-gray-500">{streakProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                            style={{ width: `${Math.min(streakProgress, 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">
                        💰 ส่งอีก {campaign.daysToNextStreak} วัน → ลุ้นรางวัล Streak {campaign.nextStreakMilestone} วัน (฿{campaign.nextStreakReward.toLocaleString()})
                    </p>
                </div>

                {/* Ranking */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">🏆 อันดับปัจจุบัน</h4>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-bold">{getRankEmoji(campaign.currentRank)}</span>
                        <span className="text-lg font-bold text-purple-700">
                            #{campaign.currentRank} <span className="text-sm text-gray-500">/ {campaign.totalParticipants}</span>
                        </span>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">ยอดขาย:</span>
                            <span className="font-semibold">฿{campaign.gmv.toLocaleString()}</span>
                        </div>
                        {campaign.gapToRank1 && (
                            <div className="flex items-center justify-between text-amber-600">
                                <span>ห่าง #1:</span>
                                <span className="font-semibold flex items-center gap-1">
                                    <ArrowUp className="w-3 h-3" />
                                    ฿{campaign.gapToRank1.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {campaign.gapToRank2 && (
                            <div className="flex items-center justify-between text-amber-600">
                                <span>ห่าง #2:</span>
                                <span className="font-semibold flex items-center gap-1">
                                    <ArrowUp className="w-3 h-3" />
                                    ฿{campaign.gapToRank2.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {campaign.gapFromRank3 && (
                            <div className="flex items-center justify-between text-emerald-600">
                                <span>ห่าง #3:</span>
                                <span className="font-semibold flex items-center gap-1">
                                    <ArrowDown className="w-3 h-3" />
                                    ฿{campaign.gapFromRank3.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {campaign.gapFromRank4 && (
                            <div className="flex items-center justify-between text-emerald-600">
                                <span>ห่าง #4:</span>
                                <span className="font-semibold flex items-center gap-1">
                                    <ArrowDown className="w-3 h-3" />
                                    ฿{campaign.gapFromRank4.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">📊 สถิติของคุณในแคมเปญนี้</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <Video className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-semibold">{campaign.videosSubmitted}</p>
                                <p className="text-xs text-gray-500">คลิป</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-semibold">{(campaign.totalViews / 1000).toFixed(0)}K</p>
                                <p className="text-xs text-gray-500">views</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-semibold">{campaign.totalOrders}</p>
                                <p className="text-xs text-gray-500">orders</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-semibold">{campaign.conversionRate}%</p>
                                <p className="text-xs text-gray-500">CR</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                    <Link
                        to={`/creator/campaigns/${campaign.id}`}
                        className="block w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                    >
                        รายละเอียด
                    </Link>
                </div>
            </div>
        </div>
    );
}
