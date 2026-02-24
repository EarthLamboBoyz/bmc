import { MessageCircle, Clock, AlertCircle } from 'lucide-react';

export interface RevisionComment {
    id: string;
    comment: string;
    reasons: string[];
    createdAt: string;
    createdBy: string;
}

interface RevisionHistoryProps {
    revisions: RevisionComment[];
    className?: string;
}

export default function RevisionHistory({ revisions, className = '' }: RevisionHistoryProps) {
    if (revisions.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold">ประวัติการส่งกลับแก้ไข ({revisions.length})</h3>
            </div>

            <div className="space-y-3">
                {revisions.map((revision, index) => (
                    <div
                        key={revision.id}
                        className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                    ครั้งที่ {revisions.length - index}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300">
                                <Clock className="w-3 h-3" />
                                {new Date(revision.createdAt).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>

                        {/* Reasons */}
                        {revision.reasons.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    เหตุผล:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {revision.reasons.map((reason, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs rounded-md"
                                        >
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comment */}
                        {revision.comment && (
                            <div>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    รายละเอียด:
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {revision.comment}
                                </p>
                            </div>
                        )}

                        {/* Created By */}
                        <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                โดย: {revision.createdBy}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
