import { Facebook, Instagram } from "lucide-react"
import type { SVGProps } from "react"

const ZaloIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="svg"
    version="1.1"
    width="400"
    height="400"
    viewBox="0 0 400 400"
    {...props}
  >
    <g id="svgg">
      <path id="path0" d="" stroke="none" fill="#040404" fillRule="evenodd" />
      <path id="path1" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path2" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path3" d="" stroke="none" fill="#080404" fillRule="evenodd" />
      <path id="path4" d="" stroke="none" fill="#080404" fillRule="evenodd" />
    </g>
  </svg>
)

export default function Socials() {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center space-y-2">
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-primary p-3 text-white hover:bg-primary/90">
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600"
      >
        <ZaloIcon className="h-5 w-5" />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-primary p-3 text-white hover:bg-primary/90">
        <Instagram className="h-5 w-5" />
      </a>
    </div>
  )
}
