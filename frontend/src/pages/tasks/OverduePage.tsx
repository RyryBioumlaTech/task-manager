import { AlertTriangleIcon } from "lucide-react"

import { DateBuckets } from "@/features/tasks/components/DateBuckets"
import { TasksView } from "@/features/tasks/components/TasksView"
import { todayKey } from "@/features/tasks/date"

export function OverduePage() {
  return (
    <TasksView
      filter={(task) => task.due_date !== null && task.due_date < todayKey() && !task.done}
      emptyIcon={AlertTriangleIcon}
      emptyTitle="No overdue tasks"
      emptyDescription="You're on top of everything. Great job!"
      renderTasks={(tasks, handlers) => <DateBuckets tasks={tasks} handlers={handlers} />}
    />
  )
}
