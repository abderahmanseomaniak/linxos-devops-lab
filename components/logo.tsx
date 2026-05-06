import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-6 w-[120px]", className)}>
      <Image
        src="/assets/logos/logo-texte-noir.svg"
        alt="LinxOS Logo"
        fill
        priority
        sizes="120px"
        className="object-contain"
      />
    </div>
  );
}