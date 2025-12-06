import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStatus } from "@/contexts/ProfileStatusProvider";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";

type ThemeMode = "light" | "dark";
type ThemeKey = "amberMinimal" | "graphite" | "comicNight";
type ThemePreference = ThemeMode | "system";

type ThemeTokens = Record<(typeof TOKEN_KEYS)[number], string>;

const TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "radius",
] as const;

const PRESETS: Record<
  ThemeKey,
  { label: string; styles: Record<ThemeMode, ThemeTokens> }
> = {
  amberMinimal: {
    label: "Amber Minimal",
    styles: {
      light: {
        background: "oklch(99% 0.02 90)",
        foreground: "oklch(25% 0.04 80)",
        card: "oklch(100% 0 0)",
        "card-foreground": "oklch(25% 0.04 80)",
        popover: "oklch(100% 0 0)",
        "popover-foreground": "oklch(25% 0.04 80)",
        primary: "oklch(70% 0.2 50)",
        "primary-foreground": "oklch(20% 0.05 50)",
        secondary: "oklch(90% 0.05 90)",
        "secondary-foreground": "oklch(40% 0.05 80)",
        muted: "oklch(95% 0.02 90)",
        "muted-foreground": "oklch(50% 0.03 85)",
        accent: "oklch(85% 0.06 90)",
        "accent-foreground": "oklch(35% 0.05 80)",
        destructive: "oklch(60% 0.2 25)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(90% 0.03 90)",
        input: "oklch(90% 0.03 90)",
        ring: "oklch(70% 0.2 50)",
        radius: "0.5rem",
      },
      dark: {
        background: "oklch(15% 0.03 80)",
        foreground: "oklch(90% 0.02 90)",
        card: "oklch(18% 0.03 80)",
        "card-foreground": "oklch(95% 0.02 90)",
        popover: "oklch(12% 0.03 80)",
        "popover-foreground": "oklch(95% 0.02 90)",
        primary: "oklch(75% 0.18 55)",
        "primary-foreground": "oklch(15% 0.05 50)",
        secondary: "oklch(25% 0.04 80)",
        "secondary-foreground": "oklch(85% 0.03 90)",
        muted: "oklch(22% 0.03 80)",
        "muted-foreground": "oklch(65% 0.03 85)",
        accent: "oklch(30% 0.05 85)",
        "accent-foreground": "oklch(90% 0.02 90)",
        destructive: "oklch(65% 0.2 30)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(30% 0.04 85)",
        input: "oklch(30% 0.04 85)",
        ring: "oklch(75% 0.18 55)",
        radius: "0.5rem",
      },
    },
  },
  graphite: {
    label: "Graphite",
    styles: {
      light: {
        background: "oklch(97% 0.01 260)",
        foreground: "oklch(22% 0.02 260)",
        card: "oklch(98% 0.005 260)",
        "card-foreground": "oklch(22% 0.02 260)",
        popover: "oklch(98% 0.005 260)",
        "popover-foreground": "oklch(22% 0.02 260)",
        primary: "oklch(55% 0.02 260)",
        "primary-foreground": "oklch(98% 0.015 260)",
        secondary: "oklch(90% 0.008 260)",
        "secondary-foreground": "oklch(30% 0.015 260)",
        muted: "oklch(88% 0.005 260)",
        "muted-foreground": "oklch(46% 0.01 260)",
        accent: "oklch(80% 0.02 250)",
        "accent-foreground": "oklch(24% 0.02 250)",
        destructive: "oklch(60% 0.15 25)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(84% 0.01 260)",
        input: "oklch(84% 0.01 260)",
        ring: "oklch(55% 0.02 260)",
        radius: "0.5rem",
      },
      dark: {
        background: "oklch(20% 0.02 255)",
        foreground: "oklch(93% 0.01 260)",
        card: "oklch(25% 0.02 255)",
        "card-foreground": "oklch(95% 0.01 260)",
        popover: "oklch(18% 0.02 255)",
        "popover-foreground": "oklch(93% 0.01 260)",
        primary: "oklch(72% 0.03 250)",
        "primary-foreground": "oklch(16% 0.01 250)",
        secondary: "oklch(32% 0.015 255)",
        "secondary-foreground": "oklch(90% 0.01 260)",
        muted: "oklch(28% 0.01 255)",
        "muted-foreground": "oklch(78% 0.01 260)",
        accent: "oklch(62% 0.03 240)",
        "accent-foreground": "oklch(15% 0.015 240)",
        destructive: "oklch(65% 0.15 25)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(34% 0.02 255)",
        input: "oklch(34% 0.02 255)",
        ring: "oklch(68% 0.03 250)",
        radius: "0.5rem",
      },
    },
  },
  comicNight: {
    label: "Comic Night",
    styles: {
      light: {
        background: "oklch(97% 0.05 280)",
        foreground: "oklch(25% 0.09 290)",
        card: "oklch(99% 0.04 280)",
        "card-foreground": "oklch(25% 0.09 290)",
        popover: "oklch(99% 0.05 280)",
        "popover-foreground": "oklch(25% 0.09 290)",
        primary: "oklch(70% 0.2 310)",
        "primary-foreground": "oklch(98% 0.03 280)",
        secondary: "oklch(92% 0.09 100)",
        "secondary-foreground": "oklch(28% 0.08 95)",
        muted: "oklch(92% 0.04 280)",
        "muted-foreground": "oklch(50% 0.06 290)",
        accent: "oklch(82% 0.12 200)",
        "accent-foreground": "oklch(22% 0.05 200)",
        destructive: "oklch(60% 0.2 25)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(88% 0.04 280)",
        input: "oklch(88% 0.04 280)",
        ring: "oklch(70% 0.2 310)",
        radius: "0.55rem",
      },
      dark: {
        background: "oklch(18% 0.08 280)",
        foreground: "oklch(96% 0.04 300)",
        card: "oklch(24% 0.08 280)",
        "card-foreground": "oklch(96% 0.04 300)",
        popover: "oklch(16% 0.08 280)",
        "popover-foreground": "oklch(95% 0.04 300)",
        primary: "oklch(75% 0.23 310)",
        "primary-foreground": "oklch(18% 0.05 300)",
        secondary: "oklch(64% 0.16 200)",
        "secondary-foreground": "oklch(12% 0.04 210)",
        muted: "oklch(30% 0.03 280)",
        "muted-foreground": "oklch(82% 0.03 300)",
        accent: "oklch(72% 0.18 110)",
        "accent-foreground": "oklch(18% 0.05 80)",
        destructive: "oklch(65% 0.2 25)",
        "destructive-foreground": "oklch(98% 0.01 20)",
        border: "oklch(34% 0.06 280)",
        input: "oklch(34% 0.06 280)",
        ring: "oklch(75% 0.23 310)",
        radius: "0.55rem",
      },
    },
  },
};

