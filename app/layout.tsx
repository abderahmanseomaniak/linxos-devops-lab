import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "LINXOS | Plateforme de Gestion des Partnerships Sportifs",
  description: "Plateforme opérationnelle de gestion des sponsorships et événements sportifs",
  keywords: ["sponsorship", "sports", "events", "management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", "bg-background", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ToastContainer />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}