import { Layout } from "@/components/layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Settings
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user?.role !== "admin") {
    return null;
  }

  const stats = [
    { label: "Total Users", value: "1,284", icon: Users, trend: "+12%" },
    { label: "Active Audits", value: "342", icon: BarChart3, trend: "+8%" },
    { label: "Flagged Properties", value: "45", icon: AlertTriangle, trend: "+3" },
    { label: "System Health", value: "98.5%", icon: TrendingUp, trend: "Stable" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage system, users, and audit operations</p>
          </div>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Admin Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span>{stat.label}</span>
                    <Icon className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-emerald-600 mt-1">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Active Users: 1,284</p>
                <p className="text-sm text-muted-foreground">Admins: 8</p>
                <p className="text-sm text-muted-foreground">Regular Users: 1,276</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View All Users
                </Button>
                <Button size="sm" className="flex-1">
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Audit Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">In Progress: 342</p>
                <p className="text-sm text-muted-foreground">Completed Today: 89</p>
                <p className="text-sm text-muted-foreground">Average Duration: 2.4 hours</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Audits
                </Button>
                <Button size="sm" className="flex-1">
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Critical: 5</p>
                <p className="text-sm text-muted-foreground">High: 18</p>
                <p className="text-sm text-muted-foreground">Medium: 22</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View All Alerts
                </Button>
                <Button size="sm" className="flex-1">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Uptime: 99.9%</p>
                <p className="text-sm text-muted-foreground">Database: Healthy</p>
                <p className="text-sm text-muted-foreground">API: Operational</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Details
                </Button>
                <Button size="sm" className="flex-1">
                  Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
