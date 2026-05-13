import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function FormLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-muted">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
                <header className="flex items-center justify-center gap-4 pt-4">
                    <Link href="/forms/sponsorship" className="flex items-center transition-opacity hover:opacity-80">
                        {/* Light mode */}
                        <Image
                            src="/assets/logos/logo-texte-noir.svg"
                            alt="Lynxos"
                            width={160}
                            height={40}
                            className="block dark:hidden"
                        />

                        {/* Dark mode */}
                        <Image
                            src="/assets/logos/logo-texte-blanc.svg"
                            alt="Lynxos"
                            width={160}
                            height={40}
                            className="hidden dark:block"
                        />
                    </Link>
                    <Separator orientation="vertical" className="h-6 mt-2" />
                    <ThemeToggle />
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
