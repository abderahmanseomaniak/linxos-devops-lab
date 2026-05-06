import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    { title: 'Workflow', href: '#workflow' },
    { title: 'Operations', href: '#operations' },
    { title: 'Logistics', href: '#logistics' },
    { title: 'Content', href: '#content' },
    { title: 'Pricing', href: '#pricing' },
    { title: 'Support', href: '#support' },
]

export default function FooterMetrics() {
    return (
        <footer className="bg-white border-t border-gray-100 py-10 md:py-12">
            <div className="mx-auto max-w-5xl px-6">

                {/* LOGO */}
                <Link
                    href="/"
                    className="mx-auto block w-fit"
                >
                    <Logo />
                </Link>

                {/* LINKS */}
                <div className="my-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-sm text-gray-500 hover:text-gray-900 transition"
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-center text-sm text-gray-500 max-w-xl mx-auto">
                    LinxOS is an internal sponsorship operations platform helping teams manage requests,
                    logistics, and content workflows in one unified system.
                </p>

                {/* SOCIALS (simplified) */}
                <div className="mt-6 flex justify-center gap-5 text-gray-400">

                    <Link href="#" className="hover:text-gray-900 transition">X</Link>
                    <Link href="#" className="hover:text-gray-900 transition">LinkedIn</Link>
                    <Link href="#" className="hover:text-gray-900 transition">Instagram</Link>

                </div>

                {/* COPYRIGHT */}
                <span className="mt-6 block text-center text-xs text-gray-400">
                    © {2026} LinxOS. All rights reserved.
                </span>

            </div>
        </footer>
    )
}