// The signature element: a horizon strip whose gradient and floating
// "readings" evoke a barometer chart. It's decorative but grounded in the
// subject — real-looking pressure/temperature ticks drifting past.
const READINGS = [
  { label: 'TEMP', value: '24°C' },
  { label: 'HUM', value: '58%' },
  { label: 'WIND', value: '12 km/h' },
  { label: 'PRESS', value: '1013 hPa' },
  { label: 'UV', value: '4.2' },
  { label: 'VIS', value: '10 km' },
]

export default function SkyStrip() {
  const loop = [...READINGS, ...READINGS]

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#152034] via-[#0f1728] to-[#0b1220]">
      {/* horizon glow */}
      <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
      <div className="absolute left-1/2 top-[28%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/20 blur-3xl" />
      <div className="absolute left-1/3 top-[55%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between p-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">Station 04 · Live</p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold leading-tight text-ink">
            Meridian
            <br />
            Weather
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            One reading, precisely instrumented — temperature, wind, and pressure for any city
            you're tracking.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-line/60 bg-deep/40 backdrop-blur-sm">
          <div className="flex w-max animate-drift gap-8 px-6 py-4">
            {loop.map((r, i) => (
              <div key={i} className="flex shrink-0 items-baseline gap-2 font-mono text-xs">
                <span className="text-muted">{r.label}</span>
                <span className="text-ink">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
