import { Trophy, Flame, TrendingUp, DollarSign, Target, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Reward {
    id: string;
    type: string;
    amount: number;
    campaignName: string;
    campaignId: string;
    status: 'guaranteed' | 'possible' | 'difficult';
    rank?: number;
    days?: number;
    description?: string;
    daysNeeded?: number;
    videosNeeded?: number;
    gmvNeeded?: number;
    currentRank?: number;
    probability?: number;
    currentProgress?: number;
}

interface Recommendation {
    priority: 'urgent' | 'high' | 'medium';
    text: string;
    detail: string;
    action: string;
    campaignId: string;
}

interface RewardsPanelProps {
    rewards: {
        totalMin: number;
        totalMax: number;
        campaignCount: number;
        guaranteed: Reward[];
        possible: Reward[];
        difficult: Reward[];
        recommendations: Recommendation[];
    };
}

export default function RewardsPanel({ rewards }: RewardsPanelProps) {
    const getRewardIcon = (type: string) => {
        switch (type) {
            case 'sales_rank':
                return <Trophy className="w-4 h-4" />;
            case 'streak_bonus':
                return <Flame className="w-4 h-4" />;
            case 'top_volume':
                return <TrendingUp className="w-4 h-4" />;
            case 'lucky_draw':
                return <Target className="w-4 h-4" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    const getRewardTitle = (reward: Reward) => {
        switch (reward.type) {
            case 'sales_rank':
                return `Sales Rank ${reward.rank}`;
            case 'streak_bonus':
                return `Streak ${reward.days} วัน`;
            case 'top_volume':
                return `Top Volume Rank ${reward.rank}`;
            case 'lucky_draw':
                return 'Lucky Draw';
            default:
                return 'รางวัลพิเศษ';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
            case 'high':
                return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300';
            case 'medium':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
            default:
                return 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return '🚨';
            case 'high':
                return '💰';
            case 'medium':
                return '📈';
            default:
                return '💡';
        }
    };

    const hasRewards = rewards.guaranteed.length > 0 || rewards.possible.length > 0 || rewards.difficult.length > 0;

    if (!hasRewards) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 dark:text-white">รางวัลที่คุณอาจได้รับ</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        เข้าร่วมแคมเปญเพื่อดูรางวัลที่คุณมีโอกาสได้รับ
                    </p>
                    <Link
                        to="/creator/campaigns"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                        หาแคมเปญ
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 sticky top-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">รางวัลที่คุณอาจได้รับ</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ประมาณการรายได้</p>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4">
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        ฿{rewards.totalMin.toLocaleString()} - ฿{rewards.totalMax.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        จาก {rewards.campaignCount} แคมเปญที่เข้าร่วม
                    </p>
                </div>
            </div>

            {/* Guaranteed Rewards */}
            {rewards.guaranteed.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <span className="text-xs">✅</span>
                        </div>
                        แทบแน่นอน ({rewards.guaranteed.length} รางวัล)
                    </h3>
                    <div className="space-y-2">
                        {rewards.guaranteed.map(reward => (
                            <div key={reward.id} className="group bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3 hover:bg-emerald-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            {getRewardIcon(reward.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-emerald-900 dark:text-emerald-200">{getRewardTitle(reward)}</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400">{reward.campaignName}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-emerald-700 dark:text-emerald-300">฿{reward.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Possible Rewards */}
            {rewards.possible.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Flame className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        ต้องพยายาม ({rewards.possible.length} รางวัล)
                    </h3>
                    <div className="space-y-2">
                        {rewards.possible.map(reward => (
                            <div key={reward.id} className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                            {getRewardIcon(reward.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-amber-900 dark:text-amber-200">{getRewardTitle(reward)}</p>
                                            <p className="text-xs text-amber-600 dark:text-amber-400">{reward.campaignName}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-amber-700 dark:text-amber-300">฿{reward.amount.toLocaleString()}</p>
                                </div>
                                {reward.currentProgress !== undefined && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-amber-600 dark:text-amber-400">ความคืบหน้า</span>
                                            <span className="text-amber-700 dark:text-amber-300">{reward.currentProgress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                                                style={{ width: `${reward.currentProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Difficult Rewards */}
            {rewards.difficult.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        ยาก ({rewards.difficult.length} รางวัล)
                    </h3>
                    <div className="space-y-2">
                        {rewards.difficult.map(reward => (
                            <div key={reward.id} className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-3">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                            {getRewardIcon(reward.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-red-900 dark:text-red-200">{getRewardTitle(reward)}</p>
                                            <p className="text-xs text-red-600 dark:text-red-400">{reward.campaignName}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-red-700 dark:text-red-300">฿{reward.amount.toLocaleString()}</p>
                                </div>
                                {reward.currentProgress !== undefined && (
                                    <div className="mt-2">
                                        <div className="h-1.5 bg-red-100 dark:bg-red-900/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-500 rounded-full transition-all"
                                                style={{ width: `${Math.min(reward.currentProgress, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {rewards.recommendations.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        แนะนำการทำงาน
                    </h3>
                    <div className="space-y-2">
                        {rewards.recommendations.map((rec, index) => (
                            <div key={index} className={`border rounded-xl p-3 ${getPriorityColor(rec.priority)}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">{getPriorityIcon(rec.priority)}</span>
                                        <div>
                                            <p className="font-medium text-sm dark:text-gray-200">{rec.text}</p>
                                            <p className="text-xs opacity-80 mt-0.5 dark:text-gray-300">{rec.detail}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="text-xs px-3 py-1.5 bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 rounded-lg font-medium transition-colors whitespace-nowrap dark:text-white"
                                        onClick={() => console.log('Action:', rec.action)}
                                    >
                                        {rec.action === 'submit' ? 'ส่งงานเลย' : rec.action === 'create' ? 'สร้างเลย' : 'ดูรายละเอียด'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            <Link
                to="/creator/rewards"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 transition-all group"
            >
                ดูรางวัลทั้งหมด
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
}
