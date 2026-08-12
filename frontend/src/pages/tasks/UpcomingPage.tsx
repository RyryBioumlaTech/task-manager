import { CalendarPlusIcon } from "lucide-react"

import { DateBuckets } from "@/features/tasks/components/DateBuckets"
import { TasksView } from "@/features/tasks/components/TasksView"
import { todayKey } from "@/features/tasks/date"

export function UpcomingPage() {
  return (
    <TasksView
      filter={(task) => task.due_date !== null && task.due_date > todayKey() && !task.done}
      emptyIcon={CalendarPlusIcon}
      emptyTitle="Nothing upcoming"
      emptyDescription="Tasks with a future due date will show here."
      renderTasks={(tasks, handlers) => <DateBuckets tasks={tasks} handlers={handlers} />}
    />
  )
}
