'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  Building2,
  BookOpen,
  Archive,
  Search,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/discover', label: 'Discover Tenders', icon: Search },
  { href: '/tenders', label: 'My Tenders', icon: FileText },
  { href: '/company-profile', label: 'Company Profile', icon: Building2 },
  { href: '/evidence', label: 'Evidence Bank', icon: Archive },
  { href: '/bid-library', label: 'Bid Library', icon: BookOpen },
  { href: '/previous-bids', label: 'Previous Bids', icon: Archive },
]

interface SidebarProps {
  orgName: string
  userName: string
}

export function Sidebar({ orgName, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-sidebar-foreground font-semibold text-base">BidWriteIt</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-medium text-white truncate">{userName}</p>
          <p className="text-xs text-sidebar-foreground opacity-60 truncate">{orgName}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
