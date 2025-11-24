import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Users,
  Gavel,
  TrendingUp,
  Download,
  Filter,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface LitigationCase {
  id: string;
  caseNumber: string;
  court: "district_court" | "high_court";
  state: string;
  propertyAddress: string;
  plaintiff: string;
  defendant: string;
  caseType: string;
  filingDate: string;
  status: "pending" | "disposed" | "appealed";
  judgment?: string;
  judgmentDate?: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  duration?: number; // in months
}

const LITIGATION_CASES: LitigationCase[] = [
  {
    id: "LIT-001",
    caseNumber: "CS-2023-001",
    court: "district_court",
    state: "Karnataka",
    propertyAddress: "123 MG Road, Bangalore",
    plaintiff: "Rajesh Kumar",
    defendant: "Priya Sharma",
    caseType: "Title Dispute",
    filingDate: "2023-05-15",
    status: "pending",
    description: "Dispute over ownership of residential property. Plaintiff claims original owner.",
    riskLevel: "high",
    duration: 20,
  },
  {
    id: "LIT-002",
    caseNumber: "HC-2022-456",
    court: "high_court",
    state: "Maharashtra",
    propertyAddress: "456 Bandra, Mumbai",
    plaintiff: "ABC Construction Pvt Ltd",
    defendant: "XYZ Builders",
    caseType: "Encroachment",
    filingDate: "2022-08-20",
    status: "disposed",
    judgment: "plaintiff_won",
    judgmentDate: "2024-11-30",
    description: "Encroachment case where ABC Construction won judgment against XYZ Builders.",
    riskLevel: "low",
    duration: 27,
  },
  {
    id: "LIT-003",
    caseNumber: "DC-2024-789",
    court: "district_court",
    state: "Delhi",
    propertyAddress: "789 Gurgaon Tower, Gurgaon",
    plaintiff: "National Housing Bank",
    defendant: "Anand Patel",
    caseType: "Mortgage Recovery",
    filingDate: "2024-03-10",
    status: "pending",
    description: "Mortgage recovery case filed by NHB against defaulter. Property valued at ₹2.5 Cr.",
    riskLevel: "critical",
    duration: 9,
  },
  {
    id: "LIT-004",
    caseNumber: "DC-2023-234",
    court: "district_court",
    state: "Tamil Nadu",
    propertyAddress: "234 Whitefield, Chennai",
    plaintiff: "Meena Devi",
    defendant: "Tenant - Rahul Singh",
    caseType: "Eviction",
    filingDate: "2023-11-05",
    status: "pending",
    description: "Eviction case filed by property owner against non-paying tenant.",
    riskLevel: "medium",
    duration: 14,
  },
  {
    id: "LIT-005",
    caseNumber: "HC-2021-567",
    court: "high_court",
    state: "Telangana",
    propertyAddress: "567 HITEC City, Hyderabad",
    plaintiff: "Hyderabad Municipal Authority",
    defendant: "Property Owner - Vikram Reddy",
    caseType: "Property Tax Recovery",
    filingDate: "2021-06-12",
    status: "disposed",
    judgment: "plaintiff_won",
    judgmentDate: "2023-09-15",
    description: "Property tax recovery case. Owner ordered to pay ₹15 lakhs in arrears.",
    riskLevel: "low",
    duration: 27,
  },
  {
    id: "LIT-006",
    caseNumber: "DC-2024-102",
    court: "district_court",
    state: "Punjab",
    propertyAddress: "910 Punjab Tower, Chandigarh",
    plaintiff: "Developer - Green Homes Ltd",
    defendant: "Buyer - Harpreet Kaur",
    caseType: "Property Dispute",
    filingDate: "2024-01-20",
    status: "appealed",
    judgment: "defendant_won",
    judgmentDate: "2024-06-30",
    description: "Construction delay case. Lower court ruled in favor of buyer. Developer filed appeal.",
    riskLevel: "high",
    duration: 11,
  },
];

const CASE_TYPES = [
  "Title Dispute",
  "Mortgage Recovery",
  "Eviction",
  "Encroachment",
  "Property Dispute",
  "Property Tax Recovery",
  "Partition Suit",
];

const STATES = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Punjab",
  "All India",
];

const COURTS = [
  { value: "district_court", label: "District Court" },
  { value: "high_court", label: "High Court" },
];

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

