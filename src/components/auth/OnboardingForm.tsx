import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, Calendar, Gift } from "lucide-react";
import { DateSelect } from "@/components/ui/date-select";
import { cn } from "@/lib/utils";

export interface OnboardingFormData {
  username: string;
  phone: string;
  dob: string;
  referralCode: string;
}

interface OnboardingFormProps {
  onSubmit: (data: OnboardingFormData) => void;
  loading: boolean;
  email: string | null;
}

// Função melhorada para máscara de telefone brasileiro
const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length === 0) return "";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export function OnboardingForm({ onSubmit, loading, email }: OnboardingFormProps) {
  const [formData, setFormData] = useState<OnboardingFormData>({
    username: "",
    phone: "",
    dob: "",
    referralCode: ""
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    setTouched({ ...touched, phone: true });
    if (localError) setLocalError(null);
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
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
      if (key !== "referralCode") {
        acc[key] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate required fields
    const errors: Record<string, string | null> = {};
    ["username", "phone", "dob"].forEach((key) => {
      const error = validateField(key, formData[key as keyof OnboardingFormData] || "");
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setLocalError(firstError || "Preencha todos os campos obrigatórios");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Quase lá! 🚀
        </h1>
        <p className="text-muted-foreground text-base">
          Complete seu perfil para acessar o sistema
        </p>
        {email && (
          <p className="text-sm text-muted-foreground mt-3">
            Conectado como: <span className="text-primary font-medium">{email}</span>
          </p>
        )}
      </div>

      {localError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary" />
            Escolha um Usuário
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
              touched.username && validateField("username", formData.username) && "border-destructive/50"
            )}
          />
          {touched.username && validateField("username", formData.username) && (
            <p className="text-xs text-destructive animate-in fade-in mt-1">
              {validateField("username", formData.username)}
            </p>
          )}
        </div>

        <div className="space-y-6">
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

        <Button 
          type="submit" 
          className="w-full mt-8 h-12 text-base font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            "Concluir Cadastro"
          )}
        </Button>
      </form>
    </div>
  );
}
