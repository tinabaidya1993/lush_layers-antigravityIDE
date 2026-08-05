"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Category,
  HeroSlide,
  Order,
  CustomCakeRequest,
  Customer,
  TestimonialReview,
  StoreSettings,
  AdminUser,
  AddonItem,
} from "@/lib/types";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  orders: Order[];
  customRequests: CustomCakeRequest[];
  customers: Customer[];
  reviews: TestimonialReview[];
  addons: AddonItem[];
  settings: StoreSettings;
  adminUsers: AdminUser[];
  isLoaded: boolean;
  toasts: ToastNotification[];

  showToast: (message: string, type?: "success" | "error" | "info") => void;

  // Addon Actions (Flavors, Accessories, Extras)
  addAddon: (addon: Omit<AddonItem, "id">) => Promise<void>;
  updateAddon: (id: string, addon: Partial<AddonItem>) => Promise<void>;
  deleteAddon: (id: string) => Promise<void>;
  deleteAddons: (ids: string[]) => Promise<void>;

  // Product Actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "slug">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteProducts: (ids: string[]) => Promise<void>;

  // Category Actions
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteCategories: (ids: string[]) => Promise<void>;

  // Hero Slide Actions
  addHeroSlide: (slide: Omit<HeroSlide, "id">) => Promise<void>;
  updateHeroSlide: (id: string, slide: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  deleteHeroSlides: (ids: string[]) => Promise<void>;

  // Order Actions
  updateOrderStatus: (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Custom Request Actions
  updateCustomRequest: (id: string, status: CustomCakeRequest["status"], price?: number) => Promise<void>;
  deleteCustomRequest: (id: string) => Promise<void>;

  // Customer Actions
  toggleBlockCustomer: (id: string) => void;

  // Review Actions
  updateReviewStatus: (id: string, status: TestimonialReview["status"], isFeatured?: boolean) => void;
  deleteReview: (id: string) => void;

  // Settings Action
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Admin User Actions
  addAdminUser: (user: Omit<AdminUser, "id">) => void;
  deleteAdminUser: (id: string) => void;

  // Image Upload helper
  uploadImageToCloudinary: (fileBase64: string, folder?: string) => Promise<string>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: "919876543210",
  storeName: "Lush Layer",
  tagline: "Artisanal Confections & Bespoke Cakes",
  adminPin: "7890",
  announcementText: "✨ Freshly baked on order | Direct WhatsApp Ordering Available across India",
  currency: "₹",
  email: "hello@lushlayerbakery.com",
  address: "Main Market Road, Local Bakery Store",
  storeHours: "Monday - Sunday: 9:00 AM - 9:00 PM",
  deliveryCharge: 50,
  minOrderValue: 300,
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
};

const DEFAULT_ADMINS: AdminUser[] = [
  { id: "adm_1", name: "Super Admin Manager", email: "admin@lushlayer.com", role: "Super Admin", pin: "7890" },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start completely empty as requested by user — zero hardcoded cakes, zero categories, zero slides
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reviews, setReviews] = useState<TestimonialReview[]>([]);
  const [addons, setAddons] = useState<AddonItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(DEFAULT_ADMINS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const newToast = { id: "toast_" + Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const uploadImageToCloudinary = async (fileBase64: string, folder = "cakes"): Promise<string> => {
    try {
      showToast("Uploading image to Cloudinary...", "info");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: fileBase64, folder }),
      });
      const data = await res.json();
      if (data.url) {
        showToast("Image uploaded to Cloudinary!", "success");
        return data.url;
      }
      return fileBase64;
    } catch (e) {
      console.error("Cloudinary upload failed", e);
      return fileBase64;
    }
  };

  // Addon Actions
  const addAddon = async (addonData: Omit<AddonItem, "id">) => {
    try {
      const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addonData),
      });
      const savedAddon = await res.json();
      setAddons((prev) => [savedAddon, ...prev]);
      showToast(`Item "${savedAddon.name}" saved!`, "success");
    } catch (e) {
      const fallback: AddonItem = { ...addonData, id: "adn_" + Date.now() };
      setAddons((prev) => [fallback, ...prev]);
      showToast("Item added!", "info");
    }
  };

  const updateAddon = async (id: string, updatedFields: Partial<AddonItem>) => {
    try {
      await fetch("/api/addons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedFields }),
      });
      setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a)));
      showToast("Item updated!", "success");
    } catch (e) {
      setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a)));
      showToast("Item updated!", "success");
    }
  };

  const deleteAddon = async (id: string) => {
    try {
      await fetch(`/api/addons?id=${id}`, { method: "DELETE" });
      setAddons((prev) => prev.filter((a) => a.id !== id));
      showToast("Item deleted.", "info");
    } catch (e) {
      setAddons((prev) => prev.filter((a) => a.id !== id));
      showToast("Item deleted.", "info");
    }
  };

  const deleteAddons = async (ids: string[]) => {
    try {
      await fetch(`/api/addons?ids=${ids.join(",")}`, { method: "DELETE" });
      setAddons((prev) => prev.filter((a) => !ids.includes(a.id)));
      showToast(`${ids.length} items deleted.`, "info");
    } catch (e) {
      setAddons((prev) => prev.filter((a) => !ids.includes(a.id)));
      showToast("Items deleted.", "info");
    }
  };

  // Initial Fetch from MongoDB Atlas API
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [cakesRes, catRes, slideRes, orderRes, addonRes] = await Promise.all([
          fetch("/api/cakes").then((r) => r.json()).catch(() => []),
          fetch("/api/categories").then((r) => r.json()).catch(() => []),
          fetch("/api/slides").then((r) => r.json()).catch(() => []),
          fetch("/api/orders").then((r) => r.json()).catch(() => []),
          fetch("/api/addons").then((r) => r.json()).catch(() => []),
        ]);

        if (Array.isArray(cakesRes)) {
          setProducts(cakesRes.map((item: any) => ({ ...item, id: item.id || item._id || "prod_" + Math.random() })));
        }
        if (Array.isArray(catRes)) {
          setCategories(catRes.map((item: any) => ({ ...item, id: item.id || item._id || "cat_" + Math.random() })));
        }
        if (Array.isArray(slideRes)) {
          setHeroSlides(slideRes.map((item: any) => ({
            ...item,
            id: item.id || item._id || "slide_" + Math.random(),
            price: item.price !== undefined && item.price !== null ? Number(item.price) : 0,
          })));
        }
        if (Array.isArray(orderRes)) {
          setOrders(orderRes.map((item: any) => ({ ...item, id: item.id || item._id || "ord_" + Math.random() })));
        }
        if (Array.isArray(addonRes)) {
          setAddons(addonRes.map((item: any) => ({ ...item, id: item.id || item._id || "adn_" + Math.random() })));
        }
      } catch (error) {
        console.error("MongoDB Atlas sync fetch error", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchLiveData();
  }, []);

  // Product Actions (MongoDB Sync)
  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "slug">) => {
    try {
      const res = await fetch("/api/cakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const savedCake = await res.json();
      setProducts((prev) => [savedCake, ...prev]);
      showToast(`Cake "${savedCake.name || productData.name}" saved to Database!`, "success");
    } catch (e) {
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fallback: Product = { ...productData, id: "prod_" + Date.now(), slug, createdAt: new Date().toISOString() };
      setProducts((prev) => [fallback, ...prev]);
      showToast("Cake added!", "info");
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      await fetch(`/api/cakes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
      showToast("Cake updated live!", "success");
    } catch (e) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
      showToast("Cake updated!", "success");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/cakes/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Cake deleted from Database.", "info");
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Cake item deleted.", "info");
    }
  };

  const deleteProducts = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => fetch(`/api/cakes/${id}`, { method: "DELETE" })));
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      showToast(`${ids.length} Cakes deleted from Database.`, "info");
    } catch (e) {
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      showToast("Cakes deleted.", "info");
    }
  };

  // Category Actions (MongoDB Sync)
  const addCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const savedCategory = await res.json();
      const formattedCategory: Category = {
        ...savedCategory,
        id: savedCategory.id || savedCategory._id || "cat_" + Date.now(),
        name: savedCategory.name || categoryData.name,
        description: savedCategory.description || categoryData.description || "",
        image: savedCategory.image || categoryData.image || "",
        parentCategory: savedCategory.parentCategory || categoryData.parentCategory || "None (Root)",
        displayOrder: savedCategory.displayOrder || categoryData.displayOrder || 1,
      };
      setCategories((prev) => [...prev, formattedCategory]);
      showToast(`Category "${formattedCategory.name}" saved to Database!`, "success");
    } catch (e) {
      const fallback: Category = { ...categoryData, id: "cat_" + Date.now() };
      setCategories((prev) => [...prev, fallback]);
      showToast("Category added!", "info");
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...categoryData }),
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryData } : c)));
      showToast("Category updated!", "success");
    } catch (e) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryData } : c)));
      showToast("Category updated!", "success");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category removed.", "info");
    } catch (e) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category removed.", "info");
    }
  };

  const deleteCategories = async (ids: string[]) => {
    try {
      await fetch(`/api/categories?ids=${ids.join(",")}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => !ids.includes(c.id)));
      showToast(`${ids.length} categories deleted.`, "info");
    } catch (e) {
      setCategories((prev) => prev.filter((c) => !ids.includes(c.id)));
      showToast("Categories deleted.", "info");
    }
  };

  // Hero Slide Actions (MongoDB Sync)
  const addHeroSlide = async (slideData: Omit<HeroSlide, "id">) => {
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slideData),
      });
      const savedSlide = await res.json();
      const newSlide: HeroSlide = {
        id: savedSlide.id || savedSlide._id || "slide_" + Date.now(),
        image: savedSlide.image || slideData.image,
        headline: savedSlide.headline || slideData.headline,
        subtext: savedSlide.subtext || slideData.subtext || "",
        price: savedSlide.price || slideData.price || 0,
        ctaText: savedSlide.ctaText || slideData.ctaText || "Explore Menu",
        ctaLink: savedSlide.ctaLink || slideData.ctaLink || "/menu",
        isActive: savedSlide.isActive !== false,
        displayOrder: savedSlide.displayOrder || slideData.displayOrder || 1,
      };
      setHeroSlides((prev) => [...prev, newSlide]);
      showToast("Hero Slide published!", "success");
    } catch (e) {
      const fallback: HeroSlide = { ...slideData, id: "slide_" + Date.now() };
      setHeroSlides((prev) => [...prev, fallback]);
      showToast("Slide added!", "info");
    }
  };

  const updateHeroSlide = async (id: string, slideData: Partial<HeroSlide>) => {
    try {
      const formattedData = {
        ...slideData,
        ...(slideData.price !== undefined ? { price: Number(slideData.price) || 0 } : {}),
      };
      await fetch("/api/slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formattedData }),
      });
      setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...formattedData } : s)));
      showToast("Slide updated live!", "success");
    } catch (e) {
      setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...slideData } : s)));
      showToast("Slide updated!", "success");
    }
  };

  const deleteHeroSlide = async (id: string) => {
    try {
      await fetch(`/api/slides?id=${id}`, { method: "DELETE" });
      setHeroSlides((prev) => prev.filter((s) => s.id !== id));
      showToast("Slide removed.", "info");
    } catch (e) {
      setHeroSlides((prev) => prev.filter((s) => s.id !== id));
      showToast("Slide removed.", "info");
    }
  };

  const deleteHeroSlides = async (ids: string[]) => {
    try {
      await fetch(`/api/slides?ids=${ids.join(",")}`, { method: "DELETE" });
      setHeroSlides((prev) => prev.filter((s) => !ids.includes(s.id)));
      showToast(`${ids.length} slides deleted.`, "info");
    } catch (e) {
      setHeroSlides((prev) => prev.filter((s) => !ids.includes(s.id)));
      showToast("Slides deleted.", "info");
    }
  };

  // Order Actions
  const updateOrderStatus = async (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, ...(paymentStatus ? { paymentStatus } : {}) } : o))
    );
    showToast(`Order status updated to "${status}"`, "success");
  };

  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showToast("Order removed.", "info");
  };

  // Custom Request Actions
  const updateCustomRequest = async (id: string, status: CustomCakeRequest["status"], price?: number) => {
    setCustomRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, ...(price !== undefined ? { quotedPrice: price } : {}) } : r))
    );
    showToast(`Custom Request status: ${status}`, "success");
  };

  const deleteCustomRequest = async (id: string) => {
    setCustomRequests((prev) => prev.filter((r) => r.id !== id));
    showToast("Custom Request deleted.", "info");
  };

  // Customer Actions
  const toggleBlockCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
    );
    showToast("Customer status updated.", "info");
  };

  // Review Actions
  const updateReviewStatus = (id: string, status: TestimonialReview["status"], isFeatured?: boolean) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, ...(isFeatured !== undefined ? { isFeaturedOnHome: isFeatured } : {}) } : r
      )
    );
    showToast("Review status updated!", "success");
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast("Review deleted.", "info");
  };

  // Settings Action
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast("Settings saved & updated live!", "success");
  };

  // Admin User Actions
  const addAdminUser = (userData: Omit<AdminUser, "id">) => {
    const newUser: AdminUser = { ...userData, id: "adm_" + Date.now() };
    setAdminUsers((prev) => [...prev, newUser]);
    showToast(`Admin account "${newUser.name}" created!`, "success");
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast("Admin account removed.", "info");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        heroSlides,
        orders,
        customRequests,
        customers,
        reviews,
        addons,
        settings,
        adminUsers,
        isLoaded,
        toasts,
        showToast,
        addAddon,
        updateAddon,
        deleteAddon,
        deleteAddons,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        deleteCategories,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        deleteHeroSlides,
        updateOrderStatus,
        deleteOrder,
        updateCustomRequest,
        deleteCustomRequest,
        toggleBlockCustomer,
        updateReviewStatus,
        deleteReview,
        updateSettings,
        addAdminUser,
        deleteAdminUser,
        uploadImageToCloudinary,
      }}
    >
      {children}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-xs font-semibold shadow-xl border pointer-events-auto transition-all animate-bounce ${
              t.type === "success"
                ? "bg-[#C2185B] text-white border-pink-400"
                : t.type === "error"
                ? "bg-red-600 text-white border-red-400"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
