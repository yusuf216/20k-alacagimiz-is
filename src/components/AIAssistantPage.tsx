
import { Send, Sparkles, MessageCircle, Lightbulb, FileText, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AIAssistantPage() {
  const suggestions = [
    {
      icon: FileText,
      title: "Not özetle",
      description: "Uzun notlarınızı özetletin"
    },
    {
      icon: Lightbulb,
      title: "Fikir geliştir",
      description: "Mevcut fikirlerinizi genişletin"
    },
    {
      icon: Brain,
      title: "Zihin haritası öner",
      description: "Konular arası bağlantıları keşfedin"
    }
  ];

  const conversations = [
    {
      id: 1,
      message: "Merhaba! Size nasıl yardımcı olabilirim?",
      sender: "ai",
      time: "Şimdi"
    },
    {
      id: 2,
      message: "Proje notlarımı özetleyebilir misin?",
      sender: "user",
      time: "2 dk önce"
    },
    {
      id: 3,
      message: "Tabii ki! Proje notlarınızı analiz ettim. İşte önemli noktalar: 1) Proje timeline'ı belirlendi 2) Takım görevleri dağıtıldı 3) İlk milestone 15 Şubat olarak planlandı...",
      sender: "ai",
      time: "2 dk önce"
    }
  ];

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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Son Sohbetler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Proje özetleme",
                  "Zihin haritası önerisi",
                  "Not kategorilendirme"
                ].map((chat, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer text-sm"
                  >
                    {chat}
                  </div>
                ))}
              </CardContent>
            </Card>
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
                      Aktif • Size yardımcı olmaya hazır
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex gap-3 ${
                        conversation.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {conversation.sender === 'ai' ? (
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                            AI
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            K
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`flex-1 space-y-1 ${conversation.sender === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block p-3 rounded-2xl max-w-[80%] ${
                            conversation.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{conversation.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="AI'ya bir soru sorun veya yardım isteyin..."
                    className="flex-1"
                  />
                  <Button size="icon" className="h-10 w-10">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  AI'ya sorularınızı sorun, notlarınızı özetlettin veya yeni fikirler geliştirin.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
