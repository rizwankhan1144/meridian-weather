import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-deep px-6 text-center">
      <CompassIcon size={32} className="text-muted" />
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink">
        Off the map
      </h1>
      <p className="text-sm text-muted">This page doesn't exist.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-cyan hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}
