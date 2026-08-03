import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext.jsx'
import { registerSchema } from '@/lib/schemas.js'
import AuthLayout from '@/components/AuthLayout.jsx'
import FormField from '@/components/FormField.jsx'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      await registerUser(values)
      toast.success('Account created successfully. Please verify your email.')
      navigate('/verify-email', { state: { email: values.email } })
    } catch (err) {
      const message =
        err.response?.data?.message || 'Could not create your account. Try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Set up your station"
      subtitle="A minute to register, then straight to your dashboard."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Name"
          name="name"
          autoComplete="name"
          register={register}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="Min 8 chars, 1 uppercase, 1 symbol"
          register={register}
          error={errors.password}
        />
        <FormField
          label="Confirm password"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          register={register}
          error={errors.password_confirmation}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-deep transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
