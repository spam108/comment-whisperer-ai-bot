
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
import { botAccountsManager, BotAccount } from "@/services/BotAccountsManager";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(statsService.getStats());
  const [accounts, setAccounts] = useState<BotAccount[]>([]);

  useEffect(() => {
    // Load accounts and check for active account
    const loadedAccounts = botAccountsManager.getAccounts();
    setAccounts(loadedAccounts);
    
    const activeAccount = botAccountsManager.getActiveAccount();
    if (activeAccount) {
      // Auto-connect active account
      handleActivateAccount(activeAccount.id);
    }
    
    // Set up a timer to refresh stats
    const statsInterval = setInterval(() => {
      setStats(statsService.getStats());
      setIsConnected(telegramBotService.isConnected);
    }, 5000);
    
    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  const handleActivateAccount = async (accountId: string) => {
    try {
      const success = await botAccountsManager.activateAccount(accountId);
      
      if (success) {
        setIsConnected(true);
        
        // Log activity
        statsService.addActivity("Bot connected");
        
        // Update stats immediately
        setStats(statsService.getStats());
        
        // Update accounts list
        setAccounts(botAccountsManager.getAccounts());
      }
    } catch (error) {
      console.error("Activation failed:", error);
      toast.error("Failed to activate the bot");
    }
  };

  const handleAccountsChange = () => {
    // Update accounts list
    setAccounts(botAccountsManager.getAccounts());
    
    // Check if connection status changed
    setIsConnected(telegramBotService.isConnected);
    
    // Update stats
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
                <CardDescription>Set up your bot accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigForm 
                  onAccountsChange={handleAccountsChange}
                  accounts={accounts}
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
