import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  TrendingUp,
  Search,
  Shield,
  ZapOff,
  FileText,
  User,
  DollarSign,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Download,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FraudAnalysis {
  propertyId: string;
  address: string;
  salePrice: number;
  overallScore: number;
  priceAnomaly: number;
  documentForger: number;
  sellerBehavior: number;
  titleFraud: number;
  doubleSaleRisk: number;
  benamiTransaction: number;
  flags: string[];
  alerts: { alert: string; severity: "low" | "medium" | "high" | "critical" }[];
  recommendation: string;
}

const FRAUD_ANALYSES: FraudAnalysis[] = [
  {
    propertyId: "PROP-001",
    address: "123 MG Road, Bangalore",
    salePrice: 8500000,
    overallScore: 12,
    priceAnomaly: 8,
    documentForger: 5,
    sellerBehavior: 3,
    titleFraud: 2,
    doubleSaleRisk: 4,
    benamiTransaction: 6,
    flags: ["Clean Title", "Good Documentation", "Market Price"],
    alerts: [
      { alert: "Recent transfer from builder", severity: "low" },
      { alert: "All documents verified", severity: "low" },
    ],
    recommendation: "SAFE - Proceed with confidence. Low fraud risk detected.",
  },
  {
    propertyId: "PROP-002",
    address: "456 Whitefield, Bangalore",
    salePrice: 6500000,
    overallScore: 35,
    priceAnomaly: 28,
    documentForger: 15,
    sellerBehavior: 22,
    titleFraud: 18,
    doubleSaleRisk: 12,
    benamiTransaction: 20,
    flags: ["Price below market", "Incomplete documentation", "Quick sale"],
    alerts: [
      { alert: "Property priced 25% below market value", severity: "high" },
      { alert: "Missing mutation records", severity: "medium" },
      { alert: "Multiple ownership transfers in 6 months", severity: "high" },
    ],
    recommendation: "CAUTION - Further investigation recommended. Verify title chain.",
  },
  {
    propertyId: "PROP-003",
    address: "789 Indiranagar, Bangalore",
    salePrice: 7200000,
    overallScore: 68,
    priceAnomaly: 55,
    documentForger: 42,
    sellerBehavior: 65,
    titleFraud: 72,
    doubleSaleRisk: 75,
    benamiTransaction: 58,
    flags: [
      "Extremely low price",
      "Forged documents suspected",
      "Suspicious seller behavior",
      "Double sale risk",
    ],
    alerts: [
      { alert: "Property priced 40% below market - possible benami transaction", severity: "critical" },
      { alert: "Document signatures do not match historical records", severity: "critical" },
      { alert: "Seller has multiple simultaneous property sales", severity: "critical" },
      { alert: "Title chain broken - 3 years of records missing", severity: "high" },
      { alert: "Property already registered to another buyer", severity: "critical" },
    ],
    recommendation:
      "HIGH RISK - DO NOT PROCEED. Multiple critical fraud indicators detected. Escalate to authorities.",
  },
];

const FRAUD_ALGORITHM_FACTORS = [
  {
    name: "Price Anomaly",
    description: "Detects prices significantly below market rate indicating potential distress or fraud",
    indicators: [
      "< Market value by 30%+",
      "Sudden price drops",
      "Unexplained discounts",
    ],
  },
  {
    name: "Document Forgery",
    description: "Analyzes document authenticity using AI and historical record matching",
    indicators: [
      "Signature mismatch",
      "Document inconsistencies",
      "Forged stamps/seals",
      "Whitespace anomalies",
    ],
  },
  {
    name: "Seller Behavior",
    description: "Flags unusual seller patterns indicating potential fraud",
    indicators: [
      "Multiple simultaneous sales",
      "Rapid ownership transfers",
      "Fake identities",
      "Payment irregularities",
    ],
  },
  {
    name: "Title Fraud",
    description: "Identifies issues with property ownership and title chain",
    indicators: [
      "Broken title chain",
      "Conflicting ownership claims",
      "Missing mutation records",
      "Unauthorized transfers",
    ],
  },
  {
    name: "Double Sale Risk",
    description: "Detects when property is sold to multiple buyers simultaneously",
    indicators: [
      "Multiple registrations",
      "Conflicting agreements",
      "Overlapping time periods",
      "Registry inconsistencies",
    ],
  },
  {
    name: "Benami Transaction",
    description: "Identifies property purchases made in someone else's name",
    indicators: [
      "Buyer not in possession",
      "Rental agreements to other parties",
      "Undisclosed beneficial owner",
      "Suspicious funding source",
    ],
  },
];

