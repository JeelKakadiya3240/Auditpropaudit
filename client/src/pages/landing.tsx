import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShieldCheck, Search, Building2 } from "lucide-react";
import generatedImage from "@assets/generated_images/abstract_blue_data_map_background.png";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LandingPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSampleReport = () => {
    toast({
      title: "Downloading Sample",
      description: "A sample enterprise audit report is being downloaded to your device.",
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast({
        title: "Search Error",
        description: "Please enter a property name, survey number, or owner name.",
      });
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
          <Link href="/solutions" className="hover:text-foreground transition-colors" data-testid="link-solutions">
            Solutions
          </Link>
          <Link href="/nri-solutions" className="hover:text-foreground transition-colors" data-testid="link-nri-solutions">
            NRI Solutions
          </Link>
          <Link href="/data-sources" className="hover:text-foreground transition-colors" data-testid="link-data-sources">
            Data Sources
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors" data-testid="link-pricing">
            Pricing
          </Link>
          <Link href="/api" className="hover:text-foreground transition-colors" data-testid="link-api">
            API
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors" data-testid="link-contact">
            Contact
          </Link>
          <Link href="/news" className="hover:text-foreground transition-colors" data-testid="link-news">
            News
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-6 md:py-10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={generatedImage} alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              The Standard for <br/>
              <span className="text-primary">Property Due Diligence</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              AuditProp delivers 360° verified property audits. We combine ownership history, legal checks, financial encumbrances, and fraud detection into a single trust score.
            </p>
          </div>
        </div>
      </section>

      {/* Try Demo Section - Search Bar */}
      <section className="py-3 bg-muted/30 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-3 text-center">Try AuditProp Now</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Search by property name, survey number, or owner..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} className="gap-2" data-testid="button-search">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Try: "Sunrise Heights", "Tech Park", or "Green Valley"
            </p>
          </div>
        </div>
      </section>

      {/* CTA Buttons */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-lg gap-2" asChild>
              <Link href="/sign-in">
                Start Free Audit <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={handleSampleReport}>
              View Sample Report
            </Button>
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