export default function LitigationSearch() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<LitigationCase | null>(null);

  const filteredCases = LITIGATION_CASES.filter((c) => {
    const matchesSearch =
      c.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plaintiff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.defendant.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState ? c.state === selectedState : true;
    const matchesStatus = selectedStatus ? c.status === selectedStatus : true;

    return matchesSearch && matchesState && matchesStatus;
  });

  const getRiskColor = (level: string) => {
    if (level === "critical") return "bg-red-100 text-red-700";
    if (level === "high") return "bg-orange-100 text-orange-700";
    if (level === "medium") return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "appealed") return "bg-orange-100 text-orange-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const getCaseStats = () => {
    return {
      total: LITIGATION_CASES.length,
      pending: LITIGATION_CASES.filter((c) => c.status === "pending").length,
      disposed: LITIGATION_CASES.filter((c) => c.status === "disposed").length,
      critical: LITIGATION_CASES.filter((c) => c.riskLevel === "critical").length,
    };
  };

  const stats = getCaseStats();

  const caseTypeData = CASE_TYPES.map((type) => ({
    name: type,
    count: LITIGATION_CASES.filter((c) => c.caseType === type).length,
  }));

  const stateData = STATES.filter((s) => s !== "All India").map((state) => ({
    name: state,
    cases: LITIGATION_CASES.filter((c) => c.state === state).length,
  }));

  const statusData = [
    { name: "Pending", value: stats.pending },
    { name: "Disposed", value: stats.disposed },
    { name: "Appealed", value: LITIGATION_CASES.filter((c) => c.status === "appealed").length },
  ];

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Litigation report is being generated...",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Litigation Search Aggregator
            </h1>
            <p className="text-muted-foreground mt-1">
              Multi-state court database integration for property-related litigation cases
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport} data-testid="button-export-litigation">
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button className="gap-2" data-testid="button-filter">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-cases">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all states</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600" data-testid="text-pending-cases">
                {stats.pending}
              </div>
              <p className="text-xs text-amber-600 mt-1">Awaiting judgment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="text-critical-cases">
                {stats.critical}
              </div>
              <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disposed Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600" data-testid="text-disposed-cases">
                {stats.disposed}
              </div>
              <p className="text-xs text-emerald-600 mt-1">Concluded with judgment</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by property, case number, or party name..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-litigation"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <div className="flex flex-wrap gap-1">
                  {STATES.map((state) => (
                    <Button
                      key={state}
                      variant={selectedState === state ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedState(selectedState === state ? null : state)}
                      data-testid={`button-state-${state.toLowerCase()}`}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { value: "pending", label: "Pending" },
                    { value: "disposed", label: "Disposed" },
                    { value: "appealed", label: "Appealed" },
                  ].map((s) => (
                    <Button
                      key={s.value}
                      variant={selectedStatus === s.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(selectedStatus === s.value ? null : s.value)}
                      data-testid={`button-status-${s.value}`}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle>Litigation Cases ({filteredCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCases.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No cases found matching your search</p>
                </div>
              ) : (
                filteredCases.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCase(c)}
                    data-testid={`case-row-${idx}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{c.caseNumber}</p>
                        <p className="text-sm text-muted-foreground">{c.propertyAddress}</p>
                      </div>
                      <Badge className={getRiskColor(c.riskLevel)} data-testid={`badge-risk-${idx}`}>
                        {c.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {c.court === "district_court" ? "District Court" : "High Court"} • {c.state}
                      </span>
                      <Badge className={getStatusColor(c.status)} variant="outline">
                        {c.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Case View */}
        {selectedCase && (
          <>
            <Card className={`border-2 ${
              selectedCase.riskLevel === "critical"
                ? "border-red-200 bg-red-50"
                : selectedCase.riskLevel === "high"
                ? "border-orange-200 bg-orange-50"
                : "border-blue-200 bg-blue-50"
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedCase.caseNumber}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="font-medium">{selectedCase.caseType}</span> • {selectedCase.state}
                    </CardDescription>
                  </div>
                  <Badge className={getRiskColor(selectedCase.riskLevel)} data-testid="badge-case-risk">
                    {selectedCase.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription data-testid="text-case-description">
                    {selectedCase.description}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Plaintiff</p>
                    <p className="font-semibold" data-testid="text-plaintiff">
                      {selectedCase.plaintiff}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Defendant</p>
                    <p className="font-semibold" data-testid="text-defendant">
                      {selectedCase.defendant}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Property Address</p>
                    <p className="font-semibold text-sm" data-testid="text-property">
                      {selectedCase.propertyAddress}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Court</p>
                    <p className="font-semibold" data-testid="text-court">
                      {selectedCase.court === "district_court" ? "District Court" : "High Court"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Filing Date</p>
                    <p className="font-semibold" data-testid="text-filing-date">
                      {new Date(selectedCase.filingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(selectedCase.status)} data-testid="badge-status">
                      {selectedCase.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {selectedCase.judgment && (
                  <div className="p-4 rounded-lg border bg-white">
                    <p className="text-sm font-semibold mb-2">Judgment Details</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Judgment</p>
                        <p className="font-medium" data-testid="text-judgment">
                          {selectedCase.judgment === "plaintiff_won"
                            ? "Plaintiff Won"
                            : selectedCase.judgment === "defendant_won"
                            ? "Defendant Won"
                            : "Settlement"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium" data-testid="text-judgment-date">
                          {selectedCase.judgmentDate ? new Date(selectedCase.judgmentDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Charts */}
        <Tabs defaultValue="by-type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-type">By Case Type</TabsTrigger>
            <TabsTrigger value="by-state">By State</TabsTrigger>
            <TabsTrigger value="by-status">By Status</TabsTrigger>
          </TabsList>

          <TabsContent value="by-type" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cases by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caseTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-state" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cases by State</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-status" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cases by Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Court Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-State Court Integration</CardTitle>
            <CardDescription>Database connectivity and data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">District Court Coverage</h3>
                {[
                  "Karnataka: Bangalore High Court Registry",
                  "Maharashtra: Mumbai District Courts",
                  "Delhi: Delhi High Court",
                  "Tamil Nadu: Chennai High Court",
                  "Telangana: Hyderabad High Court",
                  "Punjab: Punjab and Haryana High Court",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" data-testid={`court-${i}`}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Data Sources & Updates</h3>
                {[
                  "✓ Direct court portal integration",
                  "✓ Case number verification system",
                  "✓ Real-time status updates",
                  "✓ Judgment and order records",
                  "✓ Party name search database",
                  "✓ Case history tracking",
                ].map((item, i) => (
                  <div key={i} className="text-sm" data-testid={`source-${i}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
