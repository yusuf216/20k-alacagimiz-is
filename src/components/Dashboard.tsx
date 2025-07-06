
import { Plus, FileText, GitBranch, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalMindmaps: 0,
    aiRequests: 0,
    favoriteNotes: 0
  });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentMindmaps, setRecentMindmaps] = useState<any[]>([]);

  useEffect(() => {
    // Load real data from localStorage
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const mindmaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    const aiRequestCount = parseInt(localStorage.getItem('aiRequestCount') || '0');

    setStats({
      totalNotes: notes.length,
      totalMindmaps: mindmaps.length,
      aiRequests: aiRequestCount,
      favoriteNotes: notes.filter((note: any) => note.favorite).length
    });

    // Get recent notes (last 3)
    setRecentNotes(notes.slice(0, 3));
    setRecentMindmaps(mindmaps.slice(0, 3));
  }, []);

  const quickActions = [
    {
      title: "Yeni Not",
      description: "Hızlı not oluştur",
      icon: FileText,
      color: "blue",
      onClick: () => navigate("/notes")
    },
    {
      title: "Zihin Haritası",
      description: "Yeni harita oluştur",
      icon: GitBranch,
      color: "purple",
      onClick: () => navigate("/mindmaps")
    },
    {
      title: "AI Asistan",
      description: "AI ile sohbet et",
      icon: Sparkles,
      color: "amber",
      onClick: () => navigate("/ai-assistant")
    }
  ];

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
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/10 flex items-center justify-center group-hover:bg-${action.color}-500/20 transition-colors`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Not</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNotes}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>Aktif notlar</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Zihin Haritaları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMindmaps}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>Oluşturulan haritalar</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">AI İstekleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiRequests}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Toplam</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favori Notlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteNotes}</div>
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
              {recentNotes.length > 0 ? (
                recentNotes.map((note, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate("/notes")}
                  >
                    <div>
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {note.category || 'Genel'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz not oluşturulmamış
                </p>
              )}
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
              {recentMindmaps.length > 0 ? (
                recentMindmaps.map((map, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate("/mindmaps")}
                  >
                    <div>
                      <h4 className="font-medium">{map.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(map.createdAt || map.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                      {map.data?.nodes?.length || 0} düğüm
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz zihin haritası oluşturulmamış
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
