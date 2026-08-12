import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { useCreateTask, useUpdateTask } from "../hooks"
import type { Task } from "../types"

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const isEdit = task != null
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const submitting = createTask.isPending || updateTask.isPending

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [tagsText, setTagsText] = useState("")
  const [error, setError] = useState<string | null>(null)

  function initializeForm() {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? "")
      setDueDate(task.due_date ?? "")
      setTagsText(task.tags.join(", "))
    } else {
      setTitle("")
      setDescription("")
      setDueDate("")
      setTagsText("")
    }
    setError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError("Title is required.")
      return
    }

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const payload = {
      title: trimmedTitle,
      description: description.trim() === "" ? null : description.trim(),
      due_date: dueDate === "" ? null : dueDate,
      tags,
    }

    if (isEdit && task) {
      await updateTask.mutateAsync({ id: task.id, data: payload })
    } else {
      await createTask.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={initializeForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the task details below." : "Add a new task to your list."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What needs to be done?"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-description">Description</FieldLabel>
              <Textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add more details (optional)"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-due">Due date</FieldLabel>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-tags">Tags</FieldLabel>
              <Input
                id="task-tags"
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                placeholder="Comma separated (e.g. work, home)"
              />
              <FieldDescription>Separate multiple tags with commas.</FieldDescription>
            </Field>
          </FieldGroup>
          {error && <FieldError>{error}</FieldError>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner data-icon="inline-start" />}
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
