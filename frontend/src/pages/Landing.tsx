import { Link } from 'react-router-dom';
import { ArrowRight, Users, Megaphone, Wallet, Star, ChevronRight } from 'lucide-react';
import Footer from '../components/Layout/Footer';
import PublicHeader from '../components/Layout/PublicHeader';
import SEOHead from '../components/SEOHead';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <SEOHead />
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6">
            <span className="gradient-text">เชื่อมต่อแบรนด์</span>
            <br />
            <span className="text-gray-900 dark:text-white">กับครีเอเตอร์</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8">
            สร้างแคมเปญ จ่ายรางวัล ติดตามผล ทุกอย่างในที่เดียว
            <br />
            แพลตฟอร์มที่ทำให้ Influencer Marketing ง่ายขึ้น
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 gradient-primary text-white rounded-xl font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              เริ่มใช้งานฟรี
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors text-center"
            >
              ดูวิธีใช้งาน
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-10 md:mt-16">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">500+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">แคมเปญ</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">10K+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">ครีเอเตอร์</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">฿50M+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">จ่ายรางวัลแล้ว</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">ทำไมต้อง BrandMeetCreator?</h2>
            <p className="text-gray-600 dark:text-gray-400">ฟีเจอร์ครบครัน ใช้งานง่าย ผลลัพธ์ชัดเจน</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Megaphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">สร้างแคมเปญง่าย</h3>
              <p className="text-gray-600 dark:text-gray-400">
                กำหนดรางวัล ตั้งเงื่อนไข และเผยแพร่แคมเปญได้ภายในไม่กี่นาที
                ด้วยระบบที่ออกแบบมาให้ใช้งานง่าย
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">เข้าถึงครีเอเตอร์คุณภาพ</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ครีเอเตอร์มากมายพร้อมทำงานกับแบรนด์ของคุณ กรองตาม followers,
                category และอื่นๆ
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">จัดการเงินโปร่งใส</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ติดตามงบประมาณ คำนวณรางวัลอัตโนมัติ และจ่ายเงินให้ครีเอเตอร์
                ได้อย่างรวดเร็ว
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">วิธีการทำงาน</h2>
            <p className="text-gray-600 dark:text-gray-400">เริ่มต้นใช้งานได้ง่ายๆ ใน 4 ขั้นตอน</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Brand Steps */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="w-8 h-8 gradient-primary text-white rounded-full flex items-center justify-center text-sm">
                  B
                </span>
                สำหรับแบรนด์
              </h3>
              <div className="space-y-4">
                {[
                  'สร้างแคมเปญและกำหนดรางวัล',
                  'รับสมัครและอนุมัติครีเอเตอร์',
                  'ตรวจสอบผลงานที่ส่งมา',
                  'คำนวณและจ่ายรางวัล',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-700 text-primary rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">{step}</span>
                    {i < 3 && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Steps */}
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-8 rounded-2xl border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="w-8 h-8 gradient-primary text-white rounded-full flex items-center justify-center text-sm">
                  C
                </span>
                สำหรับครีเอเตอร์
              </h3>
              <div className="space-y-4">
                {[
                  'สมัครเข้าร่วมแคมเปญ',
                  'สร้างคอนเทนต์และส่งผลงาน',
                  'ติดตามสถิติและอันดับ',
                  'รับรางวัลหลังจบแคมเปญ',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-700 text-secondary rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">{step}</span>
                    {i < 3 && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">เสียงจากผู้ใช้งาน</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'คุณสมชาย',
                role: 'Brand Manager',
                company: 'Beauty Brand',
                text: 'ระบบใช้งานง่ายมาก ติดตามผลได้ real-time ทำให้จัดการแคมเปญได้อย่างมีประสิทธิภาพ',
              },
              {
                name: 'คุณสมหญิง',
                role: 'Creator',
                company: '150K followers',
                text: 'ชอบมากที่เห็นความโปร่งใสเรื่องรางวัล รู้ว่าตัวเองอยู่อันดับไหนตลอด',
              },
              {
                name: 'คุณวิทยา',
                role: 'Marketing Director',
                company: 'Health Supplement',
                text: 'AI Auto Allocation ช่วยประหยัดเวลาในการแบ่งงบประมาณมาก แนะนำเลย',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} - {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">คำถามที่พบบ่อย (FAQ)</h2>
            <p className="text-gray-600 dark:text-gray-400">ไขข้อข้องใจเกี่ยวกับการใช้งาน BrandMeetCreator</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Q: แบรนด์ต้องเสียค่าใช้จ่ายเริ่มต้นหรือไม่?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: ไม่เสียค่าใช้จ่าย! การสมัครสมาชิกและการสร้างแคมเปญทำได้ฟรี ระบบจะเก็บค่าธรรมเนียม 10% จากยอดเงินรางวัลที่จ่ายจริงเท่านั้น
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Q: ครีเอเตอร์จะได้รับเงินเมื่อไหร่?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: หลังจากแคมเปญจบและมีการประกาศผลรางวัล ครีเอเตอร์จะได้รับเงินโอนเข้าบัญชี (พร้อมเพย์/ธนาคาร) ภายใน 7 วันทำการ
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Q: มีครีเอเตอร์กี่คนในระบบ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: ปัจจุบันเรามีครีเอเตอร์คุณภาพมากกว่า 10,000+ คน ครอบคลุมทุกหมวดหมู่สินค้า พร้อมช่วยโปรโมทแบรนด์ของคุณ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">พร้อมเริ่มต้นหรือยัง?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            สมัครฟรีวันนี้ และเริ่มสร้างแคมเปญแรกของคุณ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register?role=brand"
              className="w-full sm:w-auto px-8 py-4 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-center"
            >
              สมัครเป็นแบรนด์
            </Link>
            <Link
              to="/register?role=creator"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-center"
            >
              สมัครเป็นครีเอเตอร์
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
