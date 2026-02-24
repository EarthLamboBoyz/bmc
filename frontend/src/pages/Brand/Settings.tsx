import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { Building2, Lock, Bell, Mail, Phone, Globe, RotateCcw, AlertTriangle, Database } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export default function BrandSettings() {
    const { resetData } = useData();
    const { user, updateUser } = useAuth();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetData = () => {
        resetData();
        setShowResetConfirm(false);
        toast.success('รีเซ็ตข้อมูลเรียบร้อยแล้ว! หน้าจะ refresh อัตโนมัติ');
        setTimeout(() => window.location.reload(), 1500);
    };

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        description: '',
        logo: ''
    });

    // Load initial data
    useEffect(() => {
        if (user) {
            const currentUser = user as any;
            const profile = currentUser.brandProfile || {};

            setFormData({
                companyName: profile.companyName || currentUser.name || '',
                industry: profile.industry || '',
                email: currentUser.email || '',
                phone: profile.phone || '',
                website: profile.website || '',
                address: profile.address || '',
                description: profile.description || '',
                logo: profile.logo || currentUser.avatar || ''
            });
        }
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [notifications, setNotifications] = useState({
        emailNewApplications: true,
        emailNewSubmissions: true,
        emailCampaignUpdates: true,
        emailPayments: false,
    });

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('กรุณาเข้าสู่ระบบใหม่');
                return;
            }

            const updateData = {
                companyName: formData.companyName,
                industry: formData.industry,
                phone: formData.phone,
                website: formData.website,
                address: formData.address,
                description: formData.description,
                email: formData.email,
                logo: formData.logo
            };

            await authService.updateProfile(updateData, token);

            // Update user context immediately
            updateUser({
                name: formData.companyName,
                avatar: formData.logo,
                // We might need to handle updating the nested brandProfile if needed,
                // but for header display, name and avatar are usually top-level in User type
            });

            toast.success('บันทึกข้อมูลเรียบร้อย');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('รหัสผ่านไม่ตรงกัน');
            return;
        }
        console.log('Changing password');
        toast.success('เปลี่ยนรหัสผ่านเรียบร้อย');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSaveNotifications = () => {
        console.log('Saving notifications:', notifications);
        toast.success('บันทึกการตั้งค่าเรียบร้อย');
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">ตั้งค่า</h1>

                <div className="space-y-6">
                    {/* Company Profile */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold dark:text-white">ข้อมูลบริษัท</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                        โลโก้บริษัท
                                    </label>
                                    <ImageUpload
                                        value={formData.logo}
                                        onChange={(url) => setFormData({ ...formData, logo: url })}
                                        aspectRatio="square"
                                    />
                                </div>
                                <div className="w-full md:w-2/3 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                ชื่อบริษัท
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                อุตสาหกรรม
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.industry}
                                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            <Mail className="w-4 h-4 inline mr-1" />
                                            อีเมล
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                <Phone className="w-4 h-4 inline mr-1" />
                                                เบอร์โทรศัพท์
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                                <Globe className="w-4 h-4 inline mr-1" />
                                                เว็บไซต์
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                            ที่อยู่
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-white dark:bg-slate-900 dark:text-white"
                                        />
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
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold dark:text-white">เปลี่ยนรหัสผ่าน</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    รหัสผ่านปัจจุบัน
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    รหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleChangePassword}
                                    className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    เปลี่ยนรหัสผ่าน
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold dark:text-white">การแจ้งเตือน</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium dark:text-white">มีผู้สมัครใหม่</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">แจ้งเตือนเมื่อมี Creator สมัครเข้าแคมเปญ</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNewApplications}
                                        onChange={(e) => setNotifications({ ...notifications, emailNewApplications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium dark:text-white">งานส่งใหม่</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">แจ้งเตือนเมื่อมีงานส่งเข้ามารอตรวจสอบ</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNewSubmissions}
                                        onChange={(e) => setNotifications({ ...notifications, emailNewSubmissions: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium dark:text-white">อัพเดทแคมเปญ</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">แจ้งเตือนเมื่อมีการเปลี่ยนแปลงในแคมเปญ</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailCampaignUpdates}
                                        onChange={(e) => setNotifications({ ...notifications, emailCampaignUpdates: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium dark:text-white">การชำระเงิน</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">แจ้งเตือนเมื่อมีการจ่ายรางวัล</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailPayments}
                                        onChange={(e) => setNotifications({ ...notifications, emailPayments: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveNotifications}
                                    className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    บันทึกการตั้งค่า
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Developer Tools / Data Management */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Database className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold dark:text-white">จัดการข้อมูล</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-300">สำหรับทดสอบและพัฒนา</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-orange-800">รีเซ็ตข้อมูลทั้งหมด</p>
                                        <p className="text-sm text-orange-700 mt-1">
                                            ล้างข้อมูลทั้งหมดใน localStorage และโหลด mock data ใหม่
                                            ใช้สำหรับทดสอบหรือเมื่อต้องการเริ่มต้นใหม่
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!showResetConfirm ? (
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-3 border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50 transition-colors font-medium"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    รีเซ็ตข้อมูลทั้งหมด
                                </button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-700 font-medium flex-1">ยืนยันการรีเซ็ตข้อมูล?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleResetData}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            ยืนยัน รีเซ็ตเลย
                                        </button>
                                        <button
                                            onClick={() => setShowResetConfirm(false)}
                                            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
