import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";

const links = [
  { title: "Workflow", href: "#workflow" },
  { title: "Operations", href: "#operations" },
  { title: "Logistics", href: "#logistics" },
  { title: "Content", href: "#content" },
  { title: "Pricing", href: "#pricing" },
  { title: "Support", href: "#support" },
];

export default function FooterMetrics() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 md:py-12">
      <div className="mx-auto max-w-5xl px-6">
        {/* LOGO (replaced Logo component) */}
        <Link href="/" className="mx-auto block w-fit">
          <div className="relative h-8 w-[140px]">
            <Image
              src="/assets/logos/logo-texte-noir.png"
              alt="LinxOS Logo"
              fill
              sizes="140px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* LINKS */}
        <div className="my-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <Typography variant="small">{link.title}</Typography>
            </Link>
          ))}
        </div>

        {/* DESCRIPTION */}
        <Typography variant="muted" className="text-center max-w-xl mx-auto">
          LinxOS is an internal sponsorship operations platform helping teams
          manage requests, logistics, and content workflows in one unified
          system.
        </Typography>

        {/* SOCIALS */}
        <div className="mt-6 flex justify-center gap-5 text-gray-400">
          <Link href="#" className="hover:text-gray-900 transition">
            X
          </Link>
          <Link href="#" className="hover:text-gray-900 transition">
            LinkedIn
          </Link>
          <Link href="#" className="hover:text-gray-900 transition">
            Instagram
          </Link>
        </div>

        {/* COPYRIGHT */}
        <Typography
          variant="small"
          className="mt-6 block text-center text-muted-foreground"
        >
          © 2026 LinxOS. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}
