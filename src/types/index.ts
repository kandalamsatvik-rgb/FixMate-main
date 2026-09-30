export type UserRole = 'customer' | 'worker' | 'dispatcher';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  authProvider?: 'phone' | 'google' | 'facebook' | 'email';
}

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'kn'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'ml'
  | 'pa';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export type ServiceCategoryId =
  | 'beauty_women'
  | 'grooming_men'
  | 'plumbing'
  | 'electrical'
  | 'ac_cooling'
  | 'appliances'
  | 'ro_purifier'
  | 'carpentry'
  | 'cleaning'
  | 'pest_control'
  | 'locksmith'
  | 'painting'
  | 'roofing'
  | 'cctv_smart_home'
  | 'masonry_tiling'
  | 'vehicle_care'
  | 'home_health'
  | 'gadget_repair';

export interface ServiceWorkItem {
  id: string;
  categoryId: ServiceCategoryId;
  categoryTitle: string;
  title: string;
  description: string;
  visitingFee: number;
  estimatedLabor: number;
  estDurationMinutes: number;
  badge?: string;
  keywords: string[];
  emergencyAvailable?: boolean;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  description: string;
  iconName: string;
  basePrice: number;
  priceUnit: 'flat' | 'hourly';
  estDurationMinutes: number;
  badge?: string;
  popularIssues: string[];
  toolsProvided: string[];
  worksCount?: number;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  categories: ServiceCategoryId[];
  hourlyRate: number;
  status: 'available' | 'on_job' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  vehicle: {
    type: 'Van' | 'Truck' | 'Motorbike';
    model: string;
    plateNumber: string;
  };
  badges: string[];
  experienceYears: number;
  about: string;
}

export type JobStatus =
  | 'searching'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface JobInvoice {
  visitingCharge: number; // Minimal base visiting service fee (e.g. ₹99)
  workLaborCharge: number; // Extra charge for actual work performed
  distanceCharge: number; // Extra fee for distance travelled by worker (e.g. ₹15/km)
  distanceKm: number; // Distance in kilometers
  materialsFee?: number;
  platformFee?: number;
  discount?: number;
  tax: number;
  tip: number;
  total: number;
  serviceFee?: number;
}

export interface JobRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLocation: {
    lat: number;
    lng: number;
  };
  unitNotes?: string;
  categoryId: ServiceCategoryId;
  serviceTitle: string;
  description: string;
  selectedIssues: string[];
  urgency: 'standard' | 'emergency_30min' | 'scheduled';
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "ASAP - Within 45 mins" or "10:00 AM - 12:00 PM"
  photos?: string[];
  estimatedTotal?: number;
  status: JobStatus;
  assignedWorkerId?: string;
  workerLocation?: {
    lat: number;
    lng: number;
  };
  etaMinutes?: number;
  createdAt: number;
  acceptedAt?: number;
  startedAt?: number;
  completedAt?: number;
  invoice: JobInvoice;
  rating?: number;
  reviewComment?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: 'customer' | 'worker';
  senderName: string;
  text: string;
  attachment?: string;
  timestamp: number;
  isRead?: boolean;
}
