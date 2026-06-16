"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="wrap">
      <div className="page-head" style={{ textAlign: "center" }}>
        <h1>Start your free 30 days</h1>
        <p>No password to remember — we&apos;ll email you a secure sign-in link.</p>
      </div>

      <form className="form-card" style={{ maxWidth: 560 }} onSubmit={onSubmit}>
        {sent ? (
          <div className="notice">
            <span aria-hidden="true">📬</span>
            <span>Check your email — we sent a secure link to <strong>{email}</strong>. Tap it to finish signing in.</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="notice" style={{ background: "#FBEAE6", borderColor: "#E6B9AE", color: "var(--terra-d)" }}>
                <span aria-hidden="true">⚠️</span><span>{error}</span>
              </div>
            )}
            <div className="field">
              <label htmlFor="name">Your name</label>
              <div className="hint">How neighbors will see you (first name and last initial is fine).</div>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Dorothy P." />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
              {busy ? "Sending…" : "Email me a sign-in link"}
            </button>
            <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 14, textAlign: "center" }}>
              No card needed. Cancel anytime.
            </p>
          </>
        )}
      </form>
    </div>
  );
}
