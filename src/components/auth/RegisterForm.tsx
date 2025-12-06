import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Gift,
  Lock,
  X,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useRegistrationForm,
  type RegisterFormData,
} from "@/hooks/useRegistrationForm";

export type { RegisterFormData };

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onGoogleLogin: () => void;
  onRegister: (data: RegisterFormData) => void;
  loading: boolean;
  error: string;
}

export function RegisterForm({
  onSwitchToLogin,
  onGoogleLogin,
  onRegister,
  loading,
  error,
}: RegisterFormProps) {
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    localError,
    touched,
    setTouched,
    hasSubmitted,
    handlePhoneChange,
    validateField,
    handleSubmit,
  } = useRegistrationForm({ onRegister });

  // Helper state for date picker (Date object) -> mapped to string in formData
  // Note: useRegistrationForm expects dob as string (e.g. DD/MM/YYYY or similar based on previous impl).
  // Assuming we need to adapt Calendar Date to string.
  // The original DateSelect likely returned a string.
  // We will assume YYYY-MM-DD or whatever the backend expects, or display format.
  // Let's assume standard ISO or similar for internal state if possible, but the hook uses string.
  // Let's create a local date state that syncs.
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Format to what useRegistrationForm likely expects or valid format
      // Let's use standard ISO YYYY-MM-DD for consistency
      setFormData({ ...formData, dob: format(selectedDate, "yyyy-MM-dd") });
    } else {
      setFormData({ ...formData, dob: "" });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSwitchToLogin}
        aria-label="Voltar ao login"
        className="absolute -top-2 -right-2 h-9 w-9"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-primary mb-2">Crie sua conta</h1>
        <p className="text-muted-foreground text-sm">
          Cadastre-se e comece sua jornada hoje.
        </p>
      </div>

      {(error || localError) && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <User className="w-4 h-4 text-primary" />
            Usuário
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            onBlur={() => setTouched({ ...touched, username: true })}
            placeholder="Nome de usuário"
            required
            className={cn(
              "h-10 bg-background/50 text-sm transition-all duration-200",
              hasSubmitted &&
                touched.username &&
                validateField("username", formData.username) &&
                "border-destructive/50"
            )}
          />
          {hasSubmitted &&
            touched.username &&
            validateField("username", formData.username) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("username", formData.username)}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Mail className="w-4 h-4 text-primary" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onBlur={() => setTouched({ ...touched, email: true })}
            placeholder="email@exemplo.com"
            required
            className={cn(
              "h-10 bg-background/50 text-sm transition-all duration-200",
              hasSubmitted &&
                touched.email &&
                validateField("email", formData.email) &&
                "border-destructive/50"
            )}
          />
          {hasSubmitted &&
            touched.email &&
            validateField("email", formData.email) && (
              <p className="text-xs text-destructive animate-in fade-in mt-1">
                {validateField("email", formData.email)}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="w-4 h-4 text-primary" />
            Data de Nascimento
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background/50 h-10",
                  !date && "text-muted-foreground",
                  hasSubmitted &&
                    touched.dob &&
                    validateField("dob", formData.dob) &&
                    "border-destructive/50"
                )}
                disabled={loading}
              >
                {date ? (
                  format(date, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          {hasSubmitted && touched.dob && validateField("dob", formData.dob) && (
            <p className="text-xs text-destructive animate-in fade-in mt-1">
              {validateField("dob", formData.dob)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium"
            >
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
                hasSubmitted &&
                  touched.phone &&
                  validateField("phone", formData.phone) &&
                  "border-destructive/50"
              )}
            />
            {hasSubmitted &&
              touched.phone &&
              validateField("phone", formData.phone) && (
                <p className="text-xs text-destructive animate-in fade-in mt-1">
                  {validateField("phone", formData.phone)}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="referral"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Gift className="w-4 h-4 text-primary shrink-0" />
              Código Amigo
            </Label>
            <Input
              id="referral"
              value={formData.referralCode}
              onChange={(e) =>
                setFormData({ ...formData, referralCode: e.target.value })
              }
              placeholder="Opcional"
              className="h-10 bg-background/50 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="w-4 h-4 text-primary" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="Senha"
                required
                className={cn(
                  "h-10 bg-background/50 text-sm pr-10 transition-all duration-200",
                  hasSubmitted &&
                    touched.password &&
                    validateField("password", formData.password || "") &&
                    "border-destructive/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {hasSubmitted &&
              touched.password &&
              validateField("password", formData.password || "") && (
                <p className="text-xs text-destructive animate-in fade-in mt-1">
                  {validateField("password", formData.password || "")}
                </p>
              )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="w-4 h-4 text-primary" />
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                onBlur={() =>
                  setTouched({ ...touched, confirmPassword: true })
                }
                placeholder="Confirmar senha"
                required
                className={cn(
                  "h-10 bg-background/50 text-sm pr-10 transition-all duration-200",
                  hasSubmitted &&
                    touched.confirmPassword &&
                    validateField(
                      "confirmPassword",
                      formData.confirmPassword || ""
                    ) &&
                    "border-destructive/50"
                )}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showConfirmPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {hasSubmitted &&
              touched.confirmPassword &&
              validateField(
                "confirmPassword",
                formData.confirmPassword || ""
              ) && (
                <p className="text-xs text-destructive animate-in fade-in mt-1">
                  {validateField(
                    "confirmPassword",
                    formData.confirmPassword || ""
                  )}
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
        <span className="text-xs uppercase text-muted-foreground whitespace-nowrap">
          Ou continue com
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 text-base"
        onClick={onGoogleLogin}
        disabled={loading}
      >
        <FcGoogle className="h-6 w-6" />
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
