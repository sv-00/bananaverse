"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Truck, Package, Zap, BarChart3 } from "lucide-react";

const errorMessages: Record<string, string> = {
  AccessDenied: "You don't have permission to access this application.",
  InvalidState: "Invalid authentication state. Please try again.",
  TokenExchangeFailed: "Authentication failed. Please try again.",
  UserInfoFailed: "Could not retrieve user information.",
  OAuthNotConfigured: "OAuth is not configured properly.",
  AuthFailed: "Authentication failed. Please try again.",
};

const features = [
  { icon: Truck, title: "Fleet Tracking", desc: "Live GPS tracking across your entire fleet" },
  { icon: Zap, title: "Smart Routes", desc: "AI-optimized paths for faster deliveries" },
  { icon: Package, title: "Shipment Hub", desc: "End-to-end visibility on every package" },
  { icon: BarChart3, title: "Analytics", desc: "Performance insights and delivery metrics" },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/[0.03] rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative z-10 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-2xl">🍌</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bananaverse</h1>
          </div>
          <p className="text-gray-500 text-sm ml-14">Logistics Intelligence Platform</p>
        </div>

        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Deliver smarter.<br />
            <span className="text-yellow-500">Track everything.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Real-time fleet visibility, intelligent routing, and end-to-end shipment management — all in one place.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                    <f.icon className="w-4 h-4 text-yellow-500" />
                  </div>
                  <h3 className="text-white font-medium text-sm">{f.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed ml-12">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-600 text-xs">
          <span>© 2025 Bananaverse</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Logistics Platform</span>
        </div>
      </div>

      {/* Right — Login card */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍌</span>
              </div>
              <h1 className="text-xl font-bold text-white">Bananaverse</h1>
            </div>
            <p className="text-gray-500 text-sm">Logistics Platform</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/80 p-8 shadow-2xl shadow-black/40">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to your logistics dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">
                  {errorMessages[error] || "An error occurred during sign in."}
                </p>
              </div>
            )}

            <a
              href={`/api/auth/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="w-full flex items-center justify-center gap-3 bg-white rounded-xl px-6 py-3.5 text-gray-900 font-medium hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </a>

            <div className="mt-8 pt-6 border-t border-gray-800/80">
              <p className="text-center text-xs text-gray-600">
                Only authorized team members can access this platform.
                <br />
                Contact your admin if you need access.
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>256-bit encrypted</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>SSO enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <LoginContent />
    </Suspense>
  );
}
