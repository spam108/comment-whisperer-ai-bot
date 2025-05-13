
import { Command, Stats, Activity } from './telegramTypes';

// Mock commands for demonstration
export const mockCommands: Command[] = [
  {
    command: "/start",
    description: "Initialize the bot and see welcome message",
    category: "Basic",
    example: "/start"
  },
  {
    command: "/help",
    description: "Show available commands and their descriptions",
    category: "Basic",
    example: "/help"
  },
  {
    command: "/comment",
    description: "Generate an AI comment on the replied message",
    category: "AI",
    example: "/comment"
  },
  {
    command: "/stats",
    description: "Display your usage statistics",
    category: "Admin",
    example: "/stats"
  },
  {
    command: "/settings",
    description: "Configure bot settings for this chat",
    category: "Admin",
    example: "/settings"
  }
];

// Generate sample recent activity
const now = new Date();
const generateRecentActivity = (): Activity[] => {
  const activities: Activity[] = [];
  for (let i = 0; i < 5; i++) {
    const pastDate = new Date(now);
    pastDate.setMinutes(now.getMinutes() - i * 15);
    
    const actions = [
      "Bot responded to comment request",
      "User requested AI comment",
      "New user joined",
      "Settings updated",
      "Command executed: /help"
    ];
    
    activities.push({
      timestamp: pastDate.toISOString(),
      action: actions[i % actions.length]
    });
  }
  return activities;
};

// Mock statistics for demonstration
export const mockStats: Stats = {
  totalMessages: 1254,
  messagesPerDay: 42,
  commandsUsed: 568,
  aiResponsesGenerated: 327,
  recentActivity: generateRecentActivity()
};
