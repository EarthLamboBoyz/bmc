import { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { uploadService } from '../services/upload.service';
import { transactionService } from '../services/transaction.service';

interface UploadSlipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (transactionId: string) => void;
    transactionId: string;
    creatorName: string;
    amount: number;
}

export default function UploadSlipModal({
    isOpen,
    onClose,
    onSuccess,
    transactionId,
    creatorName,
    amount,
}: UploadSlipModalProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            showError('กรุณาเลือกรูปภาพสลิป');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload Slip Image
            const imageUrl = await uploadService.uploadImage(imageFile);

            // 2. Submit Payment Proof
            await transactionService.uploadPaymentProof(transactionId, imageUrl, transferDate, note);

            showSuccess('อัพโหลดสลิปสำเร็จ');

            // Call success callback to update parent state
            if (onSuccess) {
                onSuccess(transactionId);
            }

            onClose();
            // Reset form
            setImageFile(null);
            setImagePreview(null);
            setNote('');
        } catch (error) {
            console.error(error);
            showError('เกิดข้อผิดพลาดในการอัพโหลดสลิป');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">อัพโหลดสลิปโอนเงิน</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            โอนให้ {creatorName} • ฿{amount.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            รูปภาพสลิปโอนเงิน
                        </label>

                        {!imagePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                                        <span className="font-semibold">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">
                                        PNG, JPG หรือ JPEG (สูงสุด 5MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Slip preview"
                                    className="w-full h-64 object-contain rounded-xl border border-gray-200 dark:border-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Transfer Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            วันที่โอนเงิน
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={transferDate}
                                onChange={(e) => setTransferDate(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            หมายเหตุ (ถ้ามี)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="เช่น: โอนผ่าน Mobile Banking"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium dark:text-white"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !imageFile}
                            className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'กำลังอัพโหลด...' : 'อัพโหลดสลิป'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
