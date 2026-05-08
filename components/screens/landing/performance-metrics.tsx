import { Typography } from "@/components/ui/typography";

export default function PerformanceMetrics() {
  return (
    <section id="operations" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-row justify-center gap-8 md:gap-0 md:grid md:grid-cols-3 md:divide-x md:divide-y-0 divide-y divide-border">
          {/* STAT 1 */}
          <div className="flex-1 py-8 md:py-6 md:px-10 text-center group">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-amber-400">+</span>
              <span className="text-foreground">120</span>
            </div>

            <Typography variant="small" className="mt-3">
              Events Managed
            </Typography>
          </div>

          {/* STAT 2 */}
          <div className="flex-1 py-8 md:py-6 md:px-10 text-center group">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-foreground">95</span>
              <span className="text-amber-400">%</span>
            </div>

            <Typography variant="small" className="mt-3">
              Delivery Success
            </Typography>
          </div>

          {/* STAT 3 */}
          <div className="flex-1 py-8 md:py-6 md:px-10 text-center group">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-foreground">100</span>
              <span className="text-amber-400">%</span>
            </div>

            <Typography variant="small" className="mt-3">
              Workflow Visibility
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
