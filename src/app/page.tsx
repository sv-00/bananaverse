import Link from "next/link";
import {
  Truck,
  Package,
  Zap,
  BarChart3,
  MapPin,
  Shield,
  ArrowRight,
  Globe,
} from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import BananaLogo from "@/components/BananaLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bananaverse — Logistics Intelligence Platform",
  description:
    "Real-time fleet tracking, AI-optimized routing, and end-to-end shipment management. Deliver smarter with Bananaverse.",
  keywords: [
    "logistics",
    "fleet tracking",
    "delivery management",
    "route optimization",
    "shipment tracking",
    "GPS tracking",
    "supply chain",
  ],
  openGraph: {
    title: "Bananaverse — Deliver Smarter. Track Everything.",
    description:
      "Real-time fleet visibility, intelligent routing, and end-to-end shipment management — all in one place.",
    type: "website",
    siteName: "Bananaverse",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bananaverse — Logistics Intelligence Platform",
    description:
      "Real-time fleet tracking, smart routing, and shipment management.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    icon: Truck,
    title: "Fleet Tracking",
    desc: "Live GPS tracking across your entire fleet with real-time position updates and route visualization.",
  },
  {
    icon: Zap,
    title: "Smart Routes",
    desc: "AI-optimized delivery paths that reduce fuel costs and get packages there faster.",
  },
  {
    icon: Package,
    title: "Shipment Hub",
    desc: "End-to-end visibility on every package from pickup to final delivery confirmation.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Performance insights, delivery metrics, and operational reports at a glance.",
  },
  {
    icon: MapPin,
    title: "Geo-Tasking",
    desc: "Create and assign location-based delivery tasks with image attachments and quantity tracking.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    desc: "Role-based team access with Google SSO and 256-bit encryption on all data.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<2s", label: "Location Sync" },
  { value: "40%", label: "Faster Routes" },
  { value: "24/7", label: "Monitoring" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <BananaLogo />
          <span className="text-lg sm:text-xl font-bold tracking-tight">Bananaverse</span>
        </div>
        <Link
          href="#contact"
          className="text-sm bg-yellow-500 text-gray-950 font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Get in Touch
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 sm:pt-20 pb-16 sm:pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-8">
          <Globe className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-xs text-yellow-500 font-medium">
            Logistics Intelligence Platform
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
          Deliver smarter.
          <br />
          <span className="text-yellow-500">Track everything.</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Real-time fleet visibility, intelligent routing, and end-to-end
          shipment management — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-500 text-gray-950 font-semibold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg shadow-yellow-500/20"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900/80 border border-gray-800 text-gray-300 font-medium px-8 py-3.5 rounded-xl hover:bg-gray-800/80 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 lg:px-12 pb-16 sm:pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1">
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 px-6 lg:px-12 pb-16 sm:pb-24 max-w-6xl mx-auto"
      >
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-yellow-500">move fast</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From real-time tracking to smart analytics, Bananaverse gives your
            logistics team superpowers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-900/70 hover:border-yellow-500/20 transition-all"
            >
              <div className="w-11 h-11 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <f.icon className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Contact */}
      <section
        id="contact"
        className="relative z-10 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24 max-w-4xl mx-auto"
      >
        <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to streamline your deliveries?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Drop your number and our team will reach out to understand your
            needs. No spam, just a quick conversation.
          </p>
          <LeadForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BananaLogo size="sm" />
            <span className="text-sm font-semibold">Bananaverse</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>© 2025 Bananaverse</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Logistics Intelligence Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
