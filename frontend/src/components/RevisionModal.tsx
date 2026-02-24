import { useState } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';

interface RevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comment: string, reasons: string[]) => void;
    submissionTitle?: string;
}

const revisionReasons = [
    'เนื้อหาไม่ตรงตาม brief',
    'คุณภาพวิดีโอต่ำ',
    'ขาดองค์ประกอบสำคัญ',
    'เสียงไม่ชัดเจน',
    'แสงสว่างไม่เหมาะสม',
    'ระยะเวลาไม่ตรงตามกำหนด',
];

export default function RevisionModal({
    isOpen,
    onClose,
    onSubmit,
    submissionTitle = 'งานที่ส่ง',
}: RevisionModalProps) {
    const [comment, setComment] = useState('');
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [otherReason, setOtherReason] = useState('');

    if (!isOpen) return null;

    const handleReasonToggle = (reason: string) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleSubmit = () => {
        const allReasons = [...selectedReasons];
        if (otherReason.trim()) {
            allReasons.push(`อื่นๆ: ${otherReason.trim()}`);
        }

        if (comment.trim() || allReasons.length > 0) {
            onSubmit(comment.trim(), allReasons);
            // Reset form
            setComment('');
            setSelectedReasons([]);
            setOtherReason('');
            onClose();
        }
    };

    const canSubmit = comment.trim().length > 0 || selectedReasons.length > 0 || otherReason.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6" />
                        <div>
                            <h2 className="text-xl font-bold">ส่งกลับแก้ไข</h2>
                            <p className="text-sm text-white/90">{submissionTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Warning Message */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>หน้าที่:</strong> โปรดระบุสิ่งที่ต้องการให้แก้ไขอย่างชัดเจน เพื่อให้ครีเอเตอร์สามารถปรับปรุงงานได้ตรงตามความต้องการ
                        </p>
                    </div>

                    {/* Reason Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            เหตุผลที่ต้องแก้ไข (เลือกได้หลายข้อ)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {revisionReasons.map((reason) => (
                                <label
                                    key={reason}
                                    className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedReasons.includes(reason)}
                                        onChange={() => handleReasonToggle(reason)}
                                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Other Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            เหตุผลอื่นๆ (ถ้ามี)
                        </label>
                        <input
                            type="text"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            placeholder="ระบุเหตุผลอื่นๆ..."
                            className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Comment Textarea */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="โปรดระบุสิ่งที่ต้องการให้แก้ไขอย่างละเอียด เช่น ต้องการให้เพิ่มฉากแสดงผลิตภัณฑ์ใกล้ชิดมากขึ้น หรือปรับโทนสีให้สดใสขึ้น..."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            ข้อความนี้จะถูกส่งไปยังครีเอเตอร์
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900 px-6 py-4 flex items-center justify-between gap-3 rounded-b-2xl border-t border-gray-200 dark:border-slate-600">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        ส่งกลับแก้ไข
                    </button>
                </div>
            </div>
        </div>
    );
}
