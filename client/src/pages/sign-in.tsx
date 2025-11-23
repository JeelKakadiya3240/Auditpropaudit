import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sign-in delay
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Welcome Back!",
          description: `Logged in as ${email}. Redirecting to dashboard...`,
        });
        // Navigate to dashboard
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast({
          title: "Error",
          description: "Please enter both email and password.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoAccess = () => {
    setEmail("demo@auditprop.com");
    setPassword("demo123");
    setTimeout(() => {
      toast({
        title: "Demo Account",
        description: "Using demo credentials. Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AuditProp</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="border-muted">
            <CardHeader className="space-y-2">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the AuditProp platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/">
                      <button className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or try</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={handleDemoAccess}
              >
                Try Demo Account
              </Button>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/">
                  <button className="text-primary hover:underline">
                    Request access
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="mt-6 border-muted bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Access:</strong> Click "Try Demo Account" to explore the AuditProp platform with sample data.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AuditProp Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
