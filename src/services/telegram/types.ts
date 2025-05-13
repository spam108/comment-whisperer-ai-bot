
export interface TelegramConfig {
  token: string;
  openaiApiKey: string;
}

export interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  reply_to_message?: {
    text?: string;
  };
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}