export default function FraudDetection() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<FraudAnalysis | null>(null);
  const [salePriceInput, setSalePriceInput] = useState("");
  const [propertyIdInput, setPropertyIdInput] = useState("");

  const handleAnalyze = () => {
    if (!propertyIdInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a property ID to analyze.",
      });
      return;
    }

    const analysis = FRAUD_ANALYSES.find((a) =>
      a.propertyId.toLowerCase().includes(propertyIdInput.toLowerCase())
    );

    if (analysis) {
      setSelectedAnalysis(analysis);
      toast({
        title: "Analysis Complete",
        description: `Fraud risk assessment for ${analysis.address} completed.`,
      });
    } else {
      toast({
        title: "Property Not Found",
        description: "Try searching for PROP-001, PROP-002, or PROP-003.",
      });
    }
  };

  const radarData = selectedAnalysis
    ? [
        { metric: "Price Anomaly", value: selectedAnalysis.priceAnomaly },
        { metric: "Document Forgery", value: selectedAnalysis.documentForger },
        { metric: "Seller Behavior", value: selectedAnalysis.sellerBehavior },
        { metric: "Title Fraud", value: selectedAnalysis.titleFraud },
        { metric: "Double Sale", value: selectedAnalysis.doubleSaleRisk },
        { metric: "Benami", value: selectedAnalysis.benamiTransaction },
      ]
    : [];

  const riskHistoryData = [
    { date: "Jan", avgRisk: 15, highRisk: 5, critical: 1 },
    { date: "Feb", avgRisk: 18, highRisk: 7, critical: 2 },
    { date: "Mar", avgRisk: 22, highRisk: 9, critical: 2 },
    { date: "Apr", avgRisk: 19, highRisk: 8, critical: 1 },
    { date: "May", avgRisk: 25, highRisk: 12, critical: 3 },
    { date: "Jun", avgRisk: 23, highRisk: 10, critical: 2 },
  ];

  const scoreDistribution = FRAUD_ANALYSES.map((a, i) => ({
    name: `Property ${i + 1}`,
    score: a.overallScore,
  }));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Fraud Detection & Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered comprehensive fraud detection using 6 advanced algorithms
            </p>
          </div>
          <Button className="gap-2" data-testid="button-export-analysis">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Search & Analyze */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Property Fraud Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Property ID (e.g., PROP-001)"
                value={propertyIdInput}
                onChange={(e) => setPropertyIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                data-testid="input-property-id-fraud"
              />
              <Input
                placeholder="Sale Price (₹)"
                value={salePriceInput}
                onChange={(e) => setSalePriceInput(e.target.value)}
                type="number"
                data-testid="input-sale-price-fraud"
              />
              <Button onClick={handleAnalyze} className="gap-2" data-testid="button-analyze">
                <Zap className="h-4 w-4" /> Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {selectedAnalysis && (
          <>
            {/* Overall Score */}
            <Card
              className={
                selectedAnalysis.overallScore > 60
                  ? "border-red-200 bg-red-50"
                  : selectedAnalysis.overallScore > 30
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedAnalysis.address}</CardTitle>
                    <CardDescription>{selectedAnalysis.propertyId}</CardDescription>
                  </div>
                  <Badge
                    className={
                      selectedAnalysis.overallScore > 60
                        ? "bg-red-100 text-red-700 text-lg px-4 py-2"
                        : selectedAnalysis.overallScore > 30
                        ? "bg-amber-100 text-amber-700 text-lg px-4 py-2"
                        : "bg-emerald-100 text-emerald-700 text-lg px-4 py-2"
                    }
                    data-testid="badge-overall-score"
                  >
                    {selectedAnalysis.overallScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">Fraud Risk Level</span>
                    <span
                      className={`text-sm font-semibold ${
                        selectedAnalysis.overallScore > 60
                          ? "text-red-700"
                          : selectedAnalysis.overallScore > 30
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                      data-testid="text-risk-level"
                    >
                      {selectedAnalysis.overallScore > 60
                        ? "HIGH RISK"
                        : selectedAnalysis.overallScore > 30
                        ? "MEDIUM RISK"
                        : "LOW RISK"}
                    </span>
                  </div>
                  <Progress value={selectedAnalysis.overallScore} className="h-3" />
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-semibold text-sm mb-2">Recommendation:</p>
                  <p className="text-sm" data-testid="text-recommendation">
                    {selectedAnalysis.recommendation}
                  </p>
                </div>

                {selectedAnalysis.salePrice && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Sale Price</p>
                      <p className="font-semibold" data-testid="text-sale-price">
                        ₹{selectedAnalysis.salePrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Fraud Risk Factors Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Risk Score"
                      dataKey="value"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Risk Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Price Anomaly", score: selectedAnalysis.priceAnomaly },
                  { label: "Document Forgery", score: selectedAnalysis.documentForger },
                  { label: "Seller Behavior", score: selectedAnalysis.sellerBehavior },
                  { label: "Title Fraud", score: selectedAnalysis.titleFraud },
                  { label: "Double Sale Risk", score: selectedAnalysis.doubleSaleRisk },
                  { label: "Benami Transaction", score: selectedAnalysis.benamiTransaction },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2" data-testid={`score-${item.label.toLowerCase()}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <Badge
                        variant={
                          item.score > 60 ? "destructive" : item.score > 30 ? "secondary" : "outline"
                        }
                      >
                        {item.score}/100
                      </Badge>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            {selectedAnalysis.alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Fraud Alerts ({selectedAnalysis.alerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedAnalysis.alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          alert.severity === "critical"
                            ? "bg-red-50 border-red-200"
                            : alert.severity === "high"
                            ? "bg-orange-50 border-orange-200"
                            : alert.severity === "medium"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                        data-testid={`alert-${idx}`}
                      >
                        <div className="flex items-start gap-2">
                          {alert.severity === "critical" && (
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.alert}</p>
                            <Badge
                              className="mt-1"
                              variant={
                                alert.severity === "critical"
                                  ? "destructive"
                                  : alert.severity === "high"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Flags */}
            {selectedAnalysis.flags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.flags.map((flag, idx) => (
                      <Badge key={idx} variant="secondary" data-testid={`flag-${idx}`}>
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Fraud Algorithm Details */}
        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="algorithms">Algorithm Details</TabsTrigger>
            <TabsTrigger value="trends">Fraud Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="mt-6 space-y-4">
            {FRAUD_ALGORITHM_FACTORS.map((factor, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{factor.name}</CardTitle>
                  <CardDescription>{factor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {factor.indicators.map((indicator, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm" data-testid={`indicator-${idx}-${i}`}>
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        {indicator}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trends" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Cases Detected (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={riskHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgRisk" fill="#3b82f6" name="Average Risk" />
                    <Bar dataKey="highRisk" fill="#f59e0b" name="High Risk Cases" />
                    <Bar dataKey="critical" fill="#ef4444" name="Critical Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
