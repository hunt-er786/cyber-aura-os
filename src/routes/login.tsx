import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Loader2, Mail, Lock, Chrome } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In · AI Shield OS X" },
      { name: "description", content: "Authenticate to access the AI Shield OS X command center." },
    ],
  }),
  component: LoginPage,
});

type Mode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate({ to: "/dashboard" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard" });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setInfo("Account created. Check your inbox to verify your email, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message || "Google sign-in failed");
      // result.redirected → browser will navigate to Google
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid-bg flex items-center justify-center px-4 py-10 relative">
      <div className="pointer-events-none fixed inset-0 scanline opacity-20" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-6 justify-center">
          <div className="size-9 rounded-md bg-gradient-to-br from-cyber-cyan to-cyber-blue grid place-items-center glow-cyan">
            <Shield className="size-5 text-background" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base tracking-widest text-cyber-cyan text-glow-cyan">
              AI SHIELD OS X
            </div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em]">
              CLEARANCE REQUIRED
            </div>
          </div>
        </Link>

        <div className="glass border border-cyber-cyan/30 rounded-xl p-6">
          <h1 className="font-display text-xl tracking-widest text-cyber-cyan text-glow-cyan text-center">
            {mode === "signin" ? "OPERATOR SIGN IN" : "REQUEST CLEARANCE"}
          </h1>
          <p className="mt-1 text-center text-[11px] font-mono text-muted-foreground tracking-widest">
            {mode === "signin"
              ? "Authenticate to access NEXUS"
              : "Create a new operator account"}
          </p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 h-11 rounded-md border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10 font-mono text-sm tracking-widest disabled:opacity-50"
          >
            <Chrome className="size-4" /> CONTINUE WITH GOOGLE
          </button>

          <div className="my-5 flex items-center gap-3 text-[10px] font-mono text-muted-foreground tracking-widest">
            <div className="flex-1 h-px bg-border" />
            OR
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="flex items-center gap-2 px-3 h-11 rounded-md border border-border/60 focus-within:border-cyber-cyan/60 bg-background/40">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@nexus.mil"
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                />
              </div>
            </label>
            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-2 px-3 h-11 rounded-md border border-border/60 focus-within:border-cyber-cyan/60 bg-background/40">
                <Lock className="size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                />
              </div>
            </label>

            {error && (
              <div className="text-[11px] font-mono text-cyber-red border border-cyber-red/40 bg-cyber-red/10 rounded px-3 py-2">
                {error}
              </div>
            )}
            {info && (
              <div className="text-[11px] font-mono text-cyber-emerald border border-cyber-emerald/40 bg-cyber-emerald/10 rounded px-3 py-2">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/25 font-display tracking-widest text-sm disabled:opacity-50"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "ENGAGE" : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-5 text-center text-[11px] font-mono text-muted-foreground">
            {mode === "signin" ? (
              <>
                No clearance?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                  className="text-cyber-cyan hover:underline tracking-widest"
                >
                  REQUEST ACCESS
                </button>
              </>
            ) : (
              <>
                Already cleared?{" "}
                <button
                  onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
                  className="text-cyber-cyan hover:underline tracking-widest"
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
