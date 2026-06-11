import { LoginForm } from "@/components/screens/auth/login-form"
import { Typography } from "@/components/ui/typography"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-black via-zinc-800 to-primary">

      {/* ================= LEFT (FORM) ================= */}
      <div className="flex items-center justify-center p-6 md:p-10">

        <div className="w-full max-w-md md:max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-2xl">

          <LoginForm />

        </div>
      </div>

      {/* ================= RIGHT (BRAND) ================= */}
      <div className="hidden lg:flex items-center justify-center p-12">

        <div className="w-full max-w-lg rounded-2xl p-10 text-white">

          {/* TITLE */}
          <div className="text-center">
            <Typography
              variant="h1"
              className="text-5xl md:text-6xl font-extrabold tracking-wider text-white"
            >
              LINXOS
            </Typography>

            <Typography
              variant="p"
              className="mt-4 text-lg md:text-xl text-white/80"
            >
              From Request to Report
            </Typography>

            <Typography
              variant="p"
              className="mt-6 text-sm md:text-base leading-6 text-white/60"
            >
              Intelligent Sponsoring Management Platform designed to centralize,
              automate and monitor sponsorship requests throughout their entire lifecycle.
            </Typography>
          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-3 gap-3 md:gap-4">

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">100%</div>
              <div className="text-xs text-white/60 mt-1">Digital</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">24/7</div>
              <div className="text-xs text-white/60 mt-1">Available</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">AI</div>
              <div className="text-xs text-white/60 mt-1">Powered</div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}