import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onGoogleLogin: () => void;
  onLogin: (email: string, pass: string, remember: boolean) => void;
  onForgotPassword: () => void;
  loading: boolean;
  error: string;
}

export function LoginForm({ onSwitchToRegister, onGoogleLogin, onLogin, onForgotPassword, loading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, rememberMe);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground text-sm">Acesse o painel Alfa Nerf</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email ou Usuário</Label>
          <Input
            id="email"
            type="text"
            placeholder="admin@alfanerf.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50 border-input focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 border-input focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <Label htmlFor="remember" className="font-normal cursor-pointer">Lembrar de mim</Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Button type="button" className="w-full bg-white text-gray-800 hover:bg-gray-100 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 shadow-md text-base py-2 flex items-center justify-center" onClick={onGoogleLogin} disabled={loading}>
        <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" viewBox="0 0 24 24" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.61-.06-1.22-.16-1.83H12v3.66h6.15c-.25 1.29-.93 2.39-1.99 3.16v2.33h3c1.76-1.63 2.76-3.88 2.76-6.32z"></path>
            <path fill="#34A853" d="M12 23c3.08 0 5.66-1.02 7.55-2.77l-3-2.33c-1.06.69-2.45 1.1-4.55 1.1-3.5 0-6.49-2.39-7.55-5.62H1.45v2.41C3.34 20.89 7.42 23 12 23z"></path>
            <path fill="#FBBC04" d="M4.45 14.5c-.1-.32-.16-.65-.16-.99s.06-.67.16-1c0-3.23 2.39-5.91 5.55-6.84V1.75C6.73 2.92 3.34 7.03 3.34 12c0 .99.16 1.95.45 2.8z"></path>
            <path fill="#EA4335" d="M12 4.18c1.69 0 3.24.58 4.45 1.76L20.65 2.4C18.49.92 15.34 0 12 0 7.42 0 3.34 2.11 1.45 5.09l3 2.41C5.51 5.92 8.5 3.53 12 3.53v.65z"></path>
        </svg>
        Entrar com Google
      </Button>

      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <button onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
          Cadastre-se
        </button>
      </div>
    </div>
  );
}
