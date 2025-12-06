import type { JSX, ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  ProfileStatusProvider,
  useProfileStatus,
} from "@/contexts/ProfileStatusProvider";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { CompleteProfile } from "@/pages/CompleteProfile";
import { TweakcnThemeTester } from "@/components/dev/TweakcnThemeTester";

function PrivateRoute({ children }: { children: ReactElement }): JSX.Element | null {
  const { user, loading } = useAuth();
  const { status, checking } = useProfileStatus();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (checking || status === "unknown") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "incomplete" && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: ReactElement }): JSX.Element | null {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}

export function App(): JSX.Element {
  return (
    <AuthProvider>
      <ProfileStatusProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/complete-profile"
              element={
                <PrivateRoute>
                  <CompleteProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
        <TweakcnThemeTester />
      </ProfileStatusProvider>
    </AuthProvider>
  );
}
