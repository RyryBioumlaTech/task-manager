import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunction,
  type QueryKey,
} from "@tanstack/react-query"

import { createTask, deleteTask, listTasks, updateTask } from "./api"
import type { Task, TaskFilters, TaskInput, TaskUpdate } from "./types"

const TASKS_KEY = "tasks"

function tasksQueryKey(filters: TaskFilters): QueryKey {
  return [TASKS_KEY, filters]
}

export function useTasks(filters: TaskFilters = {}) {
  return useQuery<Task[]>({
    queryKey: tasksQueryKey(filters),
    queryFn: () => listTasks(filters),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TaskInput) => createTask(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      updateTask(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

export function useToggleDone() {
  const queryClient = useQueryClient()
  const optimistic: MutationFunction<Task, { id: number; done: boolean }> = ({
    id,
    done,
  }) => updateTask(id, { done })

  return useMutation({
    mutationFn: optimistic,
    onMutate: async ({ id, done }) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_KEY] })

      const previous = queryClient.getQueriesData<Task[]>({
        queryKey: [TASKS_KEY],
      })

      queryClient.setQueriesData<Task[]>({ queryKey: [TASKS_KEY] }, (old) =>
        old?.map((task) => (task.id === id ? { ...task, done } : task)),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      const previous = (context as { previous?: [QueryKey, Task[]][] } | undefined)
        ?.previous
      previous?.forEach(([key, tasks]) => {
        queryClient.setQueryData<Task[]>(key, tasks)
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}
