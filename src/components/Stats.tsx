import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { Habit } from "@/src/types";
import { subDays, format, isSameDay } from "date-fns";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Share2, Check } from "lucide-react";

interface StatsProps {
  habits: Habit[];
}

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export function Stats({ habits }: StatsProps) {
  const [copied, setCopied] = React.useState(false);

  // Weekly Data (Last 7 Days)
  const weeklyData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date,
        day: format(date, "EEE"),
        fullDate: format(date, "MMM d"),
        count: 0,
      };
    });

    habits.forEach((habit) => {
      habit.completedDates.forEach((completedDate) => {
        const date = new Date(completedDate);
        const dayStat = last7Days.find((d) => isSameDay(d.date, date));
        if (dayStat) {
          dayStat.count++;
        }
      });
    });

    return last7Days;
  }, [habits]);

  // Monthly Data (Last 30 Days)
  const monthlyData = React.useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date,
        day: format(date, "d"),
        fullDate: format(date, "MMM d"),
        count: 0,
      };
    });

    habits.forEach((habit) => {
      habit.completedDates.forEach((completedDate) => {
        const date = new Date(completedDate);
        const dayStat = last30Days.find((d) => isSameDay(d.date, date));
        if (dayStat) {
          dayStat.count++;
        }
      });
    });

    return last30Days;
  }, [habits]);

  // Category Data
  const categoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    habits.forEach((habit) => {
      const count = habit.completedDates.length;
      if (count > 0) {
        categories[habit.category] = (categories[habit.category] || 0) + count;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [habits]);

  const totalCompletions = habits.reduce(
    (acc, habit) => acc + habit.completedDates.length,
    0
  );

  const currentStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);

  const handleShare = () => {
    const text = `Habit Tracker Stats:\nTotal Completions: ${totalCompletions}\nTotal Streak Days: ${currentStreak}\n\nTrack your habits with Habit Tracker!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Header with Share Button */}
      <div className="flex items-center justify-between md:col-span-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Analytics
        </h2>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <Share2 className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied" : "Share"}
        </Button>
      </div>

      {/* Summary Cards */}
      <Card className="flex flex-col justify-center p-6">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Completions
        </span>
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {totalCompletions}
        </span>
      </Card>
      <Card className="flex flex-col justify-center p-6">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Streak Days
        </span>
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {currentStreak}
        </span>
      </Card>

      {/* Weekly Progress Bar Chart */}
      <Card className="p-6 md:col-span-2">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Weekly Activity
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: "#1e293b",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 6 ? "#6366f1" : "#cbd5e1"}
                    className="transition-all hover:opacity-80 dark:fill-slate-700 dark:[&.recharts-bar-rectangle]:fill-indigo-500"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card className="p-6 md:col-span-2">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          30-Day Trend
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: "#1e293b",
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullDate;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Distribution Pie Chart */}
      {categoryData.length > 0 && (
        <Card className="p-6 md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Completions by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "#1e293b",
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-400 text-sm ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
