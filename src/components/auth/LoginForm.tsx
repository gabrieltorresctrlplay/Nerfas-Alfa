import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-3">
          Seja bem-vindo(a)!
        </h1>
        <p className="text-muted-foreground text-base">Acesse sua conta</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" />
            Email ou Usuário
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="Email ou usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-background/50 text-base border-input focus:ring-primary transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4 text-primary" />
              Senha
            </Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-background/50 text-base border-input focus:ring-primary pr-12 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPassword ? "Ocultar senha" : "Ver senha"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ accentColor: "var(--primary)" }}
            className="rounded border-input text-primary focus:ring-primary h-4 w-4 cursor-pointer"
          />
          <Label htmlFor="remember" className="font-normal cursor-pointer text-sm">
            Lembrar de mim
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-border" />
        <div className="px-4 text-xs uppercase text-muted-foreground">Ou continue com</div>
        <div className="flex-1 border-t border-border" />
      </div>

      <Button
        type="button"
        className="w-full bg-white text-black shadow-md text-base py-3 h-12 flex items-center justify-center transition-all duration-200 hover:bg-gray-50 active:scale-[0.99]"
        onClick={onGoogleLogin}
        disabled={loading}
      >
        <FcGoogle className="mr-3 h-5 w-5" />
        Entrar com Google
      </Button>

      <div className="text-center text-sm mt-8">
        <span className="text-muted-foreground">Não tem uma conta? </span>
        <button 
          onClick={onSwitchToRegister} 
          className="text-primary hover:underline font-medium transition-colors"
        >
          Cadastre-se
        </button>
      </div>
    </div>
  );
}
