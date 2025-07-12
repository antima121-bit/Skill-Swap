export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg ${className}`}
    >
      <div className="relative">
        <div className="w-4 h-4 bg-white rounded-sm transform rotate-12"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-black/20 rounded-sm transform -rotate-12"></div>
      </div>
    </div>
  )
}
