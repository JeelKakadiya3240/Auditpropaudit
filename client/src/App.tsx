import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import PropertyDetails from "@/pages/property-details";
import ReviewQueue from "@/pages/review-queue";
import AuditReports from "@/pages/audit-reports";
import Settings from "@/pages/settings";

import PublicSearch from "@/pages/public-search";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicSearch} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/review" component={ReviewQueue} />
      <Route path="/reports" component={AuditReports} />
      <Route path="/settings" component={Settings} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
