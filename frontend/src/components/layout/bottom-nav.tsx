import { CalendarDaysIcon, CalendarPlusIcon, AlertTriangleIcon, ListChecksIcon, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: "/tasks/today", label: "Today", icon: CalendarDaysIcon },
  { to: "/tasks/upcoming", label: "Upcoming", icon: CalendarPlusIcon },
  { to: "/tasks/overdue", label: "Overdue", icon: AlertTriangleIcon },
  { to: "/tasks/all", label: "All", icon: ListChecksIcon },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[0.7rem] font-medium text-muted-foreground transition-colors",
    isActive ? "text-foreground" : "hover:text-foreground",
  )
}

export function BottomNav() {
  return (
    <nav
      aria-label="Task views"
      className="flex h-[var(--nav-height)] items-center justify-between border-t border-border bg-background px-4"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            <Icon className="size-5" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
