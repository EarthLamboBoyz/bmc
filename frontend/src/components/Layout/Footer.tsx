import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white py-12 border-t border-gray-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="font-bold text-xl">BrandMeetCreator</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                            แพลตฟอร์มที่เชื่อมต่อแบรนด์กับครีเอเตอร์ TikTok และ Instagram เพื่อสร้างแคมเปญการตลาดที่มีประสิทธิภาพ
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">เกี่ยวกับเรา</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li><Link to="/about" className="hover:text-primary dark:hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                            <li><Link to="/contact" className="hover:text-primary dark:hover:text-white transition-colors">ติดต่อเรา</Link></li>
                            <li><Link to="/#how-it-works" className="hover:text-primary dark:hover:text-white transition-colors">การทำงาน</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">กฎหมาย</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li><Link to="/terms" className="hover:text-primary dark:hover:text-white transition-colors">ข้อกำหนดการใช้งาน</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary dark:hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} BrandMeetCreator. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Social Links could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
