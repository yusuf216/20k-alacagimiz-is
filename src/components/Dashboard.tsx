
import { Plus, FileText, GitBranch, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Hoş geldiniz! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Bugün hangi fikirlerinizi keşfetmeye başlayalım?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Yeni Not</h3>
                  <p className="text-sm text-muted-foreground">Hızlı not oluştur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <GitBranch className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Zihin Haritası</h3>
                  <p className="text-sm text-muted-foreground">Yeni harita oluştur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Asistan</h3>
                  <p className="text-sm text-muted-foreground">AI ile sohbet et</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Not</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>+12% bu ay</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Zihin Haritaları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>+3 yeni</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">AI İstekleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Bu hafta</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favori Notlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3 h-3" />
                <span>Önemli</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Son Notlar
              </CardTitle>
              <CardDescription>
                En son çalıştığınız notlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Proje Toplantısı Notları", time: "2 saat önce", category: "İş" },
                { title: "Haftalık Planlama", time: "1 gün önce", category: "Kişisel" },
                { title: "AI Öğrenme Yolculuğu", time: "3 gün önce", category: "Eğitim" },
                { title: "Kitap Özetleri", time: "1 hafta önce", category: "Okuma" }
              ].map((note, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div>
                    <h4 className="font-medium">{note.title}</h4>
                    <p className="text-sm text-muted-foreground">{note.time}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {note.category}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Son Zihin Haritaları
              </CardTitle>
              <CardDescription>
                En son oluşturduğunuz haritalar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Proje Mimarisi", nodes: "12 düğüm", time: "1 gün önce" },
                { title: "Öğrenme Rotası", nodes: "8 düğüm", time: "3 gün önce" },
                { title: "Yazılım Teknolojileri", nodes: "15 düğüm", time: "1 hafta önce" },
                { title: "İş Fikirleri", nodes: "6 düğüm", time: "2 hafta önce" }
              ].map((map, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div>
                    <h4 className="font-medium">{map.title}</h4>
                    <p className="text-sm text-muted-foreground">{map.time}</p>
                  </div>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                    {map.nodes}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
