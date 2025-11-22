import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShieldCheck, Search, Building2 } from "lucide-react";
import generatedImage from "@assets/generated_images/abstract_blue_data_map_background.png";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LandingPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSampleReport = () => {
    toast({
      title: "Downloading Sample",
      description: "A sample enterprise audit report is being downloaded to your device.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/dashboard?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">AuditProp</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Solutions</a>
          <a href="#" className="hover:text-foreground transition-colors">Data Sources</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">API</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={generatedImage} alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              The Standard for <br/>
              <span className="text-primary">Property Due Diligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AuditProp delivers 360° verified property audits. We combine ownership history, legal checks, financial encumbrances, and fraud detection into a single trust score.
            </p>

            <div className="max-w-xl mx-auto w-full bg-card p-2 rounded-xl shadow-lg border border-border/50 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by property address, survey number, or owner..." 
                  className="pl-10 h-12 text-lg border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
              <Button size="lg" className="h-12 px-8 text-base" onClick={handleSearch}>
                Search
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button variant="outline" className="h-10 gap-2 border-primary/20 hover:bg-primary/5">
                  Explore Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" className="h-10 text-muted-foreground hover:text-primary" onClick={handleSampleReport}>
                View Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Deep Search</h3>
              <p className="text-muted-foreground">
                Search by survey number, owner name, or property address across 120+ municipal and legal databases.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Identity Verification</h3>
              <p className="text-muted-foreground">
                Instant PAN and Aadhaar verification for property owners with bank-grade KYC integration.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Legal & Financial</h3>
              <p className="text-muted-foreground">
                Automated checks for pending court cases, loan liens, and RERA compliance status.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AuditProp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AuditProp Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
