
import { toast } from "sonner";

export interface TelegramConfig {
  token: string;
  openaiApiKey: string;
}

class TelegramBotService {
  private config: TelegramConfig | null = null;
  private polling = false;
  private lastUpdateId = 0;
  private pollInterval: NodeJS.Timeout | null = null;
  
  public get isConnected(): boolean {
    return this.polling && this.config !== null;
  }

  public connect(config: TelegramConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.config = config;
      
      // Validate the bot token by making a getMe request
      fetch(`https://api.telegram.org/bot${config.token}/getMe`)
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            console.log("Bot connected successfully:", data.result);
            this.startPolling();
            toast.success(`Connected to bot: ${data.result.username}`);
            resolve(true);
          } else {
            console.error("Failed to connect bot:", data);
            toast.error("Invalid Telegram bot token");
            this.config = null;
            reject(new Error(data.description || "Failed to connect"));
          }
        })
        .catch(error => {
          console.error("Error connecting to Telegram:", error);
          toast.error("Failed to connect to Telegram");
          this.config = null;
          reject(error);
        });
    });
  }

  public disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.polling = false;
    this.config = null;
    this.lastUpdateId = 0;
    toast.info("Bot disconnected");
  }

  private startPolling(): void {
    if (!this.config || this.polling) return;
    
    this.polling = true;
    // Poll for updates every 2 seconds
    this.pollInterval = setInterval(() => this.fetchUpdates(), 2000);
  }

  private async fetchUpdates(): Promise<void> {
    if (!this.config) return;
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.token}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=1`
      );
      
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        console.log("Received updates:", data.result);
        
        // Process each update
        for (const update of data.result) {
          await this.processUpdate(update);
          // Update the last processed update ID
          this.lastUpdateId = update.update_id;
        }
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  }

  private async processUpdate(update: any): Promise<void> {
    if (!this.config) return;
    
    // Only process messages that contain text
    if (update.message && update.message.text) {
      const { message } = update;
      
      // Check if it's a command
      if (message.text.startsWith('/')) {
        await this.handleCommand(message);
      }
    }
  }

  private async handleCommand(message: any): Promise<void> {
    if (!this.config) return;
    
    const command = message.text.split(' ')[0].substring(1).toLowerCase();
    
    switch (command) {
      case 'start':
        await this.sendMessage(
          message.chat.id,
          "Hello! I'm your AI Comment Bot. Reply to any message with /comment to get an AI-generated comment."
        );
        break;
        
      case 'help':
        await this.sendMessage(
          message.chat.id,
          "Available commands:\n" +
          "/start - Initialize the bot\n" +
          "/help - Show this help message\n" +
          "/comment - Generate an AI comment on a replied message\n" +
          "/stats - Show usage statistics\n" +
          "/settings - Configure bot settings"
        );
        break;
        
      case 'comment':
        await this.handleCommentCommand(message);
        break;
        
      case 'stats':
        await this.sendMessage(
          message.chat.id,
          "Statistics feature coming soon!"
        );
        break;
        
      case 'settings':
        await this.sendMessage(
          message.chat.id,
          "Settings feature coming soon!"
        );
        break;
        
      default:
        await this.sendMessage(
          message.chat.id,
          "Unknown command. Type /help for a list of commands."
        );
    }
  }

  private async handleCommentCommand(message: any): Promise<void> {
    if (!this.config) return;
    
    // Check if the message is a reply
    if (!message.reply_to_message) {
      await this.sendMessage(
        message.chat.id,
        "Please reply to a message with /comment to generate a comment."
      );
      return;
    }

    const targetMessage = message.reply_to_message.text;
    if (!targetMessage) {
      await this.sendMessage(
        message.chat.id,
        "I can only comment on text messages."
      );
      return;
    }

    await this.sendMessage(message.chat.id, "Generating comment...");

    try {
      // Call OpenAI API to generate a comment
      const aiResponse = await this.generateAIComment(targetMessage);
      await this.sendMessage(message.chat.id, aiResponse);
    } catch (error) {
      console.error("Error generating AI comment:", error);
      await this.sendMessage(
        message.chat.id,
        "Sorry, I couldn't generate a comment at this time."
      );
    }
  }

  private async generateAIComment(text: string): Promise<string> {
    if (!this.config) return "Bot is not configured";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.openaiApiKey}`
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

  private async sendMessage(chatId: number, text: string): Promise<void> {
    if (!this.config) return;
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.token}/sendMessage`,
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
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

export const telegramBotService = new TelegramBotService();
