import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { showSuccess, showError } from '../utils/toast';
import PublicHeader from '../components/Layout/PublicHeader';
import Footer from '../components/Layout/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showSuccess('ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEOHead
                title="ติดต่อเรา"
                description="ติดต่อทีมงาน BrandMeetCreator สำหรับคำถาม ข้อเสนอแนะ หรือความช่วยเหลือ"
            />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
                <PublicHeader />
                <main className="flex-grow pt-24 pb-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold dark:text-white mb-4">ติดต่อเรา</h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                มีคำถามหรือข้อเสนอแนะ? เราพร้อมช่วยเหลือคุณ
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {/* Contact Info Cards */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold dark:text-white mb-2">อีเมล</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    contact@brandmeetcreator.com
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold dark:text-white mb-2">โทรศัพท์</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    02-XXX-XXXX
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold dark:text-white mb-2">ที่อยู่</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    กรุงเทพมหานคร ประเทศไทย
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold dark:text-white mb-6">ส่งข้อความถึงเรา</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ชื่อ *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="ชื่อของคุณ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            อีเมล *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        หัวข้อ *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="หัวข้อที่ต้องการติดต่อ"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ข้อความ *
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                        placeholder="รายละเอียดที่ต้องการติดต่อ..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            กำลังส่ง...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            ส่งข้อความ
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
