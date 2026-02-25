import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Calendar,
  Wallet,
  Gift,
  Check,
  Clock,
  Flame,
  Trophy,
  X,
  Send,
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { submissionService } from '../../services/submission.service';
import { campaignService } from '../../services/campaign.service';
import SubmitWorkModal from '../../components/Creator/SubmitWorkModal';
import EmptyState from '../../components/EmptyState';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'mysubmissions', label: 'งานของฉัน' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'guidelines', label: 'Content Guidelines' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export default function CampaignDetail() {
  console.log('🔥 COMPONENT MOUNTED');
  const { id } = useParams();
  console.log('🔥 id from useParams:', id);
  const { user } = useAuth();
  console.log('🔥 user:', user?.id);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myApplication, setMyApplication] = useState<any>(null);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Keep other data from context for now (creatorStats, etc.)
  const { creatorStats } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    console.log('useEffect triggered with id:', id);
    if (!id) {
      console.log('No id, returning');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      console.log('Fetching data...');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token');
          setError('กรุณาเข้าสู่ระบบ');
          setLoading(false);
          return;
        }

        // Fetch Campaign - Use general endpoint to allow viewing before applying
        console.log('Fetching campaign from general endpoint...');
        try {
          const campaignData = await campaignService.getCampaignById(id, token);
          console.log('✅ Campaign data:', campaignData);
          setCampaign(campaignData);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setError('ไม่พบแคมเปญ หรือคุณไม่มีสิทธิ์เข้าถึงเบื้องต้น');
          } else {
            setError(`เกิดข้อผิดพลาดในการโหลดข้อมูลแคมเปญ`);
          }
          setLoading(false);
          return;
        }

        // Fetch My Applications
        console.log('Fetching applications...');
        const myApps = await applicationService.getMyApplications(token);
        if (Array.isArray(myApps)) {
          const app = myApps.find((a: any) => a.campaignId === id);
          setMyApplication(app);
        }

        // Fetch submissions
        if (user?.id) {
          console.log('Fetching submissions...');
          const mySubs = await submissionService.getSubmissions({ campaignId: id, creatorId: user.id });
          setMySubmissions(mySubs);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/creator/campaigns" className="px-6 py-2 bg-primary text-white rounded-xl">
            กลับไปหน้าแคมเปญ
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ไม่พบแคมเปญ</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            แคมเปญที่คุณต้องการดูอาจถูกลบหรือสิ้นสุดระยะเวลาแล้ว
          </p>
          <Link
            to="/creator/campaigns"
            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            กลับไปหน้าแคมเปญ
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Check if user has applied or is approved
  const isJoined = myApplication?.status === 'APPROVED';
  const hasPendingApplication = myApplication?.status === 'PENDING';
  const isRejected = myApplication?.status === 'REJECTED';


  // Calculate progress
  const totalDays = campaign.durationDays || 30;
  const daysPassed = campaign.daysPassed || 0;
  const daysRemaining = totalDays - daysPassed;
  const progressPercent = (daysPassed / totalDays) * 100;

  // Get creator stats for this campaign
  const myStats = creatorStats?.find((s: any) => s.campaignId === campaign.id);
  const myRank = myStats?.rank?.gmv || 0;  // rank is { gmv, volume, streak }
  const myGmv = myStats?.gmv || 0;
  const myVideos = myStats?.totalVideos || 0;
  const myStreak = myStats?.currentStreak || 0;

  // Potential earnings not in type — show 0 as placeholder
  const potentialEarnings = 0;

  // Handle application submission
  const handleApply = async () => {
    if (!campaign) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'กรุณาเข้าสู่ระบบ');
        return;
      }

      // Call API to apply
      await applicationService.apply(token, campaign.id, applicationMessage);

      setMyApplication({
        id: 'new-app',
        campaignId: campaign.id,
        status: 'PENDING',
        message: applicationMessage,
        createdAt: new Date().toISOString(),
      });
      setShowApplyModal(false);
      setApplicationMessage('');
      showNotification('success', 'สมัครเข้าร่วมแคมเปญสำเร็จ! 🎉');
    } catch (error: any) {
      console.error('Error applying:', error);
      showNotification('error', error.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/creator/campaigns"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าแคมเปญ
          </Link>
        </div>

        {/* Campaign Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden mb-6">
          <div className="relative h-64">
            <img
              src={campaign.coverImage || campaign.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                  {campaign.status === 'ACTIVE' ? 'กำลังดำเนินการ' : campaign.status}
                </span>
                {isJoined && (
                  <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    เข้าร่วมแล้ว
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{campaign.title}</h1>
              <p className="text-white/80">by {campaign.brandName || campaign.brand?.companyName}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">ระยะเวลา</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{daysRemaining} วัน</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">งบประมาณ</span>
              </div>
              <p className="text-xl font-bold dark:text-white">฿{(campaign.budget || 0).toLocaleString()}</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">ผู้เข้าร่วม</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{campaign.participants || 0} คน</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Gift className="w-4 h-4" />
                <span className="text-sm">รางวัล</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{campaign.rewards?.length || 0} ประเภท</p>
            </div>
          </div>
        </div>

        {/* My Stats */}
        {isJoined && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold dark:text-white mb-4">สถิติของฉัน</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">อันดับ</span>
                </div>
                <p className="text-2xl font-bold text-primary">#{myRank}</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">ยอดขาย</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">฿{myGmv.toLocaleString()}</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">Streak</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{myStreak} วัน</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm">รายได้ที่คาดว่าจะได้</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">฿{potentialEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold dark:text-white mb-3">รายละเอียดแคมเปญ</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {!isJoined && !hasPendingApplication && (
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
                    <h4 className="font-bold dark:text-white mb-2">ยังไม่ได้เข้าร่วมแคมเปญนี้</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      สมัครเข้าร่วมเพื่อเริ่มสร้างรายได้จากการรีวิวสินค้า
                    </p>
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                      สมัครเข้าร่วม
                    </button>
                  </div>
                )}

                {hasPendingApplication && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h4 className="font-bold text-amber-800 dark:text-amber-200">รอการอนุมัติ</h4>
                    </div>
                    <p className="text-amber-700 dark:text-amber-300">
                      คำสมัครของคุณอยู่ระหว่างการตรวจสอบ กรุณารอการอนุมัติจากแบรนด์
                    </p>
                  </div>
                )}

                {isJoined && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="flex-1 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      ส่งงาน
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mysubmissions' && (
              <div>
                <h3 className="text-lg font-bold dark:text-white mb-4">งานของฉัน ({mySubmissions.length})</h3>
                {mySubmissions.length === 0 ? (
                  <EmptyState
                    icon={Send}
                    title="ยังไม่มีงาน"
                    description="เริ่มส่งงานเพื่อสร้างรายได้"
                  />
                ) : (
                  <div className="space-y-4">
                    {mySubmissions.map((sub: any) => (
                      <div key={sub.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                            sub.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                            {sub.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                              sub.status === 'REJECTED' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(sub.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{sub.caption}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-bold dark:text-white mb-4">รางวัล</h3>
                <div className="space-y-4">
                  {(campaign.rewards || []).map((reward: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Gift className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold dark:text-white">{reward.name || reward.type}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {reward.type === 'sales_milestone' ? 'ยอดขาย' :
                              reward.type === 'top_volume' ? 'จำนวนวิดีโอ' :
                                reward.type === 'streak_bonus' ? 'Streak' : 'สุ่มรางวัล'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Work Modal */}
      {showSubmitModal && (
        <SubmitWorkModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          campaignId={campaign.id}
          campaignName={campaign.title}
          currentDay={daysPassed + 1}
          onSuccess={() => {
            setShowSubmitModal(false);
            // Refresh submissions after successful submit
            if (user?.id && id) {
              submissionService.getSubmissions({ campaignId: id, creatorId: user.id })
                .then(setMySubmissions)
                .catch(console.error);
            }
          }}
          variant="detail"
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold dark:text-white">สมัครเข้าร่วมแคมเปญ</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              คุณกำลังสมัครเข้าร่วมแคมเปญ <strong>{campaign.title}</strong>
            </p>
            <textarea
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="ข้อความถึงแบรนด์ (ไม่บังคับ)"
              className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-xl mb-4 dark:bg-slate-700 dark:text-white"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 gradient-primary text-white rounded-xl hover:opacity-90"
              >
                ยืนยันการสมัคร
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[9999] animate-slide-up">
          <div style={{
            background: notification.type === 'success'
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #dc2626, #ef4444)',
            borderRadius: '16px',
            padding: '16px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
          }}>
            <span style={{ fontSize: '24px' }}>{notification.type === 'success' ? '✅' : '❌'}</span>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{notification.message}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
