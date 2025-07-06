
const API_KEY = "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";

interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  static async chat(message: string): Promise<string> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "MindFlow AI Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": [
            {
              "role": "user",
              "content": message
            }
          ],
          "temperature": 0.7,
          "max_tokens": 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || "Üzgünüm, bir hata oluştu.";
    } catch (error) {
      console.error('AI Service Error:', error);
      return "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
    }
  }

  static async summarizeNote(noteContent: string, noteTitle: string): Promise<string> {
    const prompt = `"${noteTitle}" başlıklı şu notu özetle:\n\n${noteContent}`;
    return this.chat(prompt);
  }

  static async generateIdeas(topic: string): Promise<string> {
    const prompt = `"${topic}" konusu hakkında yaratıcı fikirler ve öneriler ver.`;
    return this.chat(prompt);
  }

  static async suggestMindMapNodes(topic: string): Promise<string> {
    const prompt = `"${topic}" konusu için zihin haritası düğümleri öner. Her düğüm için kısa açıklamalar da ekle.`;
    return this.chat(prompt);
  }
}
