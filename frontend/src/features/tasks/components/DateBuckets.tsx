import { compareDateKeys, dueDateLabel, groupByDueDate } from "../date"
import { DateBucketSection } from "./DateBucketSection"
import { TaskList } from "./TaskList"
import type { Task } from "../types"

export interface TaskHandlers {
  onToggleDone: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

interface DateBucketsProps {
  tasks: Task[]
  handlers: TaskHandlers
}

export function DateBuckets({ tasks, handlers }: DateBucketsProps) {
  const grouped = Array.from(groupByDueDate(tasks).entries()).sort(([a], [b]) =>
    compareDateKeys(a, b)
  )

  return (
    <div className="flex flex-col gap-5">
      {grouped.map(([dateKey, bucketTasks]) => {
        const key = dateKey === "Someday" ? "Someday" : dateKey
        const display = dueDateLabel(dateKey)
        return (
          <DateBucketSection key={key} label={display} dateKey={dateKey}>
            <TaskList tasks={bucketTasks} {...handlers} />
          </DateBucketSection>
        )
      })}
    </div>
  )
}
