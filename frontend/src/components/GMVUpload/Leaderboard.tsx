import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Flame, ShoppingCart, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    creatorId: string;
    creatorName: string;
    tiktokHandle: string | null;
    followers: number;
    totalSubmissions: number;
    approvedSubmissions: number;
    currentStreak: number;
    longestStreak: number;
    gmv: number;
    orders: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    engagementRate: string;
}

interface LeaderboardProps {
    campaignId: string;
}

type SortBy = 'gmv' | 'videos' | 'streak';

export default function Leaderboard({ campaignId }: LeaderboardProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>('gmv');
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalCreators: 0,
        totalGMV: 0,
        totalOrders: 0
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchLeaderboard();
    }, [campaignId, sortBy]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/api/gmv/leaderboard/${campaignId}?sortBy=${sortBy}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }

            const data = await response.json();
            setEntries(data.leaderboard);
            setSummary({
                totalCreators: data.totalCreators,
                totalGMV: data.totalGMV,
                totalOrders: data.totalOrders
            });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-400 dark:border-yellow-500/50';
            case 2:
                return 'bg-gray-100 dark:bg-gray-400/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-400/50';
            case 3:
                return 'bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-600/50';
            default:
                return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm">ครีเอเตอร์</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalCreators}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">ยอดขายรวม</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.totalGMV)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">ออเดอร์</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.totalOrders.toLocaleString()}</p>
                </div>
            </div>

            {/* Sort Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSortBy('gmv')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortBy === 'gmv'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    ยอดขาย (GMV)
                </button>
                <button
                    onClick={() => setSortBy('videos')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortBy === 'videos'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                >
                    <Eye className="w-4 h-4 inline mr-2" />
                    จำนวนวิดีโอ
                </button>
                <button
                    onClick={() => setSortBy('streak')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortBy === 'streak'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                >
                    <Flame className="w-4 h-4 inline mr-2" />
                    Streak
                </button>
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-xl border-2 border-black overflow-hidden shadow-lg" style={{ backgroundColor: '#ffffff' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#e5e5e5' }}>
                            <tr>
                                <th className="px-4 py-4 text-left text-base font-bold" style={{ color: '#000000' }}>อันดับ</th>
                                <th className="px-4 py-4 text-left text-base font-bold" style={{ color: '#000000' }}>ครีเอเตอร์</th>
                                <th className="px-4 py-4 text-right text-base font-bold" style={{ color: '#000000' }}>ยอดขาย</th>
                                <th className="px-4 py-4 text-right text-base font-bold" style={{ color: '#000000' }}>วิดีโอ</th>
                                <th className="px-4 py-4 text-right text-base font-bold" style={{ color: '#000000' }}>Streak</th>
                                <th className="px-4 py-4 text-right text-base font-bold" style={{ color: '#000000' }}>Engagement</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#ffffff' }}>
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-base font-bold" style={{ color: '#000000' }}>
                                        ยังไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry.creatorId} className="border-b border-gray-300">
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 text-base font-bold ${getRankStyle(entry.rank)}`}>
                                                {entry.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-bold text-base" style={{ color: '#000000' }}>{entry.creatorName}</p>
                                                <p className="text-sm font-bold" style={{ color: '#374151' }}>
                                                    {entry.tiktokHandle || `@${entry.creatorName.toLowerCase().replace(/\s/g, '_')}`}
                                                </p>
                                                <p className="text-xs font-bold" style={{ color: '#4b5563' }}>
                                                    {formatNumber(entry.followers)} followers
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <p className="font-bold text-lg" style={{ color: '#15803d' }}>
                                                {formatCurrency(entry.gmv)}
                                            </p>
                                            <p className="text-sm font-bold" style={{ color: '#374151' }}>
                                                {entry.orders.toLocaleString()} orders
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <p className="font-bold text-lg" style={{ color: '#000000' }}>
                                                {entry.approvedSubmissions}
                                            </p>
                                            <p className="text-sm font-bold" style={{ color: '#374151' }}>
                                                อนุมัติแล้ว
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1" style={{ color: '#ea580c' }}>
                                                <Flame className="w-5 h-5" />
                                                <span className="font-bold text-lg">{entry.currentStreak}</span>
                                            </div>
                                            <p className="text-sm font-bold" style={{ color: '#374151' }}>
                                                สูงสุด {entry.longestStreak}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <p className="font-bold text-lg" style={{ color: '#000000' }}>
                                                {entry.engagementRate}%
                                            </p>
                                            <div className="flex items-center justify-end gap-2 text-sm font-bold mt-1" style={{ color: '#374151' }}>
                                                <span className="flex items-center gap-0.5">
                                                    <Eye className="w-4 h-4" />
                                                    {formatNumber(entry.totalViews)}
                                                </span>
                                                <span className="flex items-center gap-0.5">
                                                    <Heart className="w-4 h-4" />
                                                    {formatNumber(entry.totalLikes)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
