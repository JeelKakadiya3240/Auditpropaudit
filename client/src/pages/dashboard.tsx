import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { MOCK_PROPERTIES, stats } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

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
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here's what's happening with your audits.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button className="gap-2" onClick={handleFilter}>
              <Filter className="h-4 w-4" /> Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-muted shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.alert ? 
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> : 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-muted shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search properties by name, survey number, or owner..." 
              className="border-0 shadow-none focus-visible:ring-0 text-lg bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="lg" onClick={handleSearch}>Search</Button>
          </div>

          {/* Results Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Audits</h2>
              <span className="text-sm text-muted-foreground">{filteredProperties.length} results found</span>
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
        </div>
      </div>
    </Layout>
  );
}
