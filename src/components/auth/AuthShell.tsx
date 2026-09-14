import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Label<span className="text-accent-foreground">Check</span>
      </span>
    </Link>
  );
}

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-hero-glow" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <section className="animate-rise rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <header className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </header>
          {children}
        </section>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </main>
  );
}
