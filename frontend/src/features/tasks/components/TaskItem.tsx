import { AlertTriangleIcon, CalendarDaysIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { isBeforeToday, localDateFormat } from "../date"
import type { Task } from "../types"

interface TaskItemProps {
  task: Task
  onToggleDone: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onToggleDone, onEdit, onDelete }: TaskItemProps) {
  const overdue = isBeforeToday(task.due_date)

  return (
    <div
      data-slot="task-item"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-2.5",
        task.done && "opacity-60"
      )}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggleDone(task)}
        aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`}
      />
      <div
        className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1"
        onClick={() => onEdit(task)}
      >
        <p
          className={cn(
            "text-sm break-words",
            task.done && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          {task.due_date && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs text-muted-foreground",
                overdue && "text-destructive"
              )}
            >
              {overdue ? (
                <AlertTriangleIcon className="size-3.5" />
              ) : (
                <CalendarDaysIcon className="size-3.5" />
              )}
              {localDateFormat(task.due_date)}
            </span>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={`Delete "${task.title}"`}
        onClick={() => onDelete(task)}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
