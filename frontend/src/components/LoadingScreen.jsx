export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep">
      <div className="flex items-center gap-3 font-mono text-sm text-muted">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
        Calibrating instruments…
      </div>
    </div>
  )
}
