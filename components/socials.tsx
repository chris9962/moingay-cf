import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

const ZaloIcon = (props: SVGProps<SVGSVGElement>) => (
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    <path d="M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7l-5 5V4a1 1 0 0 1 1-1z" />
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
);
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
