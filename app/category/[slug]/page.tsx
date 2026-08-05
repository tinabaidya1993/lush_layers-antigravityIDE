"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { CategoryShortcuts } from "@/components/CategoryShortcuts";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CakeDrawer } from "@/components/CakeDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import {
  ArrowLeft,
  Cake,
  Sparkles,
  SlidersHorizontal,
  Check,
  Star,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const decodedCategory = decodeURIComponent(resolvedParams.slug);

  const { products, categories, settings, isLoaded } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<"all" | "under-500" | "500-1000" | "above-1000">("all");

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === resolvedParams.slug ||
      p.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  let displayedProducts = categoryProducts.filter((p) => {
    if (egglessOnly && !p.isEggless) return false;
    if (priceRange === "under-500" && p.price > 500) return false;
    if (priceRange === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
    if (priceRange === "above-1000" && p.price < 1000) return false;
    return true;
  });

  if (sortBy === "price-low") {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
  }

  const categoryTitle = categoryProducts[0]?.category || decodedCategory.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#212121] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CategoryShortcuts />

      {/* Header Banner */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-600 hover:text-[#C2185B] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <span className="text-[11px] uppercase tracking-widest text-[#C2185B] font-bold">
            {categoryProducts.length} Items Available
          </span>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize">
            {categoryTitle}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Explore all cakes in the {categoryTitle} collection. 100% eggless options available with same-day express delivery.
          </p>
        </div>
      </section>

      {/* Winni-Style Filter & Sort Bar */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto w-full mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <SlidersHorizontal className="w-4 h-4 text-[#C2185B]" />
              <span>Filters:</span>
            </div>

            <button
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-semibold ${
                egglessOnly
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              <span>🌿 100% Eggless</span>
              {egglessOnly && <Check className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5">
              {[
                { label: "All Prices", value: "all" },
                { label: "Under ₹500", value: "under-500" },
                { label: "₹500 - ₹1000", value: "500-1000" },
                { label: "₹1000+", value: "above-1000" },
              ].map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setPriceRange(chip.value as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    priceRange === chip.value
                      ? "bg-[#C2185B] text-white border-[#C2185B]"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-semibold focus:outline-none"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="py-2 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-8 shadow-xs">
            <Cake className="w-12 h-12 text-[#C2185B] mx-auto mb-3 stroke-[1.2]" />
            <h3 className="font-heading text-2xl font-bold text-gray-900">
              No Cakes Found
            </h3>
            <p className="text-xs text-gray-600 mt-2">
              No cakes match your filter criteria. Try clearing filters or selecting 'All Prices'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => {
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
        )}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
