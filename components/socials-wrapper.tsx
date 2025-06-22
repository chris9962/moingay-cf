"use client";

import { usePathname } from "next/navigation";
import Socials from "./socials";

export default function SocialsWrapper() {
  const pathname = usePathname();
  const isLinkTree = pathname === "/linktree";

  // Don't show socials on linktree page since it has its own socials
  if (isLinkTree) {
    return null;
  }

  return (
    <Socials className="fixed bottom-20 right-4 z-50 flex flex-col items-center space-y-2" />
  );
}
