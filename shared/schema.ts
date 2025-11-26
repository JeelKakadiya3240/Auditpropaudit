import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  companySize: text("company_size"),
  industry: text("industry"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  interests: text("interests").array(),
  hearAboutUs: text("hear_about_us"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 1 & 5: Encumbrance Certificate (EC) & State-wise EC Integration
export const encumbranceCertificates = pgTable("encumbrance_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  subRegistrar: text("sub_registrar").notNull(),
  surveyNumber: text("survey_number").notNull(),
  ownerName: text("owner_name").notNull(),
  ecStatus: text("ec_status").notNull().default("form_16"), // form_15 (has encumbrances) or form_16 (nil)
  encumbrances: jsonb("encumbrances").notNull(), // [{type: "mortgage", amount: "50L", bank: "HDFC", date: "2020-01-01"}]
  verifiedDate: timestamp("verified_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  documentUrl: text("document_url"),
  fraudRiskScore: integer("fraud_risk_score").default(0), // 0-100
});

// Feature 2: RERA Status Checker
export const reraProjects = pgTable("rera_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reraRegistrationNumber: text("rera_registration_number").notNull().unique(),
  projectName: text("project_name").notNull(),
  developerName: text("developer_name").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  launchDate: timestamp("launch_date"),
  completionDate: timestamp("completion_date"),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  status: text("status").notNull(), // registered, under_construction, completed, stalled, cancelled
  totalUnits: integer("total_units"),
  soldUnits: integer("sold_units"),
  completionPercentage: integer("completion_percentage"),
  delayMonths: integer("delay_months").default(0),
  amenities: text("amenities").array(),
  approvalNumber: text("approval_number"),
  sanctionedArea: numeric("sanctioned_area", { precision: 10, scale: 2 }),
  unitsDelivered: integer("units_delivered").default(0),
  buyerComplaints: integer("buyer_complaints").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 3: Litigation Search Aggregator
export const litigationCases = pgTable("litigation_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").notNull(),
  court: text("court").notNull(), // district_court, high_court
  state: text("state").notNull(),
  propertyAddress: text("property_address").notNull(),
  propertyId: varchar("property_id"),
  plaintiff: text("plaintiff").notNull(),
  defendant: text("defendant").notNull(),
  caseType: text("case_type").notNull(), // title_dispute, mortgage_recovery, eviction, encroachment, etc
  filingDate: timestamp("filing_date"),
  status: text("status").notNull(), // pending, disposed, appealed
  judgment: text("judgment"), // plaintiff_won, defendant_won, settlement
  judgmentDate: timestamp("judgment_date"),
  description: text("description"),
  riskLevel: text("risk_level").default("medium"), // low, medium, high, critical
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 4: NRI Document Checklist & Feature 10: NRI Compliance Suite
export const nriDocumentChecklists = pgTable("nri_document_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nriEmail: text("nri_email").notNull(),
  propertyId: varchar("property_id"),
  passportVerified: boolean("passport_verified").default(false),
  panCardVerified: boolean("pan_card_verified").default(false),
  ociPioVerified: boolean("oci_pio_verified").default(false),
  nreNroAccountVerified: boolean("nre_nro_account_verified").default(false),
  incomeProofSubmitted: boolean("income_proof_submitted").default(false),
  poaNotarized: boolean("poa_notarized").default(false),
  poaAttested: boolean("poa_attested").default(false),
  form15caRequired: boolean("form_15ca_required").default(false),
  form15caSubmitted: boolean("form_15ca_submitted").default(false),
  femalCompliance: boolean("femal_compliance").default(false),
  repatriationEligible: boolean("repatriation_eligible").default(false),
  repatriationLimit: text("repatriation_limit"),
  paymentChannelVerified: boolean("payment_channel_verified").default(false),
  complianceScore: integer("compliance_score").default(0), // 0-100
  completionPercentage: integer("completion_percentage").default(0),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature 6: Title Verification Dashboard
export const titleVerifications = pgTable("title_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  ownerName: text("owner_name").notNull(),
  currentSalePrice: numeric("current_sale_price", { precision: 15, scale: 2 }),
  verificationStatus: text("verification_status").notNull(), // clean, flagged, disputed, unclear
  titleChainComplete: boolean("title_chain_complete").default(false),
  yearsVerified: integer("years_verified").default(0),
  mortgageStatus: text("mortgage_status").default("clear"), // clear, mortgaged, released
  taxClearance: boolean("tax_clearance").default(false),
  litigationFound: boolean("litigation_found").default(false),
  ownershipChain: jsonb("ownership_chain").notNull(), // [{owner: "name", period: "2020-2024", document: "deed"}]
  riskScore: integer("risk_score").default(0), // 0-100
  redFlags: text("red_flags").array(),
  verificationDate: timestamp("verification_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 7: Fraud Detection Algorithm
export const fraudDetectionScores = pgTable("fraud_detection_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  overallFraudScore: integer("overall_fraud_score").notNull(), // 0-100
  priceAnomalyScore: integer("price_anomaly_score").default(0),
  documentForgerScore: integer("document_forger_score").default(0),
  sellerBehaviorScore: integer("seller_behavior_score").default(0),
  titleFraudScore: integer("title_fraud_score").default(0),
  doubleSaleRiskScore: integer("double_sale_risk_score").default(0),
  benamiTransactionScore: integer("benami_transaction_score").default(0),
  fraudFlags: text("fraud_flags").array(),
  fraudAlerts: jsonb("fraud_alerts").notNull(), // [{alert: "price_below_market", severity: "high"}]
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 8: Developer Audit Module
export const developerAudits = pgTable("developer_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").notNull(),
  developerName: text("developer_name").notNull(),
  auditYear: integer("audit_year").notNull(),
  reraForm7Submitted: boolean("rera_form_7_submitted").default(false),
  form7SubmissionDate: timestamp("form_7_submission_date"),
  auditedAccountsSubmitted: boolean("audited_accounts_submitted").default(false),
  profitLossStatement: boolean("profit_loss_statement").default(false),
  balanceSheet: boolean("balance_sheet").default(false),
  cashFlowStatement: boolean("cash_flow_statement").default(false),
  fundUtilizationCorrect: boolean("fund_utilization_correct").default(false),
  fundsUsedForProject: boolean("funds_used_for_project").default(false),
  withdrawalProportionate: boolean("withdrawal_proportionate").default(false),
  auditScore: integer("audit_score").default(0), // 0-100
  complianceStatus: text("compliance_status").notNull().default("pending"), // pending, compliant, non_compliant, partial
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 9: AI Document Verification
export const documentVerifications = pgTable("document_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentType: text("document_type").notNull(), // sale_deed, title_deed, building_approval, noc, etc
  documentName: text("document_name").notNull(),
  uploadedUrl: text("uploaded_url"),
  extractedText: text("extracted_text"),
  authenticityScore: integer("authenticity_score").notNull(), // 0-100
  forgerySuspicionLevel: text("forgery_suspicion_level").default("low"), // low, medium, high
  signatureVerified: boolean("signature_verified").default(false),
  stamppingValid: boolean("stampping_valid").default(false),
  inconsistenciesFound: text("inconsistencies_found").array(),
  aiRecommendation: text("ai_recommendation"),
  manualReviewNeeded: boolean("manual_review_needed").default(false),
  verificationDate: timestamp("verification_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 11: Land Records Aggregator
export const landRecords = pgTable("land_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  village: text("village"),
  surveyNumber: text("survey_number"),
  plotNumber: text("plot_number"),
  pattaNumber: text("patta_number"),
  areaInSqft: numeric("area_in_sqft", { precision: 10, scale: 2 }),
  areaInAcres: numeric("area_in_acres", { precision: 8, scale: 2 }),
  landType: text("land_type"), // agricultural, non_agricultural, residential, commercial
  recordStatus: text("record_status").default("verified"), // verified, unverified, disputed
  ownerName: text("owner_name").notNull(),
  mutationStatus: text("mutation_status"), // completed, pending, rejected
  conversionCertificateRequired: boolean("conversion_certificate_required").default(false),
  conversionCertificateNumber: text("conversion_certificate_number"),
  nrlUpToDate: boolean("nrl_up_to_date").default(false),
  lastMutationDate: timestamp("last_mutation_date"),
  sourcePortal: text("source_portal"), // tnreginet, kaveri, doris, pearl, etc
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature 12: Market Intelligence Dashboard
export const marketIntelligence = pgTable("market_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  city: text("city").notNull(),
  state: text("state").notNull(),
  locality: text("locality"),
  monthYear: text("month_year").notNull(), // YYYY-MM format
  avgPropertyPrice: numeric("avg_property_price", { precision: 15, scale: 2 }),
  pricePerSqft: numeric("price_per_sqft", { precision: 10, scale: 2 }),
  transactionVolume: integer("transaction_volume").default(0),
  fraudRatePercentage: numeric("fraud_rate_percentage", { precision: 5, scale: 2 }),
  developerDefaultRate: numeric("developer_default_rate", { precision: 5, scale: 2 }),
  projectStallRate: numeric("project_stall_rate", { precision: 5, scale: 2 }),
  avgProjectDelayMonths: integer("avg_project_delay_months").default(0),
  demandSupplyRatio: numeric("demand_supply_ratio", { precision: 5, scale: 2 }),
  rentYield: numeric("rent_yield", { precision: 5, scale: 2 }),
  investmentScore: integer("investment_score").default(0), // 0-100
  regulatoryChanges: text("regulatory_changes").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Credits System
export const userCredits = pgTable("user_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalCredits: integer("total_credits").notNull().default(100),
  usedCredits: integer("used_credits").notNull().default(0),
  creditsPerProperty: integer("credits_per_property").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Properties (Buy/Sell Listings)
export const userProperties = pgTable("user_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  propertyName: text("property_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  propertyType: text("property_type").notNull(), // RESIDENTIAL, COMMERCIAL, LAND
  transactionType: text("transaction_type").notNull(), // BUY, SELL
  estimatedValue: numeric("estimated_value", { precision: 15, scale: 2 }),
  area: numeric("area", { precision: 10, scale: 2 }),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, archived, completed
  auditDetails: jsonb("audit_details"), // {riskScore, riskLevel, findings}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property Archive (Search History)
export const propertyArchive = pgTable("property_archive", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  propertyId: varchar("property_id").notNull(),
  propertyDetails: jsonb("property_details").notNull(),
  searchedAt: timestamp("searched_at").defaultNow(),
  notes: text("notes"),
  rating: integer("rating"), // 1-5
});

// Schemas & Types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hearAboutUs: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type EncumbranceCertificate = typeof encumbranceCertificates.$inferSelect;
export type ReraProject = typeof reraProjects.$inferSelect;
export type LitigationCase = typeof litigationCases.$inferSelect;
export type NRIDocumentChecklist = typeof nriDocumentChecklists.$inferSelect;
export type TitleVerification = typeof titleVerifications.$inferSelect;
export type FraudDetectionScore = typeof fraudDetectionScores.$inferSelect;
export type DeveloperAudit = typeof developerAudits.$inferSelect;
export type DocumentVerification = typeof documentVerifications.$inferSelect;
export type LandRecord = typeof landRecords.$inferSelect;
export type MarketIntelligence = typeof marketIntelligence.$inferSelect;

export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: string;
};

export type UserCredit = typeof userCredits.$inferSelect;
export type UserProperty = typeof userProperties.$inferSelect;
export type PropertyArchiveEntry = typeof propertyArchive.$inferSelect;

export const insertUserPropertySchema = createInsertSchema(userProperties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserProperty = z.infer<typeof insertUserPropertySchema>;
