import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { KeyRound, LogIn, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { supabaseConfigured, supabaseUrl } from "../lib/supabaseConfig";
import { ADMIN_HOME } from "../lib/adminPath";
import { useAuth } from "./AuthContext";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20";
const primaryButton =
  "btn-primary flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-semibold disabled:opacity-60";
const secondaryButton =
  "w-full rounded-full border border-border px-4 py-3 text-sm transition hover:border-primary";

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-bold">
          {title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

function ErrorText({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

/** Traduit une erreur Supabase Auth en message exploitable. */
function describeAuthError(error: { message?: string; code?: string; status?: number; name?: string }) {
  const code = error.code ?? "";
  if (code === "invalid_credentials") return "Email ou mot de passe incorrect.";
  if (code === "email_not_confirmed") return "Adresse email non confirmée : confirme-la depuis Supabase → Authentication → Users.";
  if (code === "over_request_rate_limit" || error.status === 429) return "Trop de tentatives. Patiente quelques minutes puis réessaie.";
  if (code === "user_banned") return "Ce compte est bloqué dans Supabase.";
  if (code === "mfa_factor_not_found" || code === "mfa_totp_enroll_not_enabled" || code === "mfa_totp_verify_not_enabled")
    return "La double authentification TOTP n'est pas activée dans Supabase (Authentication → Multi-Factor).";
  if (!error.status || error.name === "AuthRetryableFetchError" || /fetch|network/i.test(error.message ?? ""))
    return `Impossible de joindre Supabase (${hostOf(supabaseUrl)}). Vérifie VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sur Vercel, puis redéploie.`;
  return `Erreur Supabase : ${error.message ?? "inconnue"}${code ? ` (${code})` : ""}`;
}

function hostOf(url?: string) {
  try {
    return url ? new URL(url).host : "URL absente";
  } catch {
    return "URL invalide";
  }
}

/** Champ code TOTP à 6 chiffres. */
function CodeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <>
      <label htmlFor="mfa-code" className="mb-1.5 block text-sm font-semibold">
        Code à 6 chiffres
      </label>
      <input
        id="mfa-code"
        required
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        className={`${field} text-center font-mono text-2xl tracking-[0.5em]`}
      />
    </>
  );
}

function CredentialsStep() {
  const { authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(describeAuthError(signInError));
    setSubmitting(false);
  };

  return (
    <Card title="Administration" subtitle="Connexion réservée au propriétaire du site.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold">Email</label>
          <input id="login-email" required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold">Mot de passe</label>
          <input id="login-password" required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </div>
        <ErrorText message={error || authError} />
        <button type="submit" disabled={submitting} className={primaryButton}>
          <LogIn size={16} aria-hidden="true" /> {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted">Projet : {hostOf(supabaseUrl)}</p>
    </Card>
  );
}

function EnrollStep() {
  const { refresh, signOut } = useAuth();
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Nettoie une éventuelle configuration abandonnée (facteur non vérifié).
      const { data: factors } = await supabase.auth.mfa.listFactors();
      for (const factor of factors?.all ?? []) {
        if (factor.factor_type === "totp" && factor.status === "unverified") {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Portfolio admin",
      });
      if (cancelled) return;
      if (enrollError || !data) {
        setError(enrollError ? describeAuthError(enrollError) : "Impossible de démarrer la configuration.");
        return;
      }
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (verifyError) {
      setError(verifyError.code === "mfa_verification_failed" ? "Code invalide. Vérifie l'heure de ton téléphone et réessaie." : describeAuthError(verifyError));
      setSubmitting(false);
      return;
    }
    await refresh();
  };

  return (
    <Card title="Double authentification" subtitle="Étape unique : relie une application d'authentification (Google Authenticator, Microsoft Authenticator, Aegis…).">
      <form onSubmit={onSubmit} className="space-y-4">
        {qrCode ? (
          <>
            <img src={qrCode} alt="QR code à scanner avec ton application d'authentification" width={200} height={200} className="mx-auto rounded-xl bg-white p-2" />
            <details className="text-sm text-muted">
              <summary className="cursor-pointer">Saisie manuelle de la clé</summary>
              <code className="mt-2 block break-all rounded-lg bg-background p-2 font-mono text-xs">{secret}</code>
            </details>
            <div>
              <CodeField value={code} onChange={setCode} />
            </div>
          </>
        ) : (
          !error && <p className="text-sm text-muted">Préparation…</p>
        )}
        <ErrorText message={error} />
        <button type="submit" disabled={submitting || !factorId || code.length !== 6} className={primaryButton}>
          <ShieldCheck size={16} aria-hidden="true" /> {submitting ? "Vérification…" : "Activer et continuer"}
        </button>
        <button type="button" onClick={signOut} className={secondaryButton}>Annuler</button>
      </form>
    </Card>
  );
}

function VerifyStep() {
  const { refresh, signOut } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp[0];
    if (!factor) {
      await refresh();
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (verifyError) {
      setError(verifyError.code === "mfa_verification_failed" ? "Code invalide ou expiré." : describeAuthError(verifyError));
      setCode("");
      setSubmitting(false);
      return;
    }
    await refresh();
  };

  return (
    <Card title="Vérification" subtitle="Saisis le code affiché dans ton application d'authentification.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <CodeField value={code} onChange={setCode} />
        </div>
        <ErrorText message={error} />
        <button type="submit" disabled={submitting || code.length !== 6} className={primaryButton}>
          <KeyRound size={16} aria-hidden="true" /> {submitting ? "Vérification…" : "Valider"}
        </button>
        <button type="button" onClick={signOut} className={secondaryButton}>Se déconnecter</button>
      </form>
    </Card>
  );
}

export default function Login() {
  const { step, isAdmin, loading, signOut } = useAuth();

  if (!supabaseConfigured) {
    return (
      <Card title="Administration" subtitle="Configuration manquante.">
        <p className="text-sm text-muted">
          Les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY ne sont pas définies
          sur cet environnement. Ajoute-les dans Vercel puis redéploie.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        <h1 className="sr-only">Administration</h1>
        <p>Chargement…</p>
      </main>
    );
  }

  if (step === "ready" && isAdmin) return <Navigate to={ADMIN_HOME} replace />;
  if (step === "enroll") return <EnrollStep />;
  if (step === "verify") return <VerifyStep />;
  if (step === "ready") {
    return (
      <Card title="Accès refusé" subtitle="Ce compte n'a pas les droits d'administration.">
        <button type="button" onClick={signOut} className={secondaryButton}>Se déconnecter</button>
      </Card>
    );
  }
  return <CredentialsStep />;
}
