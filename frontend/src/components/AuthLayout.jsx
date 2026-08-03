import SkyStrip from '@/components/SkyStrip.jsx'

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <SkyStrip />
      </div>

      <div className="panel-texture flex items-center justify-center bg-deep px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">{eyebrow}</p>
          <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-ink">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
