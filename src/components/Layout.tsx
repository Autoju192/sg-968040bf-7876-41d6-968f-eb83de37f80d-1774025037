import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileSearch,
  Library,
  FileText,
  Users,
  Bell,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tenders", href: "/tenders", icon: FileSearch },
  { name: "Evidence Library", href: "/evidence", icon: Library },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Team", href: "/team", icon: Users },
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl">TenderFlow AI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="flex-1">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-1">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}