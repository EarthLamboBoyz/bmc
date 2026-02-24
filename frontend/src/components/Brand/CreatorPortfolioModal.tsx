import { X, Play, Heart, MessageCircle, Share2, DollarSign, TrendingUp } from 'lucide-react';
import { CreatorStats, Submission } from '../../types';
import { useData } from '../../context/DataContext';

interface CreatorPortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    creatorId: string;
    campaignId: string;
}

export default function CreatorPortfolioModal({ isOpen, onClose, creatorId, campaignId }: CreatorPortfolioModalProps) {
    const { creatorStats, submissions } = useData();

    if (!isOpen) return null;

    // Get data
    const stats = creatorStats.find(s => s.creatorId === creatorId && s.campaignId === campaignId);
    // In a real app, we would fetch user details. Here we might need to find from submissions or mock users.
    // Let's grab from submissions to get name/avatar if user not found in context list easily
    const creatorInfo = submissions.find(s => s.creatorId === creatorId) || { creatorName: 'Unknown', creatorAvatar: '', creatorHandle: '' };

    const creatorSubmissions = submissions.filter(
        s => s.creatorId === creatorId && s.campaignId === campaignId && s.status === 'approved'
    ).sort((a, b) => (b.performance?.views || 0) - (a.performance?.views || 0)); // Sort by views desc

    const topVideos = creatorSubmissions.slice(0, 3);
    const otherVideos = creatorSubmissions.slice(3);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-600 flex items-center justify-between bg-white dark:bg-slate-800 z-10">
                    <div className="flex items-center gap-4">
                        <img
                            src={creatorInfo.creatorAvatar}
                            alt={creatorInfo.creatorName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{creatorInfo.creatorName}</h2>
                            <p className="text-gray-500 dark:text-gray-300">{creatorInfo.creatorHandle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1 bg-gray-50/50 dark:bg-slate-900/50">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                                <Play className="w-4 h-4" /> Views
                            </div>
                            <p className="text-2xl font-bold dark:text-white">{creatorSubmissions.reduce((sum, s) => sum + (s.performance?.views || 0), 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                                <DollarSign className="w-4 h-4" /> GMV
                            </div>
                            <p className="text-2xl font-bold text-emerald-600">฿{stats?.gmv.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                                <TrendingUp className="w-4 h-4" /> Engagement
                            </div>
                            <p className="text-2xl font-bold dark:text-white">
                                {((creatorSubmissions.reduce((sum, s) => sum + (s.performance?.engagementRate || 0), 0) / (creatorSubmissions.length || 1)).toFixed(2))}%
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                                <Play className="w-4 h-4" /> Total Videos
                            </div>
                            <p className="text-2xl font-bold dark:text-white">{stats?.totalVideos || 0}</p>
                        </div>
                    </div>

                    {/* Top Videos */}
                    {topVideos.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                <TrendingUp className="w-5 h-5 text-primary" /> Top Performing Videos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {topVideos.map(video => (
                                    <div key={video.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-600 group hover:shadow-md transition-all">
                                        <div className="aspect-[9/16] bg-black relative">
                                            {/* Simulated Video Thumbnail */}
                                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                                <Play className="w-16 h-16 fill-current" />
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <span className="flex items-center gap-1"><Play className="w-3 h-3 fill-current" /> {(video.performance?.views || 0).toLocaleString()}</span>
                                                    <span className="text-emerald-400 font-bold">฿{(video.performance?.gmv || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-2">
                                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {(video.performance?.likes || 0).toLocaleString()}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {(video.performance?.shares || 0).toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Day {video.day} • {new Date(video.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Videos Repository */}
                    {otherVideos.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mb-4 dark:text-white">All Approved Videos</h3>
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-slate-600">
                                        <tr>
                                            <th className="px-4 py-3">Video</th>
                                            <th className="px-4 py-3 text-right">Views</th>
                                            <th className="px-4 py-3 text-right">Likes</th>
                                            <th className="px-4 py-3 text-right">GMV</th>
                                            <th className="px-4 py-3 text-right">Date</th>
                                            <th className="px-4 py-3">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                        {otherVideos.map(video => (
                                            <tr key={video.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Day {video.day}</td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{(video.performance?.views || 0).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{(video.performance?.likes || 0).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 font-medium">฿{(video.performance?.gmv || 0).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-gray-400 dark:text-gray-500">{new Date(video.submittedAt).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
