import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type EncumbranceCertificate, type ReraProject, type LitigationCase, type NRIDocumentChecklist, type TitleVerification, type FraudDetectionScore, type DeveloperAudit, type DocumentVerification, type LandRecord, type MarketIntelligence, type UserCredit, type UserProperty, type PropertyArchiveEntry, type InsertUserProperty } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Encumbrance Certificate methods
  getEncumbranceCertificate(propertyId: string): Promise<EncumbranceCertificate | undefined>;
  listEncumbranceCertificates(state?: string): Promise<EncumbranceCertificate[]>;
  
  // RERA Project methods
  getReraProject(registrationNumber: string): Promise<ReraProject | undefined>;
  listReraProjects(state?: string, city?: string): Promise<ReraProject[]>;
  
  // Litigation Case methods
  getLitigationCase(caseNumber: string): Promise<LitigationCase | undefined>;
  listLitigationCasesByProperty(propertyAddress: string): Promise<LitigationCase[]>;
  
  // NRI Document Checklist methods
  getNRIChecklist(nriEmail: string): Promise<NRIDocumentChecklist | undefined>;
  createNRIChecklist(checklist: Partial<NRIDocumentChecklist>): Promise<NRIDocumentChecklist>;
  
  // Title Verification methods
  getTitleVerification(propertyId: string): Promise<TitleVerification | undefined>;
  
  // Fraud Detection methods
  getFraudScore(propertyId: string): Promise<FraudDetectionScore | undefined>;
  
  // Developer Audit methods
  getDeveloperAudit(developerId: string, year: number): Promise<DeveloperAudit | undefined>;
  listDeveloperAudits(developerId: string): Promise<DeveloperAudit[]>;
  
  // Document Verification methods
  getDocumentVerification(id: string): Promise<DocumentVerification | undefined>;
  listDocumentVerifications(documentType?: string): Promise<DocumentVerification[]>;
  
  // Land Records methods
  getLandRecord(propertyId: string): Promise<LandRecord | undefined>;
  listLandRecordsByLocation(state: string, district: string): Promise<LandRecord[]>;
  
  // Market Intelligence methods
  getMarketIntelligence(city: string, monthYear: string): Promise<MarketIntelligence | undefined>;
  listMarketIntelligenceByCity(city: string): Promise<MarketIntelligence[]>;

  // User Credits & Properties methods
  getUserCredits(userId: string): Promise<UserCredit | undefined>;
  createUserCredits(userId: string): Promise<UserCredit>;
  addUserProperty(property: InsertUserProperty): Promise<UserProperty>;
  getUserProperties(userId: string, status?: string): Promise<UserProperty[]>;
  updateUserPropertyStatus(propertyId: string, status: string): Promise<UserProperty | undefined>;
  archiveSearchedProperty(userId: string, propertyId: string, propertyDetails: any, notes?: string): Promise<PropertyArchiveEntry>;
  getPropertyArchive(userId: string): Promise<PropertyArchiveEntry[]>;
  deductCredits(userId: string, amount: number): Promise<UserCredit | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;
  private encumbranceCertificates: Map<string, EncumbranceCertificate>;
  private reraProjects: Map<string, ReraProject>;
  private litigationCases: Map<string, LitigationCase>;
  private nriChecklists: Map<string, NRIDocumentChecklist>;
  private titleVerifications: Map<string, TitleVerification>;
  private fraudScores: Map<string, FraudDetectionScore>;
  private developerAudits: Map<string, DeveloperAudit>;
  private documentVerifications: Map<string, DocumentVerification>;
  private landRecords: Map<string, LandRecord>;
  private marketIntelligence: Map<string, MarketIntelligence>;
  private userCreditsMap: Map<string, UserCredit>;
  private userPropertiesMap: Map<string, UserProperty>;
  private propertyArchiveMap: Map<string, PropertyArchiveEntry>;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.encumbranceCertificates = new Map();
    this.reraProjects = new Map();
    this.litigationCases = new Map();
    this.nriChecklists = new Map();
    this.titleVerifications = new Map();
    this.fraudScores = new Map();
    this.developerAudits = new Map();
    this.documentVerifications = new Map();
    this.landRecords = new Map();
    this.marketIntelligence = new Map();
    this.userCreditsMap = new Map();
    this.userPropertiesMap = new Map();
    this.propertyArchiveMap = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock RERA Projects
    this.reraProjects.set("KA-RERA-2020-001", {
      id: randomUUID(),
      reraRegistrationNumber: "KA-RERA-2020-001",
      projectName: "Prestige Central Park",
      developerName: "Prestige Group",
      state: "Karnataka",
      city: "Bangalore",
      launchDate: new Date("2020-01-15"),
      completionDate: new Date("2023-12-31"),
      estimatedCompletion: new Date("2023-12-31"),
      actualCompletion: new Date("2024-03-15"),
      status: "completed",
      totalUnits: 450,
      soldUnits: 425,
      completionPercentage: 100,
      delayMonths: 2,
      amenities: ["Swimming Pool", "Gym", "Parking"],
      approvalNumber: "BNG-APPROVAL-2019-456",
      sanctionedArea: "35000",
      unitsDelivered: 420,
      buyerComplaints: 12,
      createdAt: new Date(),
    });

    // Mock Encumbrance Certificates
    this.encumbranceCertificates.set("prop-001", {
      id: randomUUID(),
      propertyId: "prop-001",
      state: "Karnataka",
      district: "Bangalore Urban",
      subRegistrar: "Indiranagar",
      surveyNumber: "123/456",
      ownerName: "John Doe",
      ecStatus: "form_16",
      encumbrances: [],
      verifiedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      documentUrl: "https://example.com/ec-001.pdf",
      fraudRiskScore: 5,
    });

    // Mock Litigation Cases
    this.litigationCases.set("CS-2023-001", {
      id: randomUUID(),
      caseNumber: "CS-2023-001",
      court: "district_court",
      state: "Karnataka",
      propertyAddress: "123 Main Street, Bangalore",
      propertyId: "prop-002",
      plaintiff: "Jane Smith",
      defendant: "ABC Builders",
      caseType: "title_dispute",
      filingDate: new Date("2023-06-15"),
      status: "pending",
      judgment: null,
      judgmentDate: null,
      description: "Property title dispute regarding boundary demarcation",
      riskLevel: "high",
      createdAt: new Date(),
    });

    // Mock Market Intelligence
    this.marketIntelligence.set("bangalore-2025-01", {
      id: randomUUID(),
      city: "Bangalore",
      state: "Karnataka",
      locality: "Whitefield",
      monthYear: "2025-01",
      avgPropertyPrice: "8500000",
      pricePerSqft: "8500",
      transactionVolume: 245,
      fraudRatePercentage: "2.3",
      developerDefaultRate: "1.2",
      projectStallRate: "0.8",
      avgProjectDelayMonths: 3,
      demandSupplyRatio: "1.4",
      rentYield: "3.2",
      investmentScore: 78,
      regulatoryChanges: ["New RERA compliance norms", "GST rate changes"],
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: "user" };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      phone: insertMessage.phone ?? null,
      company: insertMessage.company ?? null,
      jobTitle: insertMessage.jobTitle ?? null,
      companySize: insertMessage.companySize ?? null,
      industry: insertMessage.industry ?? null,
      budget: insertMessage.budget ?? null,
      timeline: insertMessage.timeline ?? null,
      interests: insertMessage.interests ?? null,
      hearAboutUs: insertMessage.hearAboutUs ?? null,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Encumbrance Certificate methods
  async getEncumbranceCertificate(propertyId: string): Promise<EncumbranceCertificate | undefined> {
    return this.encumbranceCertificates.get(propertyId);
  }

  async listEncumbranceCertificates(state?: string): Promise<EncumbranceCertificate[]> {
    const certs = Array.from(this.encumbranceCertificates.values());
    return state ? certs.filter(c => c.state === state) : certs;
  }

  // RERA Project methods
  async getReraProject(registrationNumber: string): Promise<ReraProject | undefined> {
    return this.reraProjects.get(registrationNumber);
  }

  async listReraProjects(state?: string, city?: string): Promise<ReraProject[]> {
    const projects = Array.from(this.reraProjects.values());
    return projects.filter(p => 
      (!state || p.state === state) && (!city || p.city === city)
    );
  }

  // Litigation Case methods
  async getLitigationCase(caseNumber: string): Promise<LitigationCase | undefined> {
    return this.litigationCases.get(caseNumber);
  }

  async listLitigationCasesByProperty(propertyAddress: string): Promise<LitigationCase[]> {
    return Array.from(this.litigationCases.values()).filter(
      c => c.propertyAddress.toLowerCase().includes(propertyAddress.toLowerCase())
    );
  }

  async searchLitigationByOwner(ownerName: string, state?: string): Promise<LitigationCase[]> {
    const allCases = Array.from(this.litigationCases.values());
    return allCases.filter(c => 
      (c.plaintiff?.includes(ownerName) || c.defendant?.includes(ownerName) || c.ownerName === ownerName) &&
      (!state || c.state === state)
    );
  }

  async searchLitigationByPropertyId(propertyId: string): Promise<LitigationCase[]> {
    return Array.from(this.litigationCases.values())
      .filter(c => c.propertyId === propertyId);
  }

  async listLitigationCasesByState(state: string): Promise<LitigationCase[]> {
    return Array.from(this.litigationCases.values())
      .filter(c => c.state === state);
  }

  async getHighRiskLitigationCases(): Promise<LitigationCase[]> {
    return Array.from(this.litigationCases.values())
      .filter(c => c.riskLevel === "high" || c.riskLevel === "critical")
      .sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (riskOrder[a.riskLevel as keyof typeof riskOrder] || 4) - 
               (riskOrder[b.riskLevel as keyof typeof riskOrder] || 4);
      });
  }

  // NRI Document Checklist methods
  async getNRIChecklist(nriEmail: string): Promise<NRIDocumentChecklist | undefined> {
    return Array.from(this.nriChecklists.values()).find(c => c.nriEmail === nriEmail);
  }

  async createNRIChecklist(checklist: Partial<NRIDocumentChecklist>): Promise<NRIDocumentChecklist> {
    const newChecklist: NRIDocumentChecklist = {
      id: randomUUID(),
      nriEmail: checklist.nriEmail ?? "",
      propertyId: checklist.propertyId,
      passportVerified: checklist.passportVerified || false,
      panCardVerified: checklist.panCardVerified || false,
      ociPioVerified: checklist.ociPioVerified || false,
      nreNroAccountVerified: checklist.nreNroAccountVerified || false,
      incomeProofSubmitted: checklist.incomeProofSubmitted || false,
      poaNotarized: checklist.poaNotarized || false,
      poaAttested: checklist.poaAttested || false,
      form15caRequired: checklist.form15caRequired || false,
      form15caSubmitted: checklist.form15caSubmitted || false,
      femalCompliance: checklist.femalCompliance || false,
      repatriationEligible: checklist.repatriationEligible || false,
      repatriationLimit: checklist.repatriationLimit || "USD 1 Million",
      paymentChannelVerified: checklist.paymentChannelVerified || false,
      complianceScore: 0,
      completionPercentage: 0,
      remarks: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.nriChecklists.set(newChecklist.id, newChecklist);
    return newChecklist;
  }

  // Title Verification methods
  async getTitleVerification(propertyId: string): Promise<TitleVerification | undefined> {
    return this.titleVerifications.get(propertyId);
  }

  // Fraud Detection methods
  async getFraudScore(propertyId: string): Promise<FraudDetectionScore | undefined> {
    return this.fraudScores.get(propertyId);
  }

  async analyzeFraudRisks(propertyId: string, ownerName: string, address: string, state: string): Promise<FraudDetectionScore> {
    const fraudScore: FraudDetectionScore = {
      id: randomUUID(),
      propertyId,
      ownerName,
      overallFraudScore: 0,
      priceAnomalyScore: Math.random() * 100,
      documentForgerScore: Math.random() * 50,
      duplicateSaleInstances: Math.random() > 0.8 ? 1 : 0,
      forgedDocumentCount: Math.random() > 0.85 ? 1 : 0,
      identityTheftAlerts: Math.random() > 0.9 ? 1 : 0,
      multipleClaimDisputes: Math.random() > 0.85 ? 1 : 0,
      gpaHolderConcerns: Math.random() > 0.8,
      salesAgreementFlags: [],
      mortgageCheckStatus: "clear",
      fraudFlags: [],
      fraudAlerts: [],
      detailedFindings: {
        duplicateSales: this.checkDuplicateSales(propertyId),
        forgedDocs: this.checkForgedDocuments(propertyId),
        identityTheft: this.checkIdentityTheft(ownerName),
        multipleOwnershipClaims: this.checkMultipleClaims(propertyId, address),
        gpaHolders: this.checkGPAHolders(propertyId),
        mortgageStatus: this.checkMortgageStatus(propertyId),
      },
      recommendation: "Manual review recommended",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fraudFlags = [];
    if (fraudScore.duplicateSaleInstances > 0) fraudFlags.push("duplicate_sale");
    if (fraudScore.forgedDocumentCount > 0) fraudFlags.push("forged_document");
    if (fraudScore.identityTheftAlerts > 0) fraudFlags.push("identity_theft");
    if (fraudScore.multipleClaimDisputes > 0) fraudFlags.push("multiple_claims");
    if (fraudScore.gpaHolderConcerns) fraudFlags.push("gpa_holder_concern");

    fraudScore.fraudFlags = fraudFlags;
    fraudScore.overallFraudScore = Math.min(
      100,
      fraudScore.priceAnomalyScore * 0.2 +
      fraudScore.documentForgerScore * 0.3 +
      (fraudScore.duplicateSaleInstances * 15) +
      (fraudScore.forgedDocumentCount * 20) +
      (fraudScore.identityTheftAlerts * 25) +
      (fraudScore.multipleClaimDisputes * 20) +
      (fraudScore.gpaHolderConcerns ? 15 : 0)
    );

    this.fraudScores.set(fraudScore.id, fraudScore);
    return fraudScore;
  }

  private checkDuplicateSales(propertyId: string): boolean {
    const cases = Array.from(this.litigationCases.values())
      .filter(c => c.propertyId === propertyId && c.caseType === "title_dispute");
    return cases.length > 0;
  }

  private checkForgedDocuments(propertyId: string): number {
    const docs = Array.from(this.documentVerifications.values())
      .filter(d => (d as any).propertyId === propertyId && d.forgerySuspicionLevel !== "low");
    return docs.length;
  }

  private checkIdentityTheft(ownerName: string): boolean {
    const cases = Array.from(this.litigationCases.values())
      .filter(c => (c.plaintiff?.includes(ownerName) || c.defendant?.includes(ownerName)) && c.caseType === "title_dispute");
    return cases.length > 1;
  }

  private checkMultipleClaims(propertyId: string, address: string): number {
    const cases = Array.from(this.litigationCases.values())
      .filter(c => c.propertyId === propertyId || c.propertyAddress === address);
    return cases.length;
  }

  private checkGPAHolders(propertyId: string): any[] {
    return [];
  }

  private checkMortgageStatus(propertyId: string): string {
    const titleVer = Array.from(this.titleVerifications.values())
      .find(t => t.propertyId === propertyId);
    return titleVer ? (titleVer as any).mortgageStatus : "clear";
  }

  // Developer Audit methods
  async getDeveloperAudit(developerId: string, year: number): Promise<DeveloperAudit | undefined> {
    const key = `${developerId}-${year}`;
    return Array.from(this.developerAudits.values()).find(
      a => a.developerId === developerId && a.auditYear === year
    );
  }

  async listDeveloperAudits(developerId: string): Promise<DeveloperAudit[]> {
    return Array.from(this.developerAudits.values()).filter(
      a => a.developerId === developerId
    );
  }

  // Document Verification methods
  async getDocumentVerification(id: string): Promise<DocumentVerification | undefined> {
    return this.documentVerifications.get(id);
  }

  async listDocumentVerifications(documentType?: string): Promise<DocumentVerification[]> {
    const docs = Array.from(this.documentVerifications.values());
    return documentType ? docs.filter(d => d.documentType === documentType) : docs;
  }

  // Land Records methods
  async getLandRecord(propertyId: string): Promise<LandRecord | undefined> {
    return this.landRecords.get(propertyId);
  }

  async listLandRecordsByLocation(state: string, district: string): Promise<LandRecord[]> {
    return Array.from(this.landRecords.values()).filter(
      r => r.state === state && r.district === district
    );
  }

  // Market Intelligence methods
  async getMarketIntelligence(city: string, monthYear: string): Promise<MarketIntelligence | undefined> {
    const key = `${city}-${monthYear}`;
    return Array.from(this.marketIntelligence.values()).find(
      m => m.city === city && m.monthYear === monthYear
    );
  }

  async listMarketIntelligenceByCity(city: string): Promise<MarketIntelligence[]> {
    return Array.from(this.marketIntelligence.values()).filter(
      m => m.city === city
    );
  }

  // User Credits & Properties methods
  async getUserCredits(userId: string): Promise<UserCredit | undefined> {
    return Array.from(this.userCreditsMap.values()).find(c => c.userId === userId);
  }

  async createUserCredits(userId: string): Promise<UserCredit> {
    const existing = await this.getUserCredits(userId);
    if (existing) return existing;
    
    const credit: UserCredit = {
      id: randomUUID(),
      userId,
      totalCredits: 100,
      usedCredits: 0,
      creditsPerProperty: 1,
      updatedAt: new Date(),
    };
    this.userCreditsMap.set(credit.id, credit);
    return credit;
  }

  async addUserProperty(property: InsertUserProperty): Promise<UserProperty> {
    const userProp: UserProperty = {
      id: randomUUID(),
      ...property,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userPropertiesMap.set(userProp.id, userProp);
    return userProp;
  }

  async getUserProperties(userId: string, status?: string): Promise<UserProperty[]> {
    const props = Array.from(this.userPropertiesMap.values()).filter(
      p => p.userId === userId
    );
    return status ? props.filter(p => p.status === status) : props;
  }

  async updateUserPropertyStatus(propertyId: string, status: string): Promise<UserProperty | undefined> {
    const prop = Array.from(this.userPropertiesMap.values()).find(p => p.id === propertyId);
    if (prop) {
      prop.status = status;
      prop.updatedAt = new Date();
    }
    return prop;
  }

  async archiveSearchedProperty(userId: string, propertyId: string, propertyDetails: any, notes?: string): Promise<PropertyArchiveEntry> {
    const archive: PropertyArchiveEntry = {
      id: randomUUID(),
      userId,
      propertyId,
      propertyDetails,
      searchedAt: new Date(),
      notes: notes || "",
      rating: undefined,
    };
    this.propertyArchiveMap.set(archive.id, archive);
    return archive;
  }

  async getPropertyArchive(userId: string): Promise<PropertyArchiveEntry[]> {
    return Array.from(this.propertyArchiveMap.values()).filter(
      a => a.userId === userId
    );
  }

  async deductCredits(userId: string, amount: number): Promise<UserCredit | undefined> {
    const credit = await this.getUserCredits(userId);
    if (credit) {
      const available = credit.totalCredits - credit.usedCredits;
      if (available >= amount) {
        credit.usedCredits += amount;
        credit.updatedAt = new Date();
      }
    }
    return credit;
  }
}

export const storage = new MemStorage();
