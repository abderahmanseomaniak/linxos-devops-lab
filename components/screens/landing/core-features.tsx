"use client";

import { Card } from '@/components/ui/card'

const IMAGE_SPPONSORSHIP = "assets/images/4.png"
const IMAGE_LOGISTICS = "assets/images/2.png"
const IMAGE_CONTENT = "assets/images/3.png"
const IMAGE_DASHBOARD = "assets/images/1.png"

export default function CoreFeatures() {
    return (
        <section id="features" className="bg-white">
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">

                    {/* HEADER */}
                    <div>
                        <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">
                            Everything your ops team needs
                        </h2>
                        <p className="text-muted-foreground mt-3 max-w-xl">
                            One platform for sponsorship intake, logistics tracking, content production, and analytics.
                        </p>
                    </div>

                    {/* GRID */}
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* 1 */}
                        <Card className="bg-white overflow-hidden p-4 h-[360px] flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">

                            <h3 className="text-base font-semibold">
                                Sponsorship Management
                            </h3>

                            {/* BADGE */}
                            <span className="w-fit px-3 py-1 text-[11px] rounded-full bg-blue-500/10 text-blue-500">
                                Request & Approval System
                            </span>

                            <p className="text-muted-foreground text-xs leading-snug">
                                Request intake, validation workflow, and approval pipeline.
                            </p>

                            <div className="mt-auto aspect-[3/4]">
                                <img
                                    src={IMAGE_SPPONSORSHIP}
                                    alt="Sponsorship Dashboard"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                        </Card>

                        {/* 2 */}
                        <Card className="bg-white overflow-hidden p-4 h-[360px] flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">

                            <h3 className="text-base font-semibold">
                                Logistics Tracking
                            </h3>

                            {/* BADGE */}
                            <span className="w-fit px-3 py-1 text-[11px] rounded-full bg-orange-500/10 text-orange-500">
                                Operations Flow
                            </span>

                            <p className="text-muted-foreground text-xs leading-snug">
                                Real-time task assignment and operational flow tracking.
                            </p>

                            <div className="mt-auto aspect-[3/4] ">
                                <img
                                    src={IMAGE_LOGISTICS}
                                    alt="Logistics Board"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                        </Card>

                        {/* 3 */}
                        <Card className="bg-white overflow-hidden p-4 h-[360px] flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">

                            <h3 className="text-base font-semibold">
                                Content Monitoring
                            </h3>

                            {/* BADGE */}
                            <span className="w-fit px-3 py-1 text-[11px] rounded-full bg-sky-500/10 text-sky-500">
                                Production Pipeline
                            </span>

                            <p className="text-muted-foreground text-xs leading-snug">
                                Control content lifecycle from creation to validation.
                            </p>

                            <div className="mt-auto aspect-[3/4] ">
                                <img
                                    src={IMAGE_CONTENT}
                                    alt="Content Review"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                        </Card>

                        {/* 4 */}
                        <Card className="bg-white overflow-hidden p-4 h-[360px] flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">

                            <h3 className="text-base font-semibold">
                                Operations Dashboard
                            </h3>

                            {/* BADGE */}
                            <span className="w-fit px-3 py-1 text-[11px] rounded-full bg-green-500/10 text-green-500">
                                Analytics & Insights
                            </span>

                            <p className="text-muted-foreground text-xs leading-snug">
                                System-wide KPIs, analytics, and operational visibility.
                            </p>

                            <div className="mt-auto aspect-[3/4]">
                                <img
                                    src={IMAGE_DASHBOARD}
                                    alt="Analytics Dashboard"
                                    className="h-full w-full object-cover "
                                />
                            </div>

                        </Card>

                    </div>
                </div>
            </div>
        </section>
    )
}