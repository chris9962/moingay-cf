import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

const ZaloIcon = (props: SVGProps<SVGSVGElement>) => (
    <text
      x="12"
      y="13"
      fontSize="6"
      textAnchor="middle"
      fontWeight="bold"
      dominantBaseline="middle"
    >
      Zalo
    </text>
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
