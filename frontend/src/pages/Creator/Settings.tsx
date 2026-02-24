import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { User, Mail, Phone, MapPin, CreditCard, Bell, Instagram, Youtube, Music } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export default function CreatorSettings() {
    const { resetData } = useData();
    const { user, updateUser } = useAuth();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('profile'); // profile, payment, notification

    // Profile Form State
    const [profileData, setProfileData] = useState({
        displayName: '',
        avatar: '',
        email: '',
        phone: '',
        bio: '',
        tiktokHandle: '',
        instagramHandle: '',
        youtubeHandle: '',
        followersCount: 0,
        address: {
            line1: '',
            line2: '',
            district: '',
            province: '',
            postalCode: ''
        }
    });

    // Payment Form State
    const [paymentData, setPaymentData] = useState({
        paymentMethod: 'PROMPTPAY', // PROMPTPAY, BANK_TRANSFER
        promptpayId: '',
        bankName: '',
        bankAccountNo: '',
        bankAccountName: ''
    });

    // Load initial data
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                try {
                    // Assume user object in context has profile data or is reasonably up to date for basic fields
                    const currentUser = user as any;
                    const profile = currentUser.creatorProfile || {};

                    // Parse address if it's a string
                    let addressObj = { line1: '', line2: '', district: '', province: '', postalCode: '' };
                    if (profile.address) {
                        try {
                            addressObj = JSON.parse(profile.address);
                        } catch (e) {
                            // usage of simple string address?
                            addressObj = { ...addressObj, line1: profile.address };
                        }
                    }

                    setProfileData({
                        displayName: profile.displayName || currentUser.name || '',
                        avatar: profile.avatar || currentUser.avatar || '',
                        email: currentUser.email || '',
                        phone: profile.phone || '',
                        bio: profile.bio || '',
                        tiktokHandle: profile.tiktokHandle || '',
                        instagramHandle: profile.instagramHandle || '',
                        youtubeHandle: profile.youtubeHandle || '',
                        followersCount: profile.followersCount || 0,
                        address: addressObj
                    });

                    setPaymentData({
                        paymentMethod: profile.paymentMethod || 'PROMPTPAY',
                        promptpayId: profile.promptpayId || '',
                        bankName: profile.bankName || '',
                        bankAccountNo: profile.bankAccountNo || '',
                        bankAccountName: profile.bankAccountName || ''
                    });

                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('กรุณาเข้าสู่ระบบใหม่');
                return;
            }

            const updatePayload = {
                ...profileData,
                // Combine address back to simple structure if backend expects string or handle as object
                // Backend updateMe handles objects for address if we implemented it that way,
                // or we stringify it here.
                // Let's stringify it just in case backend expects string for JSON field
                address: profileData.address,
                avatar: profileData.avatar
            };

            await authService.updateProfile(updatePayload, token);

            // Update user context immediately
            updateUser({
                name: profileData.displayName,
                avatar: profileData.avatar
            });

            toast.success('บันทึกข้อมูลส่วนตัวเรียบร้อย');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePayment = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await authService.updateProfile(paymentData, token);
            toast.success('บันทึกข้อมูลการเงินเรียบร้อย');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetData = () => {
        resetData();
        setShowResetConfirm(false);
        toast.success('รีเซ็ตข้อมูลเรียบร้อยแล้ว! หน้าจะ refresh อัตโนมัติ');
        setTimeout(() => window.location.reload(), 1500);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">ตั้งค่า</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'profile'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ข้อมูลส่วนตัว
                    </button>
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'payment'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ข้อมูลการชำระเงิน
                    </button>
                    <button
                        onClick={() => setActiveTab('notification')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'notification'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        การแจ้งเตือน
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold dark:text-white">ข้อมูลพื้นฐาน</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3 flex flex-col items-center">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 self-start w-full">
                                        รูปโปรไฟล์
                                    </label>
                                    <div className="w-48 h-48 mx-auto">
                                        <ImageUpload
                                            value={profileData.avatar}
                                            onChange={(url) => setProfileData({ ...profileData, avatar: url })}
                                            aspectRatio="square"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                        แนะนำขนาด 500x500px
                                    </p>
                                </div>
                                <div className="w-full md:w-2/3 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                ชื่อที่ใช้แสดง (Display Name)
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.displayName}
                                                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                <Mail className="w-4 h-4 inline mr-1" />
                                                อีเมล
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            เบอร์โทรศัพท์
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            placeholder="08x-xxx-xxxx"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            เกี่ยวกับฉัน (Bio)
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold dark:text-white">ที่อยู่จัดส่งสินค้า</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            ที่อยู่ (บ้านเลขที่, ซอย, ถนน)
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address.line1}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, line1: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            แขวง / ตำบล
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address.line2}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, line2: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            เขต / อำเภอ
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address.district}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, district: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            จังหวัด
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address.province}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, province: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            รหัสไปรษณีย์
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address.postalCode}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, postalCode: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                disabled={isLoading}
                                className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold dark:text-white">ช่องทางการรับเงิน</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Payment Method Selection */}
                            <div className="flex gap-4 mb-4">
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${paymentData.paymentMethod === 'PROMPTPAY'
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-gray-200 dark:border-slate-600'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="PROMPTPAY"
                                            checked={paymentData.paymentMethod === 'PROMPTPAY'}
                                            onChange={() => setPaymentData({ ...paymentData, paymentMethod: 'PROMPTPAY' })}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="font-medium dark:text-white">PromptPay</span>
                                    </div>
                                </label>
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${paymentData.paymentMethod === 'BANK_TRANSFER'
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-gray-200 dark:border-slate-600'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="BANK_TRANSFER"
                                            checked={paymentData.paymentMethod === 'BANK_TRANSFER'}
                                            onChange={() => setPaymentData({ ...paymentData, paymentMethod: 'BANK_TRANSFER' })}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="font-medium dark:text-white">โอนผ่านบัญชีธนาคาร</span>
                                    </div>
                                </label>
                            </div>

                            {paymentData.paymentMethod === 'PROMPTPAY' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                        เบอร์โทรศัพท์ / เลขบัตรประชาชน (PromptPay ID)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.promptpayId}
                                        onChange={(e) => setPaymentData({ ...paymentData, promptpayId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        placeholder="08x-xxx-xxxx"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            ธนาคาร
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.bankName}
                                            onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            placeholder="กสิกรไทย, ไทยพาณิชย์..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            เลขบัญชี
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.bankAccountNo}
                                            onChange={(e) => setPaymentData({ ...paymentData, bankAccountNo: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            ชื่อบัญชี
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.bankAccountName}
                                            onChange={(e) => setPaymentData({ ...paymentData, bankAccountName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSavePayment}
                                disabled={isLoading}
                                className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลการเงิน'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Notifications Tab Placeholder or Actual Implementation */}
                {activeTab === 'notification' && (
                    <div className="text-center py-10 text-gray-500">
                        ยังไม่ได้เชื่อมต่อส่วนนี้
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
