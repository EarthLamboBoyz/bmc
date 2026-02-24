import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, BarChart3, History } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import GMVUploadForm from '../../components/GMVUpload/GMVUploadForm';
import Leaderboard from '../../components/GMVUpload/Leaderboard';

type TabType = 'upload' | 'leaderboard' | 'history';

export default function GMVUpload() {
    const { id: campaignId } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('upload');

    if (!campaignId) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    กรุณาเลือกแคมเปญ
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        จัดการข้อมูล GMV
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        อัพโหลดข้อมูลยอดขายจาก TikTok Affiliate และดู Leaderboard
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            activeTab === 'upload'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        <Upload className="w-4 h-4" />
                        อัพโหลด GMV
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            activeTab === 'leaderboard'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Leaderboard
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            activeTab === 'history'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        ประวัติการอัพโหลด
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                    {activeTab === 'upload' && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                อัพโหลดไฟล์ CSV
                            </h2>
                            <GMVUploadForm 
                                campaignId={campaignId} 
                                onUploadSuccess={() => setActiveTab('leaderboard')}
                            />
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Leaderboard
                            </h2>
                            <Leaderboard campaignId={campaignId} />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                ประวัติการอัพโหลด
                            </h2>
                            <GMVUploadHistory campaignId={campaignId} />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

// GMV Upload History Component
function GMVUploadHistory({ campaignId }: { campaignId: string }) {
    const [uploads, setUploads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/api/gmv/campaign/${campaignId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUploads(data);
            }
        } catch (error) {
            console.error('Error fetching uploads:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

    if (uploads.length === 0) {
        return (
            <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">ยังไม่มีประวัติการอัพโหลด</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {uploads.map((upload) => (
                <div
                    key={upload.id}
                    className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                                upload.processed ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <span className="font-medium text-gray-900 dark:text-white">{upload.fileName}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(upload.uploadedAt)}
                        </span>
                    </div>
                    
                    {upload.processed && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ครีเอเตอร์</p>
                                <p className="font-medium text-gray-900 dark:text-white">{upload.totalCreators || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ยอดขาย</p>
                                <p className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(upload.totalGmv || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ออเดอร์</p>
                                <p className="font-medium text-blue-600 dark:text-blue-400">
                                    {(upload.totalOrders || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {upload.errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                            {upload.errorMessage}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
