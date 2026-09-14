import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCOUNT_TYPES, signUpUser, type AccountType } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — LabelCheck" },
      {
        name: "description",
        content:
          "Create a LabelCheck account as a consumer, business or government authority to verify and monitor product labels.",
      },
      { property: "og:title", content: "Create your account — LabelCheck" },
      {
        property: "og:description",
        content: "Sign up for LabelCheck label verification in under a minute.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("consumer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!fullName.trim() || !identifier.trim() || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUpUser({ fullName, identifier, password, accountType });
      toast.success("Account created successfully. Welcome to LabelCheck!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join LabelCheck to verify product labels with confidence."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-accent-foreground hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identifier">Email or Mobile Number</Label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
            autoComplete="username"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select value={accountType} onValueChange={(v) => setAccountType(v as AccountType)}>
            <SelectTrigger id="accountType" className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-base">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
