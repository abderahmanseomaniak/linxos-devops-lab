interface EventHeaderProps {
  eventName: string;
  date: string;
  city: string;
  reference?: string;
  progress: number;
  activePhaseTitle?: string;
}

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
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {reference}
        </p>
      )}
      <h1 className="text-2xl font-bold text-foreground">{eventName}</h1>
      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>{formattedDate}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{city}</span>
      </div>
      <div className="mx-auto max-w-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {activePhaseTitle && (
          <p className="text-xs text-primary font-medium">
            Current: {activePhaseTitle}
          </p>
        )}
      </div>
    </div>
  );
}