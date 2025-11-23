import { Link } from "wouter";
import { ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property, formatCurrency } from "@/lib/mockData";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-muted overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={property.riskLevel === "LOW" ? "default" : "destructive"} className="font-semibold shadow-sm">
            {property.riskLevel === "LOW" ? (
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
            ) : (
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {property.riskLevel} Risk</span>
            )}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg leading-none mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
            <p className="text-sm text-muted-foreground">{property.address}, {property.city}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-foreground">{property.riskScore}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-4 py-2 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">Value</span>
            <span className="font-medium font-mono">{formatCurrency(property.marketValue)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">Survey No</span>
            <span className="font-medium font-mono">{property.surveyNumber}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-muted/30 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Last audited: {new Date(property.lastAudited).toLocaleDateString()}</span>
        <Button size="sm" variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all" asChild>
          <Link href={`/property/${property.id}`}>
            Full Audit <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
