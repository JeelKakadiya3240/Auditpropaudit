import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, AlertTriangle, CheckCircle2, Clock, Plus, Archive, Home, DollarSign, MapPin, Trash2, Shield, FileText, Gavel, TrendingUp, Loader2, ChevronRight, Activity } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { MOCK_PROPERTIES, stats, formatCurrency } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [userCredits, setUserCredits] = useState({ total: 100, used: 0 });
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [archivedProperties, setArchivedProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    estimatedValue: "",
    area: "",
    description: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id || "guest-user";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
    
    // Load user data
    loadUserData();
  }, [location]);

  const loadUserData = async () => {
    try {
      const creditsRes = await fetch(`/api/user-credits/${userId}`);
      if (creditsRes.ok) {
        const credits = await creditsRes.json();
        setUserCredits({ total: credits.totalCredits, used: credits.usedCredits });
      }

      const propsRes = await fetch(`/api/user-properties/${userId}?status=active`);
      if (propsRes.ok) {
        const props = await propsRes.json();
        setUserProperties(props);
      }

      const archiveRes = await fetch(`/api/property-archive/${userId}`);
      if (archiveRes.ok) {
        const archives = await archiveRes.json();
        setArchivedProperties(archives);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleAddProperty = async () => {
    try {
      if (!formData.propertyName || !formData.address || !formData.city || !formData.state) {
        toast({ title: "Error", description: "Please fill all required fields" });
        return;
      }

      setIsAddingProperty(true);
      setLastAuditResult(null);

      const response = await fetch("/api/user-properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
          status: "active",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLastAuditResult(result.auditResults);
        
        toast({ 
          title: "Property Added & Audited", 
          description: `Comprehensive audit completed. Risk Level: ${result.auditResults?.riskLevel?.toUpperCase() || 'N/A'}` 
        });
        
        setFormData({
          propertyName: "",
          address: "",
          city: "",
          state: "",
          propertyType: "RESIDENTIAL",
          transactionType: "BUY",
          estimatedValue: "",
          area: "",
          description: "",
        });
        setShowAddForm(false);
        await loadUserData();
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.error || "Failed to add property" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add property" });
    } finally {
      setIsAddingProperty(false);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getECStatusLabel = (status: string) => {
    switch (status) {
      case 'form_16': return 'Clear (Form 16)';
      case 'form_15': return 'Encumbrances Found (Form 15)';
      default: return status;
    }
  };

  const filteredProperties = MOCK_PROPERTIES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your audit report is being generated. It will be downloaded shortly.",
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Advanced filtering options would open here.",
    });
  };

  const handleSearch = () => {
    toast({
      title: "Search Updated",
      description: `Found ${filteredProperties.length} properties matching "${searchQuery}"`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your properties and credits</p>
          </div>
        </div>

        {/* Credits Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">{userCredits.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Used Credits</p>
                <p className="text-2xl font-bold text-orange-600">{userCredits.used}</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${(userCredits.used / userCredits.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userCredits.total - userCredits.used} credits remaining
            </p>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Properties</TabsTrigger>
            <TabsTrigger value="myproperties">My Properties</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          {/* Search Properties Tab */}
          <TabsContent value="search" className="space-y-4">
            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-muted shadow-sm">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search properties by name, survey number, or owner..." 
                className="border-0 shadow-none focus-visible:ring-0 text-lg bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-search-property"
              />
              <Button size="lg" onClick={handleSearch} data-testid="button-search">Search</Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <span className="text-sm text-muted-foreground">{filteredProperties.length} results</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No properties found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* My Properties Tab */}
          <TabsContent value="myproperties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Properties</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2" data-testid="button-add-property">
                <Plus className="h-4 w-4" /> Add Property
              </Button>
            </div>

            {showAddForm && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Add Buy/Sell Property</CardTitle>
                  <CardDescription>List a new property for buy or sell</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Property Name"
                      value={formData.propertyName}
                      onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                      data-testid="input-property-name"
                    />
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="border rounded px-3 py-2"
                      data-testid="select-property-type"
                    >
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="LAND">Land</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      data-testid="input-address"
                    />
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      data-testid="input-city"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      data-testid="input-state"
                    />
                    <select 
                      value={formData.transactionType}
                      onChange={(e) => setFormData({...formData, transactionType: e.target.value})}
                      className="border rounded px-3 py-2"
                      data-testid="select-transaction-type"
                    >
                      <option value="BUY">Buy</option>
                      <option value="SELL">Sell</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Estimated Value (₹)"
                      type="number"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                      data-testid="input-value"
                    />
                    <Input
                      placeholder="Area (sq ft)"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      data-testid="input-area"
                    />
                  </div>

                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="border rounded px-3 py-2 w-full min-h-24"
                    data-testid="input-description"
                  />

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddProperty} 
                      disabled={isAddingProperty}
                      data-testid="button-submit-property"
                    >
                      {isAddingProperty ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Running Comprehensive Audit...
                        </>
                      ) : (
                        'Submit & Run Audit'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isAddingProperty} data-testid="button-cancel">Cancel</Button>
                  </div>
                  
                  {isAddingProperty && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Activity className="h-5 w-5 animate-pulse" />
                        <p className="font-medium">Running comprehensive property audit...</p>
                      </div>
                      <ul className="text-sm text-blue-600 mt-2 space-y-1">
                        <li>• Verifying Encumbrance Certificate (EC)</li>
                        <li>• Checking RERA registration</li>
                        <li>• Searching court records for litigation</li>
                        <li>• Analyzing fraud risk indicators</li>
                        <li>• Verifying title chain</li>
                        <li>• Fetching land records</li>
                        <li>• Gathering market intelligence</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {lastAuditResult && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Audit Complete
                  </CardTitle>
                  <CardDescription>Your property has been added and all verification checks are complete</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                      <p className="text-2xl font-bold">{lastAuditResult.overallRiskScore}</p>
                      <Badge variant={getRiskBadgeVariant(lastAuditResult.riskLevel) as any} className="mt-1">
                        {lastAuditResult.riskLevel?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">EC Status</p>
                      <p className="text-sm font-medium">{getECStatusLabel(lastAuditResult.ecStatus)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Fraud Score</p>
                      <p className="text-2xl font-bold">{lastAuditResult.fraudScore}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Litigation Cases</p>
                      <p className="text-2xl font-bold">{lastAuditResult.litigationCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link href="/ec">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" /> EC Details
                      </Button>
                    </Link>
                    <Link href="/title">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Shield className="h-4 w-4" /> Title Verification
                      </Button>
                    </Link>
                    <Link href="/litigation">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Gavel className="h-4 w-4" /> Litigation
                      </Button>
                    </Link>
                    <Link href="/fraud">
                      <Button variant="outline" size="sm" className="gap-1">
                        <AlertTriangle className="h-4 w-4" /> Fraud Analysis
                      </Button>
                    </Link>
                    <Link href="/market">
                      <Button variant="outline" size="sm" className="gap-1">
                        <TrendingUp className="h-4 w-4" /> Market Intelligence
                      </Button>
                    </Link>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-muted-foreground"
                    onClick={() => setLastAuditResult(null)}
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {userProperties.length > 0 ? (
                userProperties.map((prop) => {
                  const auditDetails = prop.auditDetails as any;
                  return (
                    <Card key={prop.id} className="border-muted" data-testid={`card-property-${prop.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{prop.propertyName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{prop.address}, {prop.city}, {prop.state}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            {auditDetails?.riskLevel && (
                              <Badge 
                                variant={getRiskBadgeVariant(auditDetails.riskLevel) as any}
                                className="capitalize"
                                data-testid={`badge-risk-${prop.id}`}
                              >
                                {auditDetails.riskLevel} Risk
                              </Badge>
                            )}
                            <Badge variant={prop.transactionType === 'BUY' ? 'default' : 'secondary'} data-testid={`badge-type-${prop.id}`}>
                              {prop.transactionType}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{prop.propertyType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-medium">{prop.estimatedValue ? formatCurrency(Number(prop.estimatedValue)) : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Area</p>
                            <p className="font-medium">{prop.area ? `${prop.area} sq ft` : 'N/A'}</p>
                          </div>
                        </div>
                        
                        {auditDetails && (
                          <>
                            <div className="border-t pt-4">
                              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Audit Summary
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-muted/50 p-2 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Risk Score</p>
                                  <p className="text-lg font-bold">{auditDetails.riskScore || 0}</p>
                                </div>
                                <div className="bg-muted/50 p-2 rounded text-center">
                                  <p className="text-xs text-muted-foreground">EC Status</p>
                                  <p className="text-xs font-medium">{auditDetails.ecStatus === 'form_16' ? 'Clear' : 'Has Encumbrances'}</p>
                                </div>
                                <div className="bg-muted/50 p-2 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Title</p>
                                  <p className="text-xs font-medium capitalize">{auditDetails.titleStatus || 'Pending'}</p>
                                </div>
                                <div className="bg-muted/50 p-2 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Litigation</p>
                                  <p className="text-lg font-bold">{auditDetails.litigationCount || 0}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Link href={`/ec?propertyId=${prop.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <FileText className="h-3 w-3" /> EC
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Link href={`/title?propertyId=${prop.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <Shield className="h-3 w-3" /> Title
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Link href={`/litigation?propertyId=${prop.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <Gavel className="h-3 w-3" /> Litigation
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Link href={`/fraud?propertyId=${prop.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Fraud
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Link href={`/rera?propertyId=${prop.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <MapPin className="h-3 w-3" /> RERA
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Link href={`/market?city=${prop.city}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                  <TrendingUp className="h-3 w-3" /> Market Intel
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                        
                        {prop.description && (
                          <p className="text-sm text-muted-foreground border-t pt-3">{prop.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No properties added yet. Click "Add Property" to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Archived Properties Tab */}
          <TabsContent value="archived" className="space-y-4">
            <h2 className="text-xl font-semibold">Archived Properties</h2>
            
            <div className="grid gap-4">
              {archivedProperties.length > 0 ? (
                archivedProperties.map((archive) => (
                  <Card key={archive.id} className="border-muted" data-testid={`card-archive-${archive.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{archive.propertyDetails?.title || 'Property'}</CardTitle>
                          <p className="text-sm text-muted-foreground">{archive.propertyDetails?.address || 'Address not available'}</p>
                        </div>
                        <Badge variant="outline" data-testid={`badge-searched-${archive.id}`}>
                          {new Date(archive.searchedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {archive.notes && (
                        <p className="text-sm mb-2"><strong>Notes:</strong> {archive.notes}</p>
                      )}
                      {archive.rating && (
                        <p className="text-sm text-muted-foreground">Rating: {archive.rating}/5</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No archived properties yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
