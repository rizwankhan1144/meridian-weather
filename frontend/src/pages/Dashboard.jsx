import { useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, CloudOff } from 'lucide-react'
import api from '@/lib/api.js'
import Navbar from '@/components/Navbar.jsx'
import CitySearch from '@/components/CitySearch.jsx'
import WeatherCard from '@/components/WeatherCard.jsx'

export default function Dashboard() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(city) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/weather', { params: { city } })
      setWeather(data.data ?? data)
    } catch (err) {
      const status = err.response?.status
      const message =
        status === 404
          ? `We couldn't find "${city}". Check the spelling and try again.`
          : err.response?.data?.message || 'Something went wrong fetching the forecast.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-deep">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">Dashboard</p>
        <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-ink">
          Pull a live reading
        </h1>
        <p className="mt-1 text-sm text-muted">
          Search any city to see its current conditions.
        </p>

        <div className="mt-6 max-w-xl">
          <CitySearch onSearch={handleSearch} loading={loading} />
        </div>

        <div className="mt-8">
          {loading && <SkeletonCard />}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-panel/60 px-6 py-14 text-center">
              <AlertTriangle size={28} className="text-danger" />
              <p className="text-sm text-muted">{error}</p>
            </div>
          )}

          {!loading && !error && weather && <WeatherCard data={weather} />}

          {!loading && !error && !weather && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-16 text-center">
              <CloudOff size={28} className="text-muted" />
              <p className="text-sm text-muted">
                No reading yet — search a city above to see its forecast.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-line bg-panel/60 p-8">
      <div className="h-3 w-24 rounded bg-line" />
      <div className="mt-3 h-7 w-40 rounded bg-line" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-line/60" />
        ))}
      </div>
    </div>
  )
}
