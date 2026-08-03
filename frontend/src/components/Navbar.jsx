import { LogOut, CloudSun } from 'lucide-react'
import { useAuth } from '@/context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
      toast.success('Signed out')
    } catch {
      toast.error('Could not sign out cleanly, but your session was cleared locally.')
    }
  }

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <CloudSun size={20} className="text-amber" />
          <span className="font-[var(--font-display)] text-lg font-semibold text-ink">
            Meridian
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">
            {user?.name ? `Signed in as ${user.name}` : ''}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm text-muted transition hover:border-danger hover:text-danger"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
