import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import type { SVGProps } from "react";
import { socialsLink } from "@/lib/utils";

export default function Socials({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href={socialsLink.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center"
      >
        <Facebook className="h-6 w-6" />
      </a>
      <a
        href={socialsLink.zalo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center"
      >
        <Image src="/zalo.webp" alt="Zalo" width={24} height={24} />
      </a>
      <a
        href={socialsLink.instagram}
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
