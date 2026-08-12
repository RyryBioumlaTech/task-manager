export interface Task {
  id: number
  owner_id: number
  title: string
  description: string | null
  due_date: string | null
  done: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface TaskInput {
  title: string
  description?: string | null
  due_date?: string | null
  tags?: string[]
}

export interface TaskUpdate {
  title?: string | null
  description?: string | null
  due_date?: string | null
  done?: boolean | null
  tags?: string[] | null
}

export interface TaskFilters {
  date?: string
  from?: string
  to?: string
  tag?: string
  done?: boolean
  overdue?: boolean
}
