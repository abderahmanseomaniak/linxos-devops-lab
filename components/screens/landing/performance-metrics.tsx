export default function PerformanceMetrics() {
    return (
        <section id="operations" className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">

                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">

                    {/* STAT 1 */}
                    <div className="py-10 md:py-6 md:px-10 text-center group">

                        <div className="text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
                            <span className="text-amber-400">+</span>
                            <span className="text-gray-900">120</span>
                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                            Events Managed
                        </p>
                    </div>

                    {/* STAT 2 */}
                    <div className="py-10 md:py-6 md:px-10 text-center group">

                        <div className="text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
                            <span className="text-gray-900">95</span>
                            <span className="text-amber-400">%</span>
                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                            Delivery Success
                        </p>
                    </div>

                    {/* STAT 3 */}
                    <div className="py-10 md:py-6 md:px-10 text-center group">

                        <div className="text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105">
                            <span className="text-gray-900">100</span>
                            <span className="text-amber-400">%</span>
                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                            Workflow Visibility
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}