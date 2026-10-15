import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export default function Login() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError("Identifiants incorrects.");
    setSubmitting(false);
  };

  const denied = !loading && session && !isAdmin;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-bold">
          Administration<span className="text-accent">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Connexion réservée au propriétaire du site.</p>

        {denied ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-accent">
              Ce compte n'a pas les droits d'administration.
            </p>
            <button
              onClick={signOut}
              className="w-full rounded-full border border-border px-4 py-3 text-sm transition hover:border-primary"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={field}
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className={field}
            />
            {error && <p className="text-sm text-accent">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <LogIn size={16} /> {submitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
