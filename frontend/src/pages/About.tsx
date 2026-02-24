import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/Layout/PublicHeader';
import Footer from '../components/Layout/Footer';

export default function About() {
    return (
        <>
            <SEOHead
                title="เกี่ยวกับเรา"
                description="BrandMeetCreator คือแพลตฟอร์มที่เชื่อมต่อแบรนด์กับครีเอเตอร์ เพื่อสร้างแคมเปญการตลาดที่มีประสิทธิภาพ"
            />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
                <PublicHeader />
                <main className="flex-grow pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                            <h1 className="text-3xl font-bold dark:text-white mb-6">เกี่ยวกับ BrandMeetCreator</h1>

                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    BrandMeetCreator เป็นแพลตฟอร์มที่เชื่อมต่อแบรนด์กับครีเอเตอร์ TikTok และ Instagram
                                    เพื่อสร้างแคมเปญการตลาดที่มีประสิทธิภาพและโปร่งใส
                                </p>

                                <h2 className="text-2xl font-bold dark:text-white mt-8 mb-4">วิสัยทัศน์</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    เราเชื่อว่าการทำงานร่วมกันระหว่างแบรนด์และครีเอเตอร์ควรจะง่าย โปร่งใส และมีประสิทธิภาพ
                                    เราจึงสร้างแพลตฟอร์มที่ช่วยให้ทั้งสองฝ่ายสามารถทำงานร่วมกันได้อย่างราบรื่น
                                </p>

                                <h2 className="text-2xl font-bold dark:text-white mt-8 mb-4">ทีมงาน</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    ทีมงานของเราประกอบด้วยผู้เชี่ยวชาญด้านการตลาดดิจิทัล เทคโนโลยี และ Influencer Marketing
                                    ที่มีประสบการณ์มากกว่า 10 ปี
                                </p>

                                <h2 className="text-2xl font-bold dark:text-white mt-8 mb-4">ติดต่อเรา</h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Email: contact@brandmeetcreator.com<br />
                                    Tel: 02-XXX-XXXX<br />
                                    Line: @brandmeetcreator
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
