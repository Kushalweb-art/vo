"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Database, FileCheck, Home } from "lucide-react"

import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Datasets", href: "/datasets", icon: Database },
    { name: "Validation", href: "/validation", icon: FileCheck },
    { name: "Results", href: "/results", icon: BarChart3 },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Data Validator</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

