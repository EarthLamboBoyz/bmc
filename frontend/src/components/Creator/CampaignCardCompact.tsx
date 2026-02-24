import { Clock, Flame, Trophy, Eye, Video, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CampaignCardCompactProps {
    campaign: {
        id: string;
        name: string;
        image: string;
        daysRemaining: number;
        endDate: string;
        currentDay: number;
        submittedToday: boolean;
        submittedAt?: string;
        todayViews?: number;
        hoursRemaining?: number;
        minutesRemaining?: number;
        currentStreak: number;
        currentRank: number;
        totalParticipants: number;
        gmv: number;
        videosSubmitted?: number;
        totalViews?: number;
    };
    onSubmitClick?: (campaignId: string) => void;
    submitLabel?: string;
}

export default function CampaignCardCompact({ campaign, onSubmitClick, submitLabel }: CampaignCardCompactProps) {
    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    // Calculate progress for streak
    const streakProgress = Math.min(((campaign.currentStreak || 0) / 20) * 100, 100);

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-col sm:flex-row">
                {/* Left: Image */}
                <div className="relative w-full sm:w-52 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                        src={campaign.image}
                        alt={campaign.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                    {/* Day badge */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            Day <span className="text-primary">{campaign.currentDay}</span>
                        </p>
                    </div>

                    {/* Streak badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-orange-500 text-white rounded-lg px-2.5 py-1 shadow-lg">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{campaign.currentStreak || 0}</span>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-5">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="mb-4">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-bold line-clamp-1 dark:text-white group-hover:text-primary transition-colors">
                                    {campaign.name}
                                </h3>
                                <span className="flex-shrink-0 text-lg">{getRankEmoji(campaign.currentRank)}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                เหลือ {campaign.daysRemaining} วัน • สิ้นสุด {new Date(campaign.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>

                        {/* Status Row - Redesigned as Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {/* Submission Status */}
                            {campaign.submittedToday ? (
                                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm border border-emerald-100 dark:border-emerald-800">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="font-medium">ส่งแล้ว {campaign.submittedAt}</span>
                                    {campaign.todayViews && (
                                        <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                                            👀 {campaign.todayViews.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm border border-amber-100 dark:border-amber-800 animate-pulse">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="font-medium">
                                        ยังไม่ส่ง • เหลือ {campaign.hoursRemaining}:{campaign.minutesRemaining?.toString().padStart(2, '0')} น.
                                    </span>
                                </div>
                            )}

                            {/* Stats Pills */}
                            <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm">
                                <Trophy className="w-3.5 h-3.5" />
                                <span className="font-medium">#{campaign.currentRank}/{campaign.totalParticipants}</span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="font-medium">฿{campaign.gmv.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Streak Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    Streak Progress
                                </span>
                                <span className="text-orange-600 dark:text-orange-400 font-medium">{streakProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                                    style={{ width: `${streakProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Row */}
                        {(campaign.videosSubmitted || campaign.totalViews) && (
                            <div className="flex items-center gap-4 mb-4 text-sm">
                                {campaign.videosSubmitted && (
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                            <Video className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                        <span className="font-medium">{campaign.videosSubmitted} คลิป</span>
                                    </div>
                                )}
                                {campaign.totalViews && (
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                        <span className="font-medium">{(campaign.totalViews / 1000).toFixed(0)}K views</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mt-auto">
                            <button
                                onClick={() => onSubmitClick?.(campaign.id)}
                                className="flex-1 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all text-center flex items-center justify-center gap-2"
                            >
                                {submitLabel || (campaign.submittedToday ? 'ส่งงานอีกครั้ง' : 'ส่งงานวันนี้')}
                            </button>
                            <Link
                                to={`/creator/campaigns/${campaign.id}`}
                                className="flex-1 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 transition-all text-center flex items-center justify-center gap-1 group/btn"
                            >
                                รายละเอียด
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
