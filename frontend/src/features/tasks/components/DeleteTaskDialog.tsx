import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

import { useDeleteTask } from "../hooks"
import type { Task } from "../types"

interface DeleteTaskDialogProps {
  task: Task | null
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskDialog({ task, onOpenChange }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask()

  async function handleDelete() {
    if (!task) {
      return
    }
    await deleteTask.mutateAsync(task.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={task != null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{task?.title}&rdquo; will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending && <Spinner data-icon="inline-start" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
