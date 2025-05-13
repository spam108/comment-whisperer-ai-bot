
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigForm from "@/components/ConfigForm";
import BotStatus from "@/components/BotStatus";
import CommandList from "@/components/CommandList";
import StatsDisplay from "@/components/StatsDisplay";
import { mockStats, mockCommands } from "@/utils/mockData";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleConnect = (telegramToken: string, openaiKey: string) => {
    // In a real implementation, this would validate and establish connections
    setToken(telegramToken);
    setApiKey(openaiKey);
    setIsConnected(true);
    console.log("Connecting with token:", telegramToken, "and API key:", openaiKey);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    console.log("Bot disconnected");
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
                  <StatsDisplay stats={mockStats} />
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
