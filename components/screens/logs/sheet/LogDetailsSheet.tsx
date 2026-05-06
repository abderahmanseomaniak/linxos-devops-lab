import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { actionVariants } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { ActivityLog } from "@/types/logs"

export function LogDetailsSheet({ log, open, onOpenChange }: { log: ActivityLog; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-2xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>Log Details</SheetTitle>
          <SheetDescription>Full information about this action</SheetDescription>
        </SheetHeader>
        <Card className="m-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{log.action}</CardTitle>
              <Badge variant={actionVariants[log.action] as "default" | "secondary" | "destructive" | "outline"}>
                {log.action}
              </Badge>
            </div>
            <CardDescription>{log.entityType}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex justify-between rounded-md bg-muted/50 p-3">
              <Typography variant="small" className="text-muted-foreground">User</Typography>
              <Typography variant="small" className="font-medium">{log.userName}</Typography>
            </div>
            <div className="flex justify-between rounded-md bg-muted/50 p-3">
              <Typography variant="small" className="text-muted-foreground">Entity Name</Typography>
              <Typography variant="small" className="font-medium">{log.entityName}</Typography>
            </div>
            <div className="flex justify-between rounded-md bg-muted/50 p-3">
              <Typography variant="small" className="text-muted-foreground">Entity ID</Typography>
              <Typography variant="small" className="font-medium">{log.entityId}</Typography>
            </div>
            <div className="flex justify-between rounded-md bg-muted/50 p-3">
              <Typography variant="small" className="text-muted-foreground">Timestamp</Typography>
              <Typography variant="small" className="font-medium">{formatDate(log.timestamp)}</Typography>
            </div>
            {log.description && (
              <div className="rounded-md bg-muted/50 p-3">
                <Typography variant="small" className="text-muted-foreground mb-1 block">Description</Typography>
                <Typography variant="small" className="font-medium">{log.description}</Typography>
              </div>
            )}
            {Object.keys(log.details).length > 0 && (
              <div className="rounded-md bg-muted/50 p-3 space-y-2">
                <Typography variant="small" className="text-muted-foreground">Details</Typography>
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm  pt-3" >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  )
}
