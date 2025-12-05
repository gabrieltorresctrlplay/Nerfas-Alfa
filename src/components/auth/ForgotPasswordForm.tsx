import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
  loading: boolean;
  message: string | null;
  error: string | null;
}

export function ForgotPasswordForm({ onBack, onSubmit, loading, message, error }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Recuperar Senha</h1>
        <p className="text-muted-foreground text-sm">Digite seu email para receber o link de redefinição.</p>
      </div>

      {message && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Cadastrado</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !!message}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {message ? "Email Enviado" : "Enviar Link"}
        </Button>
      </form>

      <div className="text-center">
        <Button variant="link" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o login
        </Button>
      </div>
    </div>
  );
}
