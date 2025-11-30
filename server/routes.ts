import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema, 
  insertUserSchema, 
  updateUserSchema,
  insertUserPropertySchema, 
  insertNRIChecklistSchema,
  insertPropertyArchiveSchema,
  type NewsArticle 
} from "@shared/schema";
import { ZodError } from "zod";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";

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
  // Admin: List all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.listAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin: Update user role
  app.patch("/api/admin/users/:userId/role", async (req, res) => {
    try {
      const { role } = req.body;
      if (!["user", "admin", "auditor", "nri_user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      const user = await storage.updateUserRole(req.params.userId, role);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Admin: Update user status
  app.patch("/api/admin/users/:userId/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["active", "inactive", "suspended"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const user = await storage.updateUserStatus(req.params.userId, status);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.userId);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

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
      
      // Add the property first
      const property = await storage.addUserProperty(validated);
      
      // Run comprehensive audit to populate all verification dashboards
      const auditResults = await storage.runComprehensiveAudit(property.id, {
        propertyName: validated.propertyName,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        pincode: validated.pincode ?? undefined,
        propertyType: validated.propertyType,
        estimatedValue: validated.estimatedValue ?? undefined,
        area: validated.area ?? undefined,
      });
      
      // Calculate overall risk score from audit results
      const overallRiskScore = Math.floor(
        (auditResults.fraudScore.overallFraudScore * 0.4) +
        ((auditResults.titleVerification.riskScore ?? 0) * 0.3) +
        ((auditResults.encumbranceCertificate.fraudRiskScore || 0) * 0.2) +
        (auditResults.litigationCases.length > 0 ? 20 : 0) * 0.1
      );
      
      const riskLevel = overallRiskScore > 60 ? "high" : overallRiskScore > 30 ? "medium" : "low";
      
      // Update property with audit details
      const updatedProperty = await storage.updateUserPropertyAuditDetails(property.id, {
        riskScore: overallRiskScore,
        riskLevel,
        ecStatus: auditResults.encumbranceCertificate.ecStatus,
        titleStatus: auditResults.titleVerification.verificationStatus,
        fraudScore: auditResults.fraudScore.overallFraudScore,
        litigationCount: auditResults.litigationCases.length,
        auditDate: new Date().toISOString(),
      });
      
      // Deduct credits after successful audit
      await storage.deductCredits(validated.userId, credits.creditsPerProperty);
      
      res.json({
        property: updatedProperty || property,
        auditResults: {
          overallRiskScore,
          riskLevel,
          ecStatus: auditResults.encumbranceCertificate.ecStatus,
          titleStatus: auditResults.titleVerification.verificationStatus,
          fraudScore: auditResults.fraudScore.overallFraudScore,
          litigationCount: auditResults.litigationCases.length,
          marketInvestmentScore: auditResults.marketIntelligence?.investmentScore,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid property data", details: error.errors });
      } else {
        console.error("Error adding property:", error);
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

  // Get all audit data for a specific property
  app.get("/api/property-audit/:propertyId", async (req, res) => {
    try {
      const propertyId = req.params.propertyId;
      
      const [ec, title, fraud, landRecord, litigationCases] = await Promise.all([
        storage.getEncumbranceCertificate(propertyId),
        storage.getTitleVerification(propertyId),
        storage.getFraudScore(propertyId),
        storage.getLandRecord(propertyId),
        storage.searchLitigationByPropertyId(propertyId),
      ]);
      
      res.json({
        propertyId,
        encumbranceCertificate: ec,
        titleVerification: title,
        fraudScore: fraud,
        landRecord,
        litigationCases,
      });
    } catch (error) {
      console.error("Error fetching property audit data:", error);
      res.status(500).json({ error: "Failed to fetch property audit data" });
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
        new Paragraph({ text: "AuditProp Platform - Complete Features Guide", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Comprehensive Property Due-Diligence & Verification System for Indian Real Estate", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: " " }),

        new Paragraph({ text: "Platform Overview", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "AuditProp is an enterprise-grade property audit platform designed for the Indian real estate market. It provides 360° verified property audits combining ownership history, legal checks, financial encumbrances, fraud detection, and regulatory compliance verification into a single comprehensive trust score.", spacing: { line: 360 } }),
        new Paragraph({ text: " " }),

        new Paragraph({ text: "1. Property Verification Features (6 Features)", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Encumbrance Certificates (EC) - 30-Year History Tracking", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Complete history of financial liabilities on property", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Verification of mortgages, loans, and liens", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "State-wise EC integration across India", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Fraud risk scoring for EC data", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "RERA Status & Compliance Checker", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Real Estate Regulatory Authority registration verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Project status tracking (registered, under-construction, completed, stalled, cancelled)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Completion percentage and timeline monitoring", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Buyer complaint tracking and resolution history", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Developer compliance monitoring", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Title Verification Dashboard - 30-Year Clean Title Checks", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Complete ownership chain verification (30 years)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Mortgage status assessment (clear, mortgaged, released)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Tax clearance verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Litigation history integration", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Risk scoring and red flag identification", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Litigation Search Aggregator - Multi-State Integration", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Multi-state court database integration", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Case number search and verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Litigation status tracking (pending, disposed, appealed)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Risk level assessment (low, medium, high, critical)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Judgment and order records retrieval", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Land Records Aggregator", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Revenue records from 12+ Indian states", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Survey number and plot details verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Mutation status tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Agricultural vs non-agricultural land classification", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "AI Document Verification with OCR", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Automated document uploads and scanning", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "AI-powered OCR text extraction", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Forgery detection (signatures, stamps, seals)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Consistency checks across documents", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "2. Risk & Fraud Analysis Features", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "AI-Powered Fraud Detection Algorithm (6-Factor Analysis)", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Price Anomaly Detection: Identifies prices significantly below market rate", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Document Forgery Analysis: AI-based authentication and signature matching", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Seller Behavior Monitoring: Flags suspicious seller patterns", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Title Fraud Detection: Identifies broken title chains and conflicting claims", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Double Sale Risk Detection: Catches properties sold to multiple buyers", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Benami Transaction Detection: Identifies properties held in proxy names", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Fraud Detection Capabilities:", heading: HeadingLevel.HEADING_3, spacing: { line: 360 } }),
        new Paragraph({ text: "Duplicate Sales Monitoring - Detects multiple registrations of same property", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Forged Document Detection - Signature and authentication analysis", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Identity Theft Alerts - Owner verification and impersonation detection", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Multiple Claim Dispute Tracking - Conflicting ownership claims", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "GPA Holder Concerns - Proxy ownership risks", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Mortgage Verification - Loan lien and default status checking", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "3. Compliance & Documentation Features", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "NRI Compliance Suite - Pre & Post-Purchase Compliance", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Passport and PAN verification for NRI buyers", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "OCI/PIO status verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "NRE/NRO bank account documentation", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Income proof requirements and submission tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Power of Attorney (POA) notarization and attestation", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Form 15CA/15CB TDS exemption documentation", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "FEMAL compliance tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Repatriation eligibility assessment", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Payment channel verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Compliance score calculation (0-100)", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Developer Audit Module - RERA Form 7 Compliance", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "RERA Form 7 submission tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Audited financial statements verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Profit & Loss statement review", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Balance sheet and cash flow analysis", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Fund utilization verification", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Compliance status tracking", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "4. Market Intelligence & Investment Features", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Real-Time Market Intelligence Dashboard", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Price trend analysis for 6 major Indian cities", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Price per square foot tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Transaction volume monitoring", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Fraud rate percentage by locality", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Developer default rate tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Project stall rate monitoring", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Demand-supply ratio analysis", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Rental yield calculations", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Investment score calculation (0-100)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Regulatory change alerts", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "5. User Management & Credit System", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Credit-Based Property Management System", heading: HeadingLevel.HEADING_2, spacing: { line: 360 } }),
        new Paragraph({ text: "Per-user credit allocation and tracking", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "1 credit per property audit (configurable)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Buy/Sell property listings management", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Property status tracking (active, archived, completed)", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Property archive with search history", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Rating and notes on archived properties", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "6. Admin & Marketing Pages", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Administrative Features:", heading: HeadingLevel.HEADING_3, spacing: { line: 360 } }),
        new Paragraph({ text: "User management and role-based access control", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "System configuration and settings", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Report generation and download", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Audit logs and activity tracking", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Marketing Pages:", heading: HeadingLevel.HEADING_3, spacing: { line: 360 } }),
        new Paragraph({ text: "Solutions page - Overview of all services", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Data Sources page - Database integrations", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Pricing page - Plans and features", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "API page - Developer documentation", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Contact page - Lead capture", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "News/Updates page - Industry updates", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Technology Architecture", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "Frontend: React 18 + TypeScript + Vite", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Backend: Express.js + TypeScript", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "Database: PostgreSQL with Drizzle ORM", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "UI Components: Radix UI + Tailwind CSS + shadcn/ui", spacing: { line: 360, before: 120, after: 120 } }),
        new Paragraph({ text: "State Management: TanStack Query + React Context", spacing: { line: 360, before: 120, after: 120 } }),

        new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_1, spacing: { line: 360 } }),
        new Paragraph({ text: "AuditProp delivers a comprehensive 360° property due-diligence platform with 26+ features covering property verification, fraud detection, compliance management, market intelligence, and user administration. The platform integrates multiple data sources and regulatory databases to provide verified risk scores and actionable insights for property buyers, investors, and real estate professionals in India.", spacing: { line: 360 } }),
      ];

      const doc = new Document({ 
        sections: [{ 
          properties: {}, 
          children: paragraphs 
        }] 
      });
      
      const buffer = await Packer.toBuffer(doc);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", "attachment; filename=AuditProp-Features-Guide.docx");
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(500).json({ error: "Failed to generate document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
