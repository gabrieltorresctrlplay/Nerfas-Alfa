import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface OnboardingFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  email: string | null;
}

export function OnboardingForm({ onSubmit, loading, email }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    username: "",
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
    onSubmit(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Quase lá! 🚀</h1>
        <p className="text-muted-foreground text-sm">
            Complete seu perfil para acessar o sistema.<br/>
            <span className="text-xs">Conectado como: {email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
            <Label htmlFor="username">Escolha um Usuário (Login)</Label>
            <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="usuario_ninja"
                required
                className="bg-background/50"
            />
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

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? "Salvando..." : "Concluir Cadastro"}
        </Button>
      </form>
    </div>
  );
}
