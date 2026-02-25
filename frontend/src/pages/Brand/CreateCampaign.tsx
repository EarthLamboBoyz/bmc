import { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  DollarSign,
  Video,
  Flame,
  Shuffle,
  Gift,
  Plus,
  Trash2,
  Check,
  Edit,
  AlertTriangle,
  Package,
  Upload,
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import ImageUpload from '../../components/ImageUpload';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ContentGuidelines } from '../../types';
import ContentGuidelinesForm from '../../components/Brand/ContentGuidelinesForm';
import { campaignService } from '../../services/campaign.service';

interface RewardTier {
  rank: number;
  amount: number;
}

interface RewardConfig {
  id: string;
  type: 'sales_milestone' | 'top_volume' | 'streak_bonus' | 'lucky_draw' | 'custom';
  title: string;
  budget: number;
  tiers?: RewardTier[];
  streaks?: { days: number; winners: number; amount: number }[];
  luckyConfig?: { winners: number; amount: number; minVideos: number };
  customConfig?: { prizes: { description: string; condition: string }[] };
}

const rewardTemplates = [
  { type: 'sales_milestone' as const, icon: DollarSign, label: 'Sales Milestones', color: 'emerald' },
  { type: 'top_volume' as const, icon: Video, label: 'Top Volume', color: 'blue' },
  { type: 'streak_bonus' as const, icon: Flame, label: 'Streak Bonus', color: 'orange' },
  { type: 'lucky_draw' as const, icon: Shuffle, label: 'Lucky Draw', color: 'purple' },
  { type: 'custom' as const, icon: Gift, label: 'Custom', color: 'pink' },
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { addCampaign } = useData();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    type: 'challenge' as 'single' | 'challenge',
    startDate: '',
    endDate: '',
    announceDate: '',
    maxCreators: 300,
    minFollowers: 10000,
    platforms: ['TikTok'] as string[],
    categories: ['Beauty'] as string[],
    totalBudget: 50000,
    // Sample settings
    hasSamples: false,
    sampleDescription: '',
    sampleImageUrl: '',
    totalSamples: 0,
    samplesPerCreator: 1,
  });
  const [rewards, setRewards] = useState<RewardConfig[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardConfig | null>(null);
  const [contentGuidelines, setContentGuidelines] = useState<ContentGuidelines>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms = ['TikTok', 'Instagram', 'YouTube'];
  const categories = ['Beauty', 'Fashion', 'Food', 'Health', 'Lifestyle', 'Tech', 'Travel', 'Gaming'];

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          const data = await campaignService.getCampaignById(id, token);

          setFormData({
            title: data.title || '',
            description: data.description || '',
            coverImage: data.image || '',
            type: data.type || 'challenge',
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
            announceDate: data.announceDate ? new Date(data.announceDate).toISOString().split('T')[0] : '',
            maxCreators: data.maxCreators || 300,
            minFollowers: data.minFollowers || 0,
            platforms: data.platforms || [],
            categories: data.categories || [],
            totalBudget: data.budget || 50000,
            hasSamples: data.hasSamples || false,
            sampleDescription: data.sampleInfo?.description || '',
            sampleImageUrl: data.sampleInfo?.imageUrl || '',
            totalSamples: data.sampleInfo?.totalSamples || 0,
            samplesPerCreator: data.sampleInfo?.samplesPerCreator || 1,
          });

          // Ensure rewards have unique IDs if missing or convert backend format if needed
          // Assuming backend returns compliant structure
          if (data.rewards) {
            setRewards(data.rewards);
          }

          if (data.contentGuidelines) {
            setContentGuidelines(data.contentGuidelines);
          }
        } catch (error) {
          console.error("Failed to fetch campaign", error);
          showError("Failed to fetch campaign details");
        }
      };

      fetchCampaign();
    }
  }, [id]);

  // Calculate total rewards budget from actual data to ensure accuracy
  const totalRewardsBudget = rewards.reduce((sum, r) => {
    if (r.customConfig) return sum; // Custom rewards don't count toward budget
    if (r.tiers) return sum + r.tiers.reduce((s, t) => s + t.amount, 0);
    if (r.streaks) return sum + r.streaks.reduce((s, st) => s + (st.winners * st.amount), 0);
    if (r.luckyConfig) return sum + (r.luckyConfig.winners * r.luckyConfig.amount);
    return sum + r.budget;
  }, 0);
  const remainingBudget = formData.totalBudget - totalRewardsBudget;

  const handleAddReward = (type: RewardConfig['type']) => {
    // Default configurations with 5 tiers
    const defaultConfigs: Record<RewardConfig['type'], Partial<RewardConfig>> = {
      sales_milestone: {
        title: 'Sales Milestones',
        tiers: [
          { rank: 1, amount: 10000 },  // 40%
          { rank: 2, amount: 6000 },   // 24%
          { rank: 3, amount: 4000 },   // 16%
          { rank: 4, amount: 3000 },   // 12%
          { rank: 5, amount: 2000 },   // 8%
        ],
        budget: 25000,
      },
      top_volume: {
        title: 'Top Volume',
        tiers: [
          { rank: 1, amount: 6000 },   // 40%
          { rank: 2, amount: 4000 },   // 27%
          { rank: 3, amount: 2500 },   // 17%
          { rank: 4, amount: 1500 },   // 10%
          { rank: 5, amount: 1000 },   // 6%
        ],
        budget: 15000,
      },
      streak_bonus: {
        title: 'Streak Bonus',
        streaks: [
          { days: 10, winners: 10, amount: 500 },  // 5,000
          { days: 20, winners: 10, amount: 1000 }, // 10,000
        ],
        budget: 15000,
      },
      lucky_draw: {
        title: 'Lucky Draw',
        luckyConfig: { winners: 20, amount: 500, minVideos: 10 },
        budget: 10000,
      },
      custom: {
        title: 'รางวัลพิเศษ',
        customConfig: { prizes: [{ description: 'iPhone 17 Pro', condition: 'ยอดขายสูงสุด' }] },
        budget: 0,
      },
    };

    const newReward: RewardConfig = {
      id: Date.now().toString(),
      type,
      ...defaultConfigs[type],
    } as RewardConfig;

    setRewards([...rewards, newReward]);
  };

  const handleRemoveReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  // Helper function to round numbers nicely
  const roundNicely = (amount: number): number => {
    if (amount >= 10000) {
      // Round to nearest 1000 for large amounts
      return Math.round(amount / 1000) * 1000;
    } else if (amount >= 1000) {
      // Round to nearest 500 for medium amounts
      return Math.round(amount / 500) * 500;
    } else if (amount >= 100) {
      // Round to nearest 100 for small amounts
      return Math.round(amount / 100) * 100;
    } else {
      // Round to nearest 50 for very small amounts
      return Math.round(amount / 50) * 50;
    }
  };

  // Helper function to distribute budget across tiers with nice numbers
  const distributeTiers = (totalBudget: number, numTiers: number): RewardTier[] => {
    // Distribution percentages for different tier counts
    const distributions: { [key: number]: number[] } = {
      5: [0.40, 0.25, 0.15, 0.12, 0.08], // 40%, 25%, 15%, 12%, 8%
      10: [0.30, 0.20, 0.14, 0.10, 0.08, 0.06, 0.04, 0.04, 0.02, 0.02], // For 10 tiers
    };

    const percentages = distributions[numTiers] || distributions[5];
    const tiers: RewardTier[] = [];
    let remainingBudget = totalBudget;

    for (let i = 0; i < numTiers; i++) {
      const isLast = i === numTiers - 1;
      let amount: number;

      if (isLast) {
        // Last tier gets exactly what remains (no rounding to ensure total equals budget)
        amount = remainingBudget;
      } else {
        amount = roundNicely(totalBudget * percentages[i]);
        remainingBudget -= amount;
      }

      tiers.push({ rank: i + 1, amount });
    }

    return tiers;
  };

  const handleAIAllocation = () => {
    const selectedTypes = rewards.map(r => r.type);
    const budget = formData.totalBudget;

    // Helper to create clean tier-based rewards
    const createTierReward = (
      id: string,
      type: 'sales_milestone' | 'top_volume',
      title: string,
      allocatedBudget: number,
      numTiers: number
    ): RewardConfig => {
      const tiers = distributeTiers(allocatedBudget, numTiers);
      const actualBudget = tiers.reduce((sum, t) => sum + t.amount, 0);

      return {
        id,
        type,
        title,
        budget: actualBudget,
        tiers,
      };
    };

    if (selectedTypes.length === 0) {
      // Default allocation if no templates selected (50/30/20 split)
      const salesBudget = roundNicely(budget * 0.5);
      const volumeBudget = roundNicely(budget * 0.3);
      const streakBudget = budget - salesBudget - volumeBudget; // Remaining

      // Default จำนวนคนสำหรับ Streak Bonus
      const defaultWinners1 = 10;
      const defaultWinners2 = 10;

      // แบ่งงบ 1:2 สำหรับ streak 10 วัน : 20 วัน
      const streak1Budget = roundNicely(streakBudget * 0.33);
      const streak2Budget = streakBudget - streak1Budget;

      const newRewards: RewardConfig[] = [
        createTierReward('1', 'sales_milestone', 'Sales Milestones', salesBudget, 5),
        createTierReward('2', 'top_volume', 'Top Volume', volumeBudget, 5),
        {
          id: '3',
          type: 'streak_bonus',
          title: 'Streak Bonus',
          budget: streakBudget,
          streaks: [
            {
              days: 10,
              winners: defaultWinners1,
              amount: Math.round(streak1Budget / defaultWinners1)
            },
            {
              days: 20,
              winners: defaultWinners2,
              amount: Math.round(streak2Budget / defaultWinners2)
            }
          ]
        },
      ];
      setRewards(newRewards);
    } else {
      // Update existing rewards based on selection
      const weights: { [key: string]: number } = {
        sales_milestone: 0.5,  // 50% for Sales (higher priority)
        top_volume: 0.3,       // 30% for Volume
        streak_bonus: 0.15,    // 15% for Streak
        lucky_draw: 0.05,      // 5% for Lucky
        custom: 0,             // 0% for Custom (no budget)
      };

      const totalWeight = selectedTypes.reduce((sum, t) => sum + weights[t], 0);

      // Calculate budgets for all rewards, ensuring total equals budget
      const rewardsWithBudgets: { reward: RewardConfig; allocatedBudget: number }[] = [];
      let remainingBudget = budget;
      const nonCustomRewards = rewards.filter(r => r.type !== 'custom');

      nonCustomRewards.forEach((r, index) => {
        const isLast = index === nonCustomRewards.length - 1;
        let allocatedBudget: number;

        if (isLast) {
          // Last reward gets exactly the remaining budget
          allocatedBudget = remainingBudget;
        } else {
          allocatedBudget = roundNicely((weights[r.type] / totalWeight) * budget);
          remainingBudget -= allocatedBudget;
        }

        rewardsWithBudgets.push({ reward: r, allocatedBudget });
      });

      // Now apply the budgets to rewards
      setRewards(rewards.map(r => {
        if (r.type === 'custom') {
          return r; // Don't modify custom rewards
        }

        const rewardWithBudget = rewardsWithBudgets.find(rwb => rwb.reward.id === r.id);
        if (!rewardWithBudget) return r;

        const allocatedBudget = rewardWithBudget.allocatedBudget;

        if (r.tiers) {
          // Recreate tiers with nice distribution
          const numTiers = r.tiers.length;
          const tiers = distributeTiers(allocatedBudget, numTiers);
          const actualBudget = tiers.reduce((sum, t) => sum + t.amount, 0);

          return {
            ...r,
            budget: actualBudget,
            tiers,
          };
        } else if (r.streaks) {
          // ใช้จำนวน winners ที่ผู้ใช้ตั้งไว้แล้ว ไม่คำนวณใหม่
          const winners1 = r.streaks[0]?.winners || 10;
          const winners2 = r.streaks[1]?.winners || 10;
          const days1 = r.streaks[0]?.days || 10;
          const days2 = r.streaks[1]?.days || 20;

          // แบ่งงบ 1:2 (streak ที่นานกว่าได้รางวัลมากกว่า)
          const budget1 = roundNicely(allocatedBudget * 0.33);
          const budget2 = allocatedBudget - budget1;

          // คำนวณรางวัลต่อคนจากงบที่จัดสรร
          const amount1 = Math.round(budget1 / winners1);
          const amount2 = Math.round(budget2 / winners2);

          return {
            ...r,
            budget: allocatedBudget,
            streaks: [
              {
                days: days1,
                winners: winners1,
                amount: amount1
              },
              {
                days: days2,
                winners: winners2,
                amount: amount2
              }
            ]
          };
        } else if (r.luckyConfig) {
          const perPersonAmount = r.luckyConfig.amount || 500;
          const winners = Math.max(1, Math.round(allocatedBudget / perPersonAmount));
          const actualBudget = winners * perPersonAmount;

          return {
            ...r,
            budget: actualBudget,
            luckyConfig: {
              ...r.luckyConfig,
              winners,
              amount: perPersonAmount,
            }
          };
        }

        return r;
      }));
    }

    setShowAIModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (isSubmitting) return;

      // Confirmation dialog before publishing
      const confirmMessage = isEditMode
        ? 'ยืนยันการอัพเดทแคมเปญหรือไม่?'
        : 'ยืนยันการเผยแพร่แคมเปญหรือไม่? เมื่อเผยแพร่แล้วครีเอเตอร์จะสามารถเห็นและสมัครได้ทันที';
      if (!window.confirm(confirmMessage)) return;

      setIsSubmitting(true);
      console.log('Submitting form data:', formData); // Debug log

      if (!formData.title) {
        showError('กรุณาระบุชื่อแคมเปญ');
        return;
      }
      if (!formData.description) {
        showError('กรุณาระบุคำอธิบายแคมเปญ');
        return;
      }
      if (!formData.startDate) {
        showError('กรุณาระบุวันเริ่มต้นแคมเปญ');
        return;
      }
      if (!formData.endDate) {
        showError('กรุณาระบุวันสิ้นสุดแคมเปญ');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        showError('กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      // Sort rewards by template order before submitting
      const sortedRewards = rewards.slice().sort((a, b) => {
        const order = ['sales_milestone', 'top_volume', 'streak_bonus', 'lucky_draw', 'custom'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });

      // Prepare payload for backend
      const payload = {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', // Default if empty
        budget: formData.totalBudget,
        startDate: formData.startDate,
        endDate: formData.endDate,
        announceDate: formData.announceDate,
        minFollowers: formData.minFollowers,
        platforms: formData.platforms,
        categories: formData.categories,
        // Complex JSON fields
        rewards: sortedRewards,
        contentGuidelines: Object.keys(contentGuidelines).length > 0 ? contentGuidelines : {},
        hasSamples: formData.hasSamples,
        sampleInfo: formData.hasSamples ? {
          description: formData.sampleDescription,
          imageUrl: formData.sampleImageUrl,
          totalSamples: formData.totalSamples,
          samplesPerCreator: formData.samplesPerCreator,
        } : {},
      };

      if (isEditMode && id) {
        await campaignService.updateCampaign(id, payload, token);
        showSuccess('อัพเดทแคมเปญสำเร็จ! 🎉');
      } else {
        await campaignService.createCampaign(payload, token);
        showSuccess('สร้างแคมเปญสำเร็จ! 🎉');
      }
      navigate('/brand/campaigns');
    } catch (error: any) {
      console.error('Failed to create campaign:', error);
      showError(`เกิดข้อผิดพลาด: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!formData.title) {
        showError('กรุณาระบุชื่อแคมเปญเพื่อบันทึกแบบร่าง');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        showError('กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      // Sort rewards
      const sortedRewards = rewards.slice().sort((a, b) => {
        const order = ['sales_milestone', 'top_volume', 'streak_bonus', 'lucky_draw', 'custom'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });

      // Prepare payload with DRAFT status
      // Note: We provide default values for required fields that might be missing in draft
      const payload = {
        title: formData.title,
        description: formData.description || 'Draft Campaign',
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        budget: formData.totalBudget || 0,
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || new Date(Date.now() + 86400000).toISOString(), // +1 day
        announceDate: formData.announceDate,
        minFollowers: formData.minFollowers || 0,
        platforms: formData.platforms,
        categories: formData.categories,
        rewards: sortedRewards,
        contentGuidelines: Object.keys(contentGuidelines).length > 0 ? contentGuidelines : {},
        hasSamples: formData.hasSamples,
        sampleInfo: formData.hasSamples ? {
          description: formData.sampleDescription,
          imageUrl: formData.sampleImageUrl,
          totalSamples: formData.totalSamples,
          samplesPerCreator: formData.samplesPerCreator,
        } : {},
        status: 'draft'
      };

      if (isEditMode && id) {
        await campaignService.updateCampaign(id, payload, token);
        showSuccess('อัพเดทแบบร่างสำเร็จ');
      } else {
        await campaignService.createCampaign(payload, token);
        showSuccess('บันทึกแบบร่างสำเร็จ');
      }
      navigate('/brand/campaigns');
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      showError(`เกิดข้อผิดพลาด: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/brand/campaigns')}
          className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </button>
        <h1 className="text-2xl font-bold dark:text-white">{isEditMode ? 'แก้ไขแคมเปญ' : 'สร้างแคมเปญใหม่'}</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { num: 1, label: 'ข้อมูลพื้นฐาน' },
          { num: 2, label: 'โครงสร้างรางวัล' },
          { num: 3, label: 'Content Guidelines' },
          { num: 4, label: 'สรุป' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium flex-shrink-0 ${step >= s.num
                ? 'gradient-primary text-white'
                : 'bg-gray-200 text-gray-500'
                }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`ml-2 whitespace-nowrap text-sm ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {s.label}
            </span>
            {i < 3 && (
              <div className="w-8 md:w-12 h-0.5 bg-gray-200 mx-2">
                <div
                  className={`h-full gradient-primary transition-all ${step > s.num ? 'w-full' : 'w-0'
                    }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
          <h2 className="text-lg font-semibold mb-6 dark:text-white">ข้อมูลแคมเปญ</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                รูปปกแคมเปญ
              </label>
              <div className="w-full">
                <ImageUpload
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  aspectRatio="video"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                ชื่อแคมเปญ *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="เช่น สามสิบ ตรา คุณสัมฤทธิ์ 365 วัน Challenge"
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                คำอธิบาย *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="อธิบายรายละเอียดแคมเปญ..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  วันเริ่มต้น * <span className="text-xs text-gray-500 font-normal">(เดือน/วัน/ปี)</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  วันสิ้นสุด * <span className="text-xs text-gray-500 font-normal">(เดือน/วัน/ปี)</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  วันประกาศผล <span className="text-xs text-gray-500 font-normal">(เดือน/วัน/ปี)</span>
                </label>
                <input
                  type="date"
                  value={formData.announceDate}
                  onChange={(e) => setFormData({ ...formData, announceDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Followers ขั้นต่ำ
              </label>
              <input
                type="number"
                value={formData.minFollowers}
                onChange={(e) => setFormData({ ...formData, minFollowers: parseInt(e.target.value) })}
                placeholder="เช่น 10000"
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">ใส่ 0 หากไม่ต้องการกำหนดขั้นต่ำ</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Platform *
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => {
                      const newPlatforms = formData.platforms.includes(platform)
                        ? formData.platforms.filter(p => p !== platform)
                        : [...formData.platforms, platform];
                      setFormData({ ...formData, platforms: newPlatforms });
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${formData.platforms.includes(platform)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                หมวดหมู่ *
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const newCategories = formData.categories.includes(category)
                        ? formData.categories.filter(c => c !== category)
                        : [...formData.categories, category];
                      setFormData({ ...formData, categories: newCategories });
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${formData.categories.includes(category)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Settings */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ตัวอย่างสินค้า
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasSamples: !formData.hasSamples })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasSamples ? 'bg-primary' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.hasSamples ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              {formData.hasSamples && (
                <div className="space-y-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-gray-500">
                    Creator สามารถขอตัวอย่างสินค้าได้หลังจากเข้าร่วมแคมเปญ
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      คำอธิบายสินค้า *
                    </label>
                    <textarea
                      value={formData.sampleDescription}
                      onChange={(e) => setFormData({ ...formData, sampleDescription: e.target.value })}
                      placeholder="เช่น ผลิตภัณฑ์เสริมอาหาร 1 กล่อง (30 แคปซูล)"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      รูปภาพสินค้า (ไม่บังคับ)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-white dark:bg-slate-900/50 cursor-pointer relative"
                      onClick={() => document.getElementById('sample-image-upload')?.click()}
                    >
                      {formData.sampleImageUrl ? (
                        <div className="relative group">
                          <img
                            src={formData.sampleImageUrl}
                            alt="Sample Preview"
                            className="max-h-48 mx-auto rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, sampleImageUrl: '' });
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">คลิกเพื่ออัพโหลดรูปภาพ</p>
                          <p className="text-xs text-gray-400 mt-2">หรือวาง URL รูปภาพ</p>
                          <input
                            type="file"
                            id="sample-image-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({ ...formData, sampleImageUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <input
                            type="text"
                            value={formData.sampleImageUrl}
                            onChange={(e) => setFormData({ ...formData, sampleImageUrl: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="หรือใส่ URL รูปภาพ (https://...)"
                            className="mt-4 w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 dark:bg-slate-800 dark:text-white placeholder:text-gray-400"
                          />
                          <p className="text-xs text-gray-400 mt-2">รองรับไฟล์ JPG, PNG ขนาดสูงสุด 5MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                        จำนวนตัวอย่างทั้งหมด *
                      </label>
                      <input
                        type="number"
                        value={formData.totalSamples || ''}
                        onChange={(e) => setFormData({ ...formData, totalSamples: parseInt(e.target.value) || 0 })}
                        placeholder="300"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                        จำนวนต่อ Creator *
                      </label>
                      <input
                        type="number"
                        value={formData.samplesPerCreator || ''}
                        onChange={(e) => setFormData({ ...formData, samplesPerCreator: parseInt(e.target.value) || 1 })}
                        placeholder="1"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors"
              type="button"
            >
              บันทึกแบบร่าง
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              ถัดไป: รางวัล
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Rewards */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
          <h2 className="text-lg font-semibold mb-6 dark:text-white">โครงสร้างรางวัล</h2>

          {/* Budget */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              งบประมาณรางวัลทั้งหมด
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
              <input
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* AI Allocation Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="w-full mb-6 p-4 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            AI Auto Allocation - แบ่งสัดส่วนอัตโนมัติ
          </button>

          {/* Reward Templates */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">เลือก Reward Templates</p>
            <div className="flex flex-wrap gap-3">
              {rewardTemplates.map((template) => {
                const isSelected = rewards.some(r => r.type === template.type);
                return (
                  <button
                    key={template.type}
                    onClick={() => {
                      if (isSelected) {
                        // Remove reward if already selected (toggle off)
                        handleRemoveReward(rewards.find(r => r.type === template.type)?.id || '');
                      } else {
                        // Add reward if not selected (toggle on)
                        handleAddReward(template.type);
                      }
                    }}
                    className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    <template.icon className="w-5 h-5" />
                    {template.label}
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Summary - Prominent */}
          <div className={`rounded-xl p-4 mb-6 ${remainingBudget < 0 ? 'bg-red-50 border-2 border-red-200' : remainingBudget > 0 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-emerald-50 border-2 border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2 dark:text-gray-800">
                  {remainingBudget < 0 && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {remainingBudget > 0 && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {remainingBudget === 0 && <Check className="w-5 h-5 text-emerald-500" />}
                  สรุปงบประมาณรางวัล
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  งบทั้งหมด: ฿{formData.totalBudget.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ฿{totalRewardsBudget.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${remainingBudget < 0 ? 'text-red-600' : remainingBudget > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {remainingBudget < 0 ? `เกินงบ ฿${Math.abs(remainingBudget).toLocaleString()}` : remainingBudget > 0 ? `เหลืออีก ฿${remainingBudget.toLocaleString()}` : 'พอดีงบ ✓'}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Rewards */}
          <div className="space-y-4 mb-6">
            {rewards
              .slice()
              .sort((a, b) => {
                // Sort by template order: sales_milestone, top_volume, streak_bonus, lucky_draw, custom
                const order = ['sales_milestone', 'top_volume', 'streak_bonus', 'lucky_draw', 'custom'];
                return order.indexOf(a.type) - order.indexOf(b.type);
              })
              .map((reward, index) => (
                <div key={reward.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium dark:text-white">
                      รางวัลที่ {index + 1}: {reward.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingReward({ ...reward })}
                        className="p-1.5 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                        title="แก้ไขรางวัล"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveReward(reward.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบรางวัล"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {reward.tiers && (
                    <div className="space-y-2 mb-3">
                      {reward.tiers.map((tier, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${tier.rank}`}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-600">อันดับที่ {tier.rank}</span>
                          </div>
                          <span className={`font-semibold ${i === 0 ? 'text-amber-700' : i === 1 ? 'text-gray-700' : i === 2 ? 'text-orange-700' : 'text-gray-600'}`}>
                            ฿{tier.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {reward.streaks && (
                    <div className="space-y-2">
                      {reward.streaks.map((streak, i) => (
                        <div key={i} className="text-sm flex items-center gap-2 dark:text-gray-300">
                          <Flame className="w-4 h-4 text-orange-500" />
                          Streak {streak.days} วัน: สุ่ม {streak.winners} คน × ฿{streak.amount.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}

                  {reward.luckyConfig && (
                    <div className="text-sm flex items-center gap-2 dark:text-gray-300">
                      <Shuffle className="w-4 h-4 text-purple-500" />
                      ขั้นต่ำ {reward.luckyConfig.minVideos} คลิป: สุ่ม {reward.luckyConfig.winners} คน × ฿{reward.luckyConfig.amount.toLocaleString()}
                    </div>
                  )}

                  {reward.customConfig && (
                    <div className="space-y-2">
                      {(reward.customConfig.prizes || []).map((prize, idx) => (
                        <div key={idx} className="text-sm flex items-start gap-2 bg-pink-50 p-2 rounded-lg">
                          <Gift className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-pink-900">{prize.description || 'รางวัล'}</p>
                            {prize.condition && (
                              <p className="text-xs text-pink-700 mt-1">เงื่อนไข: {prize.condition}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Budget display - hide for custom rewards */}
                  {!reward.customConfig && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-300">งบประมาณรางวัลนี้:</span>
                        <span className="font-semibold text-lg dark:text-white">
                          ฿{(() => {
                            // Calculate budget from actual data to ensure accuracy
                            if (reward.tiers) {
                              return reward.tiers.reduce((sum, t) => sum + t.amount, 0).toLocaleString();
                            } else if (reward.streaks) {
                              return reward.streaks.reduce((sum, s) => sum + (s.winners * s.amount), 0).toLocaleString();
                            } else if (reward.luckyConfig) {
                              return (reward.luckyConfig.winners * reward.luckyConfig.amount).toLocaleString();
                            }
                            return reward.budget.toLocaleString();
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ย้อนกลับ
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              ถัดไป: Content Guidelines
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Content Guidelines */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Content Guidelines</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">กำหนดแนวทางการสร้างคอนเทนต์ให้ Creator (ไม่บังคับ)</p>
          </div>

          <ContentGuidelinesForm
            value={contentGuidelines}
            onChange={setContentGuidelines}
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ย้อนกลับ
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              ถัดไป: สรุป
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold mb-6 dark:text-white">ตรวจสอบข้อมูลก่อนเผยแพร่</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-300 mb-2">ข้อมูลแคมเปญ</h3>
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-300">ชื่อ:</span>
                  <span className="font-medium dark:text-white">{formData.title || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-300">ระยะเวลา:</span>
                  <span className="dark:text-white">{formData.startDate || '-'} - {formData.endDate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-300">Followers ขั้นต่ำ:</span>
                  <span className="dark:text-white">{formData.minFollowers > 0 ? `${formData.minFollowers.toLocaleString()}+` : 'ไม่จำกัด'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-300 mb-2">โครงสร้างรางวัล</h3>
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                {rewards
                  .slice()
                  .sort((a, b) => {
                    // Sort by template order
                    const order = ['sales_milestone', 'top_volume', 'streak_bonus', 'lucky_draw', 'custom'];
                    return order.indexOf(a.type) - order.indexOf(b.type);
                  })
                  .map((reward, index) => (
                    <div key={reward.id}>
                      {reward.customConfig ? (
                        <div className="mb-2">
                          <span className="text-gray-500 dark:text-gray-300">รางวัลที่ {index + 1}: {reward.title}</span>
                          <div className="mt-2 space-y-1">
                            {reward.customConfig.prizes.map((prize, idx) => (
                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                                • {prize.description} {prize.condition && `(${prize.condition})`}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-300">รางวัลที่ {index + 1}: {reward.title}</span>
                          <span className="dark:text-white">
                            ฿{(() => {
                              // Calculate budget from actual data
                              if (reward.tiers) {
                                return reward.tiers.reduce((sum, t) => sum + t.amount, 0).toLocaleString();
                              } else if (reward.streaks) {
                                return reward.streaks.reduce((sum, s) => sum + (s.winners * s.amount), 0).toLocaleString();
                              } else if (reward.luckyConfig) {
                                return (reward.luckyConfig.winners * reward.luckyConfig.amount).toLocaleString();
                              }
                              return reward.budget.toLocaleString();
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="dark:text-white">รวมงบประมาณ:</span>
                    <span className="dark:text-white">฿{totalRewardsBudget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ย้อนกลับแก้ไข
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors disabled:opacity-50"
              >
                บันทึกแบบร่าง
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    กำลังบันทึก...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    เผยแพร่แคมเปญ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Auto Allocation</h3>
              <p className="text-gray-500 mb-6">
                AI จะแบ่งสัดส่วนงบประมาณ ฿{formData.totalBudget.toLocaleString()} ให้อัตโนมัติ
                โดยพิจารณาจาก Templates ที่เลือก และประเภทแคมเปญ
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
                <p className="font-medium mb-2">สัดส่วนที่แนะนำ:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Sales Milestones: 40% (ROI สูงสุด)</li>
                  <li>• Top Volume: 30% (สร้าง Awareness)</li>
                  <li>• Streak Bonus: 20% (รักษาความต่อเนื่อง)</li>
                  <li>• Lucky Draw: 10% (รางวัลปลอบใจ)</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAIAllocation}
                  className="flex-1 px-4 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  ใช้งาน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reward Modal */}
      {editingReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 dark:text-white">แก้ไขรางวัล: {editingReward.title}</h3>

            {/* Reward Title */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">ชื่อรางวัล</label>
              <input
                type="text"
                value={editingReward.title}
                onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                placeholder="เช่น Sales Milestones, Top Volume"
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            {/* Tier-based rewards */}
            {editingReward.tiers && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">รางวัลแต่ละอันดับ:</p>
                  <button
                    type="button"
                    onClick={() => {
                      const currentTiers = [...editingReward.tiers!];
                      const newRank = currentTiers.length + 1;

                      // AI: Calculate suggested amount based on existing pattern
                      let suggestedAmount = 0;
                      if (currentTiers.length >= 2) {
                        // Calculate the decay ratio from existing tiers
                        const ratios: number[] = [];
                        for (let i = 1; i < currentTiers.length && i < 5; i++) {
                          if (currentTiers[i - 1].amount > 0) {
                            ratios.push(currentTiers[i].amount / currentTiers[i - 1].amount);
                          }
                        }

                        // Use average ratio or default to 0.5 (50% decay)
                        const avgRatio = ratios.length > 0
                          ? ratios.reduce((a, b) => a + b, 0) / ratios.length
                          : 0.5;

                        // Calculate suggested amount based on last tier
                        const lastTier = currentTiers[currentTiers.length - 1];
                        suggestedAmount = Math.round(lastTier.amount * avgRatio);

                        // Round to nearest 100 for cleaner numbers
                        if (suggestedAmount >= 1000) {
                          suggestedAmount = Math.round(suggestedAmount / 100) * 100;
                        } else if (suggestedAmount >= 100) {
                          suggestedAmount = Math.round(suggestedAmount / 50) * 50;
                        }
                      } else if (currentTiers.length === 1) {
                        // If only one tier exists, suggest 50% of it
                        suggestedAmount = Math.round(currentTiers[0].amount * 0.5 / 100) * 100;
                      }

                      const newTiers = [...currentTiers, { rank: newRank, amount: suggestedAmount }];
                      const totalBudget = newTiers.reduce((sum, t) => sum + t.amount, 0);
                      setEditingReward({
                        ...editingReward,
                        tiers: newTiers,
                        budget: totalBudget
                      });
                    }}
                    className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:opacity-90 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> เพิ่ม Tier
                  </button>
                </div>

                {editingReward.tiers.map((tier, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`w-16 text-center py-1 rounded-lg text-sm font-medium ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>
                      #{tier.rank}
                    </span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                      <input
                        type="number"
                        value={tier.amount}
                        onChange={(e) => {
                          const newTiers = [...editingReward.tiers!];
                          newTiers[i] = { ...newTiers[i], amount: parseInt(e.target.value) || 0 };
                          const totalBudget = newTiers.reduce((sum, t) => sum + t.amount, 0);
                          setEditingReward({
                            ...editingReward,
                            tiers: newTiers,
                            budget: totalBudget
                          });
                        }}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    {editingReward.tiers!.length > 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newTiers = editingReward.tiers!.filter((_, idx) => idx !== i);
                          // Re-rank remaining tiers
                          const rerankedTiers = newTiers.map((t, idx) => ({ ...t, rank: idx + 1 }));
                          const totalBudget = rerankedTiers.reduce((sum, t) => sum + t.amount, 0);
                          setEditingReward({
                            ...editingReward,
                            tiers: rerankedTiers,
                            budget: totalBudget
                          });
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-300">รวมรางวัล Tiers:</span>
                    <span className="font-medium dark:text-white">฿{editingReward.tiers.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Streak rewards */}
            {editingReward.streaks && (
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">รางวัล Streak:</p>
                {editingReward.streaks.map((streak, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-20 text-gray-500">{streak.days} วัน:</span>
                    <input
                      type="number"
                      value={streak.winners}
                      onChange={(e) => {
                        const newStreaks = [...editingReward.streaks!];
                        newStreaks[i] = { ...newStreaks[i], winners: parseInt(e.target.value) || 0 };
                        const totalBudget = newStreaks.reduce((sum, s) => sum + (s.winners * s.amount), 0);
                        setEditingReward({
                          ...editingReward,
                          streaks: newStreaks,
                          budget: totalBudget
                        });
                      }}
                      className="w-16 px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-lg text-center bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <span className="dark:text-gray-300">คน ×</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">฿</span>
                      <input
                        type="number"
                        value={streak.amount}
                        onChange={(e) => {
                          const newStreaks = [...editingReward.streaks!];
                          newStreaks[i] = { ...newStreaks[i], amount: parseInt(e.target.value) || 0 };
                          const totalBudget = newStreaks.reduce((sum, s) => sum + (s.winners * s.amount), 0);
                          setEditingReward({
                            ...editingReward,
                            streaks: newStreaks,
                            budget: totalBudget
                          });
                        }}
                        className="w-full pl-6 pr-2 py-1 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-300">รวมงบ Streak:</span>
                    <span className="font-medium dark:text-white">฿{editingReward.streaks.reduce((sum, s) => sum + (s.winners * s.amount), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lucky draw */}
            {editingReward.luckyConfig && (
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lucky Draw:</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">จำนวนคน</label>
                    <input
                      type="number"
                      value={editingReward.luckyConfig.winners}
                      onChange={(e) => {
                        const newWinners = parseInt(e.target.value) || 0;
                        const totalBudget = newWinners * editingReward.luckyConfig!.amount;
                        setEditingReward({
                          ...editingReward,
                          luckyConfig: { ...editingReward.luckyConfig!, winners: newWinners },
                          budget: totalBudget
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">รางวัล/คน (฿)</label>
                    <input
                      type="number"
                      value={editingReward.luckyConfig.amount}
                      onChange={(e) => {
                        const newAmount = parseInt(e.target.value) || 0;
                        const totalBudget = editingReward.luckyConfig!.winners * newAmount;
                        setEditingReward({
                          ...editingReward,
                          luckyConfig: { ...editingReward.luckyConfig!, amount: newAmount },
                          budget: totalBudget
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">ขั้นต่ำ (คลิป)</label>
                    <input
                      type="number"
                      value={editingReward.luckyConfig.minVideos}
                      onChange={(e) => setEditingReward({ ...editingReward, luckyConfig: { ...editingReward.luckyConfig!, minVideos: parseInt(e.target.value) || 0 } })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-300">รวมงบ Lucky Draw:</span>
                    <span className="font-medium dark:text-white">฿{(editingReward.luckyConfig.winners * editingReward.luckyConfig.amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Reward */}
            {editingReward.customConfig && (
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">รางวัลพิเศษ:</p>
                  <button
                    type="button"
                    onClick={() => {
                      const prizes = editingReward.customConfig!.prizes || [];
                      setEditingReward({
                        ...editingReward,
                        customConfig: {
                          ...editingReward.customConfig!,
                          prizes: [...prizes, { description: '', condition: '' }]
                        }
                      });
                    }}
                    className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:opacity-90 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> เพิ่มรางวัล
                  </button>
                </div>

                {/* Prizes List */}
                {(editingReward.customConfig.prizes || []).map((prize, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">รางวัลที่ {idx + 1}</span>
                      {(editingReward.customConfig!.prizes?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const prizes = editingReward.customConfig!.prizes || [];
                            setEditingReward({
                              ...editingReward,
                              customConfig: {
                                ...editingReward.customConfig!,
                                prizes: prizes.filter((_, i) => i !== idx)
                              }
                            });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Prize Description */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-300 block mb-1">ชื่อรางวัล</label>
                      <input
                        type="text"
                        value={prize.description}
                        onChange={(e) => {
                          const prizes = [...(editingReward.customConfig!.prizes || [])];
                          prizes[idx] = { ...prizes[idx], description: e.target.value };
                          setEditingReward({
                            ...editingReward,
                            customConfig: { ...editingReward.customConfig!, prizes }
                          });
                        }}
                        placeholder="เช่น iPhone 17 Pro, ทองคำ 1 บาท, รถยนต์"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-slate-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* Winning Condition */}
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">เงื่อนไขการได้รับรางวัล</label>
                      <textarea
                        value={prize.condition}
                        onChange={(e) => {
                          const prizes = [...(editingReward.customConfig!.prizes || [])];
                          prizes[idx] = { ...prizes[idx], condition: e.target.value };
                          setEditingReward({
                            ...editingReward,
                            customConfig: { ...editingReward.customConfig!, prizes }
                          });
                        }}
                        placeholder="เช่น ยอดขายสูงสุด, อันดับ 1"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Budget - Only for non-custom rewards */}
            {!editingReward.customConfig && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  งบประมาณรางวัลนี้รวม
                  {(editingReward.tiers || editingReward.streaks || editingReward.luckyConfig) && (
                    <span className="text-xs font-normal text-gray-500 ml-2">(คำนวณอัตโนมัติ)</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                  <input
                    type="number"
                    value={editingReward.budget}
                    onChange={(e) => setEditingReward({ ...editingReward, budget: parseInt(e.target.value) || 0 })}
                    readOnly={!!(editingReward.tiers || editingReward.streaks || editingReward.luckyConfig)}
                    className={`w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-semibold ${(editingReward.tiers || editingReward.streaks || editingReward.luckyConfig) ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                  />
                </div>
                {editingReward.tiers && (
                  <p className="text-xs text-gray-500 mt-2">
                    * คำนวณจากผลรวม {editingReward.tiers.length} Tiers
                  </p>
                )}
                {editingReward.streaks && (
                  <p className="text-xs text-gray-500 mt-2">
                    * คำนวณจากผลรวม Streak Bonus
                  </p>
                )}
                {editingReward.luckyConfig && (
                  <p className="text-xs text-gray-500 mt-2">
                    * คำนวณจาก Lucky Draw ({editingReward.luckyConfig.winners} คน × ฿{editingReward.luckyConfig.amount.toLocaleString()})
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingReward(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  // Auto-calculate budget from tiers if applicable (NOT for custom rewards)
                  let finalReward = { ...editingReward };
                  if (finalReward.tiers) {
                    finalReward.budget = finalReward.tiers.reduce((sum, t) => sum + t.amount, 0);
                  } else if (finalReward.streaks) {
                    finalReward.budget = finalReward.streaks.reduce((sum, s) => sum + (s.winners * s.amount), 0);
                  } else if (finalReward.luckyConfig) {
                    finalReward.budget = finalReward.luckyConfig.winners * finalReward.luckyConfig.amount;
                  }
                  // For custom rewards, keep budget as manually entered by user
                  setRewards(rewards.map(r => r.id === finalReward.id ? finalReward : r));
                  setEditingReward(null);
                }}
                className="flex-1 px-4 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
