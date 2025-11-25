import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock developer audit data
const MOCK_DEVELOPERS = [
  {
    id: "DEV-001",
    name: "Prestige Group",
    projects: 15,
    totalAudits: 8,
    recentAudit: {
      year: 2024,
      auditScore: 92,
      complianceStatus: "compliant",
      form7Submitted: true,
      auditedAccounts: true,
      fundUtilizationCorrect: true,
      withdrawalProportionate: true,
    },
  },
  {
    id: "DEV-002",
    name: "Godrej Properties",
    projects: 22,
    totalAudits: 7,
    recentAudit: {
      year: 2024,
      auditScore: 87,
      complianceStatus: "compliant",
      form7Submitted: true,
      auditedAccounts: true,
      fundUtilizationCorrect: true,
      withdrawalProportionate: false,
    },
  },
  {
    id: "DEV-003",
    name: "DLF Limited",
    projects: 18,
    totalAudits: 9,
    recentAudit: {
      year: 2024,
      auditScore: 78,
      complianceStatus: "partial",
      form7Submitted: true,
      auditedAccounts: false,
      fundUtilizationCorrect: true,
      withdrawalProportionate: false,
    },
  },
  {
    id: "DEV-004",
    name: "Lodha Group",
    projects: 20,
    totalAudits: 6,
    recentAudit: {
      year: 2024,
      auditScore: 65,
      complianceStatus: "non_compliant",
      form7Submitted: false,
      auditedAccounts: false,
      fundUtilizationCorrect: false,
      withdrawalProportionate: false,
    },
  },
];

const AUDIT_HISTORY = [
  {
    year: 2024,
    developerId: "DEV-001",
    developerName: "Prestige Group",
    auditScore: 92,
    complianceStatus: "compliant",
    reraForm7: true,
    auditedAccounts: true,
    profitLoss: true,
    balanceSheet: true,
    cashFlow: true,
    fundUtilization: true,
    fundsUsedForProject: true,
    withdrawalProportionate: true,
    remarks: "All compliance requirements met. Excellent fund utilization.",
  },
  {
    year: 2023,
    developerId: "DEV-001",
    developerName: "Prestige Group",
    auditScore: 88,
    complianceStatus: "compliant",
    reraForm7: true,
    auditedAccounts: true,
    profitLoss: true,
    balanceSheet: true,
    cashFlow: true,
    fundUtilization: true,
    fundsUsedForProject: true,
    withdrawalProportionate: true,
    remarks: "Minor documentation issues resolved.",
  },
];

export default function DeveloperAuditDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);

  const handleViewDetails = (developerId: string) => {
    setSelectedDeveloper(developerId);
    toast({
      title: "Developer Audit Selected",
      description: `Loading audit records for ${developerId}...`,
    });
  };

  const handleDownloadReport = (developerId: string, year: number) => {
    toast({
      title: "Downloading Report",
      description: `Generating audit report for ${year}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-emerald-100 text-emerald-700";
      case "partial":
        return "bg-amber-100 text-amber-700";
      case "non_compliant":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const filteredDevelopers = MOCK_DEVELOPERS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Developer Audit Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track RERA compliance, audit scores, and financial statements for all developers
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-total-developers">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Total Developers</span>
                <Building2 className="h-4 w-4 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">Under tracking</p>
            </CardContent>
          </Card>

          <Card data-testid="card-compliant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Compliant</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">100% compliant status</p>
            </CardContent>
          </Card>

          <Card data-testid="card-partial-compliant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Partial Compliance</span>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card data-testid="card-non-compliant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Non-Compliant</span>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all" data-testid="tab-all-developers">
              All Developers
            </TabsTrigger>
            <TabsTrigger value="details" data-testid="tab-audit-details">
              Audit Details
            </TabsTrigger>
          </TabsList>

          {/* All Developers Tab */}
          <TabsContent value="all" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Developer Audit Summary</CardTitle>
                <CardDescription>
                  2024 compliance status and audit scores for all registered developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by developer name or ID..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-developer"
                    />
                  </div>
                  <Button variant="outline" className="gap-2" data-testid="button-filter">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </div>

                <div className="space-y-3">
                  {filteredDevelopers.map((dev) => (
                    <Card
                      key={dev.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      data-testid={`card-developer-${dev.id}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-semibold">{dev.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {dev.id}</p>
                              </div>
                            </div>
                            <div className="flex gap-4 mt-3 text-sm">
                              <span className="text-muted-foreground">
                                <strong>{dev.projects}</strong> Active Projects
                              </span>
                              <span className="text-muted-foreground">
                                <strong>{dev.totalAudits}</strong> Total Audits
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className={`text-2xl font-bold ${getScoreColor(dev.recentAudit.auditScore)}`}>
                                  {dev.recentAudit.auditScore}
                                </p>
                                <p className="text-xs text-muted-foreground">Audit Score (2024)</p>
                              </div>
                              <Badge
                                className={`text-xs px-2 py-1 ${getStatusColor(dev.recentAudit.complianceStatus)}`}
                                data-testid={`badge-status-${dev.id}`}
                              >
                                {dev.recentAudit.complianceStatus === "compliant"
                                  ? "Compliant"
                                  : dev.recentAudit.complianceStatus === "partial"
                                    ? "Partial"
                                    : "Non-Compliant"}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(dev.id)}
                                data-testid={`button-view-${dev.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDownloadReport(dev.id, dev.recentAudit.year)}
                                data-testid={`button-download-${dev.id}`}
                              >
                                <Download className="h-4 w-4 mr-1" /> Report
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Compliance Checkmarks */}
                        <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            {dev.recentAudit.form7Submitted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" data-testid={`check-form7-${dev.id}`} />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span>RERA Form 7</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {dev.recentAudit.auditedAccounts ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" data-testid={`check-accounts-${dev.id}`} />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Audited Accounts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {dev.recentAudit.fundUtilizationCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" data-testid={`check-funds-${dev.id}`} />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Fund Utilization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {dev.recentAudit.withdrawalProportionate ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" data-testid={`check-withdrawal-${dev.id}`} />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Withdrawal Proportionate</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit History
                </CardTitle>
                <CardDescription>
                  Complete audit records showing compliance documentation and financial statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {AUDIT_HISTORY.map((audit, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors"
                    data-testid={`audit-record-${idx}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{audit.developerName}</p>
                        <p className="text-sm text-muted-foreground">Audit Year: {audit.year}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getScoreColor(audit.auditScore)}`}>
                          {audit.auditScore}/100
                        </p>
                        <Badge
                          className={`text-xs px-2 py-1 ${getStatusColor(audit.complianceStatus)}`}
                          data-testid={`badge-audit-status-${idx}`}
                        >
                          {audit.complianceStatus === "compliant"
                            ? "Compliant"
                            : audit.complianceStatus === "partial"
                              ? "Partial"
                              : "Non-Compliant"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-3 border-t">
                      <div className="flex items-center gap-2">
                        {audit.reraForm7 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>RERA Form 7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.auditedAccounts ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Audited Accounts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.profitLoss ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>P&L Statement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.balanceSheet ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Balance Sheet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.cashFlow ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Cash Flow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.fundUtilization ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Fund Utilization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.fundsUsedForProject ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Funds for Projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {audit.withdrawalProportionate ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Withdrawal Proportionate</span>
                      </div>
                    </div>

                    {audit.remarks && (
                      <div className="text-sm pt-2 border-t">
                        <p className="text-muted-foreground">
                          <strong>Auditor Remarks:</strong> {audit.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
