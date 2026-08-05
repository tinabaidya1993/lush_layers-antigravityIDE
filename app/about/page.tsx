"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Sparkles, Cake, ShieldCheck, Award } from "lucide-react";

export default function AboutPage() {
  const { settings, products } = useStore();
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const heroImage = products[0]?.images?.[0] || null;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#212121] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C2185B] font-bold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Our Artisan Heritage
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900">
            The Story Behind {settings.storeName}
          </h1>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Founded on a passion for authentic European baking techniques and pure, uncompromised natural ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-8">
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white h-[360px] flex items-center justify-center">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Artisan Bakery"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8 text-gray-400 space-y-3">
                  <Cake className="w-16 h-16 stroke-[1.2] text-[#C2185B] mx-auto" />
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    Artisanal Confectionery
                  </h3>
                  <p className="text-xs text-gray-500">
                    Freshly baked daily on customer order with 100% pure ingredients.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 text-xs text-gray-700 leading-relaxed">
            <h2 className="font-heading text-2xl font-bold text-gray-900">
              "A cake should be a work of culinary art that brings genuine joy."
            </h2>
            <p>
              At {settings.storeName}, every cake begins with raw integrity. We source single-origin Belgian chocolate, Madagascar bourbon vanilla pods, and fresh local dairy. We reject artificial premixes, hydrogenated oils, or long shelf-life preservatives.
            </p>
            <p>
              Whether it’s an intimate birthday or a grand celebration, our team of dedicated pastry chefs ensures that every layer is baked fresh to order.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <span className="font-heading text-xl font-extrabold text-gray-900 block">100% Fresh</span>
                <span className="text-[11px] text-gray-500">Baked on the day of delivery</span>
              </div>
              <div>
                <span className="font-heading text-xl font-extrabold text-[#C2185B] block">🌿 Eggless Line</span>
                <span className="text-[11px] text-gray-500">Dedicated vegetarian preparation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
