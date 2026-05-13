"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrackHelp({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <HelpCircle className="size-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find">Find Reference</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <Typography variant="p" className="font-medium mb-1">
                  From confirmation email
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Check your email inbox for the subject "Request Confirmed" or
                  "Your Reference Number"
                </Typography>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <Typography variant="p" className="font-medium mb-1">
                  From your club dashboard
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Log in to your club portal and check the "My Requests" section
                </Typography>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <Typography variant="p" className="font-medium mb-1">
                  Format
                </Typography>
                <Typography
                  variant="small"
                  className="text-muted-foreground font-mono"
                >
                  Example: SPO-2026-001, SPG-2025-123
                </Typography>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 py-4">
            <div className="text-center space-y-4">
              <Typography variant="p" className="text-muted-foreground">
                Need more help? Our support team is here to assist you.
              </Typography>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@linxos.com">
                    <Mail className="size-4 mr-2" />
                    Email Support
                  </a>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact" target="_blank">
                    <ExternalLink className="size-4 mr-2" />
                    Contact Form
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}