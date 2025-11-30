import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Star, Zap, TrendingUp } from "lucide-react";

export default function Pricing() {
  const credits = [
    {
      name: "Online Research Credits",
      icon: Zap,
      price: "₹999",
      period: "/property",
      description: "Fast online property verification",
      tagline: "1 Credit per property",
      features: [
        "MCA database verification",
        "RERA registration check",
        "Ownership verification",
        "Basic title search",
        "Court case availability check",
        "Financial encumbrance check",
        "PDF audit report",
      ],
      includesOffline: false,
      includesNRI: false,
      popular: true,
    },
    {
      name: "Deep Search Credits",
      icon: TrendingUp,
      price: "₹4,999",
      period: "/property",
      description: "Comprehensive online and offline verification",
      tagline: "1 Credit per property",
      features: [
        "All Online Research features +",
        "Offline property inspection report",
        "Revenue department records",
        "Sub-registrar document review",
        "District court litigation details",
        "High court case history",
        "Physical survey verification",
        "Detailed risk assessment",
        "Word document comprehensive report",
      ],
      includesOffline: true,
      includesNRI: false,
      highlighted: true,
    },
    {
      name: "NRI Suites Credits",
      icon: Shield,
      price: "₹12,999",
      period: "/property",
      description: "Complete due-diligence with NRI compliance",
      tagline: "1 Credit per property",
      features: [
        "All Deep Search features +",
        "NRI compliance verification",
        "NRI restrictions & limitations check",
        "Foreign remittance verification",
        "NRO account details verification",
        "NRI ownership succession check",
        "Tax residency verification",
        "RBI regulations compliance",
        "NRI-specific risk assessment",
        "Detailed NRI compliance report",
      ],
      includesOffline: true,
      includesNRI: true,
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
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Credit-Based Pricing</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Purchase credits for each property check. Choose the verification depth that suits your needs—from quick online research to comprehensive NRI due-diligence.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">How Credits Work</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white text-lg font-bold mb-3">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Choose Credit Type</h3>
                  <p className="text-sm text-muted-foreground">Select the verification level you need for each property</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white text-lg font-bold mb-3">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Use 1 Credit</h3>
                  <p className="text-sm text-muted-foreground">1 credit = 1 property verification of your chosen type</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white text-lg font-bold mb-3">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Get Report</h3>
                  <p className="text-sm text-muted-foreground">Download detailed audit report in PDF or Word format</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Packages Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {credits.map((credit, i) => {
                const IconComponent = credit.icon;
                return (
                  <Card
                    key={i}
                    className={`border-muted relative flex flex-col ${
                      credit.popular ? "ring-2 ring-primary shadow-lg" : ""
                    } ${
                      credit.highlighted ? "ring-2 ring-amber-500 shadow-lg md:scale-105" : ""
                    }`}
                  >
                    {credit.popular && (
                      <Badge className="absolute -top-3 left-4">Most Popular</Badge>
                    )}
                    {credit.highlighted && (
                      <Badge className="absolute -top-3 left-4 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                        <Star className="h-3 w-3" /> Best Value
                      </Badge>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="text-xl">{credit.name}</CardTitle>
                          <p className="text-xs text-amber-600 font-medium mt-1">{credit.tagline}</p>
                        </div>
                        <IconComponent className="h-6 w-6 text-primary flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground">{credit.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col">
                      <div>
                        <div className="text-4xl font-bold">{credit.price}</div>
                        <div className="text-sm text-muted-foreground">{credit.period}</div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant={credit.popular || credit.highlighted ? "default" : "outline"}
                        asChild
                      >
                        <Link href="/contact">Purchase Credits</Link>
                      </Button>

                      {/* Info badges */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-xs bg-muted/50 rounded p-2">
                          <span className="font-medium">Includes:</span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" />
                            Online Research
                          </span>
                          {credit.includesOffline && (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-emerald-500" />
                              Offline
                            </span>
                          )}
                          {credit.includesNRI && (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-emerald-500" />
                              NRI
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 flex-1">
                        {credit.features.map((feature, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Comparison Table */}
            <div className="bg-muted/30 rounded-lg p-6 border mb-12 overflow-x-auto">
              <h3 className="text-xl font-bold mb-6">Credit Comparison</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">Online Research</th>
                    <th className="text-center py-3 px-4 font-semibold">Deep Search</th>
                    <th className="text-center py-3 px-4 font-semibold">NRI Suites</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">MCA & RERA Verification</td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Offline Property Records</td>
                    <td className="text-center">—</td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Court & Litigation History</td>
                    <td className="text-center">Availability Check</td>
                    <td className="text-center">Detailed Details</td>
                    <td className="text-center">Detailed Details</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Physical Verification</td>
                    <td className="text-center">—</td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">NRI Compliance Check</td>
                    <td className="text-center">—</td>
                    <td className="text-center">—</td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Word Document Report</td>
                    <td className="text-center">PDF Only</td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                    <td className="text-center"><Check className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bulk Purchase Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border border-blue-200 dark:border-blue-800 text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Bulk Credit Packages</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Need multiple credits? Contact our sales team for volume discounts and custom bulk packages tailored to your business needs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="default" asChild>
                  <Link href="/contact">Request Bulk Pricing</Link>
                </Button>
                <Button variant="outline">
                  Schedule a Demo
                </Button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Do credits expire?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Credits remain active for 12 months from the date of purchase. Unused credits can be renewed or carried forward.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Can I upgrade a credit type?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Yes, you can upgrade from Online Research to Deep Search or NRI Suites by paying the difference. Contact our team for details.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">What's included in the NRI Suites package?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    NRI Suites includes all Deep Search features plus comprehensive NRI compliance verification, including NRI restrictions, foreign remittance checks, NRO account verification, and tax residency confirmation.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">How long does a property verification take?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Online Research credits typically deliver results within 24-48 hours. Deep Search and NRI Suites may take 5-7 business days due to offline verification requirements.
                  </CardContent>
                </Card>
              </div>
            </div>
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
