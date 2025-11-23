import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ExternalLink, Loader2 } from "lucide-react";
import type { NewsArticle } from "@shared/schema";

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    "Real Estate",
    "Legal",
    "Finance",
    "Banking",
    "Fraud",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const url = selectedCategory
          ? `/api/news?category=${encodeURIComponent(selectedCategory.toLowerCase())}`
          : "/api/news";
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Real Estate": "bg-blue-100 text-blue-800",
      "Legal": "bg-purple-100 text-purple-800",
      "Finance": "bg-green-100 text-green-800",
      "Banking": "bg-orange-100 text-orange-800",
      "Fraud": "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AuditProp</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Property & Finance News
              </h1>
              <p className="text-xl text-muted-foreground">
                Stay updated with the latest news on real estate, legal matters, finance, banking, and fraud prevention.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => setSelectedCategory("")}
                data-testid="button-category-all"
              >
                All News
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`button-category-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* News Articles */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No articles found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                    data-testid={`card-article-${article.id}`}
                  >
                    {article.imageUrl && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Badge
                          className={`${getCategoryColor(article.category)} border-0`}
                          data-testid={`badge-category-${article.id}`}
                        >
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2" data-testid={`title-article-${article.id}`}>
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4" data-testid={`description-article-${article.id}`}>
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground" data-testid={`source-article-${article.id}`}>
                          {article.source}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          data-testid={`link-article-${article.id}`}
                          onClick={() => window.open(article.url, '_blank')}
                        >
                          Read More
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AuditProp Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
