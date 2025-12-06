import { useEffect, useMemo, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStatus } from "@/contexts/ProfileStatusProvider";
import { db } from "@/lib/firebase";
import { OnboardingForm, type OnboardingFormData } from "@/components/auth/OnboardingForm";

export function CompleteProfile() {
  const { user, loading: authLoading } = useAuth();
  const { status, profile, checking, needsProfile, refresh } = useProfileStatus();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialData = useMemo<Partial<OnboardingFormData>>(
    () => ({
      username: profile?.username || user?.displayName || "",
      phone: profile?.phone || "",
      dob: profile?.dob || "",
      referralCode: profile?.referralCode || "",
    }),
    [profile, user?.displayName],
  );

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, user, navigate]);

  if (!authLoading && user && status === "complete") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (data: OnboardingFormData) => {
    if (!user) return;
    setError(null);
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          username: data.username,
          email: user.email || profile?.email || "",
          phone: data.phone,
          dob: data.dob,
          referralCode: data.referralCode || "",
          role: profile?.role || "user",
          createdAt: profile?.createdAt || new Date().toISOString(),
        },
        { merge: true },
      );

      await updateProfile(user, { displayName: data.username });
      await refresh();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to save profile", err);
      setError("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Passo obrigatório</p>
          <h1 className="text-3xl font-bold mt-2">Complete seu perfil</h1>
          <p className="text-muted-foreground mt-2">
            Precisamos de alguns dados para liberar seu acesso. Isso leva menos de um minuto.
          </p>
          {error && (
            <div className="mt-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {checking ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">Verificando perfil...</div>
        ) : needsProfile ? (
          <OnboardingForm
            onSubmit={handleSubmit}
            loading={saving}
            email={user?.email || null}
            initialData={initialData}
          />
        ) : (
          <div className="text-center text-muted-foreground py-12">Tudo certo! Redirecionando...</div>
        )}
      </div>
    </div>
  );
}
