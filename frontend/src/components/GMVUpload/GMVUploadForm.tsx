import { useState, useCallback } from 'react';
import { Upload, FileText, Download, X, CheckCircle, AlertCircle } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

interface GMVUploadFormProps {
    campaignId: string;
    onUploadSuccess?: () => void;
}

interface UploadResult {
    uploadId: string;
    processed: boolean;
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
    summary: {
        totalGMV: number;
        totalOrders: number;
        creatorsUpdated: number;
    };
}

export default function GMVUploadForm({ campaignId, onUploadSuccess }: GMVUploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
            setUploadResult(null);
        } else {
            showError('กรุณาอัพโหลดไฟล์ CSV เท่านั้น');
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showError('กรุณาเลือกไฟล์ CSV');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('campaignId', campaignId);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/gmv/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.details || 'Upload failed');
            }

            setUploadResult(result.data);
            showSuccess('อัพโหลดข้อมูล GMV สำเร็จ!');
            
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error: any) {
            showError(error.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/gmv/sample-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download template');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gmv_template.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showSuccess('ดาวน์โหลด template สำเร็จ');
        } catch (error: any) {
            showError(error.message);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">ตัวอย่างไฟล์ CSV</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ดาวน์โหลดไฟล์ตัวอย่างพร้อมข้อมูลจำลอง</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>ดาวน์โหลด</span>
                    </button>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                    💡 หมายเหตุ: ไฟล์นี้มีข้อมูลจำลองสำหรับทดสอบ UI เท่านั้น 
                    หากต้องการ upload จริง ต้องมีครีเอเตอร์ที่ approved ในแคมเปญนี้ก่อน
                </p>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600 bg-gray-50 dark:bg-slate-800/30'
                }`}
            >
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    
                    {file ? (
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium">{file.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setUploadResult(null);
                                }}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
                            >
                                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-900 dark:text-white font-medium">
                                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                รองรับไฟล์ CSV เท่านั้น (ขนาดสูงสุด 5MB)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Upload Button */}
            {file && !uploadResult && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            กำลังอัพโหลด...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            อัพโหลดข้อมูล GMV
                        </>
                    )}
                </button>
            )}

            {/* Upload Result */}
            {uploadResult && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">อัพโหลดสำเร็จ</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ประมวลผล {uploadResult.successCount} จาก {uploadResult.totalRows} แถว
                            </p>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                                {uploadResult.summary.creatorsUpdated}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ครีเอเตอร์</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(uploadResult.summary.totalGMV)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ยอดขายรวม</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {uploadResult.summary.totalOrders.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ออเดอร์</p>
                        </div>
                    </div>

                    {uploadResult.errorCount > 0 && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-900/50">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">พบข้อผิดพลาด {uploadResult.errorCount} รายการ</span>
                            </div>
                            <div className="max-h-32 overflow-y-auto text-sm text-red-700 dark:text-red-300 space-y-1">
                                {uploadResult.errors.slice(0, 5).map((error, index) => (
                                    <p key={index}>• {error}</p>
                                ))}
                                {uploadResult.errors.length > 5 && (
                                    <p className="text-red-600 dark:text-red-400">
                                        และอีก {uploadResult.errors.length - 5} รายการ...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                        <button
                            onClick={() => {
                                setFile(null);
                                setUploadResult(null);
                            }}
                            className="w-full py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                        >
                            อัพโหลดไฟล์ใหม่
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
