
import { TelegramConfig } from "./types";
import { toast } from "sonner";

export async function validateBotToken(token: string): Promise<any> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    return await response.json();
  } catch (error) {
    console.error("Error validating bot token:", error);
    throw error;
  }
}

export async function sendTelegramMessage(
  config: TelegramConfig,
  chatId: number,
  text: string
): Promise<boolean> {
  if (!config) return false;
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error("Failed to send message:", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}

export async function fetchTelegramUpdates(
  token: string,
  lastUpdateId: number
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=1`
    );
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching updates:", error);
    throw error;
  }
}
