import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹499",
      period: "/audit",
      description: "For individual users and small teams",
      features: [
        "Basic property audit",
        "Ownership verification",
        "Court case history",
        "PDF report",
        "Email support",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: "₹4,999",
      period: "/month",
      description: "For growing real estate teams",
      features: [
        "Unlimited audits",
        "Advanced risk scoring",
        "Loan encumbrance tracking",
        "Batch processing (100/day)",
        "API access (10k calls/month)",
        "Priority support",
        "Custom reports",
      ],
      cta: "Get Started",
      popular: true,
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
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan, i) => (
                <Card
                  key={i}
                  className={`border-muted relative ${plan.popular ? "ring-2 ring-primary shadow-lg" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-4">Most Popular</Badge>
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

                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.cta}
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

            <div className="bg-muted/30 rounded-lg p-8 border text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Enterprise Support</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Need a custom solution? Our enterprise team is ready to discuss your unique requirements and build a tailored plan.
              </p>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Contact Sales Team</Link>
              </Button>
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
