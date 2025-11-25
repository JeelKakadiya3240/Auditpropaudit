import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertUserSchema, type NewsArticle } from "@shared/schema";
import { ZodError } from "zod";

const NEWS_SOURCES = [
  { name: "Real Estate", keywords: "real estate property market housing" },
  { name: "Legal", keywords: "legal law court regulation" },
  { name: "Finance", keywords: "finance financial investment banking" },
  { name: "Banking", keywords: "banking bank loans credit" },
  { name: "Fraud", keywords: "fraud forgery document crime" },
];

async function fetchNewsFromAPI(query: string): Promise<NewsArticle[]> {
  try {
    const articles: NewsArticle[] = [];
    
    const mockNews: Record<string, NewsArticle[]> = {
      "real estate": [
        {
          id: "1",
          title: "Property Market Shows Strong Recovery in Q4 2025",
          description: "Real estate sector demonstrates resilience with 12% growth in transaction volumes.",
          source: "Real Estate Daily",
          url: "https://example.com/realestate1",
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Real Estate",
        },
      ],
      "legal": [
        {
          id: "3",
          title: "Supreme Court Ruling Impacts Property Disputes",
          description: "Landmark decision clarifies ownership transfer procedures in contested cases.",
          source: "Legal Times",
          url: "https://example.com/legal1",
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Legal",
        },
      ],
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, newsList] of Object.entries(mockNews)) {
      if (!query || lowerQuery.includes(key)) {
        articles.push(...newsList);
      }
    }

    return articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message });
    } catch (error) {
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  // News endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const category = req.query.category as string || "";
      const articles = await fetchNewsFromAPI(category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Feature 1 & 5: Encumbrance Certificate endpoints
  app.get("/api/ec/:propertyId", async (req, res) => {
    try {
      const ec = await storage.getEncumbranceCertificate(req.params.propertyId);
      if (!ec) {
        return res.status(404).json({ error: "EC not found" });
      }
      res.json(ec);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch EC" });
    }
  });

  app.get("/api/ec/state/:state", async (req, res) => {
    try {
      const ecs = await storage.listEncumbranceCertificates(req.params.state);
      res.json(ecs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ECs" });
    }
  });

  // Feature 2: RERA Status Checker endpoints
  app.get("/api/rera/:registrationNumber", async (req, res) => {
    try {
      const project = await storage.getReraProject(req.params.registrationNumber);
      if (!project) {
        return res.status(404).json({ error: "RERA project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RERA project" });
    }
  });

  app.get("/api/rera/state/:state", async (req, res) => {
    try {
      const city = req.query.city as string;
      const projects = await storage.listReraProjects(req.params.state, city);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RERA projects" });
    }
  });

  // Feature 3: Litigation Search Aggregator endpoints
  app.get("/api/litigation/case/:caseNumber", async (req, res) => {
    try {
      const litigationCase = await storage.getLitigationCase(req.params.caseNumber);
      if (!litigationCase) {
        return res.status(404).json({ error: "Case not found" });
      }
      res.json(litigationCase);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch litigation case" });
    }
  });

  app.get("/api/litigation/property", async (req, res) => {
    try {
      const address = req.query.address as string;
      if (!address) {
        return res.status(400).json({ error: "Property address required" });
      }
      const cases = await storage.listLitigationCasesByProperty(address);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch litigation cases" });
    }
  });

  // Feature 4 & 10: NRI Document Checklist endpoints
  app.get("/api/nri/checklist/:email", async (req, res) => {
    try {
      const checklist = await storage.getNRIChecklist(req.params.email);
      if (!checklist) {
        return res.status(404).json({ error: "Checklist not found" });
      }
      res.json(checklist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NRI checklist" });
    }
  });

  app.post("/api/nri/checklist", async (req, res) => {
    try {
      const checklist = await storage.createNRIChecklist(req.body);
      res.json(checklist);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid checklist data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create NRI checklist" });
      }
    }
  });

  // Feature 6: Title Verification endpoints
  app.get("/api/title/:propertyId", async (req, res) => {
    try {
      const titleVerification = await storage.getTitleVerification(req.params.propertyId);
      if (!titleVerification) {
        return res.status(404).json({ error: "Title verification not found" });
      }
      res.json(titleVerification);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch title verification" });
    }
  });

  // Feature 7: Fraud Detection endpoints
  app.get("/api/fraud/:propertyId", async (req, res) => {
    try {
      const fraudScore = await storage.getFraudScore(req.params.propertyId);
      if (!fraudScore) {
        return res.status(404).json({ error: "Fraud score not found" });
      }
      res.json(fraudScore);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fraud score" });
    }
  });

  // Feature 8: Developer Audit endpoints
  app.get("/api/developer/audit/:developerId/:year", async (req, res) => {
    try {
      const audit = await storage.getDeveloperAudit(
        req.params.developerId,
        parseInt(req.params.year)
      );
      if (!audit) {
        return res.status(404).json({ error: "Audit not found" });
      }
      res.json(audit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developer audit" });
    }
  });

  app.get("/api/developer/:developerId", async (req, res) => {
    try {
      const audits = await storage.listDeveloperAudits(req.params.developerId);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developer audits" });
    }
  });

  // Feature 9: Document Verification endpoints
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const doc = await storage.getDocumentVerification(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.get("/api/documents/type/:documentType", async (req, res) => {
    try {
      const docs = await storage.listDocumentVerifications(req.params.documentType);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Feature 11: Land Records endpoints
  app.get("/api/land/:propertyId", async (req, res) => {
    try {
      const landRecord = await storage.getLandRecord(req.params.propertyId);
      if (!landRecord) {
        return res.status(404).json({ error: "Land record not found" });
      }
      res.json(landRecord);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch land record" });
    }
  });

  app.get("/api/land/location/:state/:district", async (req, res) => {
    try {
      const records = await storage.listLandRecordsByLocation(
        req.params.state,
        req.params.district
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch land records" });
    }
  });

  // Feature 12: Market Intelligence endpoints
  app.get("/api/market/:city/:monthYear", async (req, res) => {
    try {
      const intelligence = await storage.getMarketIntelligence(
        req.params.city,
        req.params.monthYear
      );
      if (!intelligence) {
        return res.status(404).json({ error: "Market intelligence not found" });
      }
      res.json(intelligence);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market intelligence" });
    }
  });

  app.get("/api/market/city/:city", async (req, res) => {
    try {
      const records = await storage.listMarketIntelligenceByCity(req.params.city);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
