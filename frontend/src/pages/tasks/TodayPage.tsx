import { CalendarCheck2Icon } from "lucide-react"

import { DateBuckets } from "@/features/tasks/components/DateBuckets"
import { TasksView } from "@/features/tasks/components/TasksView"
import { todayKey } from "@/features/tasks/date"

export function TodayPage() {
  return (
    <TasksView
      filter={(task) => task.due_date === todayKey() && !task.done}
      emptyIcon={CalendarCheck2Icon}
      emptyTitle="No tasks due today"
      emptyDescription="You're all caught up. Tasks due today will show here."
      renderTasks={(tasks, handlers) => <DateBuckets tasks={tasks} handlers={handlers} />}
    />
  )
}
