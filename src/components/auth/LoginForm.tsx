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

      <Button variant="outline" type="button" className="w-full" onClick={onGoogleLogin} disabled={loading}>
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
        Google
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
