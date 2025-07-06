
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, FileText, Lightbulb, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIService, AIMessage } from "./AIService";
import { useToast } from "@/hooks/use-toast";

export function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Ben MindFlow AI asistanınızım. Size not alma, zihin haritası oluşturma ve içerik geliştirme konularında yardımcı olabilirim. @notadı yazarak belirli notlarınızı mention edebilirsiniz. Nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableNotes, setAvailableNotes] = useState<any[]>([]);
  const [availableMindmaps, setAvailableMindmaps] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load notes and mindmaps for mentions
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const mindmaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    setAvailableNotes(notes);
    setAvailableMindmaps(mindmaps);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMentions = (message: string) => {
    // Process @mentions for notes and mindmaps
    const mentionRegex = /@(\w+)/g;
    let processedMessage = message;
    const mentions = message.match(mentionRegex);
    
    if (mentions) {
      mentions.forEach(mention => {
        const itemName = mention.substring(1); // Remove @
        
        // Find matching note
        const note = availableNotes.find(n => 
          n.title.toLowerCase().includes(itemName.toLowerCase())
        );
        
        // Find matching mindmap
        const mindmap = availableMindmaps.find(m => 
          m.title.toLowerCase().includes(itemName.toLowerCase())
        );
        
        if (note) {
          processedMessage += `\n\n[Not: ${note.title}]\nİçerik: ${note.content.substring(0, 500)}...`;
        }
        
        if (mindmap) {
          processedMessage += `\n\n[Zihin Haritası: ${mindmap.title}]\nDüğüm sayısı: ${mindmap.data?.nodes?.length || 0}`;
        }
      });
    }
    
    return processedMessage;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const processedInput = processMentions(inputMessage);
    
    const userMessage: AIMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Increment AI request counter
    const currentCount = parseInt(localStorage.getItem('aiRequestCount') || '0');
    localStorage.setItem('aiRequestCount', (currentCount + 1).toString());

    try {
      const response = await AIService.sendMessage(processedInput);
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Hata",
        description: "AI servisi ile bağlantı kurulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    {
      icon: FileText,
      title: "Not özetle",
      description: "Notlarınızı özetletin",
      prompt: "Notlarımı özetleyebilir misin? @"
    },
    {
      icon: Lightbulb,
      title: "Fikir geliştir",
      description: "Mevcut fikirlerinizi genişletin",
      prompt: "Bir proje fikri geliştirmem için yardım edebilir misin?"
    },
    {
      icon: Brain,
      title: "Zihin haritası öner",
      description: "Konular arası bağlantıları keşfedin",
      prompt: "Bir konu için zihin haritası önerisi verebilir misin?"
    }
  ];

  const handleSuggestionClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Asistan</h1>
              <p className="text-muted-foreground">
                Akıllı asistanınız ile sohbet edin ve verimliliğinizi artırın
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => handleSuggestionClick(suggestion.prompt)}
                  >
                    <div className="flex items-start gap-3">
                      <suggestion.icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Available Notes for Mentions */}
            {availableNotes.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Notlarım</CardTitle>
                  <CardDescription className="text-xs">
                    @notadı yazarak mention edebilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {availableNotes.slice(0, 5).map((note, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => setInputMessage(prev => prev + `@${note.title.replace(/\s+/g, '')}`)}
                    >
                      {note.title}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">MindFlow AI</CardTitle>
                    <CardDescription className="text-xs">
                      {isLoading ? "Düşünüyor..." : "Aktif • Size yardımcı olmaya hazır"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {message.role === 'assistant' ? (
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                            AI
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            K
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block p-3 rounded-2xl max-w-[80%] ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="inline-block p-3 rounded-2xl bg-muted">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="AI'ya bir soru sorun veya @notadı ile mention yapın..."
                    className="flex-1"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Button 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  AI'ya sorularınızı sorun, @notadı ile notlarınızı mention edin.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
