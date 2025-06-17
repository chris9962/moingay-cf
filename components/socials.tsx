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
    <path d="M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7l-5 5V4a1 1 0 0 1 1-1z" />
    <path d="M8 8h8l-8 8h8" />
  </svg>
)

export default function Socials() {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center space-y-2">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
      >
        <Facebook className="h-full w-full" />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
      >
        <ZaloIcon className="h-full w-full" />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
      >
        <Instagram className="h-full w-full" />
      </a>
    </div>
  )
}
