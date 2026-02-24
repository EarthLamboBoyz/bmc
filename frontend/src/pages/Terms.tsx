import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/Layout/PublicHeader';
import Footer from '../components/Layout/Footer';

export default function Terms() {
    return (
        <>
            <SEOHead
                title="ข้อกำหนดการใช้งาน"
                description="ข้อกำหนดและเงื่อนไขการใช้งานแพลตฟอร์ม BrandMeetCreator"
            />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
                <PublicHeader />
                <main className="flex-grow pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                            <h1 className="text-3xl font-bold dark:text-white mb-6">ข้อกำหนดการใช้งาน</h1>

                            <div className="prose dark:prose-invert max-w-none space-y-6">
                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">1. การยอมรับข้อกำหนด</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        การใช้งานแพลตฟอร์ม BrandMeetCreator ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ในเอกสารนี้
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">2. การใช้งานบริการ</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        ผู้ใช้งานต้องปฏิบัติตามกฎระเบียบดังต่อไปนี้:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                        <li>ให้ข้อมูลที่ถูกต้องและเป็นจริง</li>
                                        <li>ไม่ใช้บริการเพื่อการผิดกฎหมาย</li>
                                        <li>เคารพสิทธิ์ของผู้ใช้งานอื่น</li>
                                        <li>ไม่เผยแพร่เนื้อหาที่ไม่เหมาะสม</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">3. ความรับผิดชอบ</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        BrandMeetCreator ไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานแพลตฟอร์ม
                                        ผู้ใช้งานต้องรับผิดชอบต่อการกระทำของตนเอง
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">4. การชำระเงิน</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        การชำระเงินทั้งหมดจะต้องผ่านระบบของแพลตฟอร์มเท่านั้น
                                        เราไม่รับผิดชอบต่อการชำระเงินนอกระบบ
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">5. การเปลี่ยนแปลงข้อกำหนด</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
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
