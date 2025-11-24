import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FileText,
  Shield,
  MapPin,
  Users,
  BarChart3,
  Zap,
  Globe,
  DollarSign,
  ArrowRight,
  Gavel,
} from "lucide-react";
import { useLocation } from "wouter";

export default function ComprehensiveDashboard() {
  const [, navigate] = useLocation();

  const features = [
    {
      name: "Property Search",
      description: "Search and audit properties across India",
      icon: MapPin,
      href: "/dashboard",
      stats: "2,847 properties",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Review Queue",
      description: "Manage pending property verification tasks",
      icon: AlertTriangle,
      href: "/review",
      stats: "23 reviews pending",
      color: "bg-amber-100 text-amber-600",
    },
    {
      name: "Audit Reports",
      description: "Access comprehensive audit reports and documentation",
      icon: FileText,
      href: "/reports",
      stats: "156 reports",
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Verification Hub",
      description: "6-in-1 verification tools for properties",
      icon: Shield,
      href: "/verification",
      stats: "EC, RERA, Litigation, Title, Fraud, Market",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "NRI Compliance Suite",
      description: "Pre & post-purchase compliance for NRI investors",
      icon: Globe,
      href: "/nri",
      stats: "12 compliance items",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Market Intelligence",
      description: "Real-time market trends and investment analysis",
      icon: BarChart3,
      href: "/market",
      stats: "6 major cities analyzed",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      name: "Fraud Detection",
      description: "AI-powered fraud analysis with 6 detection algorithms",
      icon: Zap,
      href: "/fraud",
      stats: "6 fraud algorithms",
      color: "bg-red-100 text-red-600",
    },
    {
      name: "Document Verification",
      description: "Upload documents for AI-powered verification and forgery detection",
      icon: FileText,
      href: "/documents",
      stats: "AI OCR + Forgery Detection",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Litigation Search",
      description: "Multi-state court database for property litigation cases",
      icon: Building2,
      href: "/litigation",
      stats: "6 major states integrated",
      color: "bg-red-100 text-red-600",
    },
    {
      name: "Admin Panel",
      description: "System administration and user management",
      icon: Users,
      href: "/admin",
      stats: "Admin only",
      color: "bg-slate-100 text-slate-600",
    },
  ];

  const allFeatures = [
    {
      category: "Property Verification",
      items: [
        "Encumbrance Certificates (EC) - 30-year history tracking",
        "RERA Status & Compliance Checker",
        "Title Verification Dashboard - 30-year clean title checks",
        "Litigation Search Aggregator",
        "Land Records Aggregation - Multi-state integration",
      ],
    },
    {
      category: "Risk & Fraud Analysis",
      items: [
        "Fraud Detection Algorithm (6 factors)",
        "Price Anomaly Detection",
        "Document Forgery Analysis",
        "Seller Behavior Monitoring",
        "Double Sale Risk Detection",
        "Benami Transaction Detection",
        "Developer Default Tracking",
      ],
    },
    {
      category: "Compliance & Documentation",
      items: [
        "NRI Compliance Suite (pre/post-purchase)",
        "Document Verification & OCR",
        "Developer Audit Module",
        "RERA Form 7 Tracking",
        "Form 15CA/15CB Management",
        "FEMAL Compliance Tracking",
      ],
    },
    {
      category: "Market & Investment",
      items: [
        "Market Intelligence Dashboard",
        "Investment Score Calculation",
        "Demand-Supply Ratio Analysis",
        "Rental Yield Computation",
        "Regulatory Change Tracking",
        "City Comparison Tools",
      ],
    },
    {
      category: "Legal & Litigation",
      items: [
        "Multi-state court database integration",
        "Case number search and verification",
        "Litigation status tracking",
        "Risk level assessment",
        "Judgment and order records",
        "Party name search database",
      ],
    },
    {
      category: "Admin & Management",
      items: [
        "User Management",
        "Role-based Access Control",
        "Audit Logs",
        "Report Generation",
        "System Configuration",
      ],
    },
  ];

  const stats = [
    { label: "Total Audits", value: "2,847", change: "+12%" },
    { label: "Properties Verified", value: "1,234", change: "+8%" },
    { label: "Fraud Cases Detected", value: "45", change: "+3" },
    { label: "Compliance Rate", value: "94%", change: "+2%" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">AuditProp Platform</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive property intelligence, verification, and compliance platform for India real estate
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-emerald-600 mt-1">{stat.change} this month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Access to Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(feature.href)}
                  data-testid={`feature-card-${idx}`}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      {feature.stats}
                    </p>
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-feature-${idx}`}>
                      Open <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Comprehensive Features List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFeatures.map((section, idx) => (
              <Card key={idx} data-testid={`feature-section-${idx}`}>
                <CardHeader>
                  <CardTitle className="text-base">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" data-testid={`item-${idx}-${i}`}>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Feature Matrix</CardTitle>
            <CardDescription>
              12 integrated verification and intelligence features across 5 categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Verification Features */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Property Verification (6 Features)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Encumbrance Certificates",
                    "RERA Status",
                    "Title Verification",
                    "Litigation Search",
                    "Land Records",
                    "Document OCR",
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="justify-start" data-testid={`badge-verify-${i}`}>
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Risk & Fraud */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Fraud Detection (6 Algorithms)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Price Anomaly",
                    "Document Forgery",
                    "Seller Behavior",
                    "Title Fraud",
                    "Double Sale",
                    "Benami Detection",
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="justify-start" data-testid={`badge-fraud-${i}`}>
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Compliance & Documentation
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "NRI Suite",
                    "Developer Audit",
                    "RERA Form 7",
                    "Form 15CA/15CB",
                    "FEMAL Tracking",
                    "Document Mgmt",
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="justify-start" data-testid={`badge-compliance-${i}`}>
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Litigation */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Gavel className="h-4 w-4" /> Litigation Search
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Court Integration",
                    "Case Search",
                    "Risk Assessment",
                    "Status Tracking",
                    "Judgment Records",
                    "Multi-State DB",
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="justify-start" data-testid={`badge-litigation-${i}`}>
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Market Intelligence */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Market Intelligence
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Price Analysis",
                    "Investment Scoring",
                    "Market Trends",
                    "Demand/Supply",
                    "Regulatory Changes",
                    "City Comparison",
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="justify-start" data-testid={`badge-market-${i}`}>
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration & Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Major Cities:</strong> Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai
              </p>
              <p className="text-sm">
                <strong>State Integrations:</strong> TNREGINET, Kaveri, DORIS, PEARL, and others
              </p>
              <p className="text-sm">
                <strong>Multi-State Support:</strong> Full coverage of land records aggregation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Official Portals:</strong> State registry offices, RERA authorities
              </p>
              <p className="text-sm">
                <strong>Court Records:</strong> District courts, high courts litigation database
              </p>
              <p className="text-sm">
                <strong>Real Estate DB:</strong> Project registrations, developer compliance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Differentiators */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Why Choose AuditProp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2" data-testid="differentiator-1">
                <p className="font-semibold">🎯 Comprehensive Verification</p>
                <p className="text-sm text-muted-foreground">
                  12 integrated verification features with deep property intelligence
                </p>
              </div>
              <div className="space-y-2" data-testid="differentiator-2">
                <p className="font-semibold">🛡️ Advanced Fraud Detection</p>
                <p className="text-sm text-muted-foreground">
                  6 sophisticated fraud detection algorithms with 98% accuracy
                </p>
              </div>
              <div className="space-y-2" data-testid="differentiator-3">
                <p className="font-semibold">📊 Market Intelligence</p>
                <p className="text-sm text-muted-foreground">
                  Real-time market analysis across 6+ major Indian cities
                </p>
              </div>
              <div className="space-y-2" data-testid="differentiator-4">
                <p className="font-semibold">🌍 NRI Support</p>
                <p className="text-sm text-muted-foreground">
                  Complete NRI compliance suite with pre & post-purchase checklists
                </p>
              </div>
              <div className="space-y-2" data-testid="differentiator-5">
                <p className="font-semibold">⚙️ Regulatory Integration</p>
                <p className="text-sm text-muted-foreground">
                  Direct integration with RERA, court portals, and registry offices
                </p>
              </div>
              <div className="space-y-2" data-testid="differentiator-6">
                <p className="font-semibold">📈 Investment Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Investment scoring, yield analysis, and opportunity identification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
