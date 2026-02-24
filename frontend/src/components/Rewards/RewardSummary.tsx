import { useState, useEffect } from 'react';
import { Calculator, Trophy, Users, Banknote, Gift, Target, Flame, Shuffle, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

interface Winner {
    creatorId: string;
    creatorName: string;
    rewardType: string;
    rewardName: string;
    amount: number;
    rank?: number;
    criteria: string;
}

interface RewardResult {
    rewardType: string;
    rewardName: string;
    winners: Winner[];
    totalAmount: number;
}

interface RewardSummaryProps {
    campaignId: string;
}

const rewardIcons: Record<string, React.ReactNode> = {
    sales_milestone: <Target className="w-5 h-5" />,
    top_volume: <Award className="w-5 h-5" />,
    streak_bonus: <Flame className="w-5 h-5" />,
    lucky_draw: <Shuffle className="w-5 h-5" />,
    custom: <Gift className="w-5 h-5" />
};

const rewardColors: Record<string, string> = {
    sales_milestone: 'bg-emerald-500',
    top_volume: 'bg-blue-500',
    streak_bonus: 'bg-orange-500',
    lucky_draw: 'bg-purple-500',
    custom: 'bg-pink-500'
};

export default function RewardSummary({ campaignId }: RewardSummaryProps) {
    const [results, setResults] = useState<RewardResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [expandedReward, setExpandedReward] = useState<string | null>(null);
    const [summary, setSummary] = useState({ totalWinners: 0, totalAmount: 0 });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const fetchPreview = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/rewards/preview/${campaignId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results);
                calculateSummary(data.results);
            }
        } catch (error) {
            console.error('Error fetching reward preview:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateRewards = async () => {
        console.log('🎯 Frontend: calculateRewards called for campaign:', campaignId);
        try {
            setCalculating(true);
            const token = localStorage.getItem('token');
            const url = `${API_URL}/api/rewards/calculate/${campaignId}`;
            console.log('🎯 Frontend: Fetching URL:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('🎯 Frontend: Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('🎯 Frontend: Error response:', errorText);
                throw new Error('Failed to calculate rewards');
            }

            const data = await response.json();
            setResults(data.results);
            setSummary(data.summary);
            showSuccess('คำนวณรางวัลสำเร็จ!');
        } catch (error: any) {
            showError(error.message);
        } finally {
            setCalculating(false);
        }
    };

    const calculateSummary = (data: RewardResult[]) => {
        const totalWinners = data.reduce((sum, r) => sum + r.winners.length, 0);
        const totalAmount = data.reduce((sum, r) => sum + r.totalAmount, 0);
        setSummary({ totalWinners, totalAmount });
    };

    useEffect(() => {
        fetchPreview();
    }, [campaignId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0
        }).format(amount);
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
            {/* Header with Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-primary" />
                            สรุปรางวัลทั้งหมด
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            คำนวณจากข้อมูล GMV, วิดีโอ และ Streak
                        </p>
                    </div>
                    <button
                        onClick={calculateRewards}
                        disabled={calculating}
                        className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {calculating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                กำลังคำนวณ...
                            </>
                        ) : (
                            <>
                                <Calculator className="w-5 h-5" />
                                คำนวณรางวัล
                            </>
                        )}
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">ประเภทรางวัล</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalWinners}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">ผู้ได้รับรางวัล</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
                                <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(summary.totalAmount)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">งบประมาณรวม</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reward Type Cards */}
            {results.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <Gift className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">ยังไม่มีการคำนวณรางวัล</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        กด "คำนวณรางวัล" เพื่อดูผลการคำนวณจากข้อมูลต่างๆ
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((result) => (
                        <div
                            key={result.rewardType}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm"
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedReward(
                                    expandedReward === result.rewardType ? null : result.rewardType
                                )}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rewardColors[result.rewardType]}/10 dark:${rewardColors[result.rewardType]}/20`}>
                                        <span className={rewardColors[result.rewardType].replace('bg-', 'text-')}>
                                            {rewardIcons[result.rewardType]}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{result.rewardName}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {result.winners.length} คน • {formatCurrency(result.totalAmount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                                        {formatCurrency(result.totalAmount)}
                                    </span>
                                    {expandedReward === result.rewardType ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                                    )}
                                </div>
                            </button>

                            {/* Winners List */}
                            {expandedReward === result.rewardType && (
                                <div className="border-t border-gray-200 dark:border-slate-700">
                                    <div className="px-6 py-3 bg-gray-50 dark:bg-slate-900/50 grid grid-cols-12 gap-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        <div className="col-span-1">อันดับ</div>
                                        <div className="col-span-4">Creator</div>
                                        <div className="col-span-4">เกณฑ์</div>
                                        <div className="col-span-3 text-right">รางวัล</div>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {result.winners.map((winner, idx) => (
                                            <div
                                                key={`${winner.creatorId}-${idx}`}
                                                className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-slate-700/30"
                                            >
                                                <div className="col-span-1">
                                                    {winner.rank ? (
                                                        <span className="text-lg">
                                                            {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : winner.rank === 3 ? '🥉' : winner.rank}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                                <div className="col-span-4">
                                                    <p className="font-medium text-gray-900 dark:text-white">{winner.creatorName}</p>
                                                </div>
                                                <div className="col-span-4">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{winner.criteria}</p>
                                                </div>
                                                <div className="col-span-3 text-right">
                                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(winner.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
