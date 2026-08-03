import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle, RefreshCcw, Loader2 } from 'lucide-react'
import api from '@/lib/api.js'
import AuthLayout from '@/components/AuthLayout.jsx'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(0)
  
  const timerRef = useRef(null)

  useEffect(() => {
    const locEmail = location.state?.email || localStorage.getItem('verify_email')
    if (locEmail) {
      setEmail(locEmail)
      localStorage.setItem('verify_email', locEmail)
    } else {
      toast.error('No email found. Please register or log in.')
      navigate('/login')
    }
  }, [location, navigate])

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000)
    }
    return () => clearTimeout(timerRef.current)
  }, [timer])

  async function handleVerify(e) {
    e.preventDefault()
    if (!code || code.length !== 6) {
      return toast.error('Please enter a valid 6-digit code.')
    }

    setSubmitting(true)
    try {
      await api.post('/verify-email', { email, verification_code: code })
      toast.success('Email verified successfully! You can now log in.')
      localStorage.removeItem('verify_email')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (timer > 0) return

    setResending(true)
    try {
      await api.post('/resend-verification-code', { email })
      toast.success('A new verification code has been sent.')
      setTimer(60)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Verification"
      title="Verify your email"
      subtitle="We sent a 6-digit code to your email. It expires in 10 minutes."
    >
      <form onSubmit={handleVerify} noValidate>
        <div className="mb-4">
          <label className="block text-sm font-medium text-cyan mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-cyan mb-1">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-full rounded-md border border-slate-700 bg-deep px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan text-center text-2xl tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-deep transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          {submitting ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || timer > 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition hover:text-cyan/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCcw size={14} />
          )}
          {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
        </button>
      </div>
    </AuthLayout>
  )
}
