import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  AlertCircle, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  Bell,
  Shield,
  BarChart3,
  Zap,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Features", href: "/features", icon: Layers },
    { name: "Review Queue", href: "/review", icon: AlertCircle },
    { name: "Audit Reports", href: "/reports", icon: FileText },
    { name: "NRI Suite", href: "/nri", icon: ShieldCheck },
    { name: "Market Intelligence", href: "/market", icon: BarChart3 },
    { name: "Fraud Detection", href: "/fraud", icon: Zap },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const navigation = user?.role === "admin" 
    ? [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "All Features", href: "/features", icon: Layers },
        { name: "Admin Panel", href: "/admin", icon: Shield },
        { name: "Review Queue", href: "/review", icon: AlertCircle },
        { name: "Audit Reports", href: "/reports", icon: FileText },
        { name: "NRI Suite", href: "/nri", icon: ShieldCheck },
        { name: "Market Intelligence", href: "/market", icon: BarChart3 },
        { name: "Fraud Detection", href: "/fraud", icon: Zap },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    : baseNavigation;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">AuditProp</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Lead Auditor</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/60">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Enterprise Workspace</span>
              <span className="mx-2">/</span>
              <span>Property Audit</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-card"></span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
