import prisma from '../utils/prisma';

interface RewardConfig {
    id?: string;
    type: string;
    title?: string;
    budget?: number;
    config: any;
}

interface CreatorStats {
    creatorId: string;
    creatorName: string;
    gmv: number;
    orders: number;
    approvedSubmissions: number;
    currentStreak: number;
    longestStreak: number;
}

interface Winner {
    creatorId: string;
    creatorName: string;
    rewardType: string;
    rewardName: string;
    amount: number;
    rank?: number;
    criteria: string;
}

interface CalculationResult {
    rewardType: string;
    rewardName: string;
    winners: Winner[];
    totalAmount: number;
}

/**
 * Calculate all rewards for a campaign
 */
export const calculateRewards = async (campaignId: string): Promise<CalculationResult[]> => {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { brand: { select: { companyName: true } } }
    });

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    // Get all creator stats for this campaign
    const stats = await prisma.creatorCampaignStats.findMany({
        where: { campaignId },
        orderBy: { gmv: 'desc' }
    });

    // Get creator details
    const creatorIds = stats.map(s => s.creatorId);
    const profiles = await prisma.creatorProfile.findMany({
        where: { id: { in: creatorIds } }
    });

    const profileMap = new Map(profiles.map(p => [p.id, p]));

    const creatorStats: CreatorStats[] = stats.map(stat => {
        const profile = profileMap.get(stat.creatorId);
        return {
            creatorId: stat.creatorId,
            creatorName: profile?.displayName || 'Unknown',
            gmv: stat.gmv || 0,
            orders: stat.orders || 0,
            approvedSubmissions: stat.approvedSubmissions || 0,
            currentStreak: stat.currentStreak || 0,
            longestStreak: stat.longestStreak || 0
        };
    });

    // Parse rewards config
    let rewards: RewardConfig[] = [];
    try {
        rewards = JSON.parse(campaign.rewards || '[]');
        console.log(`[Rewards] Found ${rewards.length} reward types for campaign ${campaignId}`);
    } catch (e) {
        console.error('Failed to parse rewards config:', e);
    }

    if (rewards.length === 0) {
        console.log('No rewards configured for campaign:', campaignId);
        return [];
    }

    console.log(`[Rewards] ${creatorStats.length} creators with stats`);

    const results: CalculationResult[] = [];

    for (const reward of rewards) {
        console.log(`[Rewards] Processing: ${reward.type} - "${reward.title}"`);
        const result = calculateRewardType(reward, creatorStats);
        if (result) {
            console.log(`[Rewards]   → ${result.winners.length} winners, ฿${result.totalAmount}`);
            results.push(result);
        }
    }

    return results;
};

/**
 * Calculate winners for a specific reward type
 */
const calculateRewardType = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult | null => {
    switch (reward.type) {
        case 'sales_milestone':
            return calculateSalesMilestone(reward, creators);
        case 'top_volume':
            return calculateTopVolume(reward, creators);
        case 'streak_bonus':
            return calculateStreakBonus(reward, creators);
        case 'lucky_draw':
            return calculateLuckyDraw(reward, creators);
        case 'custom':
            return calculateCustom(reward, creators);
        default:
            console.log(`[Rewards] Unknown reward type: ${reward.type}`);
            return null;
    }
};

/**
 * Sales Milestones - Creators who reach GMV targets get rewards
 * Config: { milestones: [{ gmvTarget: 5000, reward: 3000 }, ...] }
 */
const calculateSalesMilestone = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult => {
    const config = reward.config || {};
    // Support both formats: config.milestones and config.tiers
    const milestones = config.milestones || config.tiers || [];
    const winners: Winner[] = [];

    // Sort milestones by gmvTarget descending (highest first)
    const sortedMilestones = [...milestones].sort((a: any, b: any) =>
        (b.gmvTarget || b.threshold || 0) - (a.gmvTarget || a.threshold || 0)
    );

    for (const creator of creators) {
        // Find the highest milestone the creator qualifies for
        for (const milestone of sortedMilestones) {
            const target = milestone.gmvTarget || milestone.threshold || 0;
            const rewardAmount = milestone.reward || milestone.amount || 0;

            if (creator.gmv >= target) {
                winners.push({
                    creatorId: creator.creatorId,
                    creatorName: creator.creatorName,
                    rewardType: 'sales_milestone',
                    rewardName: reward.title || 'Sales Milestone',
                    amount: rewardAmount,
                    criteria: `GMV ฿${creator.gmv.toLocaleString()} ≥ ฿${target.toLocaleString()}`
                });
                break; // Only give highest qualifying milestone
            }
        }
    }

    return {
        rewardType: 'sales_milestone',
        rewardName: reward.title || 'Sales Milestones',
        winners,
        totalAmount: winners.reduce((sum, w) => sum + w.amount, 0)
    };
};

/**
 * Top Volume - Top N creators by GMV
 * Config: { prizes: [{ rank: 1, reward: 15000 }, { rank: 2, reward: 7000 }, ...] }
 */
