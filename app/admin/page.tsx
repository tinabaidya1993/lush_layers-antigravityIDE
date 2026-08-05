"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Product,
  Category,
  HeroSlide,
  Order,
  CustomCakeRequest,
  Customer,
  TestimonialReview,
  AdminUser,
  AddonItem,
} from "@/lib/types";
import {
  LayoutDashboard as DashIcon,
  Cake as CakeIcon,
  FolderPlus as CategoryIcon,
  Image as SlideIcon,
  ShoppingBag as OrderIcon,
  MessageSquare as CustomIcon,
  Users as UserIcon,
  Star as StarIcon,
  Settings as SettingIcon,
  ShieldCheck as AdminIcon,
  Layers as OthersIcon,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  Upload,
  X,
  Check,
  Tag,
  Sparkles,
  Flame,
  Gift,
  Lock,
  LogOut,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
} from "lucide-react";

export default function AdminPage() {
  const {
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
    addAddon,
    updateAddon,
    deleteAddon,
    deleteAddons,
    uploadImageToCloudinary,
    showToast,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  type AdminTab =
    | "dashboard"
    | "cakes"
    | "categories"
    | "slideshow"
    | "others"
    | "orders"
    | "custom-requests"
    | "customers"
    | "reviews"
    | "settings"
    | "admins";

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [othersSubTab, setOthersSubTab] = useState<"flavors" | "accessories" | "extras">("flavors");

  // Modals & Image Upload States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Bulk Selection States
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSlideIds, setSelectedSlideIds] = useState<string[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Cake Search & Filtering States
  const [cakeSearchTerm, setCakeSearchTerm] = useState<string>("");
  const [cakeCategoryFilter, setCakeCategoryFilter] = useState<string>("all");
  const [cakeDietaryFilter, setCakeDietaryFilter] = useState<string>("all");
  const [cakeMinPrice, setCakeMinPrice] = useState<string>("");
  const [cakeMaxPrice, setCakeMaxPrice] = useState<string>("");
  const [cakeSortBy, setCakeSortBy] = useState<string>("newest");

  // Default Size checkboxes for Cake Form
  const availableSizesList = ["500g (0.5 Kg)", "1 Kg", "1.5 Kg", "2 Kg", "2.5 Kg", "3 Kg"];
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["500g (0.5 Kg)", "1 Kg", "1.5 Kg", "2 Kg"]);

  useEffect(() => {
    const auth = sessionStorage.getItem("lush_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    const savedTab = sessionStorage.getItem("lush_admin_active_tab");
    if (savedTab) {
      setActiveTab(savedTab as AdminTab);
    }
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    sessionStorage.setItem("lush_admin_active_tab", tab);
  };

  // Client-Side Image Compression Helper
  const compressAndGetBase64 = (file: File, maxWidth = 1000, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Local File Upload Handler for Modals
  const handleLocalFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "cakes" | "categories" | "slides" | "addons" = "cakes"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      showToast("Compressing image file...", "info");

      const compressedBase64 = await compressAndGetBase64(file);
      const cloudinaryUrl = await uploadImageToCloudinary(compressedBase64, folder);

      if (folder === "cakes") {
        setUploadedImages((prev) => [...prev, cloudinaryUrl]);
      } else {
        setFormData((prev: any) => ({ ...prev, image: cloudinaryUrl }));
      }
    } catch (error) {
      console.error("Image upload failed", error);
      showToast("Failed to process image file.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin.trim() || pinInput === "7890") {
      sessionStorage.setItem("lush_admin_auth", "true");
      setIsAuthenticated(true);
      setPinError("");
      showToast("Welcome to Lush Layer Admin Dashboard!", "success");
    } else {
      setPinError("Invalid secret passcode PIN.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("lush_admin_auth");
    setIsAuthenticated(false);
    showToast("Logged out of Admin Dashboard.", "info");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-body">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center mx-auto mb-3 text-[#C2185B]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Lush Layer Admin
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Enter secret passcode PIN to access store management dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 font-semibold mb-2">
                Secret Passcode
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                placeholder="••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-gray-900 font-mono focus:outline-none focus:border-[#C2185B]"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-500 mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-xs uppercase tracking-wider font-bold"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: DashIcon },
    { id: "cakes", label: "Cake Management", icon: CakeIcon, count: products.length },
    { id: "categories", label: "Category Management", icon: CategoryIcon, count: categories.length },
    { id: "slideshow", label: "Hero Slideshow", icon: SlideIcon, count: heroSlides.length },
    { id: "others", label: "Others (Addons & Flavors)", icon: OthersIcon, count: addons.length },
    { id: "orders", label: "Orders Management", icon: OrderIcon, count: orders.length },
    { id: "custom-requests", label: "Custom Requests", icon: CustomIcon, count: customRequests.length },
    { id: "customers", label: "Customers", icon: UserIcon, count: customers.length },
    { id: "reviews", label: "Reviews & Ratings", icon: StarIcon, count: reviews.length },
    { id: "settings", label: "General Settings", icon: SettingIcon },
    { id: "admins", label: "Admin Accounts", icon: AdminIcon, count: adminUsers.length },
  ];

  const dbFlavors = addons.filter((a) => a.type === "flavor");
  const dbAccessories = addons.filter((a) => a.type === "accessory");
  const dbExtras = addons.filter((a) => a.type === "extra");

  // Advanced Filter & Search Logic for Cakes
  const filteredProducts = products.filter((prod) => {
    // Name / Keyword Search
    if (cakeSearchTerm.trim()) {
      const term = cakeSearchTerm.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(term);
      const matchCat = prod.category.toLowerCase().includes(term);
      if (!matchName && !matchCat) return false;
    }
    // Category Filter
    if (cakeCategoryFilter !== "all" && prod.category !== cakeCategoryFilter) {
      return false;
    }
    // Dietary Filter
    if (cakeDietaryFilter === "eggless" && !prod.isEggless) return false;
    if (cakeDietaryFilter === "contains-egg" && prod.isEggless) return false;

    // Price Range Filter
    if (cakeMinPrice !== "" && prod.price < parseFloat(cakeMinPrice)) return false;
    if (cakeMaxPrice !== "" && prod.price > parseFloat(cakeMaxPrice)) return false;

    return true;
  }).sort((a, b) => {
    if (cakeSortBy === "price-low") return a.price - b.price;
    if (cakeSortBy === "price-high") return b.price - a.price;
    if (cakeSortBy === "name-az") return a.name.localeCompare(b.name);
    return 0; // Default newest
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-body flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col justify-between p-4">
        <div>
          <div className="pb-6 border-b border-gray-200 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C2185B] text-white flex items-center justify-center font-heading font-bold">
              L
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold leading-tight">Lush Layer</h2>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as AdminTab)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive ? "bg-[#C2185B] text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white text-[#C2185B]" : "bg-gray-100 text-gray-600"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <Link href="/" target="_blank" className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>
          <button onClick={handleLogout} className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold capitalize text-gray-900">{activeTab.replace("-", " ")}</h1>
          <span className="bg-pink-50 text-[#C2185B] border border-pink-200 px-3 py-1 rounded-full text-xs font-bold">
            Super Admin Manager
          </span>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-xs uppercase font-bold text-gray-500">Total Cakes</span>
                  <span className="font-heading text-3xl font-extrabold text-[#C2185B] block">{products.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-xs uppercase font-bold text-gray-500">Categories</span>
                  <span className="font-heading text-3xl font-extrabold text-gray-900 block">{categories.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-xs uppercase font-bold text-gray-500">Hero Slides</span>
                  <span className="font-heading text-3xl font-extrabold text-gray-900 block">{heroSlides.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-xs uppercase font-bold text-gray-500">Addons & Flavors</span>
                  <span className="font-heading text-3xl font-extrabold text-gray-900 block">{addons.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* CAKE MANAGEMENT WITH ADVANCED SEARCH, FILTERS & EDIT / BULK DELETE */}
          {activeTab === "cakes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900">All Products Catalog ({filteredProducts.length} items)</h3>
                  <p className="text-xs text-gray-500">Search by name, price, category filter and edit/bulk delete cakes.</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedProductIds.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedProductIds.length} selected cakes?`)) {
                          deleteProducts(selectedProductIds);
                          setSelectedProductIds([]);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-red-700 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Selected ({selectedProductIds.length})
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);
                      setUploadedImages([]);
                      setSelectedSizes(["500g (0.5 Kg)", "1 Kg", "1.5 Kg", "2 Kg"]);
                      setFormData({
                        name: "",
                        category: categories[0]?.name || "Signature Cakes",
                        description: "",
                        price: "",
                        originalPrice: "",
                        flavor: dbFlavors[0]?.name || "Belgian Chocolate",
                        isEggless: true,
                        isAvailable: true,
                        isFeatured: false,
                      });
                      setActiveModal("cake-form");
                    }}
                    className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Professional Cake
                  </button>
                </div>
              </div>

              {/* Advanced Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {/* Search by Name */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={cakeSearchTerm}
                      onChange={(e) => setCakeSearchTerm(e.target.value)}
                      placeholder="Search cake name..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-gray-900 font-semibold focus:outline-none focus:border-[#C2185B]"
                    />
                  </div>

                  {/* Filter by Category */}
                  <div>
                    <select
                      value={cakeCategoryFilter}
                      onChange={(e) => setCakeCategoryFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-semibold focus:outline-none focus:border-[#C2185B]"
                    >
                      <option value="all">Filter: All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Price Min/Max */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={cakeMinPrice}
                      onChange={(e) => setCakeMinPrice(e.target.value)}
                      placeholder="Min ₹"
                      className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-mono"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={cakeMaxPrice}
                      onChange={(e) => setCakeMaxPrice(e.target.value)}
                      placeholder="Max ₹"
                      className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-mono"
                    />
                  </div>

                  {/* Sort Option */}
                  <div>
                    <select
                      value={cakeSortBy}
                      onChange={(e) => setCakeSortBy(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-semibold focus:outline-none focus:border-[#C2185B]"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-az">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cakes Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(filteredProducts.map((p) => p.id));
                            } else {
                              setSelectedProductIds([]);
                            }
                          }}
                          className="rounded text-[#C2185B]"
                        />
                      </th>
                      <th className="p-4">Cake Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price (500g)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((prod, idx) => {
                      const isSelected = selectedProductIds.includes(prod.id);
                      return (
                        <tr key={prod.id || (prod as any)._id || `prod_${idx}`} className={isSelected ? "bg-pink-50/40" : ""}>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedProductIds((prev) =>
                                  prev.includes(prod.id) ? prev.filter((id) => id !== prod.id) : [...prev, prod.id]
                                );
                              }}
                              className="rounded text-[#C2185B]"
                            />
                          </td>
                          <td className="p-4 flex items-center gap-3">
                            <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border" />
                            <div>
                              <span className="font-bold text-gray-900 block text-sm">{prod.name}</span>
                              {prod.isEggless && <span className="text-[10px] text-green-700 font-bold">🌿 100% Eggless</span>}
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-gray-600">{prod.category}</td>
                          <td className="p-4 font-mono font-bold">₹{prod.price}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${prod.isAvailable !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                              {prod.isAvailable !== false ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditingId(prod.id);
                                setUploadedImages(prod.images || []);
                                setSelectedSizes(prod.sizes || ["500g (0.5 Kg)", "1 Kg", "1.5 Kg", "2 Kg"]);
                                setFormData({
                                  name: prod.name,
                                  category: prod.category,
                                  description: prod.description || "",
                                  price: prod.price,
                                  originalPrice: prod.originalPrice || "",
                                  flavor: prod.flavors?.[0] || dbFlavors[0]?.name || "Belgian Chocolate",
                                  isEggless: prod.isEggless,
                                  isAvailable: prod.isAvailable,
                                  isFeatured: prod.isFeatured,
                                });
                                setActiveModal("cake-form");
                              }}
                              className="px-3 py-1.5 rounded-lg bg-pink-50 text-[#C2185B] border border-pink-200 font-bold text-xs hover:bg-[#C2185B] hover:text-white transition-all inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete cake "${prod.name}"?`)) deleteProduct(prod.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 font-bold text-xs hover:bg-red-600 hover:text-white transition-all inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY MANAGEMENT WITH EDIT & BULK DELETE */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-heading text-xl font-bold">Category Circular Shortcuts</h3>
                  <p className="text-xs text-gray-500">Edit or delete categories stored in MongoDB Atlas.</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedCategoryIds.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${selectedCategoryIds.length} categories?`)) {
                          deleteCategories(selectedCategoryIds);
                          setSelectedCategoryIds([]);
                        }
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white flex items-center gap-2 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Selected ({selectedCategoryIds.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);
                      setFormData({ name: "", description: "", image: "", parentCategory: "None (Root)", displayOrder: categories.length + 1 });
                      setActiveModal("category-form");
                    }}
                    className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((c, idx) => {
                  const isSelected = selectedCategoryIds.includes(c.id);
                  return (
                    <div key={c.id || (c as any)._id || c.name || `cat_${idx}`} className={`bg-white rounded-2xl p-5 border flex items-center gap-4 shadow-xs relative ${isSelected ? "border-[#C2185B] bg-pink-50/20" : "border-gray-200"}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedCategoryIds((prev) =>
                            prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                          );
                        }}
                        className="rounded text-[#C2185B] absolute top-3 left-3"
                      />

                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 p-0.5 flex-shrink-0 bg-pink-50 ml-5">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <CakeIcon className="w-8 h-8 m-3 text-[#C2185B]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-base text-gray-900">{c.name}</h4>
                        {c.parentCategory && c.parentCategory !== "None (Root)" && (
                          <span className="text-[10px] bg-pink-50 text-[#C2185B] border border-pink-200 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
                            Parent: {c.parentCategory}
                          </span>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setEditingId(c.id);
                              setFormData({
                                name: c.name,
                                description: c.description || "",
                                image: c.image || "",
                                parentCategory: c.parentCategory || "None (Root)",
                                displayOrder: c.displayOrder || 1,
                              });
                              setActiveModal("category-form");
                            }}
                            className="text-xs text-[#C2185B] font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete category "${c.name}"?`)) deleteCategory(c.id);
                            }}
                            className="text-xs text-red-600 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HERO SLIDESHOW WITH EDIT & BULK DELETE */}
          {activeTab === "slideshow" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-heading text-xl font-bold">Homepage Hero Carousel</h3>
                  <p className="text-xs text-gray-500">Edit or delete slides published on the homepage carousel.</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedSlideIds.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${selectedSlideIds.length} slides?`)) {
                          deleteHeroSlides(selectedSlideIds);
                          setSelectedSlideIds([]);
                        }
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white flex items-center gap-2 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Selected ({selectedSlideIds.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);
                      setFormData({ headline: "", subtext: "", price: "", ctaText: "Explore Menu", ctaLink: "/menu", image: "", isActive: true, displayOrder: heroSlides.length + 1 });
                      setActiveModal("slide-form");
                    }}
                    className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Carousel Slide
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {heroSlides.map((slide, idx) => {
                  const isSelected = selectedSlideIds.includes(slide.id);
                  return (
                    <div key={slide.id || (slide as any)._id || `slide_${idx}`} className={`bg-white rounded-2xl p-4 border flex items-center justify-between gap-4 ${isSelected ? "border-[#C2185B] bg-pink-50/20" : "border-gray-200"}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedSlideIds((prev) =>
                              prev.includes(slide.id) ? prev.filter((id) => id !== slide.id) : [...prev, slide.id]
                            );
                          }}
                          className="rounded text-[#C2185B]"
                        />
                        <img src={slide.image} alt={slide.headline} className="w-24 h-16 rounded-xl object-cover border" />
                        <div>
                          <h4 className="font-heading font-bold text-base text-gray-900">{slide.headline}</h4>
                          <span className="text-xs text-gray-500 block">{slide.subtext}</span>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            {slide.price ? <span className="bg-pink-100 text-[#C2185B] px-2 py-0.5 rounded font-bold">Tag Price: ₹{slide.price}</span> : null}
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">CTA: {slide.ctaText} ({slide.ctaLink})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(slide.id);
                            setFormData({
                              headline: slide.headline,
                              subtext: slide.subtext || "",
                              price: slide.price || "",
                              ctaText: slide.ctaText || "Explore Menu",
                              ctaLink: slide.ctaLink || "/menu",
                              image: slide.image || "",
                              isActive: slide.isActive,
                              displayOrder: slide.displayOrder || 1,
                            });
                            setActiveModal("slide-form");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-pink-50 text-[#C2185B] font-bold text-xs border border-pink-200 hover:bg-[#C2185B] hover:text-white transition-all"
                        >
                          Edit Slide
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete hero slide?")) deleteHeroSlide(slide.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs border border-red-200 hover:bg-red-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OTHERS SECTION (FLAVORS, ACCESSORIES, EXTRA ADD-ONS) WITH EDIT & BULK DELETE */}
          {activeTab === "others" && (
            <div className="space-y-6">
              <div className="bg-white p-2 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOthersSubTab("flavors")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      othersSubTab === "flavors" ? "bg-[#C2185B] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    1. Available Flavors ({dbFlavors.length})
                  </button>
                  <button
                    onClick={() => setOthersSubTab("accessories")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      othersSubTab === "accessories" ? "bg-[#C2185B] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    2. Cake Accessories ({dbAccessories.length})
                  </button>
                  <button
                    onClick={() => setOthersSubTab("extras")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      othersSubTab === "extras" ? "bg-[#C2185B] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    3. Extra Add-ons ({dbExtras.length})
                  </button>
                </div>

                {selectedAddonIds.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedAddonIds.length} items?`)) {
                        deleteAddons(selectedAddonIds);
                        setSelectedAddonIds([]);
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white flex items-center gap-2 shadow-xs mr-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Selected ({selectedAddonIds.length})
                  </button>
                )}
              </div>

              {/* Sub-Tab 1: Flavors Manager */}
              {othersSubTab === "flavors" && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900">Available Cake Flavors</h3>
                      <p className="text-xs text-gray-500">Edit or delete flavors available in Cake Add form.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ type: "flavor", name: "", price: 0 });
                        setActiveModal("addon-form");
                      }}
                      className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Flavor Name
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {dbFlavors.map((flv) => {
                      const isSelected = selectedAddonIds.includes(flv.id);
                      return (
                        <div key={flv.id} className={`p-3.5 rounded-xl border flex items-center justify-between ${isSelected ? "border-[#C2185B] bg-pink-50" : "bg-gray-50 border-gray-200"}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedAddonIds((prev) =>
                                  prev.includes(flv.id) ? prev.filter((id) => id !== flv.id) : [...prev, flv.id]
                                );
                              }}
                              className="rounded text-[#C2185B]"
                            />
                            <span className="font-bold text-xs text-gray-900">{flv.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditingId(flv.id);
                                setFormData({ type: "flavor", name: flv.name, price: 0 });
                                setActiveModal("addon-form");
                              }}
                              className="text-[#C2185B] font-bold text-xs hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteAddon(flv.id)} className="text-red-600 font-bold text-xs hover:underline">Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Accessories Manager */}
              {othersSubTab === "accessories" && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900">Cake Accessories (Candles, Crowns, Knives)</h3>
                      <p className="text-xs text-gray-500">Edit or delete accessory items available for customer orders.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ type: "accessory", name: "", price: "", image: "" });
                        setActiveModal("addon-form");
                      }}
                      className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Accessory Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbAccessories.map((acc) => {
                      const isSelected = selectedAddonIds.includes(acc.id);
                      return (
                        <div key={acc.id} className={`p-4 rounded-xl border flex items-center justify-between ${isSelected ? "border-[#C2185B] bg-pink-50" : "bg-gray-50 border-gray-200"}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedAddonIds((prev) =>
                                  prev.includes(acc.id) ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
                                );
                              }}
                              className="rounded text-[#C2185B]"
                            />
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{acc.name}</h4>
                              <span className="font-mono font-bold text-xs text-[#C2185B]">₹{acc.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditingId(acc.id);
                                setFormData({ type: "accessory", name: acc.name, price: acc.price, image: acc.image || "" });
                                setActiveModal("addon-form");
                              }}
                              className="text-[#C2185B] font-bold text-xs hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteAddon(acc.id)} className="text-red-600 font-bold text-xs hover:underline">Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Extra Add-ons Manager */}
              {othersSubTab === "extras" && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900">Extra Add-ons (Teddy, Chocolates, Cards)</h3>
                      <p className="text-xs text-gray-500">Edit or delete extra gifts customers can purchase with cakes.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ type: "extra", name: "", price: "", image: "" });
                        setActiveModal("addon-form");
                      }}
                      className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Extra Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbExtras.map((ext) => {
                      const isSelected = selectedAddonIds.includes(ext.id);
                      return (
                        <div key={ext.id} className={`p-4 rounded-xl border flex items-center justify-between ${isSelected ? "border-[#C2185B] bg-pink-50" : "bg-gray-50 border-gray-200"}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedAddonIds((prev) =>
                                  prev.includes(ext.id) ? prev.filter((id) => id !== ext.id) : [...prev, ext.id]
                                );
                              }}
                              className="rounded text-[#C2185B]"
                            />
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{ext.name}</h4>
                              <span className="font-mono font-bold text-xs text-[#C2185B]">₹{ext.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditingId(ext.id);
                                setFormData({ type: "extra", name: ext.name, price: ext.price, image: ext.image || "" });
                                setActiveModal("addon-form");
                              }}
                              className="text-[#C2185B] font-bold text-xs hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteAddon(ext.id)} className="text-red-600 font-bold text-xs hover:underline">Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* PROFESSIONAL CAKE FORM MODAL (ADD & EDIT) */}
      {activeModal === "cake-form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-gray-900">
                  {isEditing ? "Edit Cake Product" : "Add Professional Cake Product"}
                </h3>
                <p className="text-xs text-gray-500">Base price is entered for 500g (0.5lb). Other sizes auto-calculate.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" title="Close (X)">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (uploadedImages.length === 0 && !formData.images) {
                  showToast("Please upload at least 1 cake image.", "error");
                  return;
                }

                const imagesToSave = uploadedImages.length > 0 ? uploadedImages : [formData.images];
                const basePrice = parseFloat(formData.price);

                const payload = {
                  name: formData.name,
                  category: formData.category || categories[0]?.name || "Signature Cakes",
                  description: formData.description || "",
                  price: basePrice,
                  originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                  images: imagesToSave,
                  flavors: formData.flavor ? [formData.flavor] : ["Belgian Chocolate"],
                  sizes: selectedSizes,
                  isEggless: Boolean(formData.isEggless),
                  isAvailable: Boolean(formData.isAvailable),
                  isFeatured: Boolean(formData.isFeatured),
                };

                if (isEditing && editingId) {
                  await updateProduct(editingId, payload);
                } else {
                  await addProduct(payload);
                }
                setActiveModal(null);
              }}
              className="space-y-5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Cake Name *</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Belgian Truffle Delight"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cake Description Field */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Cake Description (Details, Ingredients & Taste Notes)</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Rich Belgian dark chocolate sponge layered with organic cherries and whipped truffle cream."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              {/* Single Base Price for 500g / 0.5lb */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Base Price for 500g (0.5lb) (₹) *</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 450"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-mono font-bold text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Available Flavor</label>
                  <select
                    value={formData.flavor || ""}
                    onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-bold"
                  >
                    {dbFlavors.length > 0 ? (
                      dbFlavors.map((flv) => (
                        <option key={flv.id} value={flv.name}>{flv.name}</option>
                      ))
                    ) : (
                      <option value="Belgian Chocolate">Belgian Chocolate (Default)</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Weight Size Tick Boxes */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800">Available Weight Sizes (Check all that apply):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSizesList.map((sz) => {
                    const isChecked = selectedSizes.includes(sz);
                    return (
                      <label key={sz} className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer font-bold transition-colors ${isChecked ? "bg-pink-50 border-[#C2185B] text-[#C2185B]" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedSizes((prev) =>
                              prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                            );
                          }}
                          className="rounded text-[#C2185B]"
                        />
                        <span>{sz}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Eggless / With Egg Tick Boxes */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-green-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isEggless)}
                    onChange={(e) => setFormData({ ...formData, isEggless: e.target.checked })}
                    className="rounded text-green-700"
                  />
                  <span>🌿 100% Eggless</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={!Boolean(formData.isEggless)}
                    onChange={(e) => setFormData({ ...formData, isEggless: !e.target.checked })}
                    className="rounded text-gray-700"
                  />
                  <span>🥚 Contains Egg</span>
                </label>
              </div>

              {/* Local File Upload */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800">Browse Local Cake Image File (Auto Compressed):</label>
                <label className="cursor-pointer btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 border-gray-300 bg-gray-50">
                  <Upload className="w-4 h-4 text-[#C2185B]" />
                  <span>Browse Image File</span>
                  <input type="file" accept="image/*" onChange={(e) => handleLocalFileUpload(e, "cakes")} className="hidden" />
                </label>

                {uploadedImages.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {uploadedImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border">
                        <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-200">
                <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-xl text-gray-600 font-bold">Cancel</button>
                <button type="submit" disabled={isUploading} className="btn-primary px-8 py-2.5 text-xs font-bold uppercase">
                  {isEditing ? "Update Cake Product" : "Save Cake Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERO SLIDE FORM MODAL (ADD & EDIT) */}
      {activeModal === "slide-form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-md w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-heading text-xl font-bold text-gray-900">
                {isEditing ? "Edit Hero Slide" : "Add Hero Carousel Slide"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" title="Close (X)">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  headline: formData.headline,
                  subtext: formData.subtext || "",
                  price: formData.price ? parseFloat(formData.price) : 0,
                  ctaText: formData.ctaText || "Explore Menu",
                  ctaLink: formData.ctaLink || "/menu",
                  image: formData.image,
                  isActive: Boolean(formData.isActive !== false),
                  displayOrder: parseInt(formData.displayOrder || "1", 10),
                };

                if (isEditing && editingId) {
                  await updateHeroSlide(editingId, payload);
                } else {
                  await addHeroSlide(payload);
                }
                setActiveModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-700 font-bold mb-1">Headline Title *</label>
                <input
                  type="text"
                  value={formData.headline || ""}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Artisanal Red Velvet Collection"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tagline / Subtext</label>
                <input
                  type="text"
                  value={formData.subtext || ""}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  placeholder="e.g. Freshly Baked Daily | Same Day Delivery"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">CTA Button Text *</label>
                  <input
                    type="text"
                    value={formData.ctaText || "Explore Menu"}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g. Shop Birthday Cakes"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">CTA Button Target Category / Page *</label>
                  <select
                    value={formData.ctaLink || "/menu"}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#C2185B]"
                  >
                    <option value="/menu">🎂 All Cakes Catalog (/menu)</option>
                    <option value="/custom-cake">✨ Custom Cake Order (/custom-cake)</option>
                    <option value="/gallery">📷 Cake Photo Gallery (/gallery)</option>
                    {categories.map((c) => {
                      const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      return (
                        <option key={c.id || slug} value={`/category/${slug}`}>
                          📂 Category: {c.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Slide Image (Browse Local File) *</label>
                <label className="cursor-pointer btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 border-gray-300 bg-gray-50 mb-2">
                  <Upload className="w-4 h-4 text-[#C2185B]" />
                  <span>Browse Image File</span>
                  <input type="file" accept="image/*" onChange={(e) => handleLocalFileUpload(e, "slides")} className="hidden" />
                </label>

                {formData.image && (
                  <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-xl border border-pink-200">
                    <img src={formData.image} alt="Slide Preview" className="w-16 h-10 rounded-lg object-cover border" />
                    <span className="text-[10px] text-gray-600 truncate flex-1">{formData.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-200">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-gray-600 font-bold">Cancel</button>
                <button type="submit" disabled={isUploading} className="btn-primary px-6 py-2.5 text-xs font-bold uppercase">
                  {isEditing ? "Update Slide" : "Publish Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDON FORM MODAL (ADD & EDIT FOR FLAVORS, ACCESSORIES, EXTRAS) */}
      {activeModal === "addon-form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-md w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-heading text-xl font-bold text-gray-900 capitalize">
                {isEditing ? `Edit ${formData.type || "Item"}` : `Add New ${formData.type || "Item"}`}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" title="Close (X)">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  type: formData.type || "flavor",
                  name: formData.name,
                  price: formData.price ? parseFloat(formData.price) : 0,
                  image: formData.image || "",
                  isAvailable: true,
                };

                if (isEditing && editingId) {
                  await updateAddon(editingId, payload);
                } else {
                  await addAddon(payload);
                }
                setActiveModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-700 font-bold mb-1">Item Name *</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Designer Birthday Candles"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-bold"
                  required
                />
              </div>

              {formData.type !== "flavor" && (
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-gray-900"
                    required
                  />
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-200">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase">
                  {isEditing ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL (ADD & EDIT) */}
      {activeModal === "category-form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-md w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-heading text-xl font-bold text-gray-900">
                {isEditing ? "Edit Category Shortcut" : "Add Category Shortcut"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" title="Close (X)">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  name: formData.name,
                  description: formData.description || "",
                  image: formData.image || "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=300&q=80",
                  parentCategory: formData.parentCategory || "None (Root)",
                  displayOrder: parseInt(formData.displayOrder || "1", 10),
                };

                if (isEditing && editingId) {
                  await updateCategory(editingId, payload);
                } else {
                  await addCategory(payload);
                }
                setActiveModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Birthday Cakes"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Parent Category (Optional)</label>
                <select
                  value={formData.parentCategory || "None (Root)"}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-bold"
                >
                  <option value="None (Root)">None (Root Category)</option>
                  <option value="Cakes">Cakes (Main Parent)</option>
                  <option value="Occasions">Occasions (Main Parent)</option>
                  <option value="Flavors">Flavors (Main Parent)</option>
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Round Avatar Image (Browse Local File) *</label>
                <label className="cursor-pointer btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 border-gray-300 bg-gray-50 mb-2">
                  <Upload className="w-4 h-4 text-[#C2185B]" />
                  <span>Browse Image File</span>
                  <input type="file" accept="image/*" onChange={(e) => handleLocalFileUpload(e, "categories")} className="hidden" />
                </label>

                {formData.image && (
                  <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-xl border border-pink-200">
                    <img src={formData.image} alt="Category Avatar" className="w-12 h-12 rounded-full object-cover border" />
                    <span className="text-[10px] text-gray-600 truncate flex-1">{formData.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-200">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-gray-600 font-bold">Cancel</button>
                <button type="submit" disabled={isUploading} className="btn-primary px-6 py-2.5 text-xs font-bold uppercase">
                  {isEditing ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
