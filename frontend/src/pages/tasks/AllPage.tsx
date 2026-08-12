import { ListChecksIcon } from "lucide-react"

import { DateBuckets } from "@/features/tasks/components/DateBuckets"
import { TasksView } from "@/features/tasks/components/TasksView"

export function AllPage() {
  return (
    <TasksView
      filter={() => true}
      emptyIcon={ListChecksIcon}
      emptyTitle="No tasks yet"
      emptyDescription="Every task you create will be listed here."
      renderTasks={(tasks, handlers) => <DateBuckets tasks={tasks} handlers={handlers} />}
    />
  )
}
