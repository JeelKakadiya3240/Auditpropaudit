import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Star } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "For individual users and small teams",
      features: [
        "Basic property audit",
        "Ownership verification",
        "Court case history",
        "PDF report",
        "Email support",
      ],
      cta: "Start Now",
      popular: true,
    },
    {
      name: "Property Verification",
      price: "₹24,999",
      period: "/property",
      description: "Comprehensive property verification and analysis",
      features: [
        "360° property due-diligence",
        "30-year title verification",
        "Fraud detection analysis",
        "Complete documentation review",
        "RERA compliance check",
        "Litigation history search",
        "Detailed risk assessment",
        "Word document report",
      ],
      cta: "Request Quote",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Unlimited audits",
        "Advanced risk scoring",
        "Custom data sources",
        "Unlimited batch processing",
        "Dedicated API",
        "24/7 phone support",
        "SLA guarantee (99.9%)",
        "Custom integrations",
      ],
      cta: "Contact Sales",
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the perfect plan for your property audit needs. No hidden fees.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {plans.map((plan, i) => (
                <Card
                  key={i}
                  className={`border-muted relative ${
                    plan.popular ? "ring-2 ring-primary shadow-lg" : ""
                  } ${
                    plan.highlighted ? "ring-2 ring-amber-500 shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-4">Most Popular</Badge>
                  )}
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-4 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                      <Star className="h-3 w-3" /> Premium
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.period}</div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={plan.popular || plan.highlighted ? "default" : "outline"}
                      asChild={plan.name === "Property Verification" || plan.name === "Enterprise"}
                    >
                      {(plan.name === "Property Verification" || plan.name === "Enterprise") ? (
                        <Link href="/contact">{plan.cta}</Link>
                      ) : (
                        plan.cta
                      )}
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-8 border-2 border-primary/20 text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-2xl font-bold">Custom Solutions</h2>
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Need something tailored to your unique requirements? Our enterprise team specializes in building custom solutions for large organizations, agencies, and specialized use cases. We offer flexible pricing, dedicated support, and full integration assistance.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="default" asChild>
                  <Link href="/contact">Contact Sales Team</Link>
                </Button>
                <Button variant="outline">
                  Schedule a Demo
                </Button>
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
