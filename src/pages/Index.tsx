
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ConfigForm from "@/components/ConfigForm";
import BotStatus from "@/components/BotStatus";
import CommandList from "@/components/CommandList";
import StatsDisplay from "@/components/StatsDisplay";
import { mockCommands } from "@/utils/mockData";
import { telegramBotService } from "@/services/TelegramBotService";
import { statsService } from "@/services/StatsService";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [stats, setStats] = useState(statsService.getStats());

  useEffect(() => {
    // Check if token and API key are stored in localStorage
    const savedToken = localStorage.getItem('telegram_bot_token');
    const savedApiKey = localStorage.getItem('openai_api_key');
    
    if (savedToken && savedApiKey) {
      setToken(savedToken);
      setApiKey(savedApiKey);
      // Auto-connect if credentials are available
      handleConnect(savedToken, savedApiKey);
    }
    
    // Set up a timer to refresh stats
    const statsInterval = setInterval(() => {
      setStats(statsService.getStats());
    }, 5000);
    
    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  const handleConnect = async (telegramToken: string, openaiKey: string) => {
    try {
      const connected = await telegramBotService.connect({
        token: telegramToken,
        openaiApiKey: openaiKey
      });
      
      if (connected) {
        setIsConnected(true);
        setToken(telegramToken);
        setApiKey(openaiKey);
        
        // Save credentials to localStorage
        localStorage.setItem('telegram_bot_token', telegramToken);
        localStorage.setItem('openai_api_key', openaiKey);
        
        // Log activity
        statsService.addActivity("Bot connected");
        
        // Update stats immediately
        setStats(statsService.getStats());
      }
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error("Failed to connect the bot");
    }
  };

  const handleDisconnect = () => {
    telegramBotService.disconnect();
    setIsConnected(false);
    
    // Log activity
    statsService.addActivity("Bot disconnected");
    
    // Update stats immediately
    setStats(statsService.getStats());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Telegram AI Comment Bot</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Config and Status */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
                <CardDescription>Set up your bot credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigForm 
                  onConnect={handleConnect} 
                  onDisconnect={handleDisconnect} 
                  isConnected={isConnected}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <BotStatus isConnected={isConnected} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column - Commands and Stats */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="commands">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="commands">
              <Card>
                <CardHeader>
                  <CardTitle>Available Commands</CardTitle>
                  <CardDescription>Commands your bot can respond to</CardDescription>
                </CardHeader>
                <CardContent>
                  <CommandList commands={mockCommands} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>Bot activity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsDisplay stats={stats} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
