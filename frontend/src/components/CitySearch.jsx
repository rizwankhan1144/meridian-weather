import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

const SUGGESTED = ['London', 'New York', 'Karachi', 'Tokyo', 'Dubai', 'Berlin']

export default function CitySearch({ onSearch, loading }) {
  const [city, setCity] = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = city.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search a city — e.g. Karachi"
            className="w-full rounded-md border border-line bg-panel py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-amber"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="flex items-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-deep transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          <span className="hidden sm:inline">{loading ? 'Fetching…' : 'Get weather'}</span>
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setCity(s)
              onSearch(s)
            }}
            className="rounded-full border border-line px-3 py-1 text-xs text-muted transition hover:border-cyan hover:text-cyan"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
