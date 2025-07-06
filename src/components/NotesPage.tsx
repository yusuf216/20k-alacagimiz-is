
import { Plus, Search, Filter, FileText, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function NotesPage() {
  const notes = [
    {
      id: 1,
      title: "Proje Toplantısı Notları",
      content: "Bugünkü toplantıda projenin son durumu görüşüldü...",
      tags: ["İş", "Toplantı"],
      date: "2024-01-15",
      category: "work"
    },
    {
      id: 2,
      title: "Haftalık Planlama",
      content: "Bu hafta tamamlanması gereken görevler...",
      tags: ["Kişisel", "Planlama"],
      date: "2024-01-14",
      category: "personal"
    },
    {
      id: 3,
      title: "AI Öğrenme Yolculuğu",
      content: "Makine öğrenmesi hakkında öğrendiklerim...",
      tags: ["Eğitim", "AI", "Teknoloji"],
      date: "2024-01-12",
      category: "education"
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notlar</h1>
            <p className="text-muted-foreground">
              Tüm notlarınızı buradan yönetebilirsiniz
            </p>
          </div>
          <Button className="gap-2 h-10">
            <Plus className="w-4 h-4" />
            Yeni Not
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Notlarda ara..." 
              className="pl-9 h-10"
            />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {note.content}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for more notes */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Plus className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Yeni not oluştur</h3>
            <p className="text-muted-foreground mb-4">
              Fikirlerinizi kaydetmek için yeni bir not oluşturun
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Not Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
