export default function FormField({ label, error, type = 'text', register, name, ...rest }) {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`w-full rounded-md border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-amber ${
          error ? 'border-danger' : 'border-line'
        }`}
        {...register(name)}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error.message}</p>}
    </div>
  )
}
