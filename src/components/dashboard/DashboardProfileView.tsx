import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Save,
  User as UserIcon,
  Loader2,
  Image as ImageIcon,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DashboardProfileView() {
  const { user } = useAuth();
  const defaultAvatarUrl =
    "https://i.pinimg.com/736x/f7/cd/03/f7cd03608a383f79c6e64c0c4b7d02ae.jpg";
  const isGooglePlaceholder = (url?: string) => {
    if (!url) return false;
    const normalized = url.toLowerCase();
    if (!normalized.includes("googleusercontent.com")) return false;
    if (normalized.includes("/a/default")) return true;
    const hasBasicAPath =
      normalized.includes("/a/") && !normalized.includes("/a-/");
    const hasDefaultSize = normalized.includes("=s96-c");
    const knownLetter =
      "https://lh3.googleusercontent.com/a/ACg8ocLsOqyqVyXzigFgA-og6EV1xuWjS8q4lXJbDEXl_6X78Xyqwg=s96-c".toLowerCase();
    if (normalized === knownLetter) return true;
    return hasBasicAPath && hasDefaultSize;
  };

  // Profile State
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      const initialPhoto =
        user.photoURL && !isGooglePlaceholder(user.photoURL)
          ? user.photoURL
          : defaultAvatarUrl;
      setPhotoURL(initialPhoto);
      setEmail(user.email || "");
      // Mock fetching DOB and Phone from Firestore if implemented
    }
  }, [user]);

  const previewPhoto = useMemo(() => {
    if (photoURL && !isGooglePlaceholder(photoURL)) return photoURL;
    return defaultAvatarUrl;
  }, [photoURL]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });
      // In a real app, also save phone and dob to Firestore here
      toast.success("Perfil atualizado com sucesso!", {
        description: "Suas alterações foram salvas.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        </div>

        {/* Public Profile Section */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserIcon className="w-6 h-6 text-primary" />
              Informações Públicas
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Isso será exibido publicamente para outros usuários.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Display Name */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <Avatar className="h-28 w-28 border-2 border-border shadow-md">
                  <AvatarImage src={previewPhoto} alt="Avatar" className="object-cover" />
                  <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {/* Optional: Add an overlay/button to change avatar */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background/80 hover:bg-background rounded-full h-8 w-8 transition-colors shadow-sm"
                  title="Alterar Avatar"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-semibold text-xl">
                  {displayName || "Nome de Exibição"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Seu perfil público.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Nome de Exibição</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photoURL">URL do Avatar</Label>
                <Input
                  id="photoURL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Cole um link direto para sua imagem de perfil.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Section */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="w-6 h-6 text-primary" />
              Informações da Conta
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie suas credenciais e detalhes de contato.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-muted opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Para alterar, entre em contato com o suporte.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Seu número de telefone para contato.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                  Data de Nascimento
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
