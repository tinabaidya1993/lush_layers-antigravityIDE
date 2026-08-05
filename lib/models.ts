import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Category Schema
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true, lowercase: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    parentCategory: { type: String, default: "None (Root)" },
    displayOrder: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// 2. Cake Schema
export interface ICake extends Document {
  name: string;
  slug: string;
  description: string;
  categoryId?: mongoose.Types.ObjectId;
  category: string;
  price: number;
  discountPrice?: number;
  sizeVariants: { size: string; price: number }[];
  flavorOptions: string[];
  stockStatus: "In Stock" | "Out of Stock";
  isAvailable: boolean;
  images: string[];
  tags: string[];
  isEggless: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CakeSchema = new Schema<ICake>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    description: { type: String, default: "" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    sizeVariants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    flavorOptions: [{ type: String }],
    stockStatus: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock", index: true },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    isEggless: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 3. Slide Schema
export interface ISlide extends Document {
  image: string;
  headline: string;
  subtext: string;
  price?: number;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  displayOrder: number;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const SlideSchema = new Schema<ISlide>(
  {
    image: { type: String, required: true },
    headline: { type: String, required: true },
    subtext: { type: String, default: "" },
    price: { type: Number, default: 0 },
    ctaText: { type: String, default: "Explore Menu" },
    ctaLink: { type: String, default: "/menu" },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 1 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

// 4. Order Schema
export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: {
    cakeId?: string;
    name: string;
    size: string;
    flavor: string;
    quantity: number;
    price: number;
    isEggless: boolean;
    customMessage?: string;
  }[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    deliveryAddress: { type: String, default: "" },
    items: [
      {
        cakeId: { type: String },
        name: { type: String, required: true },
        size: { type: String, required: true },
        flavor: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        isEggless: { type: Boolean, default: true },
        customMessage: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    paymentMethod: { type: String, default: "WhatsApp" },
    notes: { type: String },
  },
  { timestamps: true }
);

// 5. Custom Request Schema
export interface ICustomRequest extends Document {
  customerName: string;
  customerPhone: string;
  referenceImage?: string;
  occasion?: string;
  flavor: string;
  size: string;
  message?: string;
  deliveryDate: string;
  timeSlot?: string;
  status: "Pending" | "Quoted" | "Accepted" | "Rejected";
  quotedPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    customerName: { type: String, default: "Guest Customer" },
    customerPhone: { type: String, default: "" },
    referenceImage: { type: String },
    occasion: { type: String },
    flavor: { type: String, required: true },
    size: { type: String, required: true },
    message: { type: String },
    deliveryDate: { type: String, required: true },
    timeSlot: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Quoted", "Accepted", "Rejected"],
      default: "Pending",
    },
    quotedPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 6. Customer Schema
export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, index: true },
    address: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 7. Review Schema
export interface IReview extends Document {
  customerName: string;
  role: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    role: { type: String, default: "Customer" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 8. Admin User Schema
export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  pin: string;
  role: "SuperAdmin" | "Manager" | "Staff";
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: "" },
    pin: { type: String, required: true, default: "7890" },
    role: { type: String, enum: ["SuperAdmin", "Manager", "Staff"], default: "SuperAdmin" },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

// 9. Addon / Accessory / Flavor Schema
export interface IAddon extends Document {
  type: "flavor" | "accessory" | "extra";
  name: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddonSchema = new Schema<IAddon>(
  {
    type: { type: String, enum: ["flavor", "accessory", "extra"], required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export const CakeModel: Model<ICake> =
  mongoose.models.Cake || mongoose.model<ICake>("Cake", CakeSchema);

export const SlideModel: Model<ISlide> =
  mongoose.models.Slide || mongoose.model<ISlide>("Slide", SlideSchema);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export const CustomRequestModel: Model<ICustomRequest> =
  mongoose.models.CustomRequest || mongoose.model<ICustomRequest>("CustomRequest", CustomRequestSchema);

export const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export const AdminUserModel: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export const AddonModel: Model<IAddon> =
  mongoose.models.Addon || mongoose.model<IAddon>("Addon", AddonSchema);
