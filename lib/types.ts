export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  flavors: string[];
  sizes: string[];
  isEggless: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string;
  image?: string;
  parentCategory?: string;
  displayOrder: number;
}

export interface AddonItem {
  id: string;
  type: "flavor" | "accessory" | "extra";
  name: string;
  price: number;
  image?: string;
  isAvailable: boolean;
}

export interface HeroSlide {
  id: string;
  image: string;
  headline: string;
  subtext: string;
  price?: number;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  displayOrder: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  flavor: string;
  price: number;
  quantity: number;
  isEggless: boolean;
  customMessage?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: "COD" | "Online" | "WhatsApp";
  createdAt: string;
  notes?: string;
}

export interface CustomCakeRequest {
  id?: string;
  productName?: string;
  customerName?: string;
  customerPhone?: string;
  weight: string;
  flavor: string;
  isEggless: boolean;
  customMessage: string;
  deliveryDate: string;
  deliveryTimeSlot?: string;
  timeSlot?: string;
  referenceImage?: string;
  notes?: string;
  quotedPrice?: number;
  calculatedPrice?: number;
  status?: "Pending" | "Quoted" | "Accepted" | "Rejected";
  createdAt?: string;
}

export type CustomCakeOrder = CustomCakeRequest;

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  isBlocked: boolean;
  createdAt: string;
}

export interface TestimonialReview {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  status: "Pending" | "Approved" | "Rejected";
  isFeaturedOnHome: boolean;
  createdAt: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  tagline: string;
  adminPin: string;
  announcementText: string;
  currency: string;
  email: string;
  address: string;
  storeHours: string;
  deliveryCharge: number;
  minOrderValue: number;
  instagramUrl: string;
  facebookUrl: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Manager" | "Staff";
  pin: string;
}
