
import { useState, useEffect } from "react";
import { Settings, Moon, Sun, Bell, User, Palette, Database, Key, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [username, setUsername] = useState("Kullanıcı");
  const [email, setEmail] = useState("user@example.com");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (savedSettings.notifications !== undefined) setNotifications(savedSettings.notifications);
    if (savedSettings.autoSave !== undefined) setAutoSave(savedSettings.autoSave);
    if (savedSettings.username) setUsername(savedSettings.username);
    if (savedSettings.email) setEmail(savedSettings.email);
    if (savedSettings.apiKey) setApiKey(savedSettings.apiKey);
  }, []);

  const saveSettings = () => {
    const settings = {
      notifications,
      autoSave,
      username,
      email,
      apiKey
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Ayarlar kaydedildi",
      description: "Tüm ayarlarınız başarıyla kaydedildi.",
    });
  };

  const exportAllData = () => {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const mindmaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    
    const allData = {
      notes,
      mindmaps,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Veriler dışa aktarıldı",
      description: "Tüm verileriniz başarıyla dışa aktarıldı.",
    });
  };

  const deleteAllData = () => {
    if (confirm('Tüm veriler silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
      localStorage.removeItem('notes');
      localStorage.removeItem('mindmaps');
      localStorage.removeItem('appSettings');
      localStorage.removeItem('aiRequestCount');
      
      toast({
        title: "Tüm veriler silindi",
        description: "Uygulama baştan başlatılıyor...",
        variant: "destructive",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('MindFlow', {
          body: 'Bildirimler aktif edildi!',
          icon: '/favicon.ico'
        });
        toast({
          title: "Bildirimler aktif",
          description: "Bildirim izni verildi.",
        });
      } else {
        toast({
          title: "Bildirim izni reddedildi",
          description: "Bildirimler için izin gerekli.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    // Request notification permission when notifications are enabled
    if (notifications && 'Notification' in window && Notification.permission === 'default') {
      requestNotificationPermission();
    }
  }, [notifications]);

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
              <Button onClick={saveSettings} className="w-full">
                Profili Güncelle
              </Button>
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
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={exportAllData}
              >
                <Download className="w-4 h-4" />
                Verileri Dışa Aktar
              </Button>
              <Button variant="outline" className="w-full">
                Verileri İçe Aktar
              </Button>
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={deleteAllData}
              >
                <Trash2 className="w-4 h-4" />
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                AI asistan özelliklerini kullanmak için OpenRouter API anahtarınızı girin
              </p>
            </div>
            <Button onClick={saveSettings}>API Anahtarını Kaydet</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
