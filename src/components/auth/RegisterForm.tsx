import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Mail, Phone, Calendar, Gift, Lock, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    setHasSubmitted(true);
    
    // Mark all fields as touched only on submit
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

    // Clear any previous errors
    setLocalError(null);
    onRegister(formData);
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      <Button
        variant=""
        size="icon"
        onClick={onSwitchToLogin}
        aria-label="Voltar ao login"
        className="absolute -top-2 -right-2 h-9 w-9"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-primary mb-2">Crie sua conta</h1>
        <p className="text-muted-foreground text-sm">Cadastre-se e comece sua jornada hoje.</p>
      </div>

      {(error || localError) && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usuario */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary" />
            Usuário
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => {
              setFormData({...formData, username: e.target.value});
              if (localError) setLocalError(null);
            }}
            onBlur={() => {
              // Only mark as touched on blur
              setTouched({ ...touched, username: true });
            }}
            placeholder="Nome de usuário"
            required
            className={cn(
              "h-10 bg-background/50 text-sm transition-all duration-200",
              // Only show error border if form was submitted
              hasSubmitted && touched.username && validateField("username", formData.username) && "border-destructive/50"
            )}
          />
          {/* Only show error message after form submission attempt */}
          {hasSubmitted && touched.username && validateField("username", formData.username) && (
            <p className="text-xs text-destructive animate-in fade-in mt-1">
              {validateField("username", formData.username)}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
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
              // Remove touched on change to prevent validation during typing
              if (localError) setLocalError(null);
            }}
            onBlur={() => {
              // Only mark as touched on blur, but don't validate yet
              setTouched({ ...touched, email: true });
            }}
            placeholder="email@exemplo.com"
            required
            className={cn(
              "h-10 bg-background/50 text-sm transition-all duration-200",
              // Only show error border if form was submitted
              hasSubmitted && touched.email && validateField("email", formData.email) && "border-destructive/50"
            )}
          />
          {/* Only show error message after form submission attempt */}
          {hasSubmitted && touched.email && validateField("email", formData.email) && (
            <p className="text-xs text-destructive animate-in fade-in mt-1">
              {validateField("email", formData.email)}
            </p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Data de Nascimento
          </Label>
          <DateSelect
            value={formData.dob}
            onChange={(value) => {
              setFormData({...formData, dob: value});
              if (localError) setLocalError(null);
            }}
            disabled={loading}
          />
          {hasSubmitted && touched.dob && validateField("dob", formData.dob) && (
            <p className="text-xs text-destructive animate-in fade-in mt-1">
              {validateField("dob", formData.dob)}
            </p>
          )}
        </div>

        {/* Telefone e Código de Referência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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
                "h-10 bg-background/50 text-sm transition-all duration-200",
                hasSubmitted && touched.phone && validateField("phone", formData.phone) && "border-destructive/50"
              )}
            />
            {hasSubmitted && touched.phone && validateField("phone", formData.phone) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("phone", formData.phone)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral" className="flex items-center gap-2 text-sm font-medium">
              <Gift className="w-4 h-4 text-primary shrink-0" />
              Código Amigo
            </Label>
            <Input
              id="referral"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
              placeholder="Opcional"
              className="h-10 bg-background/50 text-sm"
            />
          </div>
        </div>

        {/* Senha e Confirmar Senha */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
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
                  if (localError) setLocalError(null);
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="Senha"
                required
                className={cn(
                  "h-10 bg-background/50 text-sm pr-10 transition-all duration-200",
                  hasSubmitted && touched.password && validateField("password", formData.password || "") && "border-destructive/50"
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
            {hasSubmitted && touched.password && validateField("password", formData.password || "") && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("password", formData.password || "")}
              </p>
            )}
          </div>
          
          <div className="space-y-2 relative">
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
                  if (localError) setLocalError(null);
                }}
                onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                placeholder="Confirmar senha"
                required
                className={cn(
                  "h-10 bg-background/50 text-sm pr-10 transition-all duration-200",
                  hasSubmitted && touched.confirmPassword && validateField("confirmPassword", formData.confirmPassword || "") && "border-destructive/50"
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
            {hasSubmitted && touched.confirmPassword && validateField("confirmPassword", formData.confirmPassword || "") && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("confirmPassword", formData.confirmPassword || "")}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4 h-11 text-base font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" 
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

      <div className="relative my-6 flex items-center gap-4">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs uppercase text-muted-foreground whitespace-nowrap">Ou continue com</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <Button
        type="button"
        className="w-full bg-white text-black shadow-md text-base py-2.5 h-11 flex items-center justify-center transition-all duration-200 hover:bg-gray-50 active:scale-[0.99]"
        onClick={onGoogleLogin}
        disabled={loading}
      >
        <FcGoogle className="mr-3 h-5 w-5" />
        Entrar com Google
      </Button>

      <div className="text-center text-sm mt-4">
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
