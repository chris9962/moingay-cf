import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

function ZaloIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      <circle cx={12} cy={12} r={10} />
      <text
        x={12}
        y={12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="sans-serif"
        fontSize={6}
        fill="currentColor"
        stroke="none"
      >
        Zalo
      </text>
    </svg>
  )
}
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
