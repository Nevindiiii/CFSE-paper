import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { loginApi } from '@/services/authService'
import logo from '@/assets/Logogram.png'
import logoDark from '@/assets/Logogram (1).png'
import heroImg from '@/assets/Saly-10.png'

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) return setErrors(validation)
    setLoading(true)
    setApiError('')
    try {
      const { data } = await loginApi(form.email, form.password)
      login(data.token)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setApiError(msg ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {apiError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <Input
        name="email"
        type="email"
        placeholder="Email or phone number"
        value={form.email}
        onChange={handleChange}
        className={errors.email ? 'border-red-400' : ''}
        autoComplete="email"
      />
      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-400 pr-10' : 'pr-10'}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(p => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:underline text-xs">Forgot password?</a>
      </div>

      <Button type="submit" className="w-full" style={{ background: '#000842' }} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Or sign in with Google
      </button>

      <p className="text-sm text-center text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">Sign up now</Link>
      </p>
    </form>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col min-h-screen w-full bg-white px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Nice to see you again</h1>
        {formContent}
        <div className="mt-auto pt-10 flex items-center justify-center gap-2">
          <img src={logoDark} alt="logo" className="w-6 h-6" />
          <span className="font-semibold text-base">Venture</span>
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className="hidden md:flex overflow-hidden shadow-2xl"
        style={{ width: 984, minHeight: 600, borderRadius: '18.59px' }}
      >
        {/* Left blue panel */}
        <div
          className="flex flex-col justify-between p-10 text-white"
          style={{ width: '49%', background: '#000842' }}
        >
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <span className="font-semibold text-lg">Venture</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Sign in to</h2>
            <p className="text-base font-medium mb-3">Lorem Ipsum is simply</p>
            <p className="text-sm opacity-70 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>
          <div className="flex justify-center">
            <img src={heroImg} alt="hero" className="w-72 object-contain" />
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex flex-col justify-center px-14 py-12 bg-white" style={{ width: '51%' }}>
          <div className="flex items-center gap-2 mb-8">
            <img src={logoDark} alt="logo" className="w-6 h-6" />
            <span className="font-semibold text-base">Venture</span>
          </div>
          <h1 className="text-2xl font-bold mb-6">Nice to see you again</h1>
          {formContent}
        </div>
      </div>

    </div>
  )
}
