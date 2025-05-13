
export interface Command {
  command: string;
  description: string;
  category: string;
  example?: string;
}

export interface Activity {
  timestamp: string;
  action: string;
}

export interface Stats {
  totalMessages: number;
  messagesPerDay: number;
  commandsUsed: number;
  aiResponsesGenerated: number;
  recentActivity: Activity[];
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface BotConfig {
  telegramToken: string;
  openaiApiKey: string;
  autoReply: boolean;
  defaultModel: string;
}
