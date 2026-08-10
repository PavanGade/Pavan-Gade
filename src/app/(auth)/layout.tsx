import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
          <Link href="/login" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">PRSPCT</span>
          </Link>
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sidebar-muted">Prospecting intelligence</p>
            <h1 className="text-5xl font-black tracking-tight text-white xl:text-6xl">
              Turn precise signals into predictable pipeline.
            </h1>
            <p className="mt-6 text-lg leading-8 text-sidebar-muted">
              PRSPCT gives revenue teams a focused workspace for prospect discovery, pipeline motion, and AI-assisted selling.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {["Teal-grade signals", "Demo-safe auth", "Revenue-ready shell"].map((item) => (
              <div key={item} className="rounded-xl border border-sidebar-border bg-white/5 p-4 text-sidebar-muted">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/login" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-3xl font-black tracking-tight">PRSPCT</span>
              </Link>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
