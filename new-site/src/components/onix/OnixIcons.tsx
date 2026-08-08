type IconProps = { className?: string }

const iconClass = 'h-12 w-12'

export function ColocationIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="8" y="10" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="18" r="2" fill="currentColor" />
      <circle cx="24" cy="18" r="2" fill="currentColor" />
      <circle cx="32" cy="18" r="2" fill="currentColor" />
      <circle cx="16" cy="26" r="2" fill="currentColor" />
      <circle cx="24" cy="26" r="2" fill="currentColor" />
      <circle cx="32" cy="26" r="2" fill="currentColor" />
      <line x1="8" y1="34" x2="40" y2="34" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function CybersecurityIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 6L8 12v10c0 9.5 6.2 18.4 16 20 9.8-1.6 16-10.5 16-20V12L24 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M18 30c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function VirtualMachinesIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="6" y="12" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="32" x2="42" y2="32" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="34" width="8" height="4" fill="currentColor" />
    </svg>
  )
}

export function PowerIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M26 6h-4v16l-8 8c-2.5 2.5-2.5 6.5 0 9s6.5 2.5 9 0l3-3c2.5-2.5 2.5-6.5 0-9L26 22V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M30 10c4 3 6 7 6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SustainabilityIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M24 6v4M24 38v4M6 24h4M38 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12l3 3M33 33l3 3M12 36l3-3M33 15l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SecurityIcon({ className = iconClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="14" y="22" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M18 22v-4a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="31" r="2" fill="currentColor" />
    </svg>
  )
}

export type CardIconName =
  | 'colocation'
  | 'cybersecurity'
  | 'virtual-machines'
  | 'power'
  | 'sustainability'
  | 'security'

export function OnixCardIcon({ name, className }: { name: CardIconName; className?: string }) {
  const props = { className: className ?? iconClass }
  switch (name) {
    case 'colocation':
      return <ColocationIcon {...props} />
    case 'cybersecurity':
      return <CybersecurityIcon {...props} />
    case 'virtual-machines':
      return <VirtualMachinesIcon {...props} />
    case 'power':
      return <PowerIcon {...props} />
    case 'sustainability':
      return <SustainabilityIcon {...props} />
    case 'security':
      return <SecurityIcon {...props} />
  }
}
