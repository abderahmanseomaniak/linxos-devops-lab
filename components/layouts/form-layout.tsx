import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function FormLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-muted" suppressHydrationWarning>
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
                <header className="flex items-center justify-center  ">
                    <Link href="/forms/sponsorship/sponsorship-demande" className="flex items-center transition-opacity hover:opacity-80">
                        {/* Light mode */}
                        <div className="h-20 dark:hidden">
                            <Image
                                src="/assets/logos/logo-texte-noir.png"
                                alt="Lynxos"
                                width={392}
                                height={148}
                                className="h-full w-auto"
                            />
                        </div>

                        {/* Dark mode */}
                        <div className="h-20 hidden dark:block">
                            <Image
                                src="/assets/logos/logo-texte-blanc.png"
                                alt="Lynxos"
                                width={392}
                                height={148}
                                className="h-full w-auto"
                            />
                        </div>
                    </Link>
                    <Separator orientation="vertical"  className="h-10 m-6 bg-primary"  />
                    <ThemeToggle />
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
