import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  MapPin,
  Home,
  DollarSign,
  BarChart3,
  Zap,
  Building2,
  Landmark,
  Trees,
  Droplets,
  Wind,
  Lightbulb,
  Shield,
  RotateCcw,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock property valuation data
const MOCK_PROPERTIES_VALUATION = [
  {
    id: "VAL-2024-001",
    propertyName: "Modern Apartment - Koramangala",
    address: "12A, 3rd Cross Road, Koramangala, Bangalore",
    propertyType: "Residential - Apartment",
    landArea: "1200 sqft",
    builtupArea: "950 sqft",
    yearBuilt: 2015,
    age: 9,
    technicalChecks: {
      structuralIntegrity: 85,
      roofCondition: 80,
      plumbing: 75,
      electrical: 88,
      paintingCondition: 70,
      flooringCondition: 82,
      windowsAndDoors: 78,
      waterProofing: 72,
      terraceShed: 65,
      overallScore: 78,
    },
    fundamentalChecks: {
      locationDemand: 90,
      proximityToAmenities: 85,
      transportAccess: 88,
      schoolNearby: 92,
      hospitalNearby: 87,
      marketComparables: 83,
      legalCompliance: 95,
      titleClear: 98,
      taxCompliance: 90,
      encumbranceStatus: 88,
      overallScore: 90,
    },
    marketValue: 6500000,
    estimatedValuation: 6200000,
    valuationRange: {
      min: 5900000,
      max: 6500000,
    },
    pricePerSqft: 6500,
    marketTrend: "stable",
    investmentRating: "A",
    riskLevel: "low",
  },
  {
    id: "VAL-2024-002",
    propertyName: "Commercial Office - Bandra",
    address: "5B, Marine Drive, Colaba, Mumbai",
    propertyType: "Commercial - Office",
    landArea: "3000 sqft",
    builtupArea: "2800 sqft",
    yearBuilt: 2010,
    age: 14,
    technicalChecks: {
      structuralIntegrity: 72,
      roofCondition: 68,
      plumbing: 70,
      electrical: 75,
      paintingCondition: 55,
      flooringCondition: 65,
      windowsAndDoors: 70,
      waterProofing: 60,
      terraceShed: 50,
      overallScore: 66,
    },
    fundamentalChecks: {
      locationDemand: 95,
      proximityToAmenities: 90,
      transportAccess: 92,
      schoolNearby: 70,
      hospitalNearby: 85,
      marketComparables: 88,
      legalCompliance: 92,
      titleClear: 95,
      taxCompliance: 85,
      encumbranceStatus: 90,
      overallScore: 88,
    },
    marketValue: 42000000,
    estimatedValuation: 39500000,
    valuationRange: {
      min: 38000000,
      max: 42000000,
    },
    pricePerSqft: 14100,
    marketTrend: "declining",
    investmentRating: "B+",
    riskLevel: "moderate",
  },
  {
    id: "VAL-2024-003",
    propertyName: "Villa - Vasant Kunj",
    address: "42, Sector-12, Vasant Kunj, New Delhi",
    propertyType: "Residential - Villa",
    landArea: "2500 sqft",
    builtupArea: "1800 sqft",
    yearBuilt: 2018,
    age: 6,
    technicalChecks: {
      structuralIntegrity: 92,
      roofCondition: 90,
      plumbing: 88,
      electrical: 92,
      paintingCondition: 85,
      flooringCondition: 90,
      windowsAndDoors: 88,
      waterProofing: 92,
      terraceShed: 88,
      overallScore: 89,
    },
    fundamentalChecks: {
      locationDemand: 88,
      proximityToAmenities: 85,
      transportAccess: 82,
      schoolNearby: 90,
      hospitalNearby: 88,
      marketComparables: 86,
      legalCompliance: 98,
      titleClear: 99,
      taxCompliance: 95,
      encumbranceStatus: 92,
      overallScore: 90,
    },
    marketValue: 25000000,
    estimatedValuation: 24200000,
    valuationRange: {
      min: 23500000,
      max: 25500000,
    },
    pricePerSqft: 13400,
    marketTrend: "appreciating",
    investmentRating: "A+",
    riskLevel: "low",
  },
  {
    id: "VAL-2024-004",
    propertyName: "Plot - Ahmedabad",
    address: "78, Ahmedabad Road, Ahmedabad, Gujarat",
    propertyType: "Residential - Plot",
    landArea: "1500 sqft",
    builtupArea: "0 sqft",
    yearBuilt: null,
    age: 0,
    technicalChecks: {
      structuralIntegrity: 0,
      roofCondition: 0,
      plumbing: 0,
      electrical: 0,
      paintingCondition: 0,
      flooringCondition: 0,
      windowsAndDoors: 0,
      waterProofing: 0,
      terraceShed: 0,
      overallScore: 0,
    },
    fundamentalChecks: {
      locationDemand: 75,
      proximityToAmenities: 70,
      transportAccess: 72,
      schoolNearby: 65,
      hospitalNearby: 68,
      marketComparables: 72,
      legalCompliance: 85,
      titleClear: 90,
      taxCompliance: 80,
      encumbranceStatus: 85,
      overallScore: 76,
    },
    marketValue: 4000000,
    estimatedValuation: 3800000,
    valuationRange: {
      min: 3500000,
      max: 4200000,
    },
    pricePerSqft: 2533,
    marketTrend: "stable",
    investmentRating: "B",
    riskLevel: "moderate",
  },
];

