/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocalStorage } from "@/src/hooks/use-local-storage";
import { Habit } from "@/src/types";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { HabitList } from "@/src/components/HabitList";
import { Stats } from "@/src/components/Stats";
import { AddHabitModal } from "@/src/components/AddHabitModal";
import { Button } from "@/src/components/ui/Button";
import { isSameDay, subDays } from "date-fns";
import { LayoutGrid, List, Plus } from "lucide-react";

export default function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date();
        const isCompletedToday = habit.completedDates.some((date) =>
          isSameDay(new Date(date), today)
        );

        let newCompletedDates = [...habit.completedDates];
        let newStreak = habit.streak;

        if (isCompletedToday) {
          // Remove today from completed dates
          newCompletedDates = newCompletedDates.filter(
            (date) => !isSameDay(new Date(date), today)
          );
          // Recalculate streak (simplified: just decrement if it was incremented today)
          // A proper recalculation would require checking consecutive days backwards
          newStreak = Math.max(0, newStreak - 1);
        } else {
          // Add today
          newCompletedDates.push(today.toISOString());
          
          // Check if completed yesterday to increment streak
          const yesterday = subDays(today, 1);
          const isCompletedYesterday = habit.completedDates.some((date) =>
            isSameDay(new Date(date), yesterday)
          );

          if (isCompletedYesterday) {
            newStreak += 1;
          } else {
            newStreak = 1; // Reset or start new streak
          }
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8 pb-24">
        <div className="mb-6 flex items-center justify-center rounded-xl bg-white/50 p-1 backdrop-blur-sm dark:bg-slate-900/50">
          <div className="grid w-full grid-cols-2 gap-1">
            <Button
              variant={activeTab === "list" ? "primary" : "ghost"}
              onClick={() => setActiveTab("list")}
              className="w-full"
            >
              <List className="mr-2 h-4 w-4" />
              Habits
            </Button>
            <Button
              variant={activeTab === "stats" ? "primary" : "ghost"}
              onClick={() => setActiveTab("stats")}
              className="w-full"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Stats
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <HabitList
                habits={habits}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Stats habits={habits} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>

      <Footer />

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}
