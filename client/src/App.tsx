import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import PropertyDetails from "@/pages/property-details";
import ReviewQueue from "@/pages/review-queue";
import Solutions from "@/pages/solutions";
import DataSources from "@/pages/data-sources";
import Pricing from "@/pages/pricing";
import APIPage from "@/pages/api";
import SignIn from "@/pages/sign-in";
import AuditReports from "@/pages/audit-reports";
import Settings from "@/pages/settings";
import Contact from "@/pages/contact";
import News from "@/pages/news";
import AdminDashboard from "@/pages/admin";
import AuditorDashboard from "@/pages/auditor";
import VerificationHub from "@/pages/verification-hub";
import NRI from "@/pages/nri";
import MarketIntelligence from "@/pages/market-intelligence";
import FraudDetection from "@/pages/fraud-detection";
import ComprehensiveDashboard from "@/pages/comprehensive-dashboard";
import DocumentVerification from "@/pages/document-verification";
import LitigationSearch from "@/pages/litigation-search";
import TitleVerification from "@/pages/title-verification";
import DeveloperAuditDashboard from "@/pages/developer-audit-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/auditor" component={AuditorDashboard} />
      <Route path="/verification" component={VerificationHub} />
      <Route path="/review" component={ReviewQueue} />
      <Route path="/reports" component={AuditReports} />
      <Route path="/settings" component={Settings} />
      <Route path="/nri" component={NRI} />
      <Route path="/market" component={MarketIntelligence} />
      <Route path="/fraud" component={FraudDetection} />
      <Route path="/documents" component={DocumentVerification} />
      <Route path="/litigation" component={LitigationSearch} />
      <Route path="/title" component={TitleVerification} />
      <Route path="/developer-audit" component={DeveloperAuditDashboard} />
      <Route path="/features" component={ComprehensiveDashboard} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/data-sources" component={DataSources} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/api" component={APIPage} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/contact" component={Contact} />
      <Route path="/news" component={News} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
