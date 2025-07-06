
import { useState, useEffect } from "react";
import { Plus, Search, Filter, FileText, Calendar, Tag, Eye, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateNoteModal } from "./CreateNoteModal";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import jsPDF from 'jspdf';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  date: string;
  category: string;
  audio?: string;
  image?: string;
}

export function NotesPage() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
    
    // Check if we should open create modal
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('create') === 'true') {
      setIsModalOpen(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = (noteData: { title: string; content: string; tags: string[]; audio?: string; image?: string }) => {
    const newNote: Note = {
      id: Date.now(),
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags,
      date: new Date().toISOString().split('T')[0],
      category: "personal",
      audio: noteData.audio,
      image: noteData.image
    };
    const updatedNotes = [newNote, ...notes];
    saveNotesToStorage(updatedNotes);
    toast({
      title: "Not oluşturuldu",
      description: "Yeni not başarıyla oluşturuldu.",
    });
  };

  const handleUpdateNote = (noteData: { title: string; content: string; tags: string[]; audio?: string; image?: string }) => {
    if (!editingNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...noteData, date: new Date().toISOString().split('T')[0] }
        : note
    );
    saveNotesToStorage(updatedNotes);
    setEditingNote(null);
    toast({
      title: "Not güncellendi",
      description: "Not başarıyla güncellendi.",
    });
  };

  const exportNoteToPDF = (note: Note) => {
    try {
      const doc = new jsPDF();
      
      // Başlık
      doc.setFontSize(20);
      doc.text(note.title, 20, 30);
      
      // Tarih
      doc.setFontSize(12);
      doc.text(`Tarih: ${new Date(note.date).toLocaleDateString('tr-TR')}`, 20, 45);
      
      // Etiketler
      if (note.tags.length > 0) {
        doc.text(`Etiketler: ${note.tags.join(', ')}`, 20, 55);
      }
      
      // İçerik
      doc.setFontSize(11);
      const splitContent = doc.splitTextToSize(note.content, 170);
      doc.text(splitContent, 20, 70);
      
      // PDF dosyasını indir
      const fileName = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "PDF İndirildi",
        description: `"${note.title}" notu PDF olarak indirildi.`,
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Hata",
        description: "PDF indirme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (viewingNote) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setViewingNote(null)}>
              ← Geri Dön
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingNote(viewingNote);
                  setViewingNote(null);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportNoteToPDF(viewingNote)}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF İndir
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{viewingNote.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(viewingNote.date).toLocaleDateString('tr-TR')}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-wrap">{viewingNote.content}</div>
              
              {viewingNote.audio && (
                <div>
                  <p className="text-sm font-medium mb-2">Ses kaydı:</p>
                  <audio controls src={viewingNote.audio} className="w-full" />
                </div>
              )}
              
              {viewingNote.image && (
                <div>
                  <p className="text-sm font-medium mb-2">Resim:</p>
                  <img src={viewingNote.image} alt="Note attachment" className="max-w-full h-auto rounded" />
                </div>
              )}
              
              {viewingNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {viewingNote.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notlar</h1>
            <p className="text-muted-foreground">
              Tüm notlarınızı buradan yönetebilirsiniz ({notes.length} not)
            </p>
          </div>
          <Button 
            className="gap-2 h-10"
            onClick={() => setIsModalOpen(true)}
          >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-all duration-200 group">
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
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-1"
                    onClick={() => setViewingNote(note)}
                  >
                    <Eye className="w-4 h-4" />
                    Görüntüle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportNoteToPDF(note)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && !searchTerm && (
          <Card 
            className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Plus className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">İlk notunuzu oluşturun</h3>
              <p className="text-muted-foreground mb-4">
                Fikirlerinizi kaydetmek için yeni bir not oluşturun
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Not Oluştur
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredNotes.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              "{searchTerm}" için sonuç bulunamadı.
            </p>
          </div>
        )}
      </div>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        editNote={editingNote}
      />
    </div>
  );
}
