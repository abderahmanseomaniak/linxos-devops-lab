import { Typography } from "@/components/ui/typography"
import { EventHeaderProps } from "@/types/sponsorship-tracking"

export function EventHeader({
  eventName,
  date,
  city,
  reference,
  progress,
  activePhaseTitle,
}: EventHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="text-center space-y-4 py-6">
      {reference && (
        <Typography variant="small" className="font-medium uppercase tracking-wider">
          {reference}
        </Typography>
      )}
      <Typography variant="h1">{eventName}</Typography>
      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <Typography variant="p">{formattedDate}</Typography>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <Typography variant="p">{city}</Typography>
      </div>
      <div className="mx-auto max-w-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <Typography variant="small" className="text-muted-foreground">Progress</Typography>
          <Typography variant="small" className="font-medium text-primary">{progress}%</Typography>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {activePhaseTitle && (
          <Typography variant="small" className="text-primary font-medium">
            Current: {activePhaseTitle}
          </Typography>
        )}
      </div>
    </div>
  );
}