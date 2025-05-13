
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { testOpenAIKey, testTelegramToken } from "@/utils/connectionUtils";

interface ConfigFormProps {
  onConnect: (telegramToken: string, openaiKey: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

const ConfigForm = ({ onConnect, onDisconnect, isConnected }: ConfigFormProps) => {
  const [telegramToken, setTelegramToken] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!telegramToken.trim()) {
        setError("Telegram Bot Token is required");
        return;
      }

      if (!openaiKey.trim()) {
        setError("OpenAI API Key is required");
        return;
      }

      // Test the Telegram token
      const isTelegramValid = await testTelegramToken(telegramToken);
      if (!isTelegramValid) {
        setError("Invalid Telegram Bot Token");
        setIsLoading(false);
        return;
      }

      // Test the OpenAI key
      const isOpenAIValid = await testOpenAIKey(openaiKey);
      if (!isOpenAIValid) {
        setError("Invalid OpenAI API Key");
        setIsLoading(false);
        return;
      }

      onConnect(telegramToken, openaiKey);
    } catch (error) {
      setError("Connection failed. Please check your credentials.");
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="telegram-token">Telegram Bot Token</Label>
        <div className="relative">
          <Input
            id="telegram-token"
            type={showTelegramToken ? "text" : "password"}
            placeholder="Enter your bot token"
            value={telegramToken}
            onChange={(e) => setTelegramToken(e.target.value)}
            disabled={isConnected || isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowTelegramToken(!showTelegramToken)}
            disabled={isConnected || isLoading}
          >
            {showTelegramToken ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Get this from BotFather on Telegram
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="openai-key">OpenAI API Key</Label>
        <div className="relative">
          <Input
            id="openai-key"
            type={showOpenaiKey ? "text" : "password"}
            placeholder="Enter your OpenAI API key"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            disabled={isConnected || isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowOpenaiKey(!showOpenaiKey)}
            disabled={isConnected || isLoading}
          >
            {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Get this from your OpenAI dashboard
        </p>
      </div>

      <div className="pt-2">
        {isConnected ? (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDisconnect}
            className="w-full"
            disabled={isLoading}
          >
            Disconnect Bot
          </Button>
        ) : (
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Bot"
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ConfigForm;
