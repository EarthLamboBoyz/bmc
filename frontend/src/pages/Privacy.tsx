import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/Layout/PublicHeader';
import Footer from '../components/Layout/Footer';

export default function Privacy() {
    return (
        <>
            <SEOHead
                title="นโยบายความเป็นส่วนตัว"
                description="นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของ BrandMeetCreator"
            />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
                <PublicHeader />
                <main className="flex-grow pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                            <h1 className="text-3xl font-bold dark:text-white mb-6">นโยบายความเป็นส่วนตัว</h1>

                            <div className="prose dark:prose-invert max-w-none space-y-6">
                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        เราเก็บรวบรวมข้อมูลดังต่อไปนี้:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                        <li>ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทรศัพท์)</li>
                                        <li>ข้อมูลโซเชียลมีเดีย (TikTok, Instagram handles)</li>
                                        <li>ข้อมูลการใช้งานแพลตฟอร์ม</li>
                                        <li>ข้อมูลการชำระเงิน</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">2. การใช้ข้อมูล</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        เราใช้ข้อมูลของคุณเพื่อ:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                        <li>ให้บริการแพลตฟอร์ม</li>
                                        <li>ปรับปรุงประสบการณ์การใช้งาน</li>
                                        <li>ติดต่อสื่อสารเกี่ยวกับบริการ</li>
                                        <li>วิเคราะห์และพัฒนาบริการ</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">3. การแบ่งปันข้อมูล</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        เราจะไม่แบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม
                                        ยกเว้นในกรณีที่จำเป็นตามกฎหมายหรือได้รับความยินยอมจากคุณ
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">4. ความปลอดภัยของข้อมูล</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ
                                        รวมถึงการเข้ารหัสและการควบคุมการเข้าถึง
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">5. สิทธิ์ของคุณ</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        คุณมีสิทธิ์:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                        <li>เข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
                                        <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
                                        <li>ลบข้อมูลของคุณ</li>
                                        <li>คัดค้านการประมวลผลข้อมูล</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">6. Cookies</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        เราใช้ cookies เพื่อปรับปรุงประสบการณ์การใช้งานและวิเคราะห์การใช้งานแพลตฟอร์ม
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">7. ติดต่อเรา</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:<br />
                                        Email: privacy@brandmeetcreator.com
                                    </p>
                                </section>

                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-8">
                                    อัพเดทล่าสุด: 9 กุมภาพันธ์ 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
