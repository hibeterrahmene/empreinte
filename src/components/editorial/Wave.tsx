/** Vague blanche du bas du hero (motif de la maquette). Aplat, sans dégradé. */
export default function Wave({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 140" preserveAspectRatio="none" className={`absolute inset-x-0 bottom-[-1px] h-[70px] w-full text-white md:h-[110px] ${className}`}>
      <path fill="currentColor" d="M0 60 C 180 10, 340 -6, 560 34 C 800 80, 1080 118, 1440 52 L1440 140 L0 140 Z" />
    </svg>
  )
}
