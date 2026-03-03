import * as React from "react";
import { motion } from "motion/react";
import { Check, Trash2, Flame } from "lucide-react";
import { Habit } from "@/src/types";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { isSameDay } from "date-fns";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  indigo: { bg: "bg-indigo-500", border: "border-indigo-500", text: "text-indigo-500", ring: "focus:ring-indigo-500" },
  red: { bg: "bg-red-500", border: "border-red-500", text: "text-red-500", ring: "focus:ring-red-500" },
  orange: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500", ring: "focus:ring-orange-500" },
  amber: { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-500", ring: "focus:ring-amber-500" },
  green: { bg: "bg-green-500", border: "border-green-500", text: "text-green-500", ring: "focus:ring-green-500" },
  teal: { bg: "bg-teal-500", border: "border-teal-500", text: "text-teal-500", ring: "focus:ring-teal-500" },
  blue: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500", ring: "focus:ring-blue-500" },
  purple: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-500", ring: "focus:ring-purple-500" },
  pink: { bg: "bg-pink-500", border: "border-pink-500", text: "text-pink-500", ring: "focus:ring-pink-500" },
  rose: { bg: "bg-rose-500", border: "border-rose-500", text: "text-rose-500", ring: "focus:ring-rose-500" },
};

export function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const isCompletedToday = habit.completedDates.some((date) =>
    isSameDay(new Date(date), new Date())
  );

  const colorStyles = COLOR_MAP[habit.color] || COLOR_MAP.indigo;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex items-center justify-between rounded-2xl bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(habit.id)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
            colorStyles.ring,
            isCompletedToday
              ? cn(colorStyles.border, colorStyles.bg, "text-white")
              : cn("border-slate-300 bg-transparent text-transparent dark:border-slate-600", `hover:${colorStyles.border}`)
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: isCompletedToday ? 1 : 0 }}
          >
            <Check className="h-6 w-6" strokeWidth={3} />
          </motion.div>
        </button>

        <div className="flex flex-col">
          <span
            className={cn(
              "text-lg font-medium text-slate-900 transition-all dark:text-slate-100",
              isCompletedToday && "text-slate-500 line-through dark:text-slate-500"
            )}
          >
            {habit.title}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Flame className={cn("h-3 w-3", colorStyles.text)} />
              {habit.streak} day streak
            </span>
            <span>•</span>
            <span className="capitalize">{habit.category}</span>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(habit.id)}
        className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </motion.div>
  );
}
