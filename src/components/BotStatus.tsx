
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface BotStatusProps {
  isConnected: boolean;
}

const BotStatus = ({ isConnected }: BotStatusProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Connection Status:</span>
        {isConnected ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle size={14} />
            Connected
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle size={14} />
            Disconnected
          </Badge>
        )}
      </div>

      {isConnected && (
        <>
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Mode:</span>
            <Badge variant="secondary">Auto-reply</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Response Time:</span>
            <span className="text-sm">~2-3 seconds</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">AI Model:</span>
            <span className="text-sm">GPT-3.5 Turbo</span>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Bot is active and ready to respond to messages
            </p>
          </div>
        </>
      )}

      {!isConnected && (
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            Configure and connect your bot to start responding to messages
          </p>
        </div>
      )}
    </div>
  );
};

export default BotStatus;