const calculateTopVolume = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult => {
    const config = reward.config || {};
    const prizes = config.prizes || config.tiers || [];
    const sortedByGMV = [...creators].sort((a, b) => b.gmv - a.gmv);

    const winners: Winner[] = [];

    for (const prize of prizes) {
        const rankIndex = (prize.rank || 1) - 1;
        const creator = sortedByGMV[rankIndex];
        if (!creator) continue;

        winners.push({
            creatorId: creator.creatorId,
            creatorName: creator.creatorName,
            rewardType: 'top_volume',
            rewardName: `${reward.title || 'Top Volume'} #${prize.rank}`,
            amount: prize.reward || prize.amount || 0,
            rank: prize.rank,
            criteria: `GMV ฿${creator.gmv.toLocaleString()} (อันดับ ${prize.rank})`
        });
    }

    return {
        rewardType: 'top_volume',
        rewardName: reward.title || 'Top Volume',
        winners,
        totalAmount: winners.reduce((sum, w) => sum + w.amount, 0)
    };
};

/**
 * Streak Bonus - Creators who maintain posting streaks  
 * Config: { streakDays: 7, bonusPerStreak: 1500, maxStreaks: 10 }
 */
const calculateStreakBonus = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult => {
    const config = reward.config || {};
    const requiredDays = config.streakDays || config.days || 7;
    const bonusPerStreak = config.bonusPerStreak || config.amount_per_winner || 1500;

    const winners: Winner[] = [];

    for (const creator of creators) {
        if (creator.longestStreak >= requiredDays) {
            // Calculate how many complete streaks they have
            const streakMultiplier = Math.floor(creator.longestStreak / requiredDays);
            const amount = bonusPerStreak * streakMultiplier;

            winners.push({
                creatorId: creator.creatorId,
                creatorName: creator.creatorName,
                rewardType: 'streak_bonus',
                rewardName: reward.title || 'Streak Bonus',
                amount,
                criteria: `Streak ${creator.longestStreak} วัน (${streakMultiplier}x bonus)`
            });
        }
    }

    return {
        rewardType: 'streak_bonus',
        rewardName: reward.title || 'Streak Bonus',
        winners,
        totalAmount: winners.reduce((sum, w) => sum + w.amount, 0)
    };
};

/**
 * Lucky Draw - Random selection from all participating creators
 * Config: { prizes: [{ name: 'Grand Prize', amount: 10000, winners: 1 }, ...] }
 */
const calculateLuckyDraw = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult => {
    const config = reward.config || {};
    const prizes = config.prizes || [];
    const winners: Winner[] = [];

    // All creators with at least 1 approved submission are eligible
    const eligible = creators.filter(c => c.approvedSubmissions >= 1);

    for (const prize of prizes) {
        const numWinners = prize.winners || 1;
        const amount = prize.amount || 0;
        const prizeName = prize.name || 'Lucky Draw Prize';

        // Random selection from eligible (no duplicates across prizes)
        const alreadyWon = new Set(winners.map(w => w.creatorId));
        const available = eligible.filter(c => !alreadyWon.has(c.creatorId));
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, numWinners);

        for (const creator of selected) {
            winners.push({
                creatorId: creator.creatorId,
                creatorName: creator.creatorName,
                rewardType: 'lucky_draw',
                rewardName: prizeName,
                amount,
                criteria: `จับฉลาก - ${prizeName}`
            });
        }
    }

    return {
        rewardType: 'lucky_draw',
        rewardName: reward.title || 'Lucky Draw',
        winners,
        totalAmount: winners.reduce((sum, w) => sum + w.amount, 0)
    };
};

/**
 * Custom rewards - Brand selects top creators by overall performance
 * Config: { description: '...', winners: 2 }
 */
const calculateCustom = (reward: RewardConfig, creators: CreatorStats[]): CalculationResult => {
    const config = reward.config || {};
    const numWinners = config.winners || 1;
    const budget = reward.budget || 0;
    const amountPerWinner = Math.floor(budget / numWinners);

    // Auto-select top creators by combined score (GMV + videos + streak)
    const scored = creators.map(c => ({
        ...c,
        score: (c.gmv / 1000) + (c.approvedSubmissions * 10) + (c.longestStreak * 5)
    }));
    scored.sort((a, b) => b.score - a.score);

    const selected = scored.slice(0, numWinners);
    const winners: Winner[] = selected.map((creator, i) => ({
        creatorId: creator.creatorId,
        creatorName: creator.creatorName,
        rewardType: 'custom',
        rewardName: reward.title || 'Custom Award',
        amount: amountPerWinner,
        rank: i + 1,
        criteria: config.description || 'ตัดสินโดยแบรนด์'
    }));

    return {
        rewardType: 'custom',
        rewardName: reward.title || 'Custom Award',
        winners,
        totalAmount: winners.reduce((sum, w) => sum + w.amount, 0)
    };
};

export const rewardCalculationService = {
    calculateRewards
};
