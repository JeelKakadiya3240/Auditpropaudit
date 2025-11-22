import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Bell, Database, User, Lock } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your workspace preferences and integrations.
            </p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Profile Settings
                </CardTitle>
                <CardDescription>Manage your personal information and workspace display.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="john.doe@enterprise.com" type="email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Lead Auditor" disabled className="bg-muted" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Workspace Preferences</CardTitle>
                <CardDescription>Customize your dashboard experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the dashboard</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">Show more data rows in tables</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Access Control
                </CardTitle>
                <CardDescription>Manage security settings and API access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PII Masking</Label>
                    <p className="text-sm text-muted-foreground">Mask Aadhaar/PAN numbers by default</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Lock className="h-5 w-5" /> API Keys
                </CardTitle>
                <CardDescription>Manage your API keys for external integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid gap-2">
                    <Label>Production Key</Label>
                    <div className="flex gap-2">
                      <Input value="pk_live_****************************" readOnly className="font-mono" />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Database className="h-5 w-5" /> Connected Data Sources
                </CardTitle>
                <CardDescription>Manage connections to external registries and databases.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">RERA Registry (MahaRERA)</p>
                    <p className="text-sm text-muted-foreground">Last synced: 2 mins ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 bg-emerald-50">Connected</Button>
                </div>
                 <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">CERSAI (Security Interest)</p>
                    <p className="text-sm text-muted-foreground">Last synced: 1 hour ago</p>
                  </div>
                   <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 bg-emerald-50">Connected</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Court NIC API</p>
                    <p className="text-sm text-muted-foreground">Status: Operational</p>
                  </div>
                   <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 bg-emerald-50">Connected</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about audit updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Completions</Label>
                    <p className="text-sm text-muted-foreground">Notify when an audit report is ready</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate alert for critical risk factors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Summary of weekly audit activities</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
