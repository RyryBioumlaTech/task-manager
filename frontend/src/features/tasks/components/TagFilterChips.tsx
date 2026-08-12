import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TagFilterChipsProps {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
}

export function TagFilterChips({ tags, selected, onToggle }: TagFilterChipsProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div
      data-slot="tag-filter-chips"
      className="flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Filter by tag"
    >
      {tags.map((tag) => {
        const active = selected.includes(tag)
        return (
          <Button
            key={tag}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            aria-pressed={active}
            onClick={() => onToggle(tag)}
            className={cn("h-9 rounded-full px-3.5")}
          >
            {tag}
          </Button>
        )
      })}
    </div>
  )
}
