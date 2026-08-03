import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Moon } from 'lucide-react'

// OpenWeather's icon codes end in "d" (day) or "n" (night); the leading
// two digits identify the condition family.
const FAMILY_MAP = {
  '01d': Sun,
  '01n': Moon,
  '02': Cloud,
  '03': Cloud,
  '04': Cloud,
  '09': CloudDrizzle,
  '10': CloudRain,
  '11': CloudLightning,
  '13': CloudSnow,
  '50': CloudFog,
}

export default function WeatherIcon({ icon, size = 64, className = '' }) {
  const Icon = FAMILY_MAP[icon] || FAMILY_MAP[icon?.slice(0, 2)] || Cloud
  return <Icon size={size} className={className} strokeWidth={1.5} />
}
