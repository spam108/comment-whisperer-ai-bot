
import { TelegramConfig } from "./types";

export async function generateAIComment(config: TelegramConfig, text: string): Promise<string> {
  if (!config) return "Bot is not configured";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates thoughtful, relevant comments about text messages. Keep your responses concise and engaging."
          },
          {
            role: "user",
            content: `Please generate a thoughtful comment about this message: "${text}"`
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("Unexpected API response:", data);
      return "I couldn't generate a relevant comment.";
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
