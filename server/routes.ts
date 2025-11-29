import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema, 
  insertUserSchema, 
  insertUserPropertySchema, 
  insertNRIChecklistSchema,
  insertPropertyArchiveSchema,
  type NewsArticle 
} from "@shared/schema";
import { ZodError } from "zod";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, BorderStyle, convertInchesToTwip } from "docx";

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
      const validated = insertNRIChecklistSchema.parse(req.body);
      const checklist = await storage.createNRIChecklist(validated);
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

  // Property Management endpoints
  app.get("/api/user-credits/:userId", async (req, res) => {
    try {
      let credits = await storage.getUserCredits(req.params.userId);
      if (!credits) {
        credits = await storage.createUserCredits(req.params.userId);
      }
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.post("/api/user-properties", async (req, res) => {
    try {
      const validated = insertUserPropertySchema.parse(req.body);
      const credits = await storage.getUserCredits(validated.userId);
      if (!credits) {
        return res.status(400).json({ error: "User has no credits" });
      }
      const available = credits.totalCredits - credits.usedCredits;
      if (available < credits.creditsPerProperty) {
        return res.status(400).json({ error: "Insufficient credits" });
      }
      
      const property = await storage.addUserProperty(validated);
      await storage.deductCredits(validated.userId, credits.creditsPerProperty);
      res.json(property);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid property data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add property" });
      }
    }
  });

  app.get("/api/user-properties/:userId", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const properties = await storage.getUserProperties(req.params.userId, status);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.patch("/api/user-properties/:propertyId", async (req, res) => {
    try {
      const { status } = req.body;
      const property = await storage.updateUserPropertyStatus(req.params.propertyId, status);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.post("/api/property-archive", async (req, res) => {
    try {
      const validated = insertPropertyArchiveSchema.parse(req.body);
      const archive = await storage.archiveSearchedProperty(
        validated.userId, 
        validated.propertyId, 
        validated.propertyDetails,
        validated.notes ?? undefined
      );
      res.json(archive);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid archive data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to archive property" });
      }
    }
  });

  app.get("/api/property-archive/:userId", async (req, res) => {
    try {
      const archives = await storage.getPropertyArchive(req.params.userId);
      res.json(archives);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch archived properties" });
    }
  });

  // Fraud Detection endpoints
  app.post("/api/fraud-detection/analyze", async (req, res) => {
    try {
      const { propertyId, ownerName, address, state } = req.body;
      if (!propertyId || !ownerName || !address || !state) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const fraudScore = await storage.analyzeFraudRisks(propertyId, ownerName, address, state);
      res.json(fraudScore);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze fraud risks" });
    }
  });

  app.get("/api/fraud-detection/:propertyId", async (req, res) => {
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

  // Litigation Search endpoints
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

  app.get("/api/litigation/property/:propertyId", async (req, res) => {
    try {
      const cases = await storage.searchLitigationByPropertyId(req.params.propertyId);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch litigation cases" });
    }
  });

  app.get("/api/litigation/owner", async (req, res) => {
    try {
      const ownerName = req.query.name as string;
      const state = req.query.state as string | undefined;
      if (!ownerName) {
        return res.status(400).json({ error: "Owner name required" });
      }
      const cases = await storage.searchLitigationByOwner(ownerName, state);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to search litigation cases" });
    }
  });

  app.get("/api/litigation/state/:state", async (req, res) => {
    try {
      const cases = await storage.listLitigationCasesByState(req.params.state);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch litigation cases" });
    }
  });

  app.get("/api/litigation/high-risk", async (req, res) => {
    try {
      const cases = await storage.getHighRiskLitigationCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch high-risk cases" });
    }
  });

  // Features Documentation - Download as Word
  app.get("/api/features-document", async (req, res) => {
    try {
      const paragraphs = [
        new Paragraph({ text: "AuditProp Platform - Complete Features Guide", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Comprehensive Property Due-Diligence & Verification System for Indian Real Estate", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "Platform Overview", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "AuditProp is an enterprise-grade property audit platform designed for the Indian real estate market. It provides 360° verified property audits combining ownership history, legal checks, financial encumbrances, fraud detection, and regulatory compliance verification into a single comprehensive trust score." }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "1. Property Verification Features (6 Features)", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Encumbrance Certificates (EC) - 30-Year History Tracking", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Complete history of financial liabilities on property" }),
        new Paragraph({ text: "• Verification of mortgages, loans, and liens" }),
        new Paragraph({ text: "• State-wise EC integration across India" }),
        new Paragraph({ text: "• Fraud risk scoring for EC data" }),

        new Paragraph({ text: "RERA Status & Compliance Checker", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Real Estate Regulatory Authority registration verification" }),
        new Paragraph({ text: "• Project status tracking (registered, under-construction, completed, stalled, cancelled)" }),
        new Paragraph({ text: "• Completion percentage and timeline monitoring" }),
        new Paragraph({ text: "• Buyer complaint tracking and resolution history" }),
        new Paragraph({ text: "• Developer compliance monitoring" }),

        new Paragraph({ text: "Title Verification Dashboard - 30-Year Clean Title Checks", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Complete ownership chain verification (30 years)" }),
        new Paragraph({ text: "• Mortgage status assessment (clear, mortgaged, released)" }),
        new Paragraph({ text: "• Tax clearance verification" }),
        new Paragraph({ text: "• Litigation history integration" }),
        new Paragraph({ text: "• Risk scoring and red flag identification" }),

        new Paragraph({ text: "Litigation Search Aggregator - Multi-State Integration", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Multi-state court database integration" }),
        new Paragraph({ text: "• Case number search and verification" }),
        new Paragraph({ text: "• Litigation status tracking (pending, disposed, appealed)" }),
        new Paragraph({ text: "• Risk level assessment (low, medium, high, critical)" }),
        new Paragraph({ text: "• Judgment and order records retrieval" }),

        new Paragraph({ text: "Land Records Aggregator", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Revenue records from 12+ Indian states" }),
        new Paragraph({ text: "• Survey number and plot details verification" }),
        new Paragraph({ text: "• Mutation status tracking" }),
        new Paragraph({ text: "• Agricultural vs non-agricultural land classification" }),

        new Paragraph({ text: "AI Document Verification with OCR", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Automated document uploads and scanning" }),
        new Paragraph({ text: "• AI-powered OCR text extraction" }),
        new Paragraph({ text: "• Forgery detection (signatures, stamps, seals)" }),
        new Paragraph({ text: "• Consistency checks across documents" }),

        new Paragraph({ text: "2. Risk & Fraud Analysis Features", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "AI-Powered Fraud Detection Algorithm (6-Factor Analysis)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Price Anomaly Detection: Identifies prices significantly below market rate" }),
        new Paragraph({ text: "• Document Forgery Analysis: AI-based authentication and signature matching" }),
        new Paragraph({ text: "• Seller Behavior Monitoring: Flags suspicious seller patterns" }),
        new Paragraph({ text: "• Title Fraud Detection: Identifies broken title chains and conflicting claims" }),
        new Paragraph({ text: "• Double Sale Risk Detection: Catches properties sold to multiple buyers" }),
        new Paragraph({ text: "• Benami Transaction Detection: Identifies properties held in proxy names" }),

        new Paragraph({ text: "Fraud Detection Capabilities:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "• Duplicate Sales Monitoring - Detects multiple registrations of same property" }),
        new Paragraph({ text: "• Forged Document Detection - Signature and authentication analysis" }),
        new Paragraph({ text: "• Identity Theft Alerts - Owner verification and impersonation detection" }),
        new Paragraph({ text: "• Multiple Claim Dispute Tracking - Conflicting ownership claims" }),
        new Paragraph({ text: "• GPA Holder Concerns - Proxy ownership risks" }),
        new Paragraph({ text: "• Mortgage Verification - Loan lien and default status checking" }),

        new Paragraph({ text: "3. Compliance & Documentation Features", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "NRI Compliance Suite - Pre & Post-Purchase Compliance", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Passport and PAN verification for NRI buyers" }),
        new Paragraph({ text: "• OCI/PIO status verification" }),
        new Paragraph({ text: "• NRE/NRO bank account documentation" }),
        new Paragraph({ text: "• Income proof requirements and submission tracking" }),
        new Paragraph({ text: "• Power of Attorney (POA) notarization and attestation" }),
        new Paragraph({ text: "• Form 15CA/15CB TDS exemption documentation" }),
        new Paragraph({ text: "• FEMAL compliance tracking" }),
        new Paragraph({ text: "• Repatriation eligibility assessment" }),
        new Paragraph({ text: "• Payment channel verification" }),
        new Paragraph({ text: "• Compliance score calculation (0-100)" }),

        new Paragraph({ text: "Developer Audit Module - RERA Form 7 Compliance", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• RERA Form 7 submission tracking" }),
        new Paragraph({ text: "• Audited financial statements verification" }),
        new Paragraph({ text: "• Profit & Loss statement review" }),
        new Paragraph({ text: "• Balance sheet and cash flow analysis" }),
        new Paragraph({ text: "• Fund utilization verification" }),
        new Paragraph({ text: "• Compliance status tracking" }),

        new Paragraph({ text: "4. Market Intelligence & Investment Features", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Real-Time Market Intelligence Dashboard", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Price trend analysis for 6 major Indian cities" }),
        new Paragraph({ text: "• Price per square foot tracking" }),
        new Paragraph({ text: "• Transaction volume monitoring" }),
        new Paragraph({ text: "• Fraud rate percentage by locality" }),
        new Paragraph({ text: "• Developer default rate tracking" }),
        new Paragraph({ text: "• Project stall rate monitoring" }),
        new Paragraph({ text: "• Demand-supply ratio analysis" }),
        new Paragraph({ text: "• Rental yield calculations" }),
        new Paragraph({ text: "• Investment score calculation (0-100)" }),
        new Paragraph({ text: "• Regulatory change alerts" }),

        new Paragraph({ text: "5. User Management & Credit System", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Credit-Based Property Management System", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Per-user credit allocation and tracking" }),
        new Paragraph({ text: "• 1 credit per property audit (configurable)" }),
        new Paragraph({ text: "• Buy/Sell property listings management" }),
        new Paragraph({ text: "• Property status tracking (active, archived, completed)" }),
        new Paragraph({ text: "• Property archive with search history" }),
        new Paragraph({ text: "• Rating and notes on archived properties" }),

        new Paragraph({ text: "6. Admin & Marketing Pages", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Administrative Features:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "• User management and role-based access control" }),
        new Paragraph({ text: "• System configuration and settings" }),
        new Paragraph({ text: "• Report generation and download" }),
        new Paragraph({ text: "• Audit logs and activity tracking" }),

        new Paragraph({ text: "Marketing Pages:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "• Solutions page - Overview of all services" }),
        new Paragraph({ text: "• Data Sources page - Database integrations" }),
        new Paragraph({ text: "• Pricing page - Plans and features" }),
        new Paragraph({ text: "• API page - Developer documentation" }),
        new Paragraph({ text: "• Contact page - Lead capture" }),
        new Paragraph({ text: "• News/Updates page - Industry updates" }),

        new Paragraph({ text: "Technology Architecture", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "• Frontend: React 18 + TypeScript + Vite" }),
        new Paragraph({ text: "• Backend: Express.js + TypeScript" }),
        new Paragraph({ text: "• Database: PostgreSQL with Drizzle ORM" }),
        new Paragraph({ text: "• UI Components: Radix UI + Tailwind CSS + shadcn/ui" }),
        new Paragraph({ text: "• State Management: TanStack Query + React Context" }),

        new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "AuditProp delivers a comprehensive 360° property due-diligence platform with 26+ features covering property verification, fraud detection, compliance management, market intelligence, and user administration. The platform integrates multiple data sources and regulatory databases to provide verified risk scores and actionable insights for property buyers, investors, and real estate professionals in India." }),
      ];

      const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
      const buffer = await Packer.toBuffer(doc);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", "attachment; filename=AuditProp-Features-Guide.docx");
      res.send(buffer);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(500).json({ error: "Failed to generate document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
