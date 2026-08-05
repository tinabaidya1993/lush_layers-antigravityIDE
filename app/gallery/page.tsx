"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Camera, Cake, Plus } from "lucide-react";

export default function GalleryPage() {
  const { products, categories, settings } = useStore();
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Dynamically extract all photos from database products
  const liveGalleryItems = products.flatMap((p) =>
    (p.images || []).map((img) => ({
      id: p.id,
      url: img,
      title: p.name,
      cat: p.category,
    }))
  );

  const availableCategories = ["All", ...categories.map((c) => c.name)];

  const filteredItems = activeFilter === "All"
    ? liveGalleryItems
    : liveGalleryItems.filter((i) => i.cat === activeFilter);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#212121] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C2185B] font-bold flex items-center justify-center gap-1.5 mb-2">
            <Camera className="w-4 h-4" /> Live Gallery
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900">
            Artisan Cake Showcase
          </h1>
          <p className="text-xs text-gray-600 mt-2">
            Live photo showcase of cake creations added from the Admin Panel.
          </p>

          {categories.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === cat
                      ? "bg-[#C2185B] text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {liveGalleryItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm max-w-md mx-auto my-8">
            <Cake className="w-12 h-12 text-[#C2185B] mx-auto mb-4 stroke-[1.2]" />
            <h3 className="font-heading text-2xl font-bold text-gray-900">
              Gallery Ready for Photos
            </h3>
            <p className="text-xs text-gray-600 mt-2">
              No gallery images found. When you add cake items with photos in the Admin Panel, they will automatically appear here live!
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAdminPinModalOpen(true)}
                className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Open Admin Panel (PIN: 7890)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <Link
                key={idx}
                href={`/product/${item.id}`}
                className="group relative h-72 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold">
                    {item.cat}
                  </span>
                  <span className="font-heading text-base font-bold line-clamp-1">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
