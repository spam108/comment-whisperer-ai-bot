
import { TelegramConfig, TelegramMessage } from "./types";
import { sendTelegramMessage } from "./api";
import { generateAIComment } from "./aiService";

export async function handleCommand(
  config: TelegramConfig,
  message: TelegramMessage
): Promise<void> {
  if (!config) return;
  
  const command = message.text!.split(' ')[0].substring(1).toLowerCase();
  
  switch (command) {
    case 'start':
      await sendTelegramMessage(
        config,
        message.chat.id,
        "Hello! I'm your AI Comment Bot. Reply to any message with /comment to get an AI-generated comment."
      );
      break;
      
    case 'help':
      await sendTelegramMessage(
        config,
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
      await handleCommentCommand(config, message);
      break;
      
    case 'stats':
      await sendTelegramMessage(
        config,
        message.chat.id,
        "Statistics feature coming soon!"
      );
      break;
      
    case 'settings':
      await sendTelegramMessage(
        config,
        message.chat.id,
        "Settings feature coming soon!"
      );
      break;
      
    default:
      await sendTelegramMessage(
        config,
        message.chat.id,
        "Unknown command. Type /help for a list of commands."
      );
  }
}

async function handleCommentCommand(
  config: TelegramConfig,
  message: TelegramMessage
): Promise<void> {
  if (!config) return;
  
  // Check if the message is a reply
  if (!message.reply_to_message) {
    await sendTelegramMessage(
      config,
      message.chat.id,
      "Please reply to a message with /comment to generate a comment."
    );
    return;
  }

  const targetMessage = message.reply_to_message.text;
  if (!targetMessage) {
    await sendTelegramMessage(
      config,
      message.chat.id,
      "I can only comment on text messages."
    );
    return;
  }

  await sendTelegramMessage(config, message.chat.id, "Generating comment...");

  try {
    // Call OpenAI API to generate a comment
    const aiResponse = await generateAIComment(config, targetMessage);
    await sendTelegramMessage(config, message.chat.id, aiResponse);
  } catch (error) {
    console.error("Error generating AI comment:", error);
    await sendTelegramMessage(
      config,
      message.chat.id,
      "Sorry, I couldn't generate a comment at this time."
    );
  }
}
