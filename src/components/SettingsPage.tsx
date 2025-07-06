
import { useState } from "react";
import { Settings, Moon, Sun, Bell, User, Palette, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [username, setUsername] = useState("Kullanıcı");
  const [email, setEmail] = useState("user@example.com");

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
            <p className="text-muted-foreground">
              Uygulamanızı kişiselleştirin ve tercihlerinizi yönetin
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Genel Ayarlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Genel Ayarlar
              </CardTitle>
              <CardDescription>
                Uygulama davranışını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Otomatik Kaydet</Label>
                  <p className="text-sm text-muted-foreground">
                    Notları otomatik olarak kaydet
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bildirimler</Label>
                  <p className="text-sm text-muted-foreground">
                    Uygulama bildirimlerini al
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tema Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Görünüm
              </CardTitle>
              <CardDescription>
                Uygulamanın görüntüsünü özelleştirin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Açık
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Koyu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profil Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil
              </CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button className="w-full">Profili Güncelle</Button>
            </CardContent>
          </Card>

          {/* Veri Yönetimi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Veri Yönetimi
              </CardTitle>
              <CardDescription>
                Verilerinizi yedekleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Verileri Dışa Aktar
              </Button>
              <Button variant="outline" className="w-full">
                Verileri İçe Aktar
              </Button>
              <Button variant="destructive" className="w-full">
                Tüm Verileri Sil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              AI Ayarları
            </CardTitle>
            <CardDescription>
              Yapay zeka özelliklerini yapılandırın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>OpenRouter API Anahtarı</Label>
              <Input
                type="password"
                placeholder="sk-or-v1-..."
                defaultValue="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"
              />
              <p className="text-sm text-muted-foreground">
                AI asistan özelliklerini kullanmak için OpenRouter API anahtarınızı girin
              </p>
            </div>
            <Button>API Anahtarını Kaydet</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