const STORAGE_KEY = "tweakcn-dev-theme";

const isThemeKey = (value: string | null): value is ThemeKey =>
  value === "amberMinimal" || value === "graphite" || value === "comicNight";

const resolveMode = (theme: ThemePreference, prefersDark: boolean): ThemeMode =>
  theme === "system" ? (prefersDark ? "dark" : "light") : theme;

export function TweakcnThemeTester() {
  const { user } = useAuth();
  const { profile: profileStatusData, status: profileStatus } = useProfileStatus();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    if (typeof window === "undefined") return "amberMinimal";
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeKey(stored) ? stored : "amberMinimal";
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const mode = useMemo(
    () => resolveMode(theme, systemPrefersDark),
    [theme, systemPrefersDark],
  );

  const verifyReferralCode = useCallback(async () => {
    if (!user) {
      setIsAllowed(false);
      setHasChecked(true);
      return;
    }

    // 1) Use profile data already loaded by ProfileStatusProvider when available
    if (profileStatusData && profileStatus !== "checking" && profileStatus !== "unknown") {
      const referral = profileStatusData.referralCode;
      setIsAllowed(referral?.trim().toLowerCase() === "sirob");
      setHasChecked(true);
      if (referral?.trim().toLowerCase() === "sirob") return;
      // If not allowed via profile context, fall through to Firestore fetch for double-check.
    }

    try {
      const profileRef = doc(db, "users", user.uid);
      const snap = await getDoc(profileRef);
      let referral = snap.exists()
        ? (snap.data().referralCode as string | undefined)
        : null;

      // Fallback: legacy/incorrect UID docs, try email match
      if (!referral && user.email) {
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email),
          limit(1)
        );
        const emailMatch = await getDocs(q);
        const data = emailMatch.docs[0]?.data() as { referralCode?: string } | undefined;
        referral = data?.referralCode;
      }

      setIsAllowed(referral?.trim().toLowerCase() === "sirob");
      setHasChecked(true);
    } catch (error) {
      console.warn("TweakCN tester: failed to verify referral code", error);
      setIsAllowed(false);
      setHasChecked(true);
    }
  }, [user, profileStatus, profileStatusData]);

  useEffect(() => {
    verifyReferralCode();
  }, [verifyReferralCode]);

  useEffect(() => {
    if (!user) return;
    const handleFocus = () => {
      verifyReferralCode();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, verifyReferralCode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) =>
      setSystemPrefersDark(event.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("transition-colors", "duration-300", "ease-out");
    return () => {
      root.classList.remove("transition-colors", "duration-300", "ease-out");
      delete root.dataset.tweakcnTheme;
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const palette =
      PRESETS[currentTheme]?.styles[mode] ?? PRESETS.amberMinimal.styles[mode];

    const root = document.documentElement;
    TOKEN_KEYS.forEach((key) => {
      const nextValue =
        palette[key] ?? PRESETS.amberMinimal.styles[mode][key];
      root.style.setProperty(`--${key}`, nextValue);
    });
    root.dataset.tweakcnTheme = currentTheme;
    localStorage.setItem(STORAGE_KEY, currentTheme);
  }, [currentTheme, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!hasChecked || !isAllowed) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-50 text-xs flex w-60 flex-col items-end"
    >
      {isOpen && (
        <div className="mb-2 w-60 rounded-lg border border-border bg-card text-foreground shadow-lg">
          <div className="flex items-center justify-between px-3 pt-3">
            <span className="text-sm font-semibold">TweakCN themes</span>
            <span className="text-[10px] uppercase text-muted-foreground">
              {mode}
            </span>
          </div>
          <div className="space-y-2 px-3 pb-3 pt-2">
            {Object.entries(PRESETS).map(([key, preset]) => {
              const isActive = currentTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                  onClick={() => setCurrentTheme(key as ThemeKey)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{preset.label}</span>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase">
                        active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Toggle TweakCN theme tester"
        className="flex w-full items-center justify-between gap-2 rounded-full bg-primary px-3 py-2 font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-[10px] uppercase tracking-wide">Dev theme</span>
        <span className="text-sm">{PRESETS[currentTheme].label}</span>
      </button>
    </div>
  );
}
