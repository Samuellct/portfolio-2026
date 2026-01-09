export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin" />
        <span className="text-sm text-white/40 tracking-widest uppercase">Loading</span>
      </div>
    </div>
  )
}
