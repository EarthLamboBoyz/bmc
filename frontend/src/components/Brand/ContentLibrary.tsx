import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Play, Heart, Share2, DollarSign, ExternalLink, X } from 'lucide-react';
import { Submission } from '../../types';
import { useData } from '../../context/DataContext';
import { submissionService } from '../../services/submission.service';
import CreatorPortfolioModal from './CreatorPortfolioModal';

interface ContentLibraryProps {
    campaignId: string;
}

export default function ContentLibrary({ campaignId }: ContentLibraryProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [minViews, setMinViews] = useState<number>(0);
    const [minGMV, setMinGMV] = useState<number>(0);
    const [sortBy, setSortBy] = useState<'newest' | 'views' | 'gmv'>('newest');
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
    const [activePopup, setActivePopup] = useState<'views' | 'gmv' | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                // Fetch only approved submissions for this campaign
                const data = await submissionService.getSubmissions({
                    campaignId,
                    status: 'APPROVED'
                });
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch content library", error);
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchSubmissions();
        }
    }, [campaignId]);

    // Apply filters
    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.notes?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesViews = (s.performance?.views || 0) >= minViews;
        const matchesGMV = (s.performance?.gmv || 0) >= minGMV;

        return matchesSearch && matchesViews && matchesGMV;
    });

    // Apply sort
    const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
        if (sortBy === 'views') {
            return (b.performance?.views || 0) - (a.performance?.views || 0);
        }
        if (sortBy === 'gmv') {
            return (b.performance?.gmv || 0) - (a.performance?.gmv || 0);
        }
        // Newest
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    return (
        <div>
            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-600 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search creator or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Views Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setActivePopup(activePopup === 'views' ? null : 'views')}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${activePopup === 'views'
                                ? 'border-primary bg-primary/5 text-primary dark:border-primary dark:bg-primary/10 dark:text-white'
                                : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-800 dark:text-white'}`}
                        >
                            <Filter className={`w-4 h-4 ${activePopup === 'views' ? 'text-primary' : 'text-gray-500'}`} />
                            <span>Views: {minViews > 0 ? `${(minViews / 1000).toFixed(0)}k+` : 'All'}</span>
                        </button>

                        {/* Backdrop for Mobile */}
                        {activePopup === 'views' && (
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setActivePopup(null)}
                            />
                        )}

                        {activePopup === 'views' && (
                            <div className="fixed inset-x-0 bottom-0 top-auto translate-y-0 md:absolute md:inset-auto md:top-full md:right-0 mt-0 md:mt-2 w-full md:w-72 bg-white dark:bg-slate-800 border-t md:border border-gray-100 dark:border-slate-600 rounded-t-2xl md:rounded-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-lg p-6 md:p-4 z-50 md:z-20 ring-0 md:ring-1 ring-black/5 pb-8 md:pb-4 safe-area-bottom animate-slide-up md:animate-none">
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden"></div>

                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white">Minimum Views</label>
                                    <button
                                        onClick={() => setActivePopup(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    value={minViews}
                                    onChange={(e) => setMinViews(Number(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-none"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-2">
                                    <span>0</span>
                                    <span className="font-medium text-primary">{(minViews).toLocaleString()} Views</span>
                                    <span>500k+</span>
                                </div>

                                <div className="mt-6 md:hidden">
                                    <button
                                        onClick={() => setActivePopup(null)}
                                        className="w-full py-3 bg-primary text-white rounded-xl font-medium active:scale-95 transition-transform"
                                    >
                                        ดูผลลัพธ์
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* GMV Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setActivePopup(activePopup === 'gmv' ? null : 'gmv')}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${activePopup === 'gmv'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-800 dark:text-white'}`}
                        >
                            <DollarSign className={`w-4 h-4 ${activePopup === 'gmv' ? 'text-emerald-500' : 'text-gray-500'}`} />
                            <span>GMV: {minGMV > 0 ? `฿${minGMV.toLocaleString()}+` : 'All'}</span>
                        </button>

                        {/* Backdrop for Mobile */}
                        {activePopup === 'gmv' && (
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setActivePopup(null)}
                            />
                        )}

                        {activePopup === 'gmv' && (
                            <div className="fixed inset-x-0 bottom-0 top-auto translate-y-0 md:absolute md:inset-auto md:top-full md:right-0 mt-0 md:mt-2 w-full md:w-72 bg-white dark:bg-slate-800 border-t md:border border-gray-100 dark:border-slate-600 rounded-t-2xl md:rounded-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-lg p-6 md:p-4 z-50 md:z-20 ring-0 md:ring-1 ring-black/5 pb-8 md:pb-4 safe-area-bottom animate-slide-up md:animate-none">
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden"></div>

                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white">Minimum GMV</label>
                                    <button
                                        onClick={() => setActivePopup(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="20000"
                                    step="1000"
                                    value={minGMV}
                                    onChange={(e) => setMinGMV(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-none"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-2">
                                    <span>฿0</span>
                                    <span className="font-medium text-emerald-500">฿{(minGMV).toLocaleString()}</span>
                                    <span>฿20k+</span>
                                </div>

                                <div className="mt-6 md:hidden">
                                    <button
                                        onClick={() => setActivePopup(null)}
                                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                                    >
                                        ดูผลลัพธ์
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer bg-white dark:bg-slate-900 dark:text-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="views">Most Views</option>
                        <option value="gmv">Highest GMV</option>
                    </select>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedSubmissions.map((sub) => (
                    <div key={sub.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 overflow-hidden hover:shadow-lg transition-all duration-300">
                        {/* Thumbnail */}
                        <div className="aspect-[9/16] bg-gray-900 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                                <Play className="w-12 h-12 fill-current" />
                            </div>

                            {/* Overlay Stats */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        {(sub.performance?.views || 0).toLocaleString()}
                                    </div>
                                    <div className="font-bold text-emerald-400">
                                        ฿{(sub.performance?.gmv || 0).toLocaleString()}
                                    </div>
                                </div>

                                {/* Creator - Clickable */}
                                <button
                                    onClick={() => setSelectedCreatorId(sub.creatorId)}
                                    className="flex items-center gap-2 w-full hover:bg-white/10 p-1 rounded-lg transition-colors -ml-1"
                                >
                                    <img src={sub.creatorAvatar} alt={sub.creatorName} className="w-6 h-6 rounded-full border border-white/50" />
                                    <span className="text-xs font-medium truncate opacity-90">{sub.creatorName}</span>
                                </button>
                            </div>

                            {/* Top Details */}
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                <a
                                    href={sub.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                                    title="Open Video"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Bottom details */}
                        <div className="p-3 bg-white dark:bg-slate-800">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-300 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {(sub.performance?.likes || 0).toLocaleString()}</span>
                                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {(sub.performance?.shares || 0).toLocaleString()}</span>
                                </div>
                                <span>Day {sub.day}</span>
                            </div>
                            {sub.notes && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 italic">"{sub.notes}"</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {sortedSubmissions.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-700 rounded-2xl border border-dashed border-gray-200 dark:border-slate-600">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">No content found matches your filters</div>
                    <button
                        onClick={() => { setSearchQuery(''); setMinViews(0); setMinGMV(0); }}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Creator Modal */}
            {selectedCreatorId && (
                <CreatorPortfolioModal
                    isOpen={true}
                    onClose={() => setSelectedCreatorId(null)}
                    creatorId={selectedCreatorId}
                    campaignId={campaignId}
                />
            )}
        </div>
    );
}
