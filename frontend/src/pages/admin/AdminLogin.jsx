import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../lib/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Shield, Zap, BarChart3, ChevronLeft, CheckCircle } from 'lucide-react'


export default function Adminentry_255081() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  async function handleCredentialsSubmit(e) {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    toast.loading('Verifying credentials...')
    
    try {
      const res = await api.adminentry_255081(email, password)
      
      if (res?.status === 'otp_required') {
        toast.success('OTP sent to your email!')
        setStep(2)
        setOtpSent(true)
      } else if (res?.user) {
        setUser(res.user)
        toast.success('entry_255081 successful!')
        navigate('/admin')
      }
    } catch (e) {
      toast.dismiss()
      toast.error(e.message || 'Login failed')
      console.error('Login error:', e) // Debug log
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    
    if (!otp || otp.length !== 8) {
      toast.error('Please enter the 8-digit OTP')
      return
    }

    setLoading(true)
    toast.loading('Verifying OTP...')
    
    try {
      const res = await api.adminentry_255081(email, password, otp)
      if (res?.user) setUser(res.user)
      toast.dismiss()
      toast.success('entry_255081 successful!')
      navigate('/admin')
    } catch (e) {
      toast.dismiss()
      toast.error(e.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  function handleBackToCredentials() {
    setStep(1)
    setOtp('')
    setOtpSent(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo & Title */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="ml-3 sm:ml-4">
                <span className="text-lg sm:text-xl font-extrabold tracking-wide uppercase bg-gradient-to-re text-white bg-clip-text">
                  ST. GREGORY THE GREAT
                </span>
                <div className="text-xs lg:text-sm text-white font-semibold tracking-wide uppercase">CATHOLIC CHAPLAINCY - UPSA</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Welcome to Admin Portal
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-3xl-semibold text-white">Secure Access</div>
                  <span className="text-sm text-white">Protected with robost security</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-3xl-semibold text-white">Real-time Updates</div>
                  <span className="text-sm text-white-200">Monitor voting activity as it happens</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-3xl-semibold text-white">Comprehensive Analytics</div>
                  <span className="text-sm text-white">Detailed reports and insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600 mt-1">St. Gregory Voting System</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {step === 1 ? 'Welcome back' : 'Verify Your Identity'}
              </h2>
              <p className="text-gray-600">
                {step === 1 ? 'Please enter your credentials to continue' : 'Enter the code sent to your email'}
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {step === 1 ? (
                <>
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@stgregory.edu"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-400 bg-white/50"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-400 bg-white/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                    </label>
                    <a href="/admin/fg-pw_255081" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Step */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
                    <p className="text-gray-600 text-sm">
                      We've sent an 8-digit verification code to<br />
                      <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <div className="mt-3 inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-amber-800 font-medium">Expires in 5 minutes</span>
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                        setOtp(value)
                      }}
                      placeholder="00000000"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-300 text-center text-2xl font-mono tracking-widest bg-white/50"
                      maxLength={8}
                    />
                    <p className="mt-3 text-sm text-gray-600 text-center">
                      Didn't receive it? 
                      <button 
                        type="button" 
                        onClick={handleCredentialsSubmit}
                        className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors"
                        disabled={loading}
                      >
                        Resend code
                      </button>
                    </p>
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={handleBackToCredentials}
                    className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors py-2 group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Login</span>
                  </button>
                </>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={step === 1 ? handleCredentialsSubmit : handleOtpSubmit}
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none active:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{step === 1 ? 'Verifying...' : 'Signing in...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>{step === 1 ? 'Continue' : 'Sign in'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}