import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, FileText, Scale, DollarSign, MapPin, TrendingUp, Shield, Clock, Users, BookOpen, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  required: boolean;
  documents?: string[];
}

interface AccountType {
  name: string;
  acronym: string;
  description: string;
  advantages: string[];
  restrictions: string[];
  taxTreatment: string;
}

interface InvestmentGuideline {
  title: string;
  allowed: boolean;
  details: string;
  limits?: string;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const PRE_PURCHASE_CHECKLIST: ChecklistItem[] = [
  {
    id: "passport",
    name: "Passport Verification",
    description: "Verify passport validity (minimum 6 months) and authenticity",
    completed: true,
    required: true,
    documents: ["Passport copy", "Visa copy", "Travel history"],
  },
  {
    id: "pan",
    name: "PAN Card Registration",
    description: "Register with Indian tax authorities using PAN - required for all financial transactions",
    completed: true,
    required: true,
    documents: ["PAN application", "PAN certificate", "Address proof"],
  },
  {
    id: "oci",
    name: "OCI/PIO/VISA Status Verification",
    description: "Verify Overseas Citizen of India, Person of Indian Origin, or Visa status",
    completed: false,
    required: true,
    documents: ["OCI certificate", "PIO registration", "Visa copy"],
  },
  {
    id: "nre-nro",
    name: "NRE/NRO/FCNR Account Setup",
    description: "Open appropriate bank account for fund transfers and property purchase",
    completed: true,
    required: true,
    documents: ["Account opening form", "Bank certification", "Account statements"],
  },
  {
    id: "income-proof",
    name: "Income Proof & Financial Documents",
    description: "Submit income documentation to establish financial capacity",
    completed: false,
    required: true,
    documents: ["Recent tax returns (3 years)", "Bank statements (6 months)", "Salary slips", "Employment letter"],
  },
  {
    id: "poa",
    name: "Power of Attorney (POA)",
    description: "Execute notarized POA if buying through representative or agent",
    completed: false,
    required: false,
    documents: ["Notarized POA", "Apostille certificate", "CA verification"],
  },
  {
    id: "exchange-approval",
    name: "Foreign Exchange Approval",
    description: "Get RBI approval for fund remittance if amount exceeds USD 250,000",
    completed: false,
    required: false,
    documents: ["Remittance application", "RBI approval letter"],
  },
  {
    id: "title-check",
    name: "Title & Legal Verification",
    description: "Conduct thorough title search and legal due diligence on property",
    completed: false,
    required: true,
    documents: ["Title report", "Encumbrance certificate", "Legal opinion"],
  },
];

const POST_PURCHASE_CHECKLIST: ChecklistItem[] = [
  {
    id: "form15ca",
    name: "Form 15CA/15CB Filing",
    description: "File Form 15CA for TDS exemption and Form 15CB from Chartered Accountant within 30 days",
    completed: false,
    required: true,
    documents: ["CA certificate", "Form 15CA", "Form 15CB", "Bank remittance proof"],
  },
  {
    id: "femal",
    name: "FEMAL Compliance Filing",
    description: "Ensure compliance with Foreign Exchange Management Act Liberalized regulations",
    completed: false,
    required: true,
    documents: ["FEMAL form", "Bank remittance proof", "Supporting documents"],
  },
  {
    id: "property-registration",
    name: "Property Registration",
    description: "Register property within 2 months at sub-registrar office",
    completed: false,
    required: true,
    documents: ["Registered deed", "Registration certificate", "Tax receipt"],
  },
  {
    id: "mutation",
    name: "Mutation/Land Record Update",
    description: "Update land records with NRI as owner within 3 months",
    completed: false,
    required: true,
    documents: ["Mutation application", "Registered deed", "Revenue receipt"],
  },
  {
    id: "repatriation",
    name: "Repatriation Documentation",
    description: "Maintain records for fund repatriation eligibility (USD 1 Million per FY limit)",
    completed: false,
    required: false,
    documents: ["Investment proof", "Purchase deed", "Bank statements"],
  },
  {
    id: "tax-filing",
    name: "Annual Tax Filing (ITR-2)",
    description: "File income tax returns by July 31st reporting rental income or capital gains",
    completed: false,
    required: true,
    documents: ["ITR form", "Income statement", "Expense details"],
  },
  {
    id: "rental-compliance",
    name: "Rental Income Compliance (if applicable)",
    description: "TDS deduction on rental income paid to NRI and quarterly filing",
    completed: false,
    required: false,
    documents: ["Rental agreement", "TDS certificates", "Payment records"],
  },
  {
    id: "liability-filing",
    name: "Annual Liability Statement (if applicable)",
    description: "File annual statements for ongoing compliance if retaining property",
    completed: false,
    required: false,
    documents: ["Property valuation", "Liability statement"],
  },
];

const ACCOUNT_TYPES: AccountType[] = [
  {
    name: "Non-Resident External (NRE) Account",
    acronym: "NRE",
    description: "Accounts held by NRIs/OCIs for funds remitted from abroad. Fully repatriable.",
    advantages: [
      "Fully repatriable - no restrictions on fund repatriation",
      "Interest income exempt from income tax",
      "No TDS on interest earned",
      "Can hold multiple NRE accounts",
      "Free remittance of funds abroad",
    ],
    restrictions: [
      "Can only receive foreign currency remittances",
      "No local fund deposits allowed from India",
      "Interest rates typically lower than regular accounts",
    ],
    taxTreatment: "Interest is exempt from tax, principal can be freely repatriated",
  },
  {
    name: "Non-Resident Ordinary (NRO) Account",
    acronym: "NRO",
    description: "Accounts for earning from investments or income generated in India.",
    advantages: [
      "Can receive both foreign and domestic fund transfers",
      "Can hold rupee investments",
      "Interest on savings account is tax-exempt (up to ₹10,000)",
      "Can collect rental income, dividends, pension",
    ],
    restrictions: [
      "Repatriation limited to USD 1 Million per financial year",
      "TDS applicable on interest above tax-exempt limit",
      "Additional documentation needed for repatriation",
      "Interest taxable as per tax slab",
    ],
    taxTreatment: "Interest above ₹10,000 taxed as per income slab; repatriation subject to USD 1M limit",
  },
  {
    name: "Foreign Currency Non-Resident (FCNR) Account",
    acronym: "FCNR",
    description: "Term deposit accounts in foreign currency for long-term wealth management.",
    advantages: [
      "Fully repatriable - no restrictions",
      "Fixed interest rates known upfront",
      "Term deposits secure investment",
      "Hedge against rupee depreciation",
    ],
    restrictions: [
      "Only fixed deposits - not demand deposits",
      "Minimum term periods apply",
      "Early withdrawal penalties",
      "Limited flexibility",
    ],
    taxTreatment: "Interest taxable at source; fully repatriable after maturity",
  },
];

const INVESTMENT_GUIDELINES: InvestmentGuideline[] = [
  {
    title: "Residential Property Purchase",
    allowed: true,
    details: "NRIs can freely purchase residential property in India without any limits or restrictions.",
    limits: "No specific limits",
  },
  {
    title: "Commercial Property Purchase",
    allowed: false,
    details: "NRIs are NOT allowed to purchase commercial property or vacant land for speculative purposes.",
    limits: "Prohibited",
  },
  {
    title: "Multiple Property Ownership",
    allowed: true,
    details: "NRIs can own multiple residential properties as long as they comply with local state regulations.",
    limits: "Subject to state-level restrictions",
  },
  {
    title: "Agricultural Land Purchase",
    allowed: false,
    details: "NRIs cannot own agricultural land or farmland in India (varies by state).",
    limits: "Prohibited in most states",
  },
  {
    title: "Rental Income from Property",
    allowed: true,
    details: "NRIs can earn rental income from Indian properties, subject to applicable taxes.",
    limits: "Subject to TDS at 30%",
  },
  {
    title: "Fund Repatriation",
    allowed: true,
    details: "NRIs can repatriate up to USD 1 Million per financial year from NRO accounts.",
    limits: "USD 1 Million per FY",
  },
  {
    title: "Stock Market Investment",
    allowed: true,
    details: "NRIs can invest in Indian stock markets through NRE or NRO accounts.",
    limits: "No limit on investments",
  },
  {
    title: "Mutual Fund Investment",
    allowed: true,
    details: "NRIs can invest in Indian mutual funds with NRE/NRO accounts.",
    limits: "No limit on investments",
  },
];

const TAX_IMPLICATIONS = [
  {
    title: "Rental Income Taxation",
    details: "30% TDS deducted + income tax as per slab. Claim deductions for maintenance, property tax, insurance.",
    rate: "30% TDS + applicable slab rate",
  },
  {
    title: "Capital Gains on Sale",
    details: "Short-term: Taxed as ordinary income. Long-term (> 2 years): 20% with indexation benefit.",
    rate: "20% (long-term) or slab rate (short-term)",
  },
  {
    title: "Interest on Bank Deposits",
    details: "NRE: Tax-exempt. NRO: First ₹10,000 exempt, above that per tax slab.",
    rate: "0% (NRE), ₹10k exempt (NRO)",
  },
  {
    title: "Property Tax & Registration",
    details: "Stamp duty and registration fees apply at state rates. Typically 5-7% of property value.",
    rate: "5-7% stamp duty",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Can an NRI purchase commercial property or vacant land?",
    answer: "No, NRIs are restricted from purchasing commercial property, industrial plots, or vacant land for speculation. They can only purchase residential property for self-use or investment.",
    category: "Investment Rules",
  },
  {
    question: "What is the repatriation limit for NROs?",
    answer: "NRIs can repatriate up to USD 1 Million per financial year from NRO accounts. Amounts beyond this require special RBI approval.",
    category: "Repatriation",
  },
  {
    question: "Do I need to file Indian income tax returns if I'm an NRI?",
    answer: "Yes, if you have rental income from Indian property or capital gains from sale. You must file returns (ITR-2) by July 31st annually.",
    category: "Tax Compliance",
  },
  {
    question: "What is Form 15CA/15CB and why is it important?",
    answer: "Form 15CA is a declaration form for TDS exemption. Form 15CB is a CA certificate supporting it. Filed to claim exemption from 30% TDS on rental income.",
    category: "Tax Compliance",
  },
  {
    question: "Can I buy property through a Power of Attorney (POA)?",
    answer: "Yes, NRIs can appoint a representative through a notarized POA. The POA must be apostilled and verified by an Indian lawyer.",
    category: "Legal Process",
  },
  {
    question: "How long does property registration take for NRIs?",
    answer: "Typically 2-4 weeks at the sub-registrar office. Must be completed within 2 months of purchase for compliance.",
    category: "Legal Process",
  },
  {
    question: "What documents do I need to open an NRE account?",
    answer: "Passport, visa, proof of NRI status, PAN, address proof, and initial deposit amount. Requirements vary by bank.",
    category: "Bank Accounts",
  },
  {
    question: "Is there any limit on how much I can remit for property purchase?",
    answer: "Amounts up to USD 250,000 don't need RBI approval. Above that, you need RBI approval under Liberalized Remittance Scheme (LRS).",
    category: "Fund Transfer",
  },
  {
    question: "What is FEMAL compliance and when do I need it?",
    answer: "FEMAL (Foreign Exchange Management Act, 1999) compliance ensures all foreign exchange transactions are legal. Required for property purchase and fund transfers.",
    category: "Compliance",
  },
  {
    question: "Can I claim deductions on rental income as an NRI?",
    answer: "Yes, you can claim deductions for property tax, maintenance, insurance, repairs, and depreciation (25% annually). This reduces taxable income.",
    category: "Tax Benefits",
  },
];

export default function NRI() {
  const { toast } = useToast();
  const [preItems, setPreItems] = useState(PRE_PURCHASE_CHECKLIST);
  const [postItems, setPostItems] = useState(POST_PURCHASE_CHECKLIST);
  const [email, setEmail] = useState("nri.user@example.com");

  const handleToggleItem = (id: string, phase: "pre" | "post") => {
    const items = phase === "pre" ? preItems : postItems;
    const setter = phase === "pre" ? setPreItems : setPostItems;
    setter(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    toast({
      title: "Checklist Updated",
      description: "Your compliance checklist has been saved.",
    });
  };

  const calculateCompletion = (items: ChecklistItem[]) => {
    const completed = items.filter((i) => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const preCompletion = calculateCompletion(preItems);
  const postCompletion = calculateCompletion(postItems);
  const overallCompletion = Math.round((preCompletion + postCompletion) / 2);

  const ChecklistSection = ({
    title,
    items,
    phase,
    icon,
  }: {
    title: string;
    items: ChecklistItem[];
    phase: "pre" | "post";
    icon: React.ReactNode;
  }) => {
    const completed = items.filter((i) => i.completed).length;
    const progress = Math.round((completed / items.length) * 100);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                  {completed} of {items.length} items completed
                </CardDescription>
              </div>
            </div>
            <Badge variant={progress === 100 ? "secondary" : "outline"}>
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors"
                data-testid={`checklist-item-${item.id}`}
              >
                <Checkbox
                  id={item.id}
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(item.id, phase)}
                  className="mt-1"
                  data-testid={`checkbox-${item.id}`}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={item.id}
                    className="cursor-pointer block"
                    data-testid={`label-${item.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.required && (
                        <Badge variant="outline" className="text-xs" data-testid={`badge-required-${item.id}`}>
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </label>
                  {item.documents && item.documents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.documents.map((doc, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                          data-testid={`doc-badge-${item.id}-${idx}`}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {item.completed && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" data-testid={`check-icon-${item.id}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NRI Property Investment Suite</h1>
            <p className="text-muted-foreground mt-1">
              Complete compliance, taxation, and investment guidance for Non-Resident Indians
            </p>
          </div>
          <Button data-testid="button-download-guide">
            <FileText className="h-4 w-4 mr-2" />
            Download Complete Guide
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-overall-completion">
                {overallCompletion}%
              </div>
              <Progress value={overallCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pre-Purchase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-pre-completion">
                {preCompletion}%
              </div>
              <Progress value={preCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Post-Purchase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-post-completion">
                {postCompletion}%
              </div>
              <Progress value={postCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Repatriation Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-repatriation">
                USD 1M
              </div>
              <p className="text-xs text-muted-foreground mt-2">Per financial year (NRO)</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="compliance" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5" data-testid="tabs-nri-main">
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="accounts">Account Types</TabsTrigger>
            <TabsTrigger value="investment">Investment Rules</TabsTrigger>
            <TabsTrigger value="taxes">Tax Guide</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6 mt-6">
            {/* NRI Registration Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your NRI Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Registered Email</p>
                    <p className="font-medium mt-1" data-testid="text-nri-email">
                      {email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="mt-1 bg-amber-100 text-amber-700" data-testid="badge-status">
                      In Progress
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium mt-1" data-testid="text-last-updated">
                      November 24, 2025
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checklists */}
            <Tabs defaultValue="pre" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="pre">Pre-Purchase</TabsTrigger>
                <TabsTrigger value="post">Post-Purchase</TabsTrigger>
              </TabsList>

              <TabsContent value="pre" className="space-y-4 mt-6">
                <ChecklistSection
                  title="Pre-Purchase Compliance Checklist"
                  items={preItems}
                  phase="pre"
                  icon={<Scale className="h-5 w-5 text-blue-600" />}
                />
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Critical Pre-Purchase Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Obtain PAN (Permanent Account Number) - mandatory for all transactions</p>
                    <p>• Verify visa status (OCI/PIO/valid visa required)</p>
                    <p>• Set up NRE/NRO account with bank for fund transfers</p>
                    <p>• Conduct title search and legal verification of property</p>
                    <p>• Secure apostilled Power of Attorney if using representative</p>
                    <p>• Get Foreign Exchange approval if remitting >USD 250,000</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="post" className="space-y-4 mt-6">
                <ChecklistSection
                  title="Post-Purchase Compliance Checklist"
                  items={postItems}
                  phase="post"
                  icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
                />
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Critical Post-Purchase Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• File Form 15CA/15CB within 30 days for TDS exemption</p>
                    <p>• Complete property registration within 2 months of purchase</p>
                    <p>• File mutation/land record update within 3 months</p>
                    <p>• File annual ITR-2 by July 31st if earning rental income</p>
                    <p>• Maintain FEMAL compliance documentation</p>
                    <p>• Report annual earnings/property to Indian tax authorities</p>
                  </CardContent>
                </Card>

                {/* Compliance Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Compliance Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted" data-testid="deadline-15ca">
                        <div>
                          <p className="font-medium">Form 15CA/15CB Filing</p>
                          <p className="text-sm text-muted-foreground">TDS exemption request</p>
                        </div>
                        <Badge variant="outline">Within 30 days</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted" data-testid="deadline-registration">
                        <div>
                          <p className="font-medium">Property Registration</p>
                          <p className="text-sm text-muted-foreground">Sub-registrar office</p>
                        </div>
                        <Badge variant="outline">Within 2 months</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted" data-testid="deadline-mutation">
                        <div>
                          <p className="font-medium">Land Record Mutation</p>
                          <p className="text-sm text-muted-foreground">District revenue office</p>
                        </div>
                        <Badge variant="outline">Within 3 months</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted" data-testid="deadline-tax">
                        <div>
                          <p className="font-medium">Annual Tax Filing (ITR-2)</p>
                          <p className="text-sm text-muted-foreground">Income tax department</p>
                        </div>
                        <Badge variant="outline">By July 31st</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Account Types Tab */}
          <TabsContent value="accounts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              {ACCOUNT_TYPES.map((account, idx) => (
                <Card key={idx} data-testid={`account-card-${account.acronym}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          {account.name}
                        </CardTitle>
                        <CardDescription className="mt-1">{account.description}</CardDescription>
                      </div>
                      <Badge className="ml-2">{account.acronym}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {account.advantages.map((adv, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Restrictions
                      </h4>
                      <ul className="space-y-1">
                        {account.restrictions.map((res, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Tax Treatment:</span> {account.taxTreatment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">How to Choose the Right Account?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Use NRE if:</strong> You want fully repatriable funds with no tax on interest. Ideal for short-term investments.
                </p>
                <p>
                  <strong>Use NRO if:</strong> You're earning income in India (rental, salary, business) or want flexibility with domestic investments.
                </p>
                <p>
                  <strong>Use FCNR if:</strong> You have long-term surplus funds and want to secure returns in foreign currency.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Rules Tab */}
          <TabsContent value="investment" className="space-y-6 mt-6">
            <div className="space-y-4">
              {INVESTMENT_GUIDELINES.map((guideline, idx) => (
                <Card key={idx} data-testid={`guideline-${idx}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 rounded-lg p-2 ${guideline.allowed ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {guideline.allowed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{guideline.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{guideline.details}</p>
                        {guideline.limits && (
                          <p className="text-sm font-medium mt-2">
                            Limit: <Badge variant="outline">{guideline.limits}</Badge>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  Key Investment Restrictions for NRIs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>✗ Commercial property, office space, or industrial plots</p>
                <p>✗ Vacant or speculative land holdings</p>
                <p>✗ Agricultural land (in most states)</p>
                <p>✗ Property for rental income if purchased with NRO funds (limited tax benefits)</p>
                <p>✓ Residential properties for own use or investment</p>
                <p>✓ Stock market and mutual fund investments</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Guide Tab */}
          <TabsContent value="taxes" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-4">
              {TAX_IMPLICATIONS.map((tax, idx) => (
                <Card key={idx} data-testid={`tax-item-${idx}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          {tax.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2">{tax.details}</p>
                      </div>
                      <Badge className="ml-4 bg-blue-100 text-blue-700">{tax.rate}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Tax Deductions You Can Claim
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Property tax and municipal taxes paid</p>
                <p>• Home loan interest (if applicable)</p>
                <p>• Insurance premiums</p>
                <p>• Repairs and maintenance costs</p>
                <p>• Professional fees (accountant, lawyer)</p>
                <p>• Depreciation on building (25% annually)</p>
                <p>• Ground rent and society maintenance</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Important Tax Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Form 15CA/15CB Filing:</strong> Within 30 days of remitting purchase funds
                </p>
                <p>
                  <strong>ITR Filing Deadline:</strong> July 31st of following financial year
                </p>
                <p>
                  <strong>TDS Payment:</strong> Typically deducted at source if earning >₹50,000 annually
                </p>
                <p>
                  <strong>Repatriation Requests:</strong> Must be filed along with relevant documentation
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 mt-6">
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => (
                <Card key={idx} data-testid={`faq-item-${idx}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <CardTitle className="text-base">{faq.question}</CardTitle>
                        <Badge variant="outline" className="mt-2">
                          {faq.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Reference Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Reference: NRI Property Purchase Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-900">Before Purchase</p>
                <p className="text-muted-foreground mt-1">Get PAN, setup bank account, arrange funds, legal verification</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">At Purchase</p>
                <p className="text-muted-foreground mt-1">Execute agreement, arrange FEMAL compliance, sign documents</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Within 2 Months</p>
                <p className="text-muted-foreground mt-1">Register property, file Form 15CA/15CB, arrange title transfer</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Within 3 Months</p>
                <p className="text-muted-foreground mt-1">Update land records, file mutation, complete all compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
