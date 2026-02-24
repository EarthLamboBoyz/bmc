import { useState } from 'react';
import { X } from 'lucide-react';

interface BulkApproveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemCount: number;
    items?: Array<{ id: string; title: string }>;
}

export default function BulkApproveModal({
    isOpen,
    onClose,
    onConfirm,
    itemCount,
    items = [],
}: BulkApproveModalProps) {
    const [isChecked, setIsChecked] = useState(false);

    if (!isOpen) return null;

    const displayItems = items.slice(0, 5);
    const remainingCount = itemCount - displayItems.length;

    const handleConfirm = () => {
        if (isChecked) {
            onConfirm();
            setIsChecked(false);
            onClose();
        }
    };

    const handleClose = () => {
        setIsChecked(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">⚠️ ยืนยันการอนุมัติทั้งหมด</h2>
                            <p className="text-red-50 text-sm">
                                กรุณาตรวจสอบอย่างรอบคอบก่อนดำเนินการ
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 text-lg font-semibold mb-4">
                            คุณแน่ใจหรือไม่ว่าต้องการอนุมัติทั้งหมด{' '}
                            <span className="text-red-600 font-bold">{itemCount} รายการ</span>?
                        </p>

                        {displayItems.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm font-semibold text-gray-600 mb-2">
                                    รายการที่จะอนุมัติ:
                                </p>
                                <ul className="space-y-2">
                                    {displayItems.map((item, index) => (
                                        <li key={item.id} className="text-sm text-gray-700 flex items-start">
                                            <span className="text-gray-400 mr-2">{index + 1}.</span>
                                            <span className="line-clamp-1">{item.title || `รายการ ${item.id}`}</span>
                                        </li>
                                    ))}
                                </ul>
                                {remainingCount > 0 && (
                                    <p className="text-sm text-gray-500 mt-2 italic">
                                        และอีก {remainingCount} รายการ...
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p className="text-sm text-yellow-800">
                                <strong>คำเตือน:</strong> การอนุมัติทั้งหมดจะไม่สามารถยกเลิกได้
                                กรุณาตรวจสอบรายการอย่างละเอียดก่อนดำเนินการ
                            </p>
                        </div>

                        {/* Confirmation Checkbox */}
                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 select-none">
                                ฉันเข้าใจและต้องการดำเนินการอนุมัติทั้งหมด{' '}
                                <strong className="text-red-600">{itemCount} รายการ</strong> ต่อ
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!isChecked}
                            className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${isChecked
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            ยืนยันการอนุมัติ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
