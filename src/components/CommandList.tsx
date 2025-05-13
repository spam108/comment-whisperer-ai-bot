
import { Command } from "@/utils/telegramTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommandListProps {
  commands: Command[];
}

const CommandList = ({ commands }: CommandListProps) => {
  return (
    <div className="space-y-4">
      {commands.map((command) => (
        <Card key={command.command}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <code className="bg-muted px-2 py-1 rounded text-primary font-mono">
                  /{command.command}
                </code>
                <Badge variant="outline" className="ml-2">
                  {command.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{command.description}</p>
            {command.example && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">Example: </span>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{command.example}</code>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommandList;
