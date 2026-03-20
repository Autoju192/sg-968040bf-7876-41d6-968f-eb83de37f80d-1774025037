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
  Menu,
  Inbox,
  FileCheck,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingWizard } from "@/components/OnboardingWizard";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Tenders", href: "/tenders", icon: FileText },
  { name: "Documents", href: "/documents", icon: FileCheck },
  { name: "Evidence Library", href: "/evidence", icon: Library },
  { name: "Team", href: "/team", icon: Users },
  { name: "Integrations", href: "/integrations", icon: Settings },
  { name: "Help & Tutorials", href: "/help", icon: HelpCircle },
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const getPageTitle = () => {
    const path = router.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/tenders")) return "Tenders";
    if (path.startsWith("/evidence")) return "Evidence Library";
    if (path.startsWith("/documents")) return "Documents";
    if (path.startsWith("/team")) return "Team";
    if (path.startsWith("/reports")) return "Performance Reports";
    if (path.startsWith("/admin")) return "Admin Panel";
    return "TenderFlow AI";
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex-col hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
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
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-1" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <ThemeSwitch />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
      <OnboardingWizard />
    </div>
  );
}