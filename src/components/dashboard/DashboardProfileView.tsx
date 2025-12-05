import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, User as UserIcon, Loader2, Image as ImageIcon, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { DateSelect } from "@/components/ui/date-select";
import { toast } from "sonner";

export function DashboardProfileView() {
  const { user } = useAuth();

  // Profile State
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
      setEmail(user.email || "");
      // For phone and dob, you would typically fetch these from Firestore if they were stored there.
      // For now, they remain empty or can be pre-filled with dummy data.
      // Assuming dob from user is a string in YYYY-MM-DD format
      // You should fetch this from Firestore in a real implementation
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName,
        photoURL
      });
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
            <p className="text-sm text-muted-foreground">Isso será exibido publicamente para outros usuários.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Display Name */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="h-28 w-28 rounded-full bg-secondary overflow-hidden flex items-center justify-center border-2 border-border shadow-md">
                  {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl font-medium text-secondary-foreground">{displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                {/* Optional: Add an overlay/button to change avatar */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background/80 hover:bg-background rounded-full h-8 w-8 transition-colors"
                  title="Alterar Avatar"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-semibold text-xl">{displayName || "Nome de Exibição"}</h3>
                <p className="text-sm text-muted-foreground">Seu perfil público.</p>
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
                <p className="text-xs text-muted-foreground">Cole um link direto para sua imagem de perfil.</p>
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
            <p className="text-sm text-muted-foreground">Gerencie suas credenciais e detalhes de contato.</p>
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
                 <p className="text-xs text-muted-foreground">Para alterar, entre em contato com o suporte.</p>
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
                <p className="text-xs text-muted-foreground">Seu número de telefone para contato.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                    Data de Nascimento
                </Label>
                <DateSelect
                  value={dob}
                  onChange={(value) => setDob(value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="flex justify-end pt-4">
          <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full sm:w-auto">
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