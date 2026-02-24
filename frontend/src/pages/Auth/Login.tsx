import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useFormValidation, emailValidation } from '../../hooks/useFormValidation';
import { FormError } from '../../components/FormError';
import PasswordInput from '../../components/PasswordInput';
import { showError, showSuccess } from '../../utils/toast';

export default function Login() {
  const [role, setRole] = useState<UserRole>('brand');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useFormValidation(
    { email: '', password: '' },
    {
      email: emailValidation,
      password: { required: true, minLength: 6 },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    setLoading(true);

    try {
      const user = await login(values.email, values.password);
      showSuccess('เข้าสู่ระบบสำเร็จ');
      navigate(user.role === 'brand' ? '/brand/dashboard' : '/creator/dashboard');
    } catch {
      showError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="font-bold text-2xl gradient-text">BrandMeetCreator</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-8 border border-gray-200 dark:border-slate-800 transition-colors">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบ
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('brand')}
              className={`p-4 rounded-xl border-2 transition-all ${role === 'brand'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
            >
              <span className="text-2xl">🏢</span>
              <p className={`font-medium mt-1 ${role === 'brand' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                แบรนด์
              </p>
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`p-4 rounded-xl border-2 transition-all ${role === 'creator'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
            >
              <span className="text-2xl">👤</span>
              <p className={`font-medium mt-1 ${role === 'creator' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                ครีเอเตอร์
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.email && touched.email
                  ? 'border-red-500'
                  : 'border-gray-200 dark:border-slate-700 focus:border-primary'
                  }`}
              />
              <FormError error={errors.email} touched={touched.email} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                รหัสผ่าน
              </label>
              <PasswordInput
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                error={errors.password}
                touched={touched.password}
              />
              <FormError error={errors.password} touched={touched.password} />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                <span className="text-sm text-gray-600 dark:text-gray-400">จดจำฉัน</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">เข้าสู่ระบบแบบรวดเร็ว (Demo):</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setRole('brand');
                setValues({ email: 'demo-brand@bmc.com', password: '123456' });
              }}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/50 rounded-lg text-sm text-amber-700 dark:text-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
            >
              🏢 Brand Demo
            </button>
            <button
              onClick={() => {
                setRole('creator');
                setValues({ email: 'demo-creator@bmc.com', password: '123456' });
              }}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/50 rounded-lg text-sm text-amber-700 dark:text-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
            >
              👤 Creator Demo
            </button>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 text-center">
            รหัสผ่าน: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
