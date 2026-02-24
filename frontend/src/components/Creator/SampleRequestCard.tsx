import { Package, MapPin, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { useState } from 'react';

interface SampleRequestCardProps {
    campaign: {
        id: string;
        title: string;
        hasSamples?: boolean;
        sampleInfo?: {
            description: string;
            imageUrl?: string;
            totalSamples: number;
            samplesPerCreator: number;
        };
    };
    sampleRequest?: {
        id: string;
        status: 'pending' | 'approved' | 'rejected' | 'shipped';
        requestedAt: string;
        reviewedAt?: string;
        shippedAt?: string;
        rejectionReason?: string;
    };
    userShippingAddress?: {
        recipientName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        district: string;
        province: string;
        postalCode: string;
    };
    onRequestSample: (message?: string) => void;
    isJoined: boolean;
}

export default function SampleRequestCard({
    campaign,
    sampleRequest,
    userShippingAddress,
    onRequestSample,
    isJoined,
}: SampleRequestCardProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [message, setMessage] = useState('');

    if (!campaign.hasSamples || !campaign.sampleInfo) {
        return null;
    }

    const { sampleInfo } = campaign;

    const handleConfirmRequest = () => {
        onRequestSample(message);
        setShowConfirmModal(false);
        setMessage('');
    };

    const getStatusBadge = () => {
        if (!sampleRequest) return null;

        const badges = {
            pending: {
                icon: Clock,
                text: 'รอการอนุมัติ',
                className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
            },
            approved: {
                icon: CheckCircle,
                text: 'อนุมัติแล้ว',
                className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
            },
            rejected: {
                icon: XCircle,
                text: 'ไม่อนุมัติ',
                className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50',
            },
            shipped: {
                icon: Truck,
                text: 'จัดส่งแล้ว',
                className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
            },
        };

        const badge = badges[sampleRequest.status];
        const Icon = badge.icon;

        return (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${badge.className}`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{badge.text}</span>
            </div>
        );
    };

    const canRequestSample = isJoined && !sampleRequest && userShippingAddress;

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    {/* Sample Image */}
                    <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                        {sampleInfo.imageUrl ? (
                            <img
                                src={sampleInfo.imageUrl}
                                alt="Sample product"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-300 dark:text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="font-semibold text-lg dark:text-white">ตัวอย่างสินค้า</h3>
                            </div>
                            {sampleRequest && getStatusBadge()}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-3">{sampleInfo.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-300 mb-4">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full font-medium border border-emerald-100 dark:border-emerald-900/30">
                                แจก {sampleInfo.totalSamples} ชิ้น
                            </span>
                            <span>รับได้ {sampleInfo.samplesPerCreator} ชิ้น/คน</span>
                        </div>

                        {/* Status Messages */}
                        {sampleRequest?.status === 'rejected' && sampleRequest.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 mb-3">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    <strong>เหตุผล:</strong> {sampleRequest.rejectionReason}
                                </p>
                            </div>
                        )}

                        {sampleRequest?.status === 'approved' && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg p-3 mb-3">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    แบรนด์จะจัดส่งสินค้าไปยังที่อยู่ที่คุณระบุไว้
                                </p>
                            </div>
                        )}

                        {sampleRequest?.status === 'shipped' && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3 mb-3">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    📦 จัดส่งเมื่อ: {new Date(sampleRequest.shippedAt!).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        {!sampleRequest && (
                            <div>
                                {!isJoined ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        กรุณาสมัครเข้าร่วมแคมเปญก่อนขอตัวอย่างสินค้า
                                    </p>
                                ) : !userShippingAddress ? (
                                    <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-medium mb-1">กรุณาตั้งค่าที่อยู่จัดส่ง</p>
                                            <p className="text-amber-600 dark:text-amber-400">
                                                ไปที่ Settings → ข้อมูลส่วนตัว เพื่อเพิ่มที่อยู่จัดส่ง
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowConfirmModal(true)}
                                        className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                    >
                                        ขอตัวอย่างสินค้า
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 dark:border-slate-600">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">ยืนยันการขอตัวอย่างสินค้า</h3>

                        {/* Product Info */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg">
                            <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="font-medium dark:text-gray-200">{sampleInfo.description}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">จำนวน {sampleInfo.samplesPerCreator} ชิ้น</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {userShippingAddress && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-red-500 dark:text-red-400" />
                                    <span className="font-medium text-sm dark:text-gray-300">ที่อยู่จัดส่ง:</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg p-3 text-sm">
                                    <p className="font-medium dark:text-gray-200">{userShippingAddress.recipientName}</p>
                                    <p className="text-gray-600 dark:text-gray-400">เบอร์โทร: {userShippingAddress.phone}</p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        ที่อยู่: {userShippingAddress.addressLine1}
                                        {userShippingAddress.addressLine2 && ` ${userShippingAddress.addressLine2}`}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {userShippingAddress.district} {userShippingAddress.province}{' '}
                                        {userShippingAddress.postalCode}
                                    </p>
                                </div>
                                <button className="text-sm text-primary dark:text-blue-400 hover:underline mt-2">
                                    แก้ไขที่อยู่ในโปรไฟล์
                                </button>
                            </div>
                        )}

                        {/* Optional Message */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ข้อความถึงแบรนด์ (ไม่บังคับ):
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="ข้อความถึงแบรนด์ (ไม่บังคับ):"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 border border-gray-200 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirmRequest}
                                className="flex-1 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                            >
                                ยืนยันการขอ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
