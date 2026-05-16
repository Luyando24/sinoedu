"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Clock, CheckCircle2, XCircle, RefreshCw, Mail } from "lucide-react"
import Image from "next/image"

export default function AgentPendingPage() {
  const [status, setStatus] = useState<"pending" | "active" | "rejected" | "loading">("loading")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace("/auth/login")
      return
    }
    setUserEmail(user.email ?? null)
    const { data } = await supabase
      .from("users")
      .select("role, status")
      .eq("id", user.id)
      .single()

    // Non-agent users have no business here
    if (data?.role !== "agent") {
      router.replace("/dashboard")
      return
    }

    const s = data?.status ?? "pending"
    setStatus(s as "pending" | "active" | "rejected")

    // If admin approved, redirect to dashboard
    if (s === "active") {
      router.replace("/dashboard")
    }
  }

  useEffect(() => {
    fetchStatus()
    // Poll every 30 seconds so the page auto-detects approval
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckStatus = async () => {
    setChecking(true)
    await fetchStatus()
    setChecking(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/auth/login")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003d82] via-[#0056b3] to-[#1a7fd4] px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white space-y-6">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-lg">
              <Image src="/images/logo-new.jpg" alt="Sinoway Logo" fill className="object-contain" />
            </div>
          </div>

          {/* Status icon + heading */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-amber-300" />
              </div>
              <p className="text-white/60 text-sm">Checking your status…</p>
            </div>
          )}

          {status === "pending" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-300" />
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Under Review</h1>
                <p className="text-white/70 text-sm mt-1">Your agent application is pending admin approval</p>
              </div>
            </div>
          )}

          {status === "rejected" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-400/50 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Application Rejected</h1>
                <p className="text-white/70 text-sm mt-1">Unfortunately your agent application was not approved</p>
              </div>
            </div>
          )}

          {status === "active" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Approved!</h1>
                <p className="text-white/70 text-sm mt-1">Redirecting you to the dashboard…</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Message body */}
          {status === "pending" && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm leading-relaxed text-center">
                Thank you for registering as a <span className="font-semibold text-amber-300">Sinoway Agent</span>.
                Our team is reviewing your application and will notify you once a decision has been made.
              </p>

              {/* Timeline steps */}
              <div className="space-y-3">
                {[
                  { step: "1", label: "Application submitted", done: true },
                  { step: "2", label: "Admin review in progress", done: false, active: true },
                  { step: "3", label: "Account activated", done: false },
                ].map(({ step, label, done, active }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      done
                        ? "bg-green-500/80 text-white"
                        : active
                        ? "bg-amber-400/80 text-[#003d82] ring-2 ring-amber-400/40 ring-offset-1 ring-offset-transparent"
                        : "bg-white/10 text-white/40"
                    }`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : step}
                    </div>
                    <span className={`text-sm ${done ? "text-green-300" : active ? "text-amber-300 font-medium" : "text-white/40"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Email reminder */}
              {userEmail && (
                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Mail className="w-4 h-4 mt-0.5 text-sky-300 flex-shrink-0" />
                  <p className="text-xs text-white/70">
                    We'll send a notification to <span className="font-medium text-white">{userEmail}</span> when your account is approved or if we need more information.
                  </p>
                </div>
              )}
            </div>
          )}

          {status === "rejected" && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm leading-relaxed text-center">
                We were unable to approve your agent application at this time.
                Please contact our support team for more information or to appeal this decision.
              </p>
              <a
                href="mailto:support@sinoway.com"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-medium transition-all"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            {status === "pending" && (
              <Button
                onClick={handleCheckStatus}
                disabled={checking}
                className="w-full bg-amber-400 hover:bg-amber-300 text-[#003d82] font-semibold rounded-xl h-11 shadow-lg shadow-amber-500/20 transition-all"
              >
                {checking ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Checking…</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" /> Check Status</>
                )}
              </Button>
            )}

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-11 transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/40 text-xs">
            This page refreshes automatically every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
