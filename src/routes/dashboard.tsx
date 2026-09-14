import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Loader2 } from "lucide-react";

import { BrandMark } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { ACCOUNT_TYPE_HEADINGS, type AccountType } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — LabelCheck" },
      { name: "description", content: "Your LabelCheck account dashboard." },
      { property: "og:title", content: "Dashboard — LabelCheck" },
      { property: "og:description", content: "Your LabelCheck account dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

interface Profile {
  full_name: string;
  account_type: AccountType;
  contact: string;
}

function DashboardPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/", replace: true });
    }
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, account_type, contact")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data as Profile);
      });
    return () => {
      active = false;
    };
  }, [session]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const heading = profile ? ACCOUNT_TYPE_HEADINGS[profile.account_type] : "Dashboard";

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <BrandMark />
          <Button variant="outline" className="rounded-xl" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}. Your LabelCheck account is
          ready.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard label="Account type" value={profile ? ACCOUNT_TYPE_HEADINGS[profile.account_type].replace(" Dashboard", "") : "—"} />
          <InfoCard label="Signed in as" value={profile?.contact || session.user.email || "—"} />
          <InfoCard label="Status" value="Active" />
        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}
