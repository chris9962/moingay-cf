import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

const ZaloIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="6"
      fontFamily="inherit"
      fill="currentColor"
      stroke="none"
    >
      Zalo
    </text>
  </svg>
)

export default function Socials() {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center space-y-2">
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-primary p-3 text-white hover:bg-primary/90">
        <Facebook className="h-5 w-5" />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="rounded-full bg-primary p-3 text-white hover:bg-primary/90">
        <ZaloIcon className="h-5 w-5" />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-primary p-3 text-white hover:bg-primary/90">
        <Instagram className="h-5 w-5" />
      </a>
    </div>
  )
}
