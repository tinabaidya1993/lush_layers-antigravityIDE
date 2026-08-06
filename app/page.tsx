"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryShortcuts } from "@/components/CategoryShortcuts";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CakeDrawer } from "@/components/CakeDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import {
  Sparkles,
  MessageCircle,
  Plus,
  Lock,
  ChevronRight,
  Cake,
  Star,
  Camera,
  ArrowRight,
  Truck,
  ShieldCheck,
  HelpCircle,
  Heart,
  Award,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

export default function HomePage() {
  const { products, categories, settings, isLoaded } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeCategories = Array.from(
    new Set([
      ...categories.map((c) => c.name.trim()),
      ...products.map((p) => (p.category ? p.category.trim() : "Signature Cakes")),
    ])
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#212121] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 1. Hero Carousel Slider */}
      <HeroCarousel />

      {/* 2. Winni-Style Circular Category Shortcuts */}
      <CategoryShortcuts />

      {/* 3. Winni-Style Product Catalog Sections */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {!isLoaded ? (
          <div className="py-20 text-center text-gray-500 text-sm animate-pulse">
            Loading Lush Layer Bakery catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-sm max-w-xl mx-auto my-8">
            <Cake className="w-12 h-12 text-[#C2185B] mx-auto mb-4 stroke-[1.5]" />
            <h3 className="font-heading text-2xl font-bold text-gray-900">
              Catalog Ready for Your Creations
            </h3>
            <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto">
              Your store is currently empty. Open the secret Admin Panel to add your signature cakes, set prices, and upload photos!
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAdminPinModalOpen(true)}
                className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Open Admin Panel (PIN: 7890)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {activeCategories.map((catName) => {
              const catCakes = products.filter(
                (p) =>
                  (p.category && p.category.trim().toLowerCase() === catName.toLowerCase()) ||
                  (!p.category && catName === "Signature Cakes")
              );
              if (catCakes.length === 0) return null;

              const visibleCakes = catCakes.slice(0, 8);
              const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              return (
                <div key={catName} className="space-y-6">
                  
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div>
                      <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                        <span>{catName}</span>
                        <span className="w-8 h-1 bg-[#C2185B] rounded-full inline-block" />
                      </h2>
                    </div>

                    <Link
                      href={`/category/${catSlug}`}
                      className="text-xs font-bold text-[#C2185B] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({catCakes.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Product Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {visibleCakes.map((product) => {
                      const isWishlisted = wishlist.includes(product.id);
                      const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
                      const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="winni-card group flex flex-col overflow-hidden relative"
                        >
                          <div className="w-full h-44 sm:h-52 bg-gray-50 relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Cake className="w-10 h-10 stroke-[1.2]" />
                              </div>
                            )}

                            <button
                              onClick={(e) => toggleWishlist(product.id, e)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                            </button>

                            {product.isEggless && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[9px] font-bold text-green-700 border border-green-200">
                                🌿 Eggless
                              </span>
                            )}
                          </div>

                          <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
                            <div>
                              <h3 className="font-heading font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#C2185B] line-clamp-1 transition-colors">
                                {product.name}
                              </h3>

                              <div className="flex items-baseline gap-1.5 mt-1">
                                <span className="font-bold text-sm sm:text-base text-gray-900">
                                  {settings.currency}{product.price}
                                </span>
                                <span className="text-[11px] text-gray-400 line-through">
                                  {settings.currency}{originalPrice}
                                </span>
                                <span className="text-[10px] font-extrabold text-[#C2185B]">
                                  {discountPct}% OFF
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px]">
                              <div className="rating-badge">
                                <span>4.5</span>
                                <Star className="w-2.5 h-2.5 fill-white text-white" />
                              </div>

                              <span className="text-gray-500 font-medium">
                                Earliest: <strong className="text-gray-800">Today</strong>
                              </span>
                            </div>

                          </div>
                        </Link>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Winni-Style Trust Indicators Footer Strip */}
      <section className="py-8 px-4 bg-[#FCE4EC] border-b border-pink-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-[#C2185B] font-bold">
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6" />
            <span>100% Safe & Express Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6" />
            <span>100% Secure WhatsApp Ordering</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Award className="w-6 h-6" />
            <span>100K+ Happy Cake Lovers</span>
          </div>
        </div>
      </section>

      {/* 5. Winni-Style Detailed Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C2185B] text-white flex items-center justify-center font-heading font-extrabold text-lg">
                L
              </div>
              <span className="font-heading text-xl font-bold text-white">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              India's premier online artisanal cake bakery. Delivering happiness across local delivery zones via WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-white block mb-2">Explore Menu</span>
            <div><Link href="/menu" className="hover:text-[#D48C95]">All Signature Cakes</Link></div>
            <div><Link href="/custom-cake" className="hover:text-[#D48C95]">Custom Photo Cake</Link></div>
            <div><Link href="/about" className="hover:text-[#D48C95]">About Our Bakery</Link></div>
            <div><Link href="/faq" className="hover:text-[#D48C95]">Delivery & FAQ</Link></div>
          </div>

          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-white block mb-2">Customer Policies</span>
            <div><Link href="/faq" className="hover:text-[#D48C95]">Refund Policy</Link></div>
            <div><Link href="/contact" className="hover:text-[#D48C95]">Contact Store</Link></div>
            <div>WhatsApp: {settings.whatsappNumber}</div>
          </div>

          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-white block">Store Control</span>
            <button
              onClick={() => setIsAdminPinModalOpen(true)}
              className="btn-secondary px-4 py-2 text-xs flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-[#C2185B] hover:border-[#C2185B]"
            >
              <Lock className="w-3.5 h-3.5 text-[#C2185B]" />
              <span>Admin Dashboard (PIN: 7890)</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} {settings.storeName}. All Rights Reserved. Inspired by Winni.in e-commerce excellence.
        </div>
      </footer>

      <CakeDrawer product={selectedProduct} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
