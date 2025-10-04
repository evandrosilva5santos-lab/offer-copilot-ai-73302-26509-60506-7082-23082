import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Upload, Camera, Instagram, Globe, Clock } from "lucide-react";
import { storage, KEYS } from "@/lib/storage";
import type { UserProfile } from "@/types";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema
const profileSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres"),
  timezone: z.string().min(1, "Selecione um timezone"),
  language: z.string().min(1, "Selecione um idioma"),
  instagramHandle: z.string().regex(/^@?[a-zA-Z0-9._]{1,30}$/, "Handle do Instagram inválido").optional().or(z.literal("")),
});

const defaultProfile: UserProfile = {
  email: "",
  fullName: "",
  bio: "",
  avatar: "",
  timezone: "America/Sao_Paulo",
  language: "pt-BR",
  instagramHandle: "",
};

// Common timezones
const timezones = [
  { value: "America/Sao_Paulo", label: "São Paulo (BRT/BRST)" },
  { value: "America/New_York", label: "Nova York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Europe/London", label: "Londres (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tóquio (JST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
];

// Languages
const languages = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
  { value: "de-DE", label: "Deutsch" },
  { value: "it-IT", label: "Italiano" },
];

export default function Usuario() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = storage.get<UserProfile>(KEYS.USER_PROFILE) || defaultProfile;
    setProfile(saved);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile({ ...profile, avatar: base64 });
        toast.success("Foto de perfil atualizada!");
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Erro ao carregar imagem");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem");
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setProfile({ ...profile, avatar: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Foto de perfil removida");
  };

  const validateAndSave = () => {
    try {
      // Validate
      profileSchema.parse(profile);
      
      // Save to localStorage
      storage.set(KEYS.USER_PROFILE, profile);
      setErrors({});
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
        toast.error("Por favor, corrija os erros no formulário");
      }
    }
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil de Usuário</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Adicione ou altere sua foto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} alt={profile.fullName} />
                ) : (
                  <AvatarFallback className="text-4xl gradient-primary">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      {profile.avatar ? "Alterar" : "Upload"}
                    </>
                  )}
                </Button>

                {profile.avatar && (
                  <Button
                    variant="destructive"
                    onClick={removeAvatar}
                    disabled={isUploading}
                  >
                    Remover
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG ou WEBP (max. 2MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Mantenha seus dados atualizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Seu nome completo"
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="seu@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={3}
                maxLength={500}
                className={errors.bio ? "border-destructive" : ""}
              />
              <div className="flex justify-between items-center">
                {errors.bio && (
                  <p className="text-xs text-destructive">{errors.bio}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {profile.bio.length}/500
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Timezone <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                >
                  <SelectTrigger id="timezone" className={errors.timezone ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-xs text-destructive">{errors.timezone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Idioma <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) => setProfile({ ...profile, language: value })}
                >
                  <SelectTrigger id="language" className={errors.language ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-xs text-destructive">{errors.language}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">
                <Instagram className="inline h-4 w-4 mr-1" />
                Instagram (opcional)
              </Label>
              <Input
                id="instagram"
                value={profile.instagramHandle || ""}
                onChange={(e) => setProfile({ ...profile, instagramHandle: e.target.value })}
                placeholder="@seuusuario"
                className={errors.instagramHandle ? "border-destructive" : ""}
              />
              {errors.instagramHandle && (
                <p className="text-xs text-destructive">{errors.instagramHandle}</p>
              )}
            </div>

            <Button onClick={validateAndSave} className="w-full" size="lg">
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
