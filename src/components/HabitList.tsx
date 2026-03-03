import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Habit } from "@/src/types";
import { HabitItem } from "./HabitItem";
import { Button } from "./ui/Button";
import { Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortOption = "date" | "name" | "streak" | "category";

export function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<SortOption>("date");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const categories = React.useMemo(() => {
    const cats = new Set(habits.map((h) => h.category));
    return ["All", ...Array.from(cats)];
  }, [habits]);

  const filteredAndSortedHabits = React.useMemo(() => {
    let result = [...habits];

    if (selectedCategory !== "All") {
      result = result.filter((h) => h.category === selectedCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "streak":
          return b.streak - a.streak;
        case "category":
          return a.category.localeCompare(b.category);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [habits, selectedCategory, sortBy]);

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
          <svg
            className="h-8 w-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          No habits yet
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Get started by creating a new habit.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2 text-xs"
            >
              <ArrowUpDown className="h-3 w-3" />
              Sort by: <span className="capitalize">{sortBy}</span>
            </Button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    {(["date", "name", "streak", "category"] as SortOption[]).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center px-4 py-2 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                            sortBy === option
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      )
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
        
        {filteredAndSortedHabits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            No habits found in this category.
          </motion.div>
        )}
      </div>
    </div>
  );
}
