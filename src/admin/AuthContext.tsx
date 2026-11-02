import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * Étapes de connexion :
 * - "credentials" : pas de session, saisir email + mot de passe ;
 * - "enroll"      : session aal1 sans facteur TOTP vérifié, configurer l'app d'authentification ;
 * - "verify"      : session aal1 avec facteur TOTP, saisir le code à 6 chiffres ;
 * - "ready"       : session aal2, droits vérifiés via is_admin().
 */
export type AuthStep = "credentials" | "enroll" | "verify" | "ready";

type AuthState = {
  session: Session | null;
  step: AuthStep;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const evaluate = useCallback(async (current: Session | null) => {
    if (!current) {
      setStep("credentials");
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: aal, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) throw aalError;

      if (aal.currentLevel === "aal2") {
        const { data } = await supabase.rpc("is_admin");
        setIsAdmin(data === true);
        setStep("ready");
        return;
      }

      const { data: factors, error: factorsError } =
        await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;
      setIsAdmin(false);
      setStep(factors.totp.length > 0 ? "verify" : "enroll");
    } catch {
      setIsAdmin(false);
      setStep("credentials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Pas d'appel Supabase « await » dans ce callback (risque de blocage) :
    // on met seulement la session à jour, l'évaluation se fait dans l'effet suivant.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const token = session?.access_token;
  useEffect(() => {
    void evaluate(session);
    // La réévaluation suit le jeton : il change après connexion et après vérification MFA.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, evaluate]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    await evaluate(data.session);
  }, [evaluate]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, step, isAdmin, loading, refresh, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
