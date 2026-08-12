import { PlusIcon, type LucideIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { DeleteTaskDialog } from "./DeleteTaskDialog"
import { TagFilterChips } from "./TagFilterChips"
import { TaskEmptyState } from "./TaskEmptyState"
import { TaskFormDialog } from "./TaskFormDialog"
import { useTasks, useToggleDone } from "../hooks"
import type { Task } from "../types"

interface TasksViewProps {
  filter: (task: Task) => boolean
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  renderTasks: (
    tasks: Task[],
    handlers: {
      onToggleDone: (task: Task) => void
      onEdit: (task: Task) => void
      onDelete: (task: Task) => void
    }
  ) => React.ReactNode
}

export function TasksView({
  filter,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderTasks,
}: TasksViewProps) {
  const { data, isPending, isError, refetch } = useTasks()
  const toggleDone = useToggleDone()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    data?.forEach((task) => task.tags.forEach((tag) => set.add(tag)))
    return [...set].sort()
  }, [data])

  const tasks = useMemo(() => {
    if (!data) {
      return []
    }
    return data.filter((task) => {
      if (!filter(task)) {
        return false
      }
      if (selectedTags.length > 0) {
        if (!selectedTags.every((tag) => task.tags.includes(tag))) {
          return false
        }
      }
      return true
    })
  }, [data, filter, selectedTags])

  function handleToggleDone(task: Task) {
    toggleDone.mutate({ id: task.id, done: !task.done })
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    )
  }

  function openCreate() {
    setEditingTask(null)
    setFormOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">Could not load tasks</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const handlers = {
    onToggleDone: handleToggleDone,
    onEdit: (task: Task) => {
      setEditingTask(task)
      setFormOpen(true)
    },
    onDelete: (task: Task) => setDeletingTask(task),
  }

  return (
    <div className="flex flex-col gap-4">
      <TagFilterChips tags={allTags} selected={selectedTags} onToggle={toggleTag} />

      {tasks.length === 0 ? (
        <TaskEmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        renderTasks(tasks, handlers)
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto flex max-w-[420px] justify-end px-4 pb-[calc(var(--nav-height)+0.75rem)]">
          <Button
            size="icon-lg"
            className="pointer-events-auto size-11 rounded-full shadow-lg"
            aria-label="Add task"
            onClick={openCreate}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editingTask} />
      <DeleteTaskDialog
        task={deletingTask}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTask(null)
          }
        }}
      />
    </div>
  )
}
