
import { Stats } from "@/utils/telegramTypes";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StatsDisplayProps {
  stats: Stats;
}

const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  const chartData = [
    { name: "Total", value: stats.totalMessages },
    { name: "Today", value: stats.messagesPerDay },
    { name: "Commands", value: stats.commandsUsed },
    { name: "AI Gen", value: stats.aiResponsesGenerated },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Messages" value={stats.totalMessages.toString()} />
        <StatCard title="Messages Today" value={stats.messagesPerDay.toString()} />
        <StatCard title="Commands Used" value={stats.commandsUsed.toString()} />
        <StatCard title="AI Responses" value={stats.aiResponsesGenerated.toString()} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-2">Usage Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-medium mb-2">Activity Log</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="text-sm p-2 bg-muted rounded-md">
              <span className="text-muted-foreground">{activity.timestamp}: </span>
              {activity.action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default StatsDisplay;
