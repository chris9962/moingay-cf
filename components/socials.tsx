import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import type { SVGProps } from "react";

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
);

export default function Socials({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href="https://www.facebook.com/Moingayatelier?mibextid=LQQJ4d.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center"
      >
        <Facebook className="h-6 w-6" />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center"
      >
        <Image src="/zalo.webp" alt="Zalo" width={24} height={24} />
      </a>
      <a
        href="https://www.instagram.com/moingay.atelier?utm_source=ig_web_button_share_sheet&igsh=MWYzYmVkbmpjbWRlZw=="
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center"
      >
        <Instagram className="h-6 w-6" />
      </a>
    </div>
  );
}
