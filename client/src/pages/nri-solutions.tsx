import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, Building2, Shield, TrendingUp, CheckCircle2, MapPin, DollarSign, BookOpen, Lock } from "lucide-react";

export default function NRISolutions() {
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
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-blue-50/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">NRI Property Investment Solutions</h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                AuditProp specializes in helping Non-Resident Indians navigate India's real estate market with complete confidence. Our platform simplifies property verification, compliance, and investment decisions for NRI buyers worldwide.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/nri">
                    Explore NRI Suite <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why NRIs Choose AuditProp */}
        <section className="py-16 md:py-24 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why NRIs Choose AuditProp</h2>
              <p className="text-muted-foreground">
                Investing in Indian real estate as an NRI involves unique challenges. From regulatory compliance to fraud detection, AuditProp provides peace of mind.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>RERA & Legal Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Full compliance with RERA regulations, FEMA rules, and NRI-specific investment restrictions. Get instant verification of developer credentials and project status.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> RERA registration verification
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> FEMA compliance check
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Legal title clearance
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Court case history search
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle>Fraud Detection & Protection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    AI-powered fraud detection with 6 algorithms catches benami transactions, double sales, and document forgeries before you commit funds.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Document forgery detection
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Benami transaction alerts
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Double sale risk scoring
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Price anomaly detection
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle>Tax & Financial Planning</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive guides on TDS, Form 15CA/15CB, ITR filing, repatriation rules, and tax deductions specific to NRI property investors.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> TDS exemption guide
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Rental income tax planning
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Repatriation assistance
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Fund transfer compliance
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle>Market Intelligence & Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Real-time market data for 6 major Indian cities with investment scores, price trends, and developer performance metrics.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Price trend analysis
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Rental yield calculations
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Developer track records
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Investment opportunity scoring
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Complete NRI Checklist */}
        <section className="py-16 md:py-24 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Complete NRI Property Purchase Journey</h2>
              <p className="text-muted-foreground">
                From initial property search to final registration, AuditProp guides you through every step.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <Card data-testid="card-phase-pre">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Pre-Purchase Phase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Complete these checks before committing:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Passport & visa verification</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>PAN card registration</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>30-year title verification</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Litigation search (30 years)</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Fraud risk assessment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-phase-post">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    Post-Purchase Phase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Complete these within 3 months:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Form 15CA/15CB filing</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Property registration</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Land record mutation</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Annual ITR filing</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>FEMAL compliance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Account Types */}
        <section className="py-16 md:py-24 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">NRE, NRO & FCNR Bank Accounts</h2>
              <p className="text-muted-foreground">
                Understand which account type is best for your property investment strategy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card data-testid="card-account-nre">
                <CardHeader>
                  <CardTitle className="text-lg">NRE Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-emerald-600 mb-2">Advantages:</p>
                    <ul className="space-y-1">
                      <li>• Foreign funds remittance</li>
                      <li>• Tax exemption</li>
                      <li>• Free repatriation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-600 mb-2">Restrictions:</p>
                    <ul className="space-y-1">
                      <li>• Domestic payment limited</li>
                      <li>• Cannot purchase land</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-account-nro">
                <CardHeader>
                  <CardTitle className="text-lg">NRO Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-emerald-600 mb-2">Advantages:</p>
                    <ul className="space-y-1">
                      <li>• Full domestic access</li>
                      <li>• Property purchase allowed</li>
                      <li>• Flexible transfers</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-600 mb-2">Tax:</p>
                    <ul className="space-y-1">
                      <li>• TDS on interest income</li>
                      <li>• Global income taxable</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-account-fcnr">
                <CardHeader>
                  <CardTitle className="text-lg">FCNR Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-emerald-600 mb-2">Advantages:</p>
                    <ul className="space-y-1">
                      <li>• Currency hedging</li>
                      <li>• Higher interest rates</li>
                      <li>• Foreign currency deposits</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-600 mb-2">Restrictions:</p>
                    <ul className="space-y-1">
                      <li>• Fixed tenure required</li>
                      <li>• Domestic use limited</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 md:py-24 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Success Stories</h2>
              <p className="text-muted-foreground">
                See how NRI investors have successfully invested in Indian real estate with AuditProp's guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card data-testid="card-case-study-1">
                <CardHeader>
                  <CardTitle>Rahul from USA - ₹2.5 Cr Investment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    "Investing from abroad was intimidating. AuditProp's NRI Suite made everything transparent. Within 3 months, I had a 30-year clean title, RERA verification, and complete tax compliance guidance. The fraud detection gave me confidence to proceed."
                  </p>
                  <p className="text-xs text-muted-foreground italic">— Verified NRI Investor, Silicon Valley</p>
                </CardContent>
              </Card>

              <Card data-testid="card-case-study-2">
                <CardHeader>
                  <CardTitle>Priya from UK - ₹1.8 Cr Investment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    "The NRE/NRO account comparison and tax guide saved me ₹3L in unnecessary taxes. AuditProp caught a red flag in the litigation history that my local consultant missed. Absolutely worth it."
                  </p>
                  <p className="text-xs text-muted-foreground italic">— Medical Professional, London</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Invest Confidently?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start your NRI property audit today. Comprehensive verification, compliance guidance, and peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    Start NRI Audit <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/nri">View Full NRI Suite</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AuditProp Technologies. All rights reserved.</p>
          <p className="mt-2">Empowering NRI investors with confidence and compliance.</p>
        </div>
      </footer>
    </div>
  );
}