const getInvestmentColor = (rating: string) => {
  switch (rating) {
    case "A+":
      return "text-emerald-600 bg-emerald-50";
    case "A":
      return "text-green-600 bg-green-50";
    case "B+":
      return "text-amber-600 bg-amber-50";
    case "B":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-red-600 bg-red-50";
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "bg-emerald-500/10 text-emerald-700";
    case "moderate":
      return "bg-amber-500/10 text-amber-700";
    case "high":
      return "bg-red-500/10 text-red-700";
    default:
      return "bg-gray-500/10 text-gray-700";
  }
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

export default function PropertyValuation() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const filteredProperties = MOCK_PROPERTIES_VALUATION.filter((property) =>
    property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPropertyData = selectedProperty
    ? MOCK_PROPERTIES_VALUATION.find((p) => p.id === selectedProperty)
    : null;

  const handleDownloadReport = () => {
    toast({
      title: "Valuation Report Generated",
      description: "Your property valuation report is being prepared for download.",
    });
  };

  const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
    const getScoreColor = (s: number) => {
      if (s >= 85) return "text-emerald-600";
      if (s >= 70) return "text-blue-600";
      if (s >= 50) return "text-amber-600";
      return "text-red-600";
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${
                score >= 85 ? "#10b981" : score >= 70 ? "#3b82f6" : score >= 50 ? "#f59e0b" : "#ef4444"
              } ${score}%, #e5e7eb ${score}%)`,
            }}
          ></div>
          <span className={`relative text-lg font-bold z-10 ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Property Valuation Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Advanced valuation estimates based on technical assessments and fundamental market analysis.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Search */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Search Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Name / Address</label>
                    <Input
                      placeholder="Search property..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-valuation-search"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Properties List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Properties ({filteredProperties.length})</h3>
                {filteredProperties.map((property) => (
                  <Card
                    key={property.id}
                    className={`cursor-pointer transition-all ${
                      selectedProperty === property.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedProperty(property.id)}
                    data-testid={`card-valuation-property-${property.id}`}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="font-medium text-sm line-clamp-2">{property.propertyName}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground line-clamp-1">{property.address}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className={getInvestmentColor(property.investmentRating)}>
                            {property.investmentRating}
                          </Badge>
                          <span className="text-xs font-semibold text-blue-600">{formatCurrency(property.marketValue)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Panel - Property Details */}
            <div className="lg:col-span-2">
              {selectedPropertyData ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="text-xs" data-testid="tab-valuation-overview">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="text-xs" data-testid="tab-valuation-technical">
                      Technical
                    </TabsTrigger>
                    <TabsTrigger value="fundamental" className="text-xs" data-testid="tab-valuation-fundamental">
                      Fundamental
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="text-xs" data-testid="tab-valuation-analysis">
                      Analysis
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{selectedPropertyData.propertyName}</CardTitle>
                            <CardDescription>{selectedPropertyData.address}</CardDescription>
                          </div>
                          <Badge className={getInvestmentColor(selectedPropertyData.investmentRating)}>
                            {selectedPropertyData.investmentRating}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Valuation Summary */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold mb-4">Valuation Estimate</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Estimated Value</p>
                              <p className="font-bold text-lg text-blue-600">{formatCurrency(selectedPropertyData.estimatedValuation)}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Market Value</p>
                              <p className="font-bold text-lg text-green-600">{formatCurrency(selectedPropertyData.marketValue)}</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Price/SqFt</p>
                              <p className="font-bold text-lg text-amber-600">₹{selectedPropertyData.pricePerSqft.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Valuation Range */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold mb-3">Valuation Range</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Minimum</span>
                                <span className="font-medium">{formatCurrency(selectedPropertyData.valuationRange.min)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      ((selectedPropertyData.estimatedValuation - selectedPropertyData.valuationRange.min) /
                                        (selectedPropertyData.valuationRange.max - selectedPropertyData.valuationRange.min)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm mt-2">
                                <span className="text-muted-foreground">Maximum</span>
                                <span className="font-medium">{formatCurrency(selectedPropertyData.valuationRange.max)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold mb-3">Property Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium">{selectedPropertyData.propertyType}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Age</p>
                              <p className="font-medium">{selectedPropertyData.age === 0 ? "New" : `${selectedPropertyData.age} years`}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Land Area</p>
                              <p className="font-medium">{selectedPropertyData.landArea}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Builtup Area</p>
                              <p className="font-medium">{selectedPropertyData.builtupArea}</p>
                            </div>
                          </div>
                        </div>

                        {/* Investment Metrics */}
                        <div>
                          <h4 className="font-semibold mb-3">Investment Metrics</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                              <Badge className={getRiskColor(selectedPropertyData.riskLevel)}>
                                {selectedPropertyData.riskLevel.charAt(0).toUpperCase() + selectedPropertyData.riskLevel.slice(1)}
                              </Badge>
                            </div>
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Market Trend</p>
                              <Badge variant="outline">
                                {selectedPropertyData.marketTrend === "appreciating"
                                  ? "📈 Rising"
                                  : selectedPropertyData.marketTrend === "declining"
                                  ? "📉 Falling"
                                  : "➡️ Stable"}
                              </Badge>
                            </div>
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Rating</p>
                              <span className={`font-bold text-lg ${getInvestmentColor(selectedPropertyData.investmentRating)}`}>
                                {selectedPropertyData.investmentRating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleDownloadReport} className="w-full gap-2" data-testid="button-download-valuation">
                          <Download className="h-4 w-4" />
                          Download Valuation Report
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Technical Checks Tab */}
                  <TabsContent value="technical" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Technical Assessment</CardTitle>
                        <CardDescription>Property condition and structural evaluation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {selectedPropertyData.age === 0 ? (
                          <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                            <p className="font-semibold">Plot - No Structures</p>
                            <p className="text-sm text-muted-foreground">Technical assessment not applicable for plots</p>
                          </div>
                        ) : (
                          <>
                            {/* Overall Technical Score */}
                            <div className="flex justify-center pb-4">
                              <ScoreGauge
                                score={selectedPropertyData.technicalChecks.overallScore}
                                label="Overall Technical Score"
                              />
                            </div>

                            {/* Individual Checks */}
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { label: "Structural Integrity", icon: Building2 },
                                { label: "Roof Condition", icon: Home },
                                { label: "Plumbing", icon: Droplets },
                                { label: "Electrical", icon: Lightbulb },
                                { label: "Painting Condition", icon: RotateCcw },
                                { label: "Flooring Condition", icon: Landmark },
                                { label: "Windows & Doors", icon: Zap },
                                { label: "Water Proofing", icon: Shield },
                              ].map((item, idx) => {
                                const key = item.label
                                  .toLowerCase()
                                  .replace(/ /g, "")
                                  .replace(/&/g, "and");
                                const value =
                                  selectedPropertyData.technicalChecks[
                                    key as keyof typeof selectedPropertyData.technicalChecks
                                  ];
                                const IconComponent = item.icon;

                                return (
                                  <div key={idx} className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <IconComponent className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${
                                            (value as number) >= 80
                                              ? "bg-emerald-500"
                                              : (value as number) >= 60
                                              ? "bg-blue-500"
                                              : "bg-amber-500"
                                          }`}
                                          style={{ width: `${(value as number)}%` }}
                                        ></div>
                                      </div>
                                      <span className="font-semibold text-sm w-8">{value}%</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Recommendations */}
                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-3">Technical Recommendations</h4>
                              <div className="space-y-2">
                                {selectedPropertyData.technicalChecks.overallScore >= 85 ? (
                                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Property is in excellent condition with minimal maintenance required</span>
                                  </div>
                                ) : selectedPropertyData.technicalChecks.overallScore >= 70 ? (
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Property is in good condition. Minor repairs recommended for optimal value</span>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Property requires significant repairs and maintenance. Budget ₹5-15L for upgrades</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Fundamental Checks Tab */}
                  <TabsContent value="fundamental" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fundamental Assessment</CardTitle>
                        <CardDescription>Market position and regulatory compliance</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overall Fundamental Score */}
                        <div className="flex justify-center pb-4">
                          <ScoreGauge
                            score={selectedPropertyData.fundamentalChecks.overallScore}
                            label="Overall Fundamental Score"
                          />
                        </div>

                        {/* Individual Checks */}
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Location Demand", icon: MapPin },
                            { label: "Proximity To Amenities", icon: Building2 },
                            { label: "Transport Access", icon: Zap },
                            { label: "School Nearby", icon: Landmark },
                            { label: "Hospital Nearby", icon: Shield },
                            { label: "Market Comparables", icon: BarChart3 },
                            { label: "Legal Compliance", icon: FileText },
                            { label: "Title Clear", icon: CheckCircle2 },
                          ].map((item, idx) => {
                            const key = item.label
                              .toLowerCase()
                              .replace(/ /g, "")
                              .replace(/to/g, "");
                            const value =
                              selectedPropertyData.fundamentalChecks[
                                key as keyof typeof selectedPropertyData.fundamentalChecks
                              ];
                            const IconComponent = item.icon;

                            return (
                              <div key={idx} className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <IconComponent className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full ${
                                        (value as number) >= 85
                                          ? "bg-emerald-500"
                                          : (value as number) >= 70
                                          ? "bg-blue-500"
                                          : "bg-amber-500"
                                      }`}
                                      style={{ width: `${(value as number)}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-semibold text-sm w-8">{value}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Compliance Status */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3">Compliance Status</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">Legal Compliance</span>
                              <Badge className="bg-emerald-500">
                                {selectedPropertyData.fundamentalChecks.legalCompliance >= 85 ? "✓ Compliant" : "⚠ Issues"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">Title Status</span>
                              <Badge className="bg-emerald-500">
                                {selectedPropertyData.fundamentalChecks.titleClear >= 95 ? "✓ Clear" : "⚠ Encumbered"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">Tax Compliance</span>
                              <Badge className={selectedPropertyData.fundamentalChecks.taxCompliance >= 85 ? "bg-emerald-500" : "bg-amber-500"}>
                                {selectedPropertyData.fundamentalChecks.taxCompliance >= 85 ? "✓ Current" : "⚠ Overdue"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analysis Tab */}
                  <TabsContent value="analysis" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Valuation Analysis</CardTitle>
                        <CardDescription>Detailed insights and market comparison</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Combined Scores */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Technical Score</p>
                            <p className="text-2xl font-bold text-blue-600">{selectedPropertyData.technicalChecks.overallScore}%</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {selectedPropertyData.technicalChecks.overallScore >= 85 ? "Excellent Condition" :
                               selectedPropertyData.technicalChecks.overallScore >= 70 ? "Good Condition" :
                               selectedPropertyData.technicalChecks.overallScore >= 50 ? "Fair Condition" : "Poor Condition"}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Fundamental Score</p>
                            <p className="text-2xl font-bold text-green-600">{selectedPropertyData.fundamentalChecks.overallScore}%</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {selectedPropertyData.fundamentalChecks.overallScore >= 85 ? "Strong Market Position" :
                               selectedPropertyData.fundamentalChecks.overallScore >= 70 ? "Good Market Position" : "Moderate Position"}
                            </p>
                          </div>
                        </div>

                        {/* Investment Summary */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3">Investment Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span className="text-sm">Investment Rating</span>
                              <span className={`font-bold ${getInvestmentColor(selectedPropertyData.investmentRating)}`}>
                                {selectedPropertyData.investmentRating}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span className="text-sm">Risk Level</span>
                              <Badge className={getRiskColor(selectedPropertyData.riskLevel)}>
                                {selectedPropertyData.riskLevel.charAt(0).toUpperCase() + selectedPropertyData.riskLevel.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span className="text-sm">Market Trend</span>
                              <Badge variant="outline">
                                {selectedPropertyData.marketTrend === "appreciating"
                                  ? "📈 Appreciating"
                                  : selectedPropertyData.marketTrend === "declining"
                                  ? "📉 Declining"
                                  : "➡️ Stable"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Valuation Justification */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3">Valuation Justification</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Estimated at {formatCurrency(selectedPropertyData.estimatedValuation)} based on technical & fundamental scores</span>
                            </div>
                            <div className="flex gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Price per sqft: ₹{selectedPropertyData.pricePerSqft.toLocaleString()} (market adjusted)</span>
                            </div>
                            <div className="flex gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Valuation range: {formatCurrency(selectedPropertyData.valuationRange.min)} to {formatCurrency(selectedPropertyData.valuationRange.max)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="pt-12 text-center">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">Select a Property</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a property from the list to view detailed valuation analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
