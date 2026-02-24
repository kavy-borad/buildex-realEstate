export interface CostItem {
  id: string;
  itemName: string;
  category?: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

export interface ClientDetails {
  name: string;
  phone: string;
  email: string;
  siteAddress: string;
  address?: string;
  quotationDate: string;
  validTill: string;
}

export interface ClientFeedback {
  action: string;
  comments?: string;
  rejectionReason?: string;
  requestedChanges?: string[];
  respondedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ProjectDetails {
  projectType: string;
  builtUpArea: number;
  areaUnit: string;
  city: string;
  area: string;
  constructionQuality: 'basic' | 'standard' | 'premium';
  projectDuration?: string;
}

export interface QuotationSummary {
  subtotal: number;
  gstPercentage: number;
  gstAmount: number;
  discount: number;
  labourCost?: number;
  grandTotal: number;
}

export interface Quotation {
  id: string;
  quotationNumber?: string;
  clientDetails: ClientDetails;
  projectDetails: ProjectDetails;
  costItems: CostItem[];
  summary: QuotationSummary;
  createdAt: string;
  status: 'draft' | 'sent' | 'work-in-progress' | 'accepted' | 'rejected';
  clientStatus?: 'pending' | 'viewed' | 'approved' | 'rejected' | 'changes-requested';
  clientFeedback?: ClientFeedback;
  termsAndConditions?: string;
  validTill?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  viewedAt?: string;
  tokenExpiresAt?: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  tagline?: string;
  logo?: string;
}
