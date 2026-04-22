import type { SVGProps } from "react"
import Link from "next/link"
import { Typography } from "@/components/ui/typography"

export function WizardHelpFooter() {
  return (
    <footer className="mt-16 flex flex-col md:flex-row justify-between gap-12 border-t border-border pt-12 pb-8">
      {/* Left Column: Contact */}
      <div className="flex flex-col gap-4">
        <Typography variant="large" className="font-semibold text-foreground">
          +1 (120) 233-01231
        </Typography>
        <Typography variant="h2" className="text-4xl lg:text-5xl font-bold tracking-tight">
          yo@shadcnblocks.com
        </Typography>
      </div>

      {/* Right Columns Container */}
      <div className="flex flex-col sm:flex-row gap-16 md:gap-24">
        {/* Navigate Column */}
        <div className="flex flex-col gap-4">
          <Typography variant="muted" className="mb-2 text-muted-foreground">
            Navigate
          </Typography>
          <Link href="#" className="font-medium text-foreground hover:underline">
            Home
          </Link>
          <Link href="#" className="font-medium text-foreground hover:underline">
            Collection
          </Link>
          <Link href="#" className="font-medium text-foreground hover:underline">
            Projects
          </Link>
          <Link href="#" className="font-medium text-foreground hover:underline">
            Pricing
          </Link>
          <Link href="#" className="font-medium text-foreground hover:underline">
            Login
          </Link>
        </div>

        {/* Social Column */}
        <div className="flex flex-col gap-4">
          <Typography variant="muted" className="mb-2 text-muted-foreground">
            Social
          </Typography>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-medium text-foreground hover:underline inline-flex items-center gap-1.5"
          >
            LinkedIn <ExternalLinkIcon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-medium text-foreground hover:underline inline-flex items-center gap-1.5"
          >
            Twitter <ExternalLinkIcon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-medium text-foreground hover:underline inline-flex items-center gap-1.5"
          >
            Facebook <ExternalLinkIcon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}
