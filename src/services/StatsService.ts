
import { Stats, Activity } from "@/utils/telegramTypes";

class StatsService {
  private stats: Stats = {
    totalMessages: 0,
    messagesPerDay: 0,
    commandsUsed: 0,
    aiResponsesGenerated: 0,
    recentActivity: []
  };

  constructor() {
    this.loadStats();
  }

  public incrementTotalMessages(): void {
    this.stats.totalMessages += 1;
    this.stats.messagesPerDay += 1;
    this.saveStats();
  }

  public incrementCommandsUsed(): void {
    this.stats.commandsUsed += 1;
    this.saveStats();
  }

  public incrementAIResponses(): void {
    this.stats.aiResponsesGenerated += 1;
    this.saveStats();
  }

  public addActivity(action: string): void {
    const newActivity: Activity = {
      timestamp: new Date().toISOString(),
      action
    };

    // Add to the beginning of the array
    this.stats.recentActivity = [newActivity, ...this.stats.recentActivity].slice(0, 20);
    this.saveStats();
  }

  public getStats(): Stats {
    return { ...this.stats };
  }

  public resetDailyStats(): void {
    this.stats.messagesPerDay = 0;
    this.saveStats();
  }

  private saveStats(): void {
    try {
      localStorage.setItem('telegram_bot_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  }

  private loadStats(): void {
    try {
      const savedStats = localStorage.getItem('telegram_bot_stats');
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }
}

export const statsService = new StatsService();
