"use client"

interface LogoProps {
  className?: string
  onClick?: () => void
}

export default function Logo({ className = "", onClick }: LogoProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 group ${className}`}
    >
      <span className="text-white font-bold text-lg tracking-tight group-hover:scale-110 transition-transform">
        SA
      </span>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </button>
  )
}
