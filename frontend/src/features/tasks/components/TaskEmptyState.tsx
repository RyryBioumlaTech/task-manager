import type { LucideIcon } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface TaskEmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export function TaskEmptyState({ icon: Icon, title, description }: TaskEmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}
