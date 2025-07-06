
import { Plus, Search, Filter, GitBranch, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MindMapsPage() {
  const mindmaps = [
    {
      id: 1,
      title: "Proje Mimarisi",
      description: "Yeni projenin teknik mimarisi ve bileşenleri",
      nodes: 12,
      date: "2024-01-15",
      collaborators: 3
    },
    {
      id: 2,
      title: "Öğrenme Rotası",
      description: "Yazılım geliştirme öğrenme yol haritası",
      nodes: 8,
      date: "2024-01-13",
      collaborators: 1
    },
    {
      id: 3,
      title: "İş Fikirleri",
      description: "Potansiyel iş fikirleri ve değerlendirmeler",
      nodes: 6,
      date: "2024-01-10",
      collaborators: 2
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zihin Haritaları</h1>
            <p className="text-muted-foreground">
              Fikirlerinizi görselleştirin ve bağlantıları keşfedin
            </p>
          </div>
          <Button className="gap-2 h-10">
            <Plus className="w-4 h-4" />
            Yeni Harita
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Zihin haritalarında ara..." 
              className="pl-9 h-10"
            />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>

        {/* Mind Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mindmaps.map((mindmap) => (
            <Card key={mindmap.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <GitBranch className="w-5 h-5 text-purple-500" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(mindmap.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {mindmap.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {mindmap.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {mindmap.nodes} düğüm
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {mindmap.collaborators}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Canvas Preview */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
              <GitBranch className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Yeni zihin haritası oluştur</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Fikirlerinizi organize edin, bağlantıları keşfedin ve yaratıcılığınızı serbest bırakın
            </p>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Harita Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
