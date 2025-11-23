import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Users, Shield, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Solutions() {
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Enterprise Solutions</h1>
              <p className="text-xl text-muted-foreground mb-8">
                AuditProp provides comprehensive property verification solutions tailored for enterprises of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Real Estate Developers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Streamline your property acquisition process with instant land title verification and ownership history analysis.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Legal encumbrance checks
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-owner verification
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> RERA compliance validation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-500" />
                    </div>
                    <CardTitle>Financial Institutions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Accelerate mortgage approvals with automated property verification and collateral assessment.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Loan default detection
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> NPA risk scoring
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Fraud flag alerts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-amber-500" />
                    </div>
                    <CardTitle>Legal & Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive legal due diligence for conveyancing, litigation support, and regulatory compliance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Court case history
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Title clearance reports
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Audit trail documentation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle>Investment Firms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Make data-driven investment decisions with comprehensive property risk analytics and market insights.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Risk scoring engine
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Portfolio analytics
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Batch API processing
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Link href="/">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
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
