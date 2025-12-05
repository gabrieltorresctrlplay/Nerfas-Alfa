import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker"; // Import DatePicker

export interface RegisterFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  dob: string; // Change dob type to string
  referralCode: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onGoogleLogin: () => void;
  onRegister: (data: RegisterFormData) => void;
  loading: boolean;
  error: string;
}

export function RegisterForm({ onSwitchToLogin, onGoogleLogin, onRegister, loading, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "", // Initialize dob as empty string
    referralCode: ""
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = val;
    if (val.length > 2) formatted = `(${val.slice(0,2)}) ${val.slice(2)}`;
    if (val.length > 3) formatted = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3)}`;
    if (val.length > 7) formatted = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3,7)}-${val.slice(7)}`;
    setFormData({ ...formData, phone: formatted });
  };

  const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem!");
      return;
    }

    if (!validateEmail(formData.email)) {
        setLocalError("Por favor, insira um email válido (ex: nome@dominio.com)");
        return;
    }

    onRegister(formData); // dob is already string
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crie sua conta</h1>
        <p className="text-muted-foreground text-sm">Junte-se ao Alfa Nerf</p>
      </div>

      {(error || localError) && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground text-sm text-center">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="username">Usuário (Login)</Label>
                <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    className="bg-background/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                        if (localError) setLocalError(null);
                    }}
                    required
                    className="bg-background/50"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(XX) XXXXX-XXXX"
                    required
                    className="bg-background/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dob">Data de Nascimento</Label>
                <DatePicker
                  date={formData.dob ? new Date(formData.dob) : undefined} // Convert string to Date for DatePicker
                  setDate={(date) => setFormData({...formData, dob: date ? date.toISOString().split('T')[0] : ""})} // Convert Date to string
                  placeholder="Selecione sua data"
                  disabled={loading}
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="referral">Código de Referência (Opcional)</Label>
            <Input
                id="referral"
                value={formData.referralCode}
                onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                placeholder="Opcional: código de referência"
                className="bg-background/50"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
                <Label htmlFor="password">Senha</Label>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="bg-background/50 pr-10"
                />
            </div>
            <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirmar</Label>
                <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="bg-background/50 pr-10"
                />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? "Criando..." : "Criar Conta"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Ou</span>
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

      <div className="text-center text-sm mt-4">
        Já tem conta?{" "}
        <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
          Faça Login
        </button>
      </div>
    </div>
  );
}
