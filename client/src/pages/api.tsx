import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Shield } from "lucide-react";

export default function APIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/v1/search",
      description: "Fuzzy search properties by name, survey number, or owner",
    },
    {
      method: "GET",
      path: "/v1/property/{id}/360",
      description: "Get complete 360° audit for a property",
    },
    {
      method: "GET",
      path: "/v1/owner/{id}",
      description: "Retrieve owner profile and verification status",
    },
    {
      method: "POST",
      path: "/v1/property/{id}/recompute",
      description: "Trigger risk score recomputation",
    },
    {
      method: "POST",
      path: "/v1/report/property/{id}",
      description: "Generate PDF audit report",
    },
    {
      method: "GET",
      path: "/v1/graph/relations",
      description: "Graph traversal for relationship mapping",
    },
  ];

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
          <Button variant="ghost" asChild>
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">API Documentation</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Integrate AuditProp's property verification engine into your applications with our REST API.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Read Full Docs</Button>
                <Button size="lg" variant="outline">Get API Key</Button>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Available Endpoints</h2>

            <div className="space-y-4 mb-12">
              {endpoints.map((endpoint, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                            {endpoint.method}
                          </Badge>
                          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Code Example */}
            <div className="bg-muted rounded-lg p-6 border mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5" /> Example Request
              </h3>
              <pre className="bg-background rounded p-4 overflow-x-auto text-sm">
                <code>{`curl -X POST https://api.auditprop.com/v1/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "property name",
    "type": "PROPERTY"
  }'`}</code>
              </pre>
            </div>

            <Button size="lg" className="gap-2" asChild>
              <Link href="/sign-in">
                Get Started with API
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AuditProp Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
