export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function parseDateKey(key: string): Date {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function localDateFormat(key: string): string {
  const date = parseDateKey(key)
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function isBeforeToday(key: string | null): boolean {
  if (!key) {
    return false
  }
  return key < todayKey()
}

export function taskDateKey(task: { due_date: string | null }): string {
  return task.due_date ?? "Someday"
}

export function bucketByDateKey(tasks: { due_date: string | null }[]): Map<string, { due_date: string | null }[]> {
  const buckets = new Map<string, { due_date: string | null }[]>()
  for (const task of tasks) {
    const key = taskDateKey(task)
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.push(task)
    } else {
      buckets.set(key, [task])
    }
  }
  return buckets
}

export function groupByDueDate<T extends { due_date: string | null }>(tasks: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>()
  for (const task of tasks) {
    const key = task.due_date ?? "Someday"
    const bucket = groups.get(key)
    if (bucket) {
      bucket.push(task)
    } else {
      groups.set(key, [task])
    }
  }
  return groups
}

export function dueDateLabel(dateKey: string): string {
  if (dateKey === "Someday") {
    return "Someday"
  }
  const today = todayKey()
  if (dateKey === today) {
    return "Today"
  }
  return localDateFormat(dateKey)
}

export function compareDateKeys(a: string, b: string): number {
  if (a === "Someday") {
    return 1
  }
  if (b === "Someday") {
    return -1
  }
  return a < b ? -1 : a > b ? 1 : 0
}
