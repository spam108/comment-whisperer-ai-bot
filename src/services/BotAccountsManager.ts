
import { toast } from "sonner";
import { telegramBotService, TelegramConfig } from "@/services/TelegramBotService";

export interface BotAccount {
  id: string;
  name: string;
  token: string;
  openaiApiKey: string;
  isActive: boolean;
}

class BotAccountsManager {
  private accounts: BotAccount[] = [];
  private activeAccountId: string | null = null;

  constructor() {
    this.loadAccounts();
  }

  public getAccounts(): BotAccount[] {
    return [...this.accounts];
  }

  public getActiveAccount(): BotAccount | null {
    if (!this.activeAccountId) return null;
    return this.accounts.find(account => account.id === this.activeAccountId) || null;
  }

  public async addAccount(name: string, token: string, openaiApiKey: string): Promise<BotAccount> {
    // Check if account with the same token already exists
    if (this.accounts.some(account => account.token === token)) {
      throw new Error("A bot with this token already exists");
    }

    const newAccount: BotAccount = {
      id: Date.now().toString(),
      name,
      token,
      openaiApiKey,
      isActive: false
    };

    this.accounts.push(newAccount);
    this.saveAccounts();
    
    toast.success(`Bot account "${name}" added successfully`);
    return newAccount;
  }

  public removeAccount(id: string): void {
    // If removing active account, disconnect it first
    if (id === this.activeAccountId) {
      telegramBotService.disconnect();
      this.activeAccountId = null;
    }

    this.accounts = this.accounts.filter(account => account.id !== id);
    this.saveAccounts();
    
    toast.info("Bot account removed");
  }

  public async activateAccount(id: string): Promise<boolean> {
    const account = this.accounts.find(acc => acc.id === id);
    if (!account) {
      toast.error("Account not found");
      return false;
    }

    // Disconnect current bot if there is one
    if (this.activeAccountId) {
      telegramBotService.disconnect();
    }

    try {
      // Connect the new bot
      const connected = await telegramBotService.connect({
        token: account.token,
        openaiApiKey: account.openaiApiKey
      });

      if (connected) {
        // Update active status for all accounts
        this.accounts = this.accounts.map(acc => ({
          ...acc,
          isActive: acc.id === id
        }));
        
        this.activeAccountId = id;
        this.saveAccounts();
        toast.success(`Bot "${account.name}" is now active`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to activate account:", error);
      toast.error("Failed to activate bot account");
      return false;
    }
  }

  private saveAccounts(): void {
    try {
      localStorage.setItem('telegram_bot_accounts', JSON.stringify({
        accounts: this.accounts,
        activeAccountId: this.activeAccountId
      }));
    } catch (error) {
      console.error("Failed to save bot accounts:", error);
    }
  }

  private loadAccounts(): void {
    try {
      const savedData = localStorage.getItem('telegram_bot_accounts');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.accounts = data.accounts || [];
        this.activeAccountId = data.activeAccountId || null;
      }
    } catch (error) {
      console.error("Failed to load bot accounts:", error);
    }
  }
}

export const botAccountsManager = new BotAccountsManager();
