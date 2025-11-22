import { Layout } from "@/components/layout";
import { useRoute } from "wouter";
import { MOCK_PROPERTIES, formatCurrency, RiskLevel } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiskScoreMeter } from "@/components/risk-meter";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  MapPin, 
  Building, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  UserCheck,
  Landmark,
  Gavel,
  AlertOctagon,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PropertyDetails() {
  const [, params] = useRoute("/property/:id");
  const property = MOCK_PROPERTIES.find(p => p.id === params?.id);
  const { toast } = useToast();

  if (!property) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold">Property Not Found</h2>
          <Button variant="link" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  const handleRecompute = () => {
    toast({
      title: "Recomputing Score",
      description: "Request sent to scoring engine. This may take a few minutes.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link Copied",
      description: "Property audit link copied to clipboard.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Generating detailed PDF audit report...",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent hover:text-primary" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
            </Button>
            <span>/</span>
            <span>{property.id}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleRecompute}>
              <RefreshCw className="h-4 w-4" /> Recompute Score
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Download PDF Report
            </Button>
          </div>
        </div>

        {/* Header Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="h-48 md:h-64 w-full relative">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
                  <div className="flex items-center text-white/90 gap-4 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {property.address}, {property.city}</span>
                    <span className="flex items-center gap-1"><Building className="h-4 w-4" /> {property.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Market Value</p>
                  <p className="text-xl font-mono font-semibold mt-1">{formatCurrency(property.marketValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Survey Number</p>
                  <p className="text-xl font-mono font-semibold mt-1">{property.surveyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">RERA ID</p>
                  <p className="text-xl font-mono font-semibold mt-1">{property.reraId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Audit Date</p>
                  <p className="text-xl font-mono font-semibold mt-1">{new Date(property.lastAudited).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-card border p-1 mb-6">
                <TabsTrigger value="overview" className="flex-1 md:flex-none">Overview</TabsTrigger>
                <TabsTrigger value="ownership" className="flex-1 md:flex-none">Ownership</TabsTrigger>
                <TabsTrigger value="legal" className="flex-1 md:flex-none">Legal & Cases</TabsTrigger>
                <TabsTrigger value="financial" className="flex-1 md:flex-none">Financial</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Risk Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" /> Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {property.riskFactors.length > 0 ? (
                      <div className="space-y-4">
                        {property.riskFactors.map((factor) => (
                          <div key={factor.id} className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-muted">
                            <div className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                              factor.severity === "CRITICAL" ? "bg-red-100 text-red-600" :
                              factor.severity === "HIGH" ? "bg-orange-100 text-orange-600" :
                              "bg-amber-100 text-amber-600"
                            )}>
                              <AlertOctagon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={cn(
                                  factor.severity === "CRITICAL" ? "border-red-500 text-red-500" :
                                  factor.severity === "HIGH" ? "border-orange-500 text-orange-500" :
                                  "border-amber-500 text-amber-500"
                                )}>{factor.severity}</Badge>
                                <h4 className="font-semibold">{factor.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{factor.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3 opacity-20" />
                        <p>No critical risk factors detected.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-muted-foreground">Ownership Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <UserCheck className="h-6 w-6 text-primary" />
                        {property.owners.length} Owners
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {property.owners.every(o => o.kycStatus === "VERIFIED") 
                          ? "All owners verified via Aadhaar/PAN"
                          : "Some owners pending verification"
                        }
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-muted-foreground">Legal Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <Gavel className="h-6 w-6 text-primary" />
                        {property.cases.length} Active Cases
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Checked across district & high courts
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ownership" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ownership Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {property.owners.map((owner) => (
                      <div key={owner.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {owner.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-lg">{owner.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">PAN: {owner.maskedPan}</span>
                              {owner.maskedAadhaar && (
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">UID: {owner.maskedAadhaar}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right mr-4">
                            <p className="text-xs text-muted-foreground uppercase">Share</p>
                            <p className="font-mono font-bold">{owner.sharePercentage}%</p>
                          </div>
                          <Badge variant={owner.kycStatus === "VERIFIED" ? "default" : "secondary"} className={cn(
                            owner.kycStatus === "VERIFIED" ? "bg-emerald-500 hover:bg-emerald-600" : ""
                          )}>
                            {owner.kycStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle>Legal Case History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {property.cases.length > 0 ? (
                      <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                        {property.cases.map((c) => (
                          <div key={c.id} className="ml-6 relative">
                            <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                            <div className="flex flex-col gap-1 mb-2">
                              <span className="text-sm text-muted-foreground font-mono">{new Date(c.date).toLocaleDateString()}</span>
                              <h4 className="text-lg font-bold">{c.title}</h4>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">{c.court}</Badge>
                                <Badge variant={c.status === "OPEN" ? "destructive" : "secondary"}>{c.status}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border border-muted">
                              {c.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                        <p>No legal cases found associated with this property.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Encumbrances & Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {property.loans.length > 0 ? (
                      <div className="space-y-4">
                        {property.loans.map((loan) => (
                          <div key={loan.id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-card">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                <Landmark className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-bold">{loan.bankName}</h4>
                                <p className="text-sm text-muted-foreground">Sanctioned: {new Date(loan.dateSanctioned).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground uppercase">Amount</p>
                                <p className="font-mono font-bold">{formatCurrency(loan.amount)}</p>
                              </div>
                              <Badge variant={loan.status === "ACTIVE" ? "default" : loan.status === "DEFAULTED" ? "destructive" : "secondary"}>
                                {loan.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                         <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                        <p>No active encumbrances found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-gradient-to-b from-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-center">Audit Score</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <RiskScoreMeter score={property.riskScore} size="lg" />
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Identity Verification</span>
                    <span className="font-medium text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Legal Clearance</span>
                    {property.cases.length > 0 ? (
                      <span className="font-medium text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Flagged</span>
                    ) : (
                      <span className="font-medium text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Clear</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Financial Health</span>
                    {property.loans.some(l => l.status === "DEFAULTED") ? (
                      <span className="font-medium text-red-500 flex items-center gap-1"><AlertOctagon className="w-3 h-3"/> Critical</span>
                    ) : (
                      <span className="font-medium text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Stable</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Audit Provenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Verification Complete</p>
                      <p className="text-xs text-muted-foreground">{new Date(property.lastAudited).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 opacity-60">
                    <div className="mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Records Fetched</p>
                      <p className="text-xs text-muted-foreground">4 Sources Syncing</p>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
