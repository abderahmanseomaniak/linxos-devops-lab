"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FeatureHighlights() {
  return (
    <section id="workflow" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="max-w-2xl">
          <Typography variant="h3">See LinxOS in Action</Typography>

          <Typography variant="muted" className="mt-2">
            From request validation to content publication, your team always
            knows exactly where everything stands.
          </Typography>
        </div>

        {/* CONTENT (TEXT LEFT / VIDEO RIGHT) */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
          {/* LEFT - TEXT */}
          <div>
            <Typography variant="lead" className="font-semibold">
              Complete workflow visibility
            </Typography>

            <Typography variant="muted" className="mt-2">
              From request validation to logistics and content production,
              LinxOS gives your team a clear, structured system to manage every
              step without confusion.
            </Typography>

            <Button
              className="mt-5 border-muted-foreground/30"
              variant="outline"
              asChild
            >
              <Link href="#">
                <span className="font-medium">Explore Workflow</span>
                <ChevronRight className="ml-1 size-4 opacity-60" />
              </Link>
            </Button>
          </div>

          {/* RIGHT - VIDEO */}
          <div className="bg-white border border-muted/40 rounded-xl shadow-sm p-3">
            {/* PIPELINE LABELS */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/10 text-blue-600 font-medium">
                Requested
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                Approved
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-orange-500/10 text-orange-600 font-medium">
                Logistics
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-sky-500/10 text-sky-600 font-medium">
                Content
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-green-500/10 text-green-600 font-medium">
                Published
              </span>
            </div>

            {/* VIDEO */}
            <div className="rounded-lg overflow-hidden border bg-muted/20">
              <video
                src="https://dam-cdn.atl.orangelogic.com/CDNLink/AT12EY9X.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
