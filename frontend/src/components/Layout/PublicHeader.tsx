import { Link } from 'react-router-dom';
import DarkModeToggle from '../DarkModeToggle';

export default function PublicHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="font-bold text-xl gradient-text">BrandMeetCreator</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <DarkModeToggle />
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                        >
                            เข้าสู่ระบบ
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                            เริ่มใช้งานฟรี
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
