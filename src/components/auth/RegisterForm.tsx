import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Mail, Phone, Calendar, Gift, Lock } from "lucide-react";
import { DateSelect } from "@/components/ui/date-select";
import { cn } from "@/lib/utils";

export interface RegisterFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  dob: string;
  referralCode: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onGoogleLogin: () => void;
  onRegister: (data: RegisterFormData) => void;
  loading: boolean;
  error: string;
}

// Função melhorada para máscara de telefone brasileiro
const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length === 0) return "";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export function RegisterForm({ onSwitchToLogin, onGoogleLogin, onRegister, loading, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    referralCode: ""
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    setTouched({ ...touched, phone: true });
    if (localError) setLocalError(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "email":
        if (!value) return "Preencha este campo";
        if (!validateEmail(value)) return "Email inválido";
        return null;
      case "password":
        if (!value) return "Preencha este campo";
        if (value.length < 6) return "A senha deve ter no mínimo 6 caracteres";
        return null;
      case "confirmPassword":
        if (!value) return "Preencha este campo";
        if (value !== formData.password) return "As senhas não coincidem";
        return null;
      case "username":
        if (!value) return "Preencha este campo";
        if (value.length < 3) return "O usuário deve ter no mínimo 3 caracteres";
        return null;
      case "phone":
        if (!value) return "Preencha este campo";
        const phoneNumbers = value.replace(/\D/g, "");
        if (phoneNumbers.length < 10) return "Telefone inválido";
        return null;
      case "dob":
        if (!value) return "Preencha este campo";
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate all fields
    const errors: Record<string, string | null> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof RegisterFormData] || "");
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setLocalError(firstError || "Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem!");
      return;
    }

    if (!validateEmail(formData.email)) {
      setLocalError("Por favor, insira um email válido");
      return;
    }

    onRegister(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Crie sua conta
        </h1>
        <p className="text-muted-foreground text-base">Junte-se ao Alfa Nerf e comece sua jornada</p>
      </div>

      {(error || localError) && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-primary" />
              Usuário
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => {
                setFormData({...formData, username: e.target.value});
                setTouched({ ...touched, username: true });
                if (localError) setLocalError(null);
              }}
              onBlur={() => setTouched({ ...touched, username: true })}
              placeholder="Nome de usuário"
              required
              className={cn(
                "h-12 bg-background/50 text-base transition-all duration-200",
                touched.username && !formData.username && "border-destructive/50"
              )}
            />
            {touched.username && validateField("username", formData.username) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("username", formData.username)}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setTouched({ ...touched, email: true });
                if (localError) setLocalError(null);
              }}
              onBlur={() => setTouched({ ...touched, email: true })}
              placeholder="email@exemplo.com"
              required
              className={cn(
                "h-12 bg-background/50 text-base transition-all duration-200",
                touched.email && validateField("email", formData.email) && "border-destructive/50"
              )}
            />
            {touched.email && validateField("email", formData.email) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("email", formData.email)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 text-primary" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => setTouched({ ...touched, phone: true })}
              placeholder="(00) 00000-0000"
              maxLength={15}
              required
              className={cn(
                "h-12 bg-background/50 text-base transition-all duration-200",
                touched.phone && validateField("phone", formData.phone) && "border-destructive/50"
              )}
            />
            {touched.phone && validateField("phone", formData.phone) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("phone", formData.phone)}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              Data de Nascimento
            </Label>
            <DateSelect
              value={formData.dob}
              onChange={(value) => {
                setFormData({...formData, dob: value});
                setTouched({ ...touched, dob: true });
                if (localError) setLocalError(null);
              }}
              disabled={loading}
            />
            {touched.dob && validateField("dob", formData.dob) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("dob", formData.dob)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="referral" className="flex items-center gap-2 text-sm font-medium">
            <Gift className="w-4 h-4 text-primary" />
            Código de Referência
            <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Input
            id="referral"
            value={formData.referralCode}
            onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
              placeholder="Código de referência (opcional)"
            className="h-12 bg-background/50 text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 relative">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4 text-primary" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  setTouched({ ...touched, password: true });
                  if (localError) setLocalError(null);
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="Senha"
                required
                className={cn(
                  "h-12 bg-background/50 text-base pr-12 transition-all duration-200",
                  touched.password && validateField("password", formData.password || "") && "border-destructive/50"
                )}
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
            {touched.password && validateField("password", formData.password || "") && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("password", formData.password || "")}
              </p>
            )}
          </div>
          
          <div className="space-y-3 relative">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4 text-primary" />
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({...formData, confirmPassword: e.target.value});
                  setTouched({ ...touched, confirmPassword: true });
                  if (localError) setLocalError(null);
                }}
                onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                placeholder="Confirmar senha"
                required
                className={cn(
                  "h-12 bg-background/50 text-base pr-12 transition-all duration-200",
                  touched.confirmPassword && validateField("confirmPassword", formData.confirmPassword || "") && "border-destructive/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showConfirmPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {touched.confirmPassword && validateField("confirmPassword", formData.confirmPassword || "") && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("confirmPassword", formData.confirmPassword || "")}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-8 h-12 text-base font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-4 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Button 
        type="button" 
        className="w-full bg-white text-gray-800 hover:bg-gray-50 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 shadow-md text-base py-3 h-12 flex items-center justify-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" 
        onClick={onGoogleLogin} 
        disabled={loading}
      >
        <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" viewBox="0 0 24 24" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.61-.06-1.22-.16-1.83H12v3.66h6.15c-.25 1.29-.93 2.39-1.99 3.16v2.33h3c1.76-1.63 2.76-3.88 2.76-6.32z"></path>
          <path fill="#34A853" d="M12 23c3.08 0 5.66-1.02 7.55-2.77l-3-2.33c-1.06.69-2.45 1.1-4.55 1.1-3.5 0-6.49-2.39-7.55-5.62H1.45v2.41C3.34 20.89 7.42 23 12 23z"></path>
          <path fill="#FBBC04" d="M4.45 14.5c-.1-.32-.16-.65-.16-.99s.06-.67.16-1c0-3.23 2.39-5.91 5.55-6.84V1.75C6.73 2.92 3.34 7.03 3.34 12c0 .99.16 1.95.45 2.8z"></path>
          <path fill="#EA4335" d="M12 4.18c1.69 0 3.24.58 4.45 1.76L20.65 2.4C18.49.92 15.34 0 12 0 7.42 0 3.34 2.11 1.45 5.09l3 2.41C5.51 5.92 8.5 3.53 12 3.53v.65z"></path>
        </svg>
        Entrar com Google
      </Button>

      <div className="text-center text-sm mt-8">
        <span className="text-muted-foreground">Já tem conta? </span>
        <button 
          onClick={onSwitchToLogin} 
          className="text-primary hover:underline font-medium transition-colors"
        >
          Faça Login
        </button>
      </div>
    </div>
  );
}
