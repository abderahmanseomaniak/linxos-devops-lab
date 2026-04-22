import { Typography } from "@/components/ui/typography";
import { ReactNode } from "react";

export default function FormLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-muted">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <header className="flex items-center justify-center">
                    <Typography variant="h3">Logoipsum</Typography>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
