export default function MetricTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-4 transition hover:bg-panel-hover">
      <div className="flex items-center gap-2 text-muted">
        <Icon size={15} strokeWidth={1.75} />
        <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-2.5 font-mono text-2xl text-ink">{value}</p>
    </div>
  )
}
