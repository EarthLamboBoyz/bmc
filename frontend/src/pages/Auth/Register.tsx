import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { authService } from '../../services/auth.service';
import { useFormValidation, emailValidation, passwordValidation } from '../../hooks/useFormValidation';
import { FormError, PasswordRequirements, PasswordStrength } from '../../components/FormError';
import PasswordInput from '../../components/PasswordInput';
import SEOHead from '../../components/SEOHead';
import { showError, showSuccess } from '../../utils/toast';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || null;

  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const categories = ['Beauty', 'Fashion', 'Food', 'Health', 'Lifestyle', 'Tech', 'Travel', 'Gaming'];

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      companyName: '',
      industry: '',
      tiktokHandle: '',
      instagramHandle: '',
      followers: '',
      categories: [] as string[],
    },
    {
      email: emailValidation,
      password: passwordValidation,
      // Dynamic validation based on role
      ...(role === 'brand'
        ? { companyName: { required: true } }
        : {
          name: { required: true },
          tiktokHandle: {
            required: true,
            pattern: /^@/,
            customMessage: 'TikTok Handle ต้องขึ้นต้นด้วย @'
          },
          followers: {
            required: true,
            validate: (val) => parseInt(val) >= 0 ? true : 'จำนวนผู้ติดตามต้องไม่ติดลบ'
          },
          categories: { required: true, validate: (val) => val.length > 0 ? true : 'กรุณาเลือกอย่างน้อย 1 หมวดหมู่' }
        }
      )
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    if (!role) {
      showError('กรุณาเลือกประเภทบัญชี');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        email: values.email,
        password: values.password,
        role: role.toUpperCase(),
      };

      if (role === 'brand') {
        payload.companyName = values.companyName;
        payload.industry = values.industry;
      } else {
        payload.displayName = values.name;
        payload.tiktokHandle = values.tiktokHandle;
        payload.instagramHandle = values.instagramHandle;
        payload.followersCount = values.followers;
        payload.categories = values.categories;
      }

      await authService.register(payload);
      await login(values.email, values.password, role);

      showSuccess('สมัครสมาชิกสำเร็จ!');
      navigate(role === 'brand' ? '/brand/dashboard' : '/creator/dashboard');
    } catch (error: any) {
      showError(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    const currentCats = values.categories;
    const newCats = currentCats.includes(cat)
      ? currentCats.filter(c => c !== cat)
      : [...currentCats, cat];
    handleChange('categories', newCats);
  };

  return (
    <>
      <SEOHead title="สมัครสมาชิก" description="สมัครสมาชิก BrandMeetCreator เพื่อเริ่มสร้างแคมเปญหรือรับงาน" />
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
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">สมัครสมาชิก</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">คุณคือ...</p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setRole('brand');
                      setStep(2);
                    }}
                    className="p-8 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-primary hover:bg-primary/10 transition-all text-center group"
                  >
                    <span className="text-5xl">🏢</span>
                    <p className="font-semibold mt-3 text-gray-700 dark:text-gray-200 group-hover:text-primary">แบรนด์</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">สร้างแคมเปญ</p>
                  </button>
                  <button
                    onClick={() => {
                      setRole('creator');
                      setStep(2);
                    }}
                    className="p-8 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-secondary hover:bg-secondary/10 transition-all text-center group"
                  >
                    <span className="text-5xl">👤</span>
                    <p className="font-semibold mt-3 text-gray-700 dark:text-gray-200 group-hover:text-secondary">ครีเอเตอร์</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">รับงานและสร้างรายได้</p>
                  </button>
                </div>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                  มีบัญชีอยู่แล้ว?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>กลับ</span>
                </button>

                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                  {role === 'brand' ? 'สมัครเป็นแบรนด์' : 'สมัครเป็นครีเอเตอร์'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">กรอกข้อมูลเพื่อสมัครสมาชิก</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {role === 'brand' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ชื่อบริษัท / แบรนด์ *
                        </label>
                        <input
                          type="text"
                          value={values.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          onBlur={() => handleBlur('companyName')}
                          placeholder="ชื่อแบรนด์ของคุณ"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.companyName && touched.companyName
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-slate-700 focus:border-primary'
                            }`}
                        />
                        <FormError error={errors.companyName} touched={touched.companyName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          อุตสาหกรรม
                        </label>
                        <select
                          value={values.industry}
                          onChange={(e) => handleChange('industry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">เลือกอุตสาหกรรม</option>
                          <option value="beauty">ความงาม</option>
                          <option value="fashion">แฟชั่น</option>
                          <option value="food">อาหารและเครื่องดื่ม</option>
                          <option value="health">สุขภาพ</option>
                          <option value="tech">เทคโนโลยี</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ชื่อที่แสดง *
                        </label>
                        <input
                          type="text"
                          value={values.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="ชื่อของคุณ"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.name && touched.name
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-slate-700 focus:border-primary'
                            }`}
                        />
                        <FormError error={errors.name} touched={touched.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          TikTok Handle *
                        </label>
                        <input
                          type="text"
                          value={values.tiktokHandle}
                          onChange={(e) => handleChange('tiktokHandle', e.target.value)}
                          onBlur={() => handleBlur('tiktokHandle')}
                          placeholder="@yourhandle"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.tiktokHandle && touched.tiktokHandle
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-slate-700 focus:border-primary'
                            }`}
                        />
                        <FormError error={errors.tiktokHandle} touched={touched.tiktokHandle} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          value={values.instagramHandle}
                          onChange={(e) => handleChange('instagramHandle', e.target.value)}
                          placeholder="@yourhandle"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          จำนวน Followers (TikTok) *
                        </label>
                        <input
                          type="number"
                          value={values.followers}
                          onChange={(e) => handleChange('followers', e.target.value)}
                          onBlur={() => handleBlur('followers')}
                          placeholder="10000"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.followers && touched.followers
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-slate-700 focus:border-primary'
                            }`}
                        />
                        <FormError error={errors.followers} touched={touched.followers} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          หมวดหมู่คอนเทนต์ *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${values.categories.includes(cat)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <FormError error={errors.categories} touched={true} />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      อีเมล *
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
                      รหัสผ่าน *
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
                    {values.password && (
                      <div className="mt-2">
                        <PasswordStrength password={values.password} />
                        <PasswordRequirements show={!!errors.password} />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังสมัคร...
                      </>
                    ) : (
                      'สมัครสมาชิก'
                    )}
                  </button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                  มีบัญชีอยู่แล้ว?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
