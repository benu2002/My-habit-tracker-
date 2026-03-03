export type Theme = "dark" | "light" | "system";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  color: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  createdAt: string;
  streak: number;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  completionRate: number;
}
