import { motion } from 'framer-motion'
import { Droplets, Wind, Thermometer, Gauge } from 'lucide-react'
import WeatherIcon from '@/components/WeatherIcon.jsx'
import MetricTile from '@/components/MetricTile.jsx'

export default function WeatherCard({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="panel-texture rounded-xl border border-line bg-panel/60 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Current conditions
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-ink">
            {data.city}
            {data.country ? <span className="text-muted">, {data.country}</span> : null}
          </h2>
          <p className="mt-1 text-sm capitalize text-muted">{data.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <WeatherIcon icon={data.icon} size={56} className="text-amber" />
          <div className="text-right">
            <p className="font-mono text-5xl leading-none text-ink">
              {Math.round(data.temperature)}°
            </p>
            <p className="mt-1 text-xs text-muted">feels like {Math.round(data.feels_like)}°</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile icon={Thermometer} label="Feels like" value={`${Math.round(data.feels_like)}°`} />
        <MetricTile icon={Droplets} label="Humidity" value={`${data.humidity}%`} />
        <MetricTile icon={Wind} label="Wind" value={`${data.wind_speed} m/s`} />
        <MetricTile icon={Gauge} label="Condition" value={data.condition} />
      </div>
    </motion.div>
  )
}
