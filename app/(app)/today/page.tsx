"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  category: string;
}

export default function TodayPage() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "הגשת טופס 106",
      description: "הגש את הטופס באתר ביטוח לאומי",
      dueDate: "היום",
      priority: "high",
      completed: false,
      category: "ביטוח לאומי",
    },
    {
      id: "2",
      title: "תור לביטוח לאומי",
      description: "תור בסניף ראשי - יום רביעי 10:30",
      dueDate: "מחר",
      priority: "medium",
      completed: false,
      category: "ביטוח לאומי",
    },
    {
      id: "3",
      title: "העלאת אישור רפואי",
      description: "העלה את האישור הרפואי המעודכן",
      dueDate: "עד סוף השבוע",
      priority: "medium",
      completed: false,
      category: "מסמכים",
    },
    {
      id: "4",
      title: "בדיקת סטטוס תביעה",
      description: "בדוק את סטטוס התביעה באתר",
      dueDate: "היום",
      priority: "low",
      completed: true,
      category: "מעקב",
    },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-error-bg text-error";
      case "medium":
        return "bg-warning-bg text-warning";
      case "low":
        return "bg-info-bg text-info";
    }
  };

  const _getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "priority_high";
      case "medium":
        return "schedule";
      case "low":
        return "low_priority";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "דחוף";
      case "medium":
        return "רגיל";
      case "low":
        return "נמוך";
    }
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">today</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">{t("dashboard.todaysTasks")}</h1>
              <p className="text-sm text-muted-foreground">{pendingTasks.length} משימות ממתינות</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-error-bg rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-error">
              {tasks.filter((t) => t.priority === "high" && !t.completed).length}
            </p>
            <p className="text-xs text-error font-medium">דחוף</p>
          </div>
          <div className="bg-warning-bg rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-warning">
              {tasks.filter((t) => t.priority === "medium" && !t.completed).length}
            </p>
            <p className="text-xs text-warning font-medium">רגיל</p>
          </div>
          <div className="bg-success-bg rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-success">{completedTasks.length}</p>
            <p className="text-xs text-success font-medium">הושלם</p>
          </div>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              ממתינות
            </h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card rounded-2xl p-4 border border-border shadow-soft"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="size-6 rounded-lg border-2 border-border hover:border-primary flex items-center justify-center shrink-0 mt-1 transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{task.title}</h3>
                        <span
                          className={`shrink-0 px-2 py-1 rounded-lg text-xs font-bold ${getPriorityColor(task.priority)}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="material-symbols-outlined text-sm">folder</span>
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              הושלמו
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-card/50 rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="size-6 rounded-lg bg-success text-white flex items-center justify-center shrink-0 mt-1"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-muted-foreground line-through">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
