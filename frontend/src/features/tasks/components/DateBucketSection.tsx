import { CheckCircle2Icon } from "lucide-react"
import type { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"

import { isBeforeToday, todayKey } from "../date"

interface DateBucketSectionProps {
  label: string
  dateKey?: string
  children: ReactNode
}

export function DateBucketSection({ label, dateKey, children }: DateBucketSectionProps) {
  const overdue = dateKey !== undefined && dateKey !== "Someday" && isBeforeToday(dateKey)
  const isToday = dateKey === todayKey()

  return (
    <section data-slot="date-bucket" className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <span
          className={
            overdue
              ? "text-xs font-semibold tracking-wide text-destructive uppercase"
              : "text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          }
        >
          {label}
        </span>
        {isToday && <CheckCircle2Icon className="size-4 text-primary" />}
      </div>
      <Separator />
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}
