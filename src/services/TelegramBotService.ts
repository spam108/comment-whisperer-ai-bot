
import { toast } from "sonner";
import { TelegramConfig, TelegramUpdate } from "./telegram/types";
import { validateBotToken, fetchTelegramUpdates } from "./telegram/api";
import { handleCommand } from "./telegram/commandHandler";

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
      validateBotToken(config.token)
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
      const data = await fetchTelegramUpdates(this.config.token, this.lastUpdateId);
      
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

  private async processUpdate(update: TelegramUpdate): Promise<void> {
    if (!this.config) return;
    
    // Only process messages that contain text
    if (update.message && update.message.text) {
      const { message } = update;
      
      // Check if it's a command
      if (message.text.startsWith('/')) {
        await handleCommand(this.config, message);
      }
    }
  }
}

export type { TelegramConfig };
export const telegramBotService = new TelegramBotService();
