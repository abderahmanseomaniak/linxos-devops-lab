import Link from "next/link"
import { ReactNode } from "react"

export default function FormLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-muted">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
                <header className="flex items-center justify-center pt-4">
                    <Link href="/" className="transition-opacity hover:opacity-80">
                        {/* Light mode */}
                        <img
                            src="/assets/logos/logo-texte-noir.svg"
                            alt="Lynxos"
                            width={160}
                            height={40}
                            className="block h-10 w-auto dark:hidden"
                        />

                        {/* Dark mode */}
                        <img
                            src="/assets/logos/logo-texte-blanc.svg"
                            alt="Lynxos"
                            width={160}
                            height={40}
                            className="hidden h-10 w-auto dark:block"
                        />
                    </Link>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
