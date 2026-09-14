import { supabase } from "@/integrations/supabase/client";

export type AccountType = "consumer" | "business" | "government";

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "consumer", label: "Consumer" },
  { value: "business", label: "Business" },
  { value: "government", label: "Government Authority" },
];

export const ACCOUNT_TYPE_HEADINGS: Record<AccountType, string> = {
  consumer: "Consumer Dashboard",
  business: "Business Dashboard",
  government: "Government Authority Dashboard",
};

/** Domain used to derive a stable login address for mobile-number accounts. */
const MOBILE_DOMAIN = "mobile.labelcheck.app";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^\+?[0-9][0-9\s-]{6,17}$/;

export type Identifier =
  | { kind: "email"; email: string; contact: string }
  | { kind: "mobile"; email: string; contact: string };

/**
 * Accepts an email address or a mobile number and returns the address used for
 * authentication. Mobile numbers map to a deterministic internal address so the
 * same number always resolves to the same account.
 */
export function parseIdentifier(raw: string): Identifier | null {
  const value = raw.trim();
  if (EMAIL_RE.test(value)) {
    const email = value.toLowerCase();
    return { kind: "email", email, contact: email };
  }
  if (MOBILE_RE.test(value)) {
    const digits = value.replace(/[^0-9]/g, "");
    return { kind: "mobile", email: `${digits}@${MOBILE_DOMAIN}`, contact: `+${digits}` };
  }
  return null;
}

export interface SignUpInput {
  fullName: string;
  identifier: string;
  password: string;
  accountType: AccountType;
}

export async function signUpUser({ fullName, identifier, password, accountType }: SignUpInput) {
  const parsed = parseIdentifier(identifier);
  if (!parsed) throw new Error("Enter a valid email address or mobile number.");

  const { error } = await supabase.auth.signUp({
    email: parsed.email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      data: {
        full_name: fullName.trim(),
        account_type: accountType,
        contact: parsed.contact,
      },
    },
  });

  if (error) throw new Error(friendlyAuthError(error.message));
}

export async function signInUser(identifier: string, password: string) {
  const parsed = parseIdentifier(identifier);
  if (!parsed) throw new Error("Enter a valid email address or mobile number.");

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password,
  });

  if (error) throw new Error(friendlyAuthError(error.message));
}

export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Incorrect credentials. Check your email/mobile number and password.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with these details already exists. Try logging in instead.";
  }
  if (m.includes("pwned") || m.includes("compromised")) {
    return "This password has appeared in a data breach. Please choose a stronger one.";
  }
  if (m.includes("password should be")) {
    return "Password must be at least 6 characters long.";
  }
  return message;
}
