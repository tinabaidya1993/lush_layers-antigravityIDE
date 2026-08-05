"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CakeDrawer } from "@/components/CakeDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import {
  ArrowLeft,
  Cake,
  Sparkles,
  Star,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Heart,
  Gift,
  Flame,
  Plus,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { products, addons, settings } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  const product = products.find(
    (p) => p.id === resolvedParams.id || p.slug === resolvedParams.id
  ) || products[0];

  const availableSizes = product?.sizes && product.sizes.length > 0
    ? product.sizes
    : ["500g (0.5 Kg)", "1 Kg", "1.5 Kg", "2 Kg"];

  const [selectedWeight, setSelectedWeight] = useState(availableSizes[0] || "500g (0.5 Kg)");
  const [selectedFlavor, setSelectedFlavor] = useState(
    product?.flavors?.[0] || "Belgian Chocolate"
  );
  const [isEggless, setIsEggless] = useState(product?.isEggless ?? true);
  const [customInscription, setCustomInscription] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected Accessories & Extra Addons
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6 text-center font-body">
        <div>
          <h2 className="font-heading text-2xl font-bold">Cake Not Found</h2>
          <Link href="/menu" className="mt-4 btn-primary px-6 py-2 text-xs inline-block">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // Weight Multiplier Calculation based on 500g Base Price
  const getWeightMultiplier = (sizeStr: string): number => {
    if (sizeStr.includes("500g") || sizeStr.includes("0.5")) return 1;
    if (sizeStr.includes("1.5")) return 3;
    if (sizeStr.includes("1")) return 2;
    if (sizeStr.includes("2.5")) return 5;
    if (sizeStr.includes("2")) return 4;
    if (sizeStr.includes("3")) return 6;
    return 1;
  };

  const calculatedBasePrice = product.price * getWeightMultiplier(selectedWeight);

  const dbAccessories = addons.filter((a) => a.type === "accessory");
  const dbExtras = addons.filter((a) => a.type === "extra");

  // Calculate total accessories price
  const accessoriesTotal = selectedAccessories.reduce((sum, accName) => {
    const acc = dbAccessories.find((a) => a.name === accName);
    return sum + (acc ? acc.price : 0);
  }, 0);

  // Calculate total extras price
  const extrasTotal = selectedExtras.reduce((sum, extName) => {
    const ext = dbExtras.find((a) => a.name === extName);
    return sum + (ext ? ext.price : 0);
  }, 0);

  const finalTotalPrice = calculatedBasePrice + accessoriesTotal + extrasTotal;

  const toggleAccessory = (name: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const toggleExtra = (name: string) => {
    setSelectedExtras((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const relatedCakes = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsAppOrder = () => {
    const text = `Hi ${settings.storeName}! I want to order *${product.name}*:\n` +
      `• Selected Size: ${selectedWeight}\n` +
      `• Flavor: ${selectedFlavor}\n` +
      `• Dietary: ${isEggless ? "100% Eggless" : "Regular Egg"}\n` +
      (customInscription ? `• Message on Cake: "${customInscription}"\n` : "") +
      (selectedAccessories.length > 0 ? `• Accessories: ${selectedAccessories.join(", ")}\n` : "") +
      (selectedExtras.length > 0 ? `• Extra Add-ons: ${selectedExtras.join(", ")}\n` : "") +
      `• Total Price: ${settings.currency}${finalTotalPrice}\n\n` +
      `Please confirm order availability & delivery!`;
    const url = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#212121] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/menu"
            className="text-xs font-semibold text-gray-600 hover:text-[#C2185B] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu Catalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-white border border-gray-200 relative shadow-sm">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Cake className="w-16 h-16 stroke-[1.2]" />
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-[#C2185B]" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Customization & Price */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C2185B] font-bold">
                {product.category}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="rating-badge">
                  <span>4.9</span>
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
                <span className="text-gray-500 font-semibold">• 28 Verified Reviews</span>
              </div>
            </div>

            {/* Calculated Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900">
                {settings.currency}{finalTotalPrice}
              </span>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || "Baked fresh to order with natural Belgian cocoa and premium dairy ingredients."}
            </p>

            <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-center gap-2 text-xs text-[#C2185B] font-bold">
              <Truck className="w-4 h-4" />
              <span>Earliest Delivery: <strong>Today (Express Delivery Available)</strong></span>
            </div>

            <div className="space-y-5 pt-2">
              {/* Weight Options */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-900 font-bold mb-2">
                  Select Weight / Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedWeight === size;
                    const priceForSize = product.price * getWeightMultiplier(size);

                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedWeight(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#C2185B] text-white border-[#C2185B]"
                            : "bg-white text-gray-800 border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <span>{size}</span>
                        <span className="text-[11px] font-mono opacity-80">({settings.currency}{priceForSize})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Eggless Option */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-900 font-bold mb-2">
                  Dietary Preference:
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEggless(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      isEggless ? "bg-green-50 text-green-700 border-green-300" : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    <span>🌿 100% Eggless</span>
                    {isEggless && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsEggless(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      !isEggless ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    <span>🥚 Contains Egg</span>
                    {!isEggless && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Cake Accessories Tick Box Selection */}
              {dbAccessories.length > 0 && (
                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#C2185B]" />
                    <span>Add Cake Accessories (Tick to Add):</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbAccessories.map((acc) => {
                      const isChecked = selectedAccessories.includes(acc.name);
                      return (
                        <label
                          key={acc.id}
                          onClick={() => toggleAccessory(acc.name)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked ? "bg-pink-50 border-[#C2185B] text-[#C2185B]" : "bg-gray-50 border-gray-200 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-[#C2185B]" />
                            <span>{acc.name}</span>
                          </div>
                          <span className="font-mono font-bold">+₹{acc.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extra Addons Selection */}
              {dbExtras.length > 0 && (
                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#C2185B]" />
                    <span>Add Extra Gifts & Cards (Tick to Add):</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbExtras.map((ext) => {
                      const isChecked = selectedExtras.includes(ext.name);
                      return (
                        <label
                          key={ext.id}
                          onClick={() => toggleExtra(ext.name)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked ? "bg-pink-50 border-[#C2185B] text-[#C2185B]" : "bg-gray-50 border-gray-200 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-[#C2185B]" />
                            <span>{ext.name}</span>
                          </div>
                          <span className="font-mono font-bold">+₹{ext.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Message Inscription */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Custom Message on Cake:
                </label>
                <input
                  type="text"
                  value={customInscription}
                  onChange={(e) => setCustomInscription(e.target.value)}
                  placeholder="e.g. Happy Birthday Ananya!"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleWhatsAppOrder}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly on WhatsApp ({settings.currency}{finalTotalPrice})</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
