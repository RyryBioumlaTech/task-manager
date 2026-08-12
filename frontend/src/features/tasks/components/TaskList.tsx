import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

import { TaskItem } from "./TaskItem"
import type { Task } from "../types"

interface TaskListProps {
  tasks: Task[]
  onToggleDone: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const VIRTUALIZE_THRESHOLD = 100

export function TaskList({ tasks, onToggleDone, onEdit, onDelete }: TaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76,
    overscan: 8,
  })

  if (tasks.length > VIRTUALIZE_THRESHOLD) {
    return (
      <div
        ref={parentRef}
        className="max-h-[60dvh] overflow-auto"
        role="list"
        aria-label="Tasks"
      >
        <div
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const task = tasks[virtualRow.index]
            if (!task) {
              return null
            }
            return (
              <div
                key={task.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <div className="px-0.5 py-1">
                  <TaskItem
                    task={task}
                    onToggleDone={onToggleDone}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div role="list" aria-label="Tasks" className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
