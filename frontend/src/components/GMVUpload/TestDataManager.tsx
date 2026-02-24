import { useState } from 'react';
import { Download, Users, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

interface TestDataManagerProps {
    campaignId: string;
    onDataChanged?: () => void;
}

export default function TestDataManager({ campaignId, onDataChanged }: TestDataManagerProps) {
    const [isSeeding, setIsSeeding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [createdCreators, setCreatedCreators] = useState<any[]>([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const seedTestData = async () => {
        setIsSeeding(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/test/seed-campaign-data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    campaignId,
                    creatorCount: 8
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to seed test data');
            }

            setCreatedCreators(data.creators);
            showSuccess(`สร้างข้อมูลทดสอบสำเร็จ: ${data.creators.length} ครีเอเตอร์`);
            
            if (onDataChanged) {
                onDataChanged();
            }
        } catch (error: any) {
            showError(error.message);
        } finally {
            setIsSeeding(false);
        }
    };

    const downloadSampleCSV = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/test/sample-csv/${campaignId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || data.error || 'Failed to generate sample CSV');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sample_gmv_${campaignId}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showSuccess('ดาวน์โหลดไฟล์ตัวอย่างสำเร็จ');
        } catch (error: any) {
            showError(error.message);
        }
    };

    const clearTestData = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทดสอบทั้งหมด?')) {
            return;
        }

        setIsClearing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/test/clear-campaign-data/${campaignId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to clear test data');
            }

            setCreatedCreators([]);
            showSuccess(`ลบข้อมูลทดสอบสำเร็จ: ${data.deletedCount} ครีเอเตอร์`);
            
            if (onDataChanged) {
                onDataChanged();
            }
        } catch (error: any) {
            showError(error.message);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={seedTestData}
                    disabled={isSeeding}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-xl transition-colors"
                >
                    {isSeeding ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Users className="w-5 h-5" />
                    )}
                    สร้างครีเอเตอร์ทดสอบ (8 คน)
                </button>

                <button
                    onClick={downloadSampleCSV}
                    disabled={isSeeding}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-xl transition-colors"
                >
                    <Download className="w-5 h-5" />
                    ดาวน์โหลด CSV ตัวอย่าง
                </button>

                <button
                    onClick={clearTestData}
                    disabled={isClearing || createdCreators.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-xl transition-colors"
                >
                    {isClearing ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Trash2 className="w-5 h-5" />
                    )}
                    ลบข้อมูลทดสอบ
                </button>
            </div>

            {/* Created Creators List */}
            {createdCreators.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-medium text-white">
                            ครีเอเตอร์ที่สร้าง ({createdCreators.length} คน)
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-700 max-h-64 overflow-y-auto">
                        {createdCreators.map((creator) => (
                            <div key={creator.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{creator.name}</p>
                                    <p className="text-sm text-gray-400">{creator.handle}</p>
                                    <p className="text-xs text-gray-500">{creator.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm">
                                        {creator.submissions} วิดีโอ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-2">ขั้นตอนการทดสอบ:</h4>
                <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
                    <li>คลิก "สร้างครีเอเตอร์ทดสอบ" เพื่อสร้างครีเอเตอร์จำลองในแคมเปญนี้</li>
                    <li>คลิก "ดาวน์โหลด CSV ตัวอย่าง" เพื่อรับไฟล์ GMV ที่มีข้อมูลตรงกับครีเอเตอร์ที่สร้าง</li>
                    <li>ไปที่ tab "อัพโหลด GMV" และอัพโหลดไฟล์ CSV ที่ดาวน์โหลดมา</li>
                    <li>ตรวจสอบผลลัพธ์ใน tab "Leaderboard"</li>
                    <li>เมื่อเสร็จสิ้น คลิก "ลบข้อมูลทดสอบ" เพื่อล้างข้อมูล</li>
                </ol>
            </div>

            {/* CSV Format */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-2">รูปแบบไฟล์ CSV:</h4>
                <code className="block bg-slate-900 p-3 rounded-lg text-sm text-gray-400 font-mono">
                    creator_id,creator_name,gmv,orders,last_updated<br />
                    uuid-1,@beauty_sara,450000,1200,2026-02-18<br />
                    uuid-2,@skincare_lover,380000,980,2026-02-18<br />
                    uuid-3,@makeup_guru,250000,650,2026-02-18
                </code>
            </div>
        </div>
    );
}
