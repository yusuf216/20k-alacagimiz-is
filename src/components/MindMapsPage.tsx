
import { useState, useEffect } from "react";
import { Plus, Search, Filter, GitBranch, Calendar, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MindMapCanvas } from "./MindMapCanvas";

interface MindMap {
  id: number;
  title: string;
  description: string;
  nodes: number;
  date: string;
  collaborators: number;
  data?: any;
}

export function MindMapsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);

  useEffect(() => {
    const savedMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    setMindmaps(savedMaps.map((map: any) => ({
      id: map.id,
      title: map.title,
      description: map.description || "Zihin haritası açıklaması",
      nodes: map.data?.nodes?.length || 0,
      date: map.createdAt || new Date().toISOString().split('T')[0],
      collaborators: 1,
      data: map.data
    })));
  }, [isCreating]);

  const filteredMindmaps = mindmaps.filter(map =>
    map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    map.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating) {
    return (
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex items-center gap-4 p-4 border-b bg-background">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCreating(false)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </Button>
          <h2 className="text-lg font-semibold">Yeni Zihin Haritası</h2>
        </div>
        <MindMapCanvas />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zihin Haritaları</h1>
            <p className="text-muted-foreground">
              Fikirlerinizi görselleştirin ve bağlantıları keşfedin ({mindmaps.length} harita)
            </p>
          </div>
          <Button 
            className="gap-2 h-10"
            onClick={() => setIsCreating(true)}
          >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>

        {/* Mind Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMindmaps.map((mindmap) => (
            <Card 
              key={mindmap.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => setIsCreating(true)}
            >
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

        {/* Empty State */}
        {filteredMindmaps.length === 0 && !searchTerm && (
          <Card 
            className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setIsCreating(true)}
          >
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                <GitBranch className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">İlk zihin haritanızı oluşturun</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Fikirlerinizi organize edin, bağlantıları keşfedin ve yaratıcılığınızı serbest bırakın
              </p>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Harita Oluştur
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredMindmaps.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              "{searchTerm}" için sonuç bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
