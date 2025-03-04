"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Network, 
  FileText, 
  Users, 
  LayoutDashboard, 
  GitBranch 
} from "lucide-react"

/**
 * Navigation items configuration
 * Each item defines a route and its associated icon and label
 */
const navItems = [
  {
    href: "/",
    icon: () => <span className="font-mono font-black text-lg text-green-500">[ ]</span>,
    label: "",
  },
  {
    href: "/",
    icon: Network,
    label: "Space Builder",
  },
  {
    href: "/reference-manager",
    icon: FileText,
    label: "Reference Manager",
  },
  {
    href: "/teams",
    icon: Users,
    label: "Teams",
  },
  {
    href: "/dashboard-builder",
    icon: LayoutDashboard,
    label: "Dashboard Builder",
  },
  {
    href: "/sandbox",
    icon: GitBranch,
    label: "Workflow Builder",
  },
]

/**
 * Header component with navigation between different application features
 * Highlights the current active route and provides consistent styling
 */
export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
} 