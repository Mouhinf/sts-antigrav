import type { Timestamp } from "firebase/firestore";

// ==================== BASE TYPES ====================

export type FirestoreTimestamp = Timestamp | Date | string;

export type Status = "active" | "inactive" | "pending" | "archived";

export interface BaseEntity {
  id: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// ==================== PROPERTY TYPES ====================

export type PropertyType = "sale" | "rent";
export type PropertyStatus = "available" | "sold" | "rented" | "reserved";

export interface Property extends BaseEntity {
  title: string;
  description: string;
  price: number;
  location: string;
  type: PropertyType;
  surface: number;
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ==================== VEHICLE TYPES ====================

export type VehicleType = "sedan" | "suv" | "van" | "truck" | "luxury" | "bus";
export type VehicleStatus = "available" | "rented" | "maintenance" | "unavailable";

export interface Vehicle extends BaseEntity {
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  capacity: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  images: string[];
  status: VehicleStatus;
  features: string[];
  licensePlate?: string;
  fuelType?: "gasoline" | "diesel" | "electric" | "hybrid";
  transmission?: "manual" | "automatic";
}

// ==================== BOOKING TYPES ====================

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
export type ServiceType = "vehicle" | "training" | "property" | "hygiene" | "agrobusiness" | "marketing";

export interface Booking extends BaseEntity {
  serviceType: ServiceType;
  vehicleId?: string;
  propertyId?: string;
  trainingId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: FirestoreTimestamp;
  endDate?: FirestoreTimestamp;
  totalPrice?: number;
  status: BookingStatus;
  notes?: string;
  adminNotes?: string;
  ip?: string;
  userAgent?: string;
}

// ==================== QUOTE TYPES ====================

export type QuoteStatus = "pending" | "reviewed" | "responded" | "accepted" | "rejected";

export interface Quote extends BaseEntity {
  service: string;
  serviceType?: ServiceType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company?: string;
  description: string;
  budget?: string;
  deadline?: FirestoreTimestamp;
  status: QuoteStatus;
  adminNotes?: string;
  response?: string;
  respondedAt?: FirestoreTimestamp;
  ip?: string;
  userAgent?: string;
}

// ==================== MESSAGE TYPES ====================

export type MessageStatus = "new" | "read" | "replied" | "archived";

export interface Message extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  reply?: string;
  repliedAt?: FirestoreTimestamp;
  ip?: string;
  userAgent?: string;
}

// ==================== TRAINING TYPES ====================

export type TrainingStatus = "active" | "inactive" | "full" | "cancelled";

export interface Training extends BaseEntity {
  title: string;
  description: string;
  duration: string;
  price: number;
  schedule: string;
  seats: number;
  enrolled: number;
  image: string;
  category: string;
  status: TrainingStatus;
  instructor?: string;
  prerequisites?: string[];
  objectives?: string[];
  syllabus?: string[];
}

// ==================== BLOG TYPES ====================

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: FirestoreTimestamp;
  author: string;
  authorId?: string;
  views: number;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

// ==================== ADMIN TYPES ====================

export type AdminRole = "admin" | "superadmin" | "editor";

export interface Admin extends BaseEntity {
  email: string;
  displayName?: string;
  role: AdminRole;
  lastLoginAt?: FirestoreTimestamp;
  photoURL?: string;
  permissions?: string[];
}

// ==================== NEWSLETTER TYPES ====================

export interface NewsletterSubscriber extends BaseEntity {
  email: string;
  subscribedAt: FirestoreTimestamp;
  unsubscribedAt?: FirestoreTimestamp;
  isActive: boolean;
  ip?: string;
}

// ==================== SITE SETTINGS TYPES ====================

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultImage: string;
    googleAnalyticsId?: string;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
  };
  updatedAt: FirestoreTimestamp;
}

// ==================== ACTIVITY LOG TYPES ====================

export type ActivityType =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish";

export interface ActivityLog extends BaseEntity {
  userId: string;
  userEmail: string;
  action: ActivityType;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  ip?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
    lastDoc?: string;
  };
}

// ==================== FORM TYPES ====================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  budget?: string;
  deadline?: string;
}

export interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: ServiceType;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface NewsletterFormData {
  email: string;
}

// ==================== COMPONENT PROP TYPES ====================

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

// ==================== NAVIGATION TYPES ====================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  isExternal?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// ==================== SEO TYPES ====================

export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
  canonical?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

// ==================== ANIMATION TYPES ====================

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: number[];
}

export interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
}
