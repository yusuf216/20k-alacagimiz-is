
const OPENROUTER_API_KEY = "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";

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class AIService {
  private static async makeRequest(messages: Array<{role: string, content: string}>) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "MindFlow AI Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": messages,
          "temperature": 0.7,
          "max_tokens": 1000,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Üzgünüm, bir yanıt oluşturamadım.";
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('AI hizmetine bağlanırken bir hata oluştu.');
    }
  }

  static async sendMessage(message: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: "Sen MindFlow uygulamasının AI asistanısın. Kullanıcılara not alma, zihin haritası oluşturma ve içerik organize etme konularında yardım ediyorsun. Türkçe yanıt ver."
      },
      {
        role: "user",
        content: message
      }
    ];

    return await this.makeRequest(messages);
  }

  static async summarizeNote(noteContent: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: "Sen bir not özetleme uzmanısın. Verilen metni ana noktalarını koruyarak özetle. Türkçe yanıt ver."
      },
      {
        role: "user",
        content: `Lütfen şu notu özetler misin:\n\n${noteContent}`
      }
    ];

    return await this.makeRequest(messages);
  }

  static async generateMindMapSuggestions(topic: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: "Sen zihin haritası oluşturma uzmanısın. Verilen konu için zihin haritası önerileri sun. Türkçe yanıt ver."
      },
      {
        role: "user",
        content: `"${topic}" konusu için zihin haritası önerileri verebilir misin?`
      }
    ];

    return await this.makeRequest(messages);
  }

  static async improveContent(content: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: "Sen bir içerik geliştirme uzmanısın. Verilen metni daha iyi hale getir, düzenle ve geliştir. Türkçe yanıt ver."
      },
      {
        role: "user",
        content: `Lütfen şu içeriği geliştirir misin:\n\n${content}`
      }
    ];

    return await this.makeRequest(messages);
  }
}
