import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onGoogleLogin: () => void;
  onRegister: (data: any) => void;
  loading: boolean;
  error: string;
}

export function RegisterForm({ onSwitchToLogin, onGoogleLogin, onRegister, loading, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    onRegister(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crie sua conta</h1>
        <p className="text-muted-foreground text-sm">Junte-se ao Alfa Nerf</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground text-sm text-center">
          {error}
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
                    placeholder="usuario123"
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="voce@exemplo.com"
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
                    placeholder="(37) 9 8888-8888"
                    required
                    className="bg-background/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dob">Data de Nascimento</Label>
                <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    required
                    className="bg-background/50"
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="referral">Código de Referência (Opcional)</Label>
            <Input
                id="referral"
                value={formData.referralCode}
                onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                placeholder="Tem um convite?"
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

      <Button variant="outline" type="button" className="w-full" onClick={onGoogleLogin} disabled={loading}>
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
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
