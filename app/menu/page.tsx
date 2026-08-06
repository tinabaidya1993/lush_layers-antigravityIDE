"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CakeDrawer } from "@/components/CakeDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { ArrowRight, Cake, Plus, Sparkles, Filter } from "lucide-react";

export default function MenuPage() {
  const { products, categories, settings, isLoaded } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const openProductDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category && p.category.trim().toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#2C1A10] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Header */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full text-center">
        <span className="text-xs uppercase tracking-widest text-[#D48C95] font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Full Menu Catalog
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#2C1A10]">
          Signature Confections
        </h1>
        <p className="text-sm text-[#7A6255] mt-2 max-w-lg mx-auto leading-relaxed">
          Explore our handcrafted gourmet cake collection. Click any cake to customize size, flavor, dietary preference, and order on WhatsApp!
        </p>

        {/* Category Filter Badges */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`py-2 px-5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "All"
                  ? "bg-[#2C1A10] text-[#FFF9F4]"
                  : "bg-[#FAF2EC] text-[#7A6255] border border-[#EADCD3] hover:border-[#D48C95]"
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`py-2 px-5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.name
                    ? "bg-[#2C1A10] text-[#FFF9F4]"
                    : "bg-[#FAF2EC] text-[#7A6255] border border-[#EADCD3] hover:border-[#D48C95]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Grid View */}
      <main className="py-8 px-6 max-w-7xl mx-auto w-full flex-1">
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FAF2EC] rounded-3xl p-12 text-center border border-[#EADCD3] max-w-xl mx-auto my-8">
            <Cake className="w-12 h-12 text-[#D48C95] mx-auto mb-3 stroke-[1.2]" />
            <h3 className="font-heading text-2xl font-bold text-[#2C1A10]">
              No Products Found
            </h3>
            <p className="text-xs text-[#7A6255] mt-2 max-w-md mx-auto">
              No products found in this category. Add your signature cakes from the secret Admin Panel to display them here!
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAdminPinModalOpen(true)}
                className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider"
              >
                Open Admin Panel (PIN: 7890)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => openProductDrawer(product)}
                className="group cursor-pointer flex flex-col pb-6 border-b border-[#EADCD3]"
              >
                <div className="w-full h-72 rounded-2xl overflow-hidden bg-[#FAF2EC] border border-[#EADCD3] relative mb-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7A6255]">
                      <Cake className="w-10 h-10 stroke-[1.5]" />
                    </div>
                  )}
                  {product.isEggless && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFF9F4]/90 text-[10px] font-bold text-[#2C1A10] border border-[#EADCD3]">
                      🌿 Eggless
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#D48C95] font-semibold uppercase tracking-wider mb-1">
                  <span>{product.category}</span>
                  <span className="font-heading text-lg font-bold text-[#2C1A10]">
                    {settings.currency}{product.price}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#2C1A10] group-hover:text-[#D48C95] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-[#7A6255] line-clamp-2 mt-1.5">
                  {product.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openProductDrawer(product);
                  }}
                  className="mt-4 text-xs font-bold text-[#2C1A10] hover:text-[#D48C95] flex items-center gap-1.5 transition-colors"
                >
                  <span>Customize & Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <CakeDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
      />
    </div>
  );
}
