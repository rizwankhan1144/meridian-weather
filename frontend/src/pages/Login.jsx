import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext.jsx'
import { loginSchema } from '@/lib/schemas.js'
import AuthLayout from '@/components/AuthLayout.jsx'
import FormField from '@/components/FormField.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      await login(values)
      toast.success('Welcome back')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || 'Could not sign in. Check your credentials.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Check today's forecast"
      subtitle="Enter your credentials to open your dashboard."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          register={register}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          register={register}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-deep transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-medium text-cyan hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
