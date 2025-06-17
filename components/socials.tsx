import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

const ZaloIcon = (props: SVGProps<SVGSVGElement>) => (
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="svg"
    version="1.1"
    width="400"
    height="400"
    viewBox="0 0 400 400"
    <g id="svgg">
      <path id="path0" d="" stroke="none" fill="#040404" fillRule="evenodd" />
      <path id="path1" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path2" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path3" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path4" d="" stroke="none" fill="#080404" fillRule="evenodd" />
    </g>
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
