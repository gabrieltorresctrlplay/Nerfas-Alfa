import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

type ProfileData = {
  username?: string;
  email?: string;
  phone?: string;
  dob?: string;
  referralCode?: string;
  createdAt?: string;
  role?: string;
};

type ProfileStatus = "unknown" | "checking" | "complete" | "incomplete" | "error";

type ProfileStatusContextType = {
  status: ProfileStatus;
  profile: ProfileData | null;
  checking: boolean;
  needsProfile: boolean;
  refresh: () => Promise<void>;
};

const ProfileStatusContext = createContext<ProfileStatusContextType | undefined>(undefined);

const REQUIRED_FIELDS: Array<keyof ProfileData> = ["username", "email", "phone", "dob"];

const isProfileComplete = (data?: ProfileData | null) =>
  !!data &&
  REQUIRED_FIELDS.every((field) => {
    const value = data[field];
    return typeof value === "string" && value.trim().length > 0;
  });

export function ProfileStatusProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<ProfileStatus>("unknown");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [checking, setChecking] = useState(false);

  const needsProfile = useMemo(() => status === "incomplete", [status]);

  const refresh = async () => {
    if (!user) {
      setProfile(null);
      setStatus("unknown");
      return;
    }
    setChecking(true);
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? (snap.data() as ProfileData) : null;
      setProfile(data);
      setStatus(isProfileComplete(data) ? "complete" : "incomplete");
    } catch (error) {
      console.warn("ProfileStatusProvider refresh failed", error);
      setStatus("error");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setStatus("unknown");
      setChecking(false);
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid]);

  return (
    <ProfileStatusContext.Provider
      value={{
        status,
        profile,
        checking: authLoading || checking || status === "unknown",
        needsProfile,
        refresh,
      }}
    >
      {children}
    </ProfileStatusContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileStatus = () => {
  const ctx = useContext(ProfileStatusContext);
  if (!ctx) throw new Error("useProfileStatus must be used within ProfileStatusProvider");
  return ctx;
};
