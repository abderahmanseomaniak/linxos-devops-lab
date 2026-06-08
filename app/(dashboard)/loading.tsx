import { Typography } from "@/components/ui/typography"

export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg className="mx-auto h-8 w-8 text-muted-foreground animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
          <circle cx="12" cy="12" r="4" strokeOpacity="0.75"/>
        </svg>
        <Typography variant="p" className="mt-3 text-sm text-muted-foreground">
          Chargement de votre tableau de bord...
        </Typography>
      </div>
    </div>
  )
}