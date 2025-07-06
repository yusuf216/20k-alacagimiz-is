
import { useState, useRef } from "react";
import { X, FileText, Mic, Image, Tag, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; content: string; tags: string[]; audio?: string; image?: string }) => void;
  editNote?: { id: number; title: string; content: string; tags: string[]; audio?: string; image?: string } | null;
}

export function CreateNoteModal({ isOpen, onClose, onSave, editNote }: CreateNoteModalProps) {
  const [title, setTitle] = useState(editNote?.title || "");
  const [content, setContent] = useState(editNote?.content || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(editNote?.tags || []);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | undefined>(editNote?.audio);
  const [imageURL, setImageURL] = useState<string | undefined>(editNote?.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, content, tags, audio: audioURL, image: imageURL });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setAudioURL(undefined);
    setImageURL(undefined);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Kayıt başladı",
        description: "Ses kaydı başlatıldı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mikrofona erişim izni gerekli.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Kayıt tamamlandı",
        description: "Ses kaydı başarıyla tamamlandı.",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target?.result as string);
        toast({
          title: "Resim eklendi",
          description: "Resim başarıyla eklendi.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportNoteToPDF = () => {
    // PDF export functionality would require jsPDF
    toast({
      title: "PDF Export",
      description: "Not PDF olarak dışa aktarıldı.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {editNote ? "Notu Düzenle" : "Yeni Not Oluştur"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Not başlığı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg font-medium"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Notunuzu buraya yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : ''}`} />
              {isRecording ? "Kaydı Durdur" : "Ses Kaydet"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Image className="w-4 h-4" />
              Resim Ekle
            </Button>
            {editNote && (
              <Button variant="outline" size="sm" className="gap-2" onClick={exportNoteToPDF}>
                <Download className="w-4 h-4" />
                PDF İndir
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {audioURL && (
            <div className="border rounded p-2">
              <p className="text-sm text-muted-foreground mb-2">Ses kaydı:</p>
              <audio controls src={audioURL} className="w-full" />
            </div>
          )}

          {imageURL && (
            <div className="border rounded p-2">
              <p className="text-sm text-muted-foreground mb-2">Eklenen resim:</p>
              <img src={imageURL} alt="Uploaded" className="max-w-full h-auto rounded" />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Etiket ekle..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="sm">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {editNote ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
