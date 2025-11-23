import { Layout } from "@/components/layout";
import { MOCK_PROPERTIES, Property, RiskLevel } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle2, XCircle, AlertTriangle, Eye, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ReviewQueue() {
  const { toast } = useToast();

  // Filter for items that might need review (e.g. High Risk or missing KYC)
  const reviewItems = MOCK_PROPERTIES.filter(p => 
    p.riskLevel === "HIGH" || 
    p.riskLevel === "CRITICAL" || 
    p.owners.some(o => o.kycStatus === "PENDING")
  );

  const handleApprove = (id: string) => {
    toast({
      title: "Property Approved",
      description: `Property ${id} has been marked as verified.`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
            <p className="text-muted-foreground mt-1">
              Properties requiring manual verification or high-risk overrides.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-base px-4 py-1">
              {reviewItems.length} Pending
            </Badge>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Property</TableHead>
                <TableHead>Owner Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewItems.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{property.title}</span>
                      <span className="text-xs text-muted-foreground">{property.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {property.owners.map(o => (
                        <div key={o.id} className="flex items-center gap-2 text-sm">
                          {o.kycStatus === "VERIFIED" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          )}
                          <span className={cn(o.kycStatus === "PENDING" && "text-amber-600 font-medium")}>
                            {o.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      property.riskLevel === "HIGH" ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200" : 
                      property.riskLevel === "CRITICAL" ? "bg-red-100 text-red-700 hover:bg-red-200 border-red-200" : 
                      "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                    )}>
                      {property.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {property.riskFactors.slice(0, 2).map(rf => (
                        <Badge key={rf.id} variant="outline" className="text-xs">
                          {rf.category}
                        </Badge>
                      ))}
                      {property.riskFactors.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{property.riskFactors.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <Link href={`/property/${property.id}`}>
                          <Eye className="h-3 w-3" /> Review
                        </Link>
                      </Button>
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(property.id)}>
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
