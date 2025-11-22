import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ShieldCheck, MapPin, Building } from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function PublicSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const filteredProperties = searchQuery ? MOCK_PROPERTIES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
           <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">AuditProp</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Public Property Search</h1>
          <p className="text-xl text-muted-foreground">
            Verify basic property details instantly. Sign in for full due diligence reports.
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              className="pl-10 h-12 text-lg shadow-sm" 
              placeholder="Enter property address, survey number, or city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="lg" className="h-12 px-8" onClick={handleSearch}>Search</Button>
        </div>

        {hasSearched && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Search Results ({filteredProperties.length})</h2>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-48 md:h-auto bg-muted relative">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{property.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <MapPin className="h-4 w-4" />
                              {property.address}, {property.city}
                            </div>
                          </div>
                          <Badge variant="outline">{property.type}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">Survey No</span>
                            <span className="font-mono font-medium">{property.surveyNumber}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">Status</span>
                            <span className="font-medium text-emerald-600 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> Active Record
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4 mt-auto">
                          <p className="text-xs text-muted-foreground">
                            Basic verification available publicly.
                          </p>
                          <Link href="/dashboard">
                            <Button size="sm" className="gap-2">
                              View Full Report <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No properties found</h3>
                    <p className="text-muted-foreground">Try searching for "Sunrise", "Bangalore", or survey numbers.</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
