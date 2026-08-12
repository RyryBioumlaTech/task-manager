import { apiFetch } from "@/lib/api-client"

import type { Task, TaskFilters, TaskInput, TaskUpdate } from "./types"

export function listTasks(filters: TaskFilters = {}): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks", {
    query: {
      date: filters.date,
      from: filters.from,
      to: filters.to,
      tag: filters.tag,
      done: filters.done,
      overdue: filters.overdue,
    },
  })
}

export function getTask(id: number): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`)
}

export function createTask(data: TaskInput): Promise<Task> {
  return apiFetch<Task>("/tasks", { method: "POST", json: data })
}

export function updateTask(id: number, data: TaskUpdate): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, { method: "PATCH", json: data })
}

export function deleteTask(id: number): Promise<void> {
  return apiFetch<void>(`/tasks/${id}`, { method: "DELETE" })
}
