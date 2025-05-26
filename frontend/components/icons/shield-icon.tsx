export const ModernShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FD1C5" />
        <stop offset="100%" stopColor="#38B2AC" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L3 7V12C3 16.55 6.84 20.74 9.91 21.79C11.12 22.26 12.88 22.26 14.09 21.79C17.16 20.74 21 16.55 21 12V7L12 2Z"
      fill="url(#shieldGradient)"
      fillOpacity="0.2"
      stroke="url(#shieldGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="url(#shieldGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
