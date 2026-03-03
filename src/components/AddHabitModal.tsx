import * as React from "react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { v4 as uuidv4 } from "uuid";
import { Habit } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const COLORS = [
  { name: "indigo", value: "bg-indigo-500" },
  { name: "red", value: "bg-red-500" },
  { name: "orange", value: "bg-orange-500" },
  { name: "amber", value: "bg-amber-500" },
  { name: "green", value: "bg-green-500" },
  { name: "teal", value: "bg-teal-500" },
  { name: "blue", value: "bg-blue-500" },
  { name: "purple", value: "bg-purple-500" },
  { name: "pink", value: "bg-pink-500" },
  { name: "rose", value: "bg-rose-500" },
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [color, setColor] = React.useState("indigo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit: Habit = {
      id: uuidv4(),
      title: title.trim(),
      category: category.trim() || "General",
      color,
      completedDates: [],
      createdAt: new Date().toISOString(),
      streak: 0,
    };

    onAdd(newHabit);
    setTitle("");
    setCategory("");
    setColor("indigo");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Habit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Habit Title
          </label>
          <Input
            id="title"
            placeholder="e.g., Read 30 minutes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Category (Optional)
          </label>
          <Input
            id="category"
            placeholder="e.g., Health"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-600",
                  c.value,
                  color === c.name && "ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-100"
                )}
                aria-label={`Select ${c.name} color`}
              >
                {color === c.name && (
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Habit</Button>
        </div>
      </form>
    </Modal>
  );
}
