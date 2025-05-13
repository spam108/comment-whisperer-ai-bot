
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { testOpenAIKey, testTelegramToken } from "@/utils/connectionUtils";
import { botAccountsManager, BotAccount } from "@/services/BotAccountsManager";

interface ConfigFormProps {
  onAccountsChange: () => void;
  accounts: BotAccount[];
}

const ConfigForm = ({ onAccountsChange, accounts }: ConfigFormProps) => {
  const [botName, setBotName] = useState("");
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
      if (!botName.trim()) {
        setError("Bot name is required");
        setIsLoading(false);
        return;
      }

      if (!telegramToken.trim()) {
        setError("Telegram Bot Token is required");
        setIsLoading(false);
        return;
      }

      if (!openaiKey.trim()) {
        setError("OpenAI API Key is required");
        setIsLoading(false);
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

      await botAccountsManager.addAccount(botName, telegramToken, openaiKey);
      
      // Clear form
      setBotName("");
      setTelegramToken("");
      setOpenaiKey("");
      
      // Notify parent component about the change
      onAccountsChange();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to add bot account");
      }
      console.error("Add account error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateBot = async (accountId: string) => {
    setIsLoading(true);
    try {
      await botAccountsManager.activateAccount(accountId);
      onAccountsChange();
    } catch (error) {
      console.error("Activation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBot = (accountId: string) => {
    botAccountsManager.removeAccount(accountId);
    onAccountsChange();
  };

  return (
    <div className="space-y-6">
      {/* Bot accounts list */}
      {accounts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Bot Accounts</h3>
          <div className="space-y-2">
            {accounts.map((account) => (
              <div 
                key={account.id}
                className={`p-3 border rounded-md flex items-center justify-between ${
                  account.isActive ? 'bg-primary/5 border-primary' : ''
                }`}
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">Token: •••••••••••</p>
                </div>
                <div className="flex gap-2">
                  {!account.isActive && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleActivateBot(account.id)}
                      disabled={isLoading}
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBot(account.id)}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new bot form */}
      <div>
        <h3 className="text-lg font-medium mb-4">Add New Bot</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input
              id="bot-name"
              type="text"
              placeholder="Enter a name for this bot"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              A friendly name to identify this bot
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram-token">Telegram Bot Token</Label>
            <div className="relative">
              <Input
                id="telegram-token"
                type={showTelegramToken ? "text" : "password"}
                placeholder="Enter your bot token"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowTelegramToken(!showTelegramToken)}
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                disabled={isLoading}
              >
                {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get this from your OpenAI dashboard
            </p>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Bot...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Bot Account
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigForm;
