import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, CheckCircle2 } from "lucide-react";

export default function DataSources() {
  const sources = [
    { name: "MCA (Ministry of Corporate Affairs)", category: "Corporate", status: "Live" },
    { name: "RERA (Real Estate Regulatory Authority)", category: "Property", status: "Live" },
    { name: "District Courts", category: "Legal", status: "Live" },
    { name: "High Courts", category: "Legal", status: "Live" },
    { name: "Revenue Department Records", category: "Property", status: "Live" },
    { name: "Sub-Registrar Database", category: "Property", status: "Live" },
    { name: "RBI CIBIL Integration", category: "Financial", status: "Live" },
    { name: "Bank Loan Records", category: "Financial", status: "Integration" },
    { name: "Cheque Bounce Records", category: "Financial", status: "Integration" },
    { name: "GST Database", category: "Corporate", status: "Integration" },
    { name: "Property Tax Database", category: "Property", status: "Integration" },
    { name: "Municipal Records", category: "Property", status: "Development" },
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
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Data Sources</h1>
              <p className="text-xl text-muted-foreground mb-8">
                AuditProp integrates with 120+ verified data sources to deliver comprehensive property intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Sources Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {sources.map((source, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{source.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{source.category}</Badge>
                      <Badge variant={source.status === "Live" ? "default" : "secondary"}>
                        {source.status === "Live" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {source.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/30 rounded-lg p-8 border mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Coverage</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">120+</div>
                  <p className="text-muted-foreground">Verified data sources</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50M+</div>
                  <p className="text-muted-foreground">Properties indexed</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
                  <p className="text-muted-foreground">Daily updates</p>
                </div>
              </div>
            </div>

            <Link href="/">
              <Button size="lg">Back Home</Button>
            </Link>
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
