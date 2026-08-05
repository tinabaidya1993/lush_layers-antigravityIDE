"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCustomCakeWhatsAppUrl } from "@/lib/whatsapp";
import { CustomCakeOrder } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Sparkles, MessageCircle, Cake, Check, Palette, Award, Calendar, Upload } from "lucide-react";

export default function CustomCakePage() {
  const { settings } = useStore();
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [weight, setWeight] = useState<string>("1.0 Kg (Serves 6-8)");
  const [basePrice, setBasePrice] = useState<number>(850);
  const [flavor, setFlavor] = useState<string>("Rich Belgian Chocolate");
  const [shape, setShape] = useState<string>("Classic Round");
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("Evening (4 PM - 7 PM)");
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const weights = [
    { label: "0.5 Kg (Serves 3-4)", price: 500 },
    { label: "1.0 Kg (Serves 6-8)", price: 850 },
    { label: "1.5 Kg (Serves 10-12)", price: 1250 },
    { label: "2.0 Kg (Serves 15+)", price: 1650 },
    { label: "3.0 Kg 2-Tier Celebration", price: 2500 },
  ];

  const flavors = [
    "Rich Belgian Chocolate",
    "Red Velvet Cream Cheese",
    "Madagascar Vanilla Bean",
    "Mango Passionfruit Truffle",
    "Fresh Strawberry Coulis",
    "Hazelnut Praline Buttercream",
    "Black Forest Gourmet",
  ];

  const shapes = ["Classic Round", "Romantic Heart", "Modern Square", "Geometric Hexagon"];

  const handleCustomOrder = () => {
    const orderData: CustomCakeOrder = {
      weight,
      flavor: `${flavor} (${shape})`,
      isEggless,
      customMessage,
      deliveryDate,
      deliveryTimeSlot: timeSlot,
      notes: `${notes} ${referenceUrl ? `Ref Image: ${referenceUrl}` : ""}`,
      calculatedPrice: basePrice,
    };

    const whatsappUrl = formatCustomCakeWhatsAppUrl(orderData, settings);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#2C1A10] flex flex-col font-body">
      <Navbar
        onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D48C95] font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Custom Request Studio
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#2C1A10]">
            Bespoke Custom Cake Request
          </h1>
          <p className="text-sm text-[#7A6255] mt-3 leading-relaxed">
            Specify your custom cake flavor, size, theme message, and delivery date below. Get an instant estimate quote on WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-[#FAF2EC] rounded-3xl p-8 border border-[#EADCD3] space-y-8">
            
            {/* Step 1 */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-3">
                1. Select Size & Weight
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weights.map((w) => (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => {
                      setWeight(w.label);
                      setBasePrice(w.price);
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      weight === w.label
                        ? "bg-[#2C1A10] text-[#FFF9F4] border-[#2C1A10]"
                        : "bg-[#FFF9F4] text-[#2C1A10] border-[#EADCD3] hover:border-[#D48C95]"
                    }`}
                  >
                    <span className="text-xs font-semibold">{w.label}</span>
                    <span className="text-xs font-bold">{settings.currency}{w.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-3">
                2. Select Base Flavor
              </label>
              <div className="flex flex-wrap gap-2">
                {flavors.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFlavor(f)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-medium border transition-all ${
                      flavor === f
                        ? "bg-[#2C1A10] text-[#FFF9F4] border-[#2C1A10]"
                        : "bg-[#FFF9F4] text-[#7A6255] border-[#EADCD3] hover:border-[#D48C95]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-2">
                  Cake Shape
                </label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                >
                  {shapes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-2">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      isEggless
                        ? "bg-[#E6F4EA] text-[#137333] border-[#137333]/30"
                        : "bg-[#FFF9F4] text-[#7A6255] border-[#EADCD3]"
                    }`}
                  >
                    🌿 Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      !isEggless
                        ? "bg-[#FCE8E6] text-[#C5221F] border-[#C5221F]/30"
                        : "bg-[#FFF9F4] text-[#7A6255] border-[#EADCD3]"
                    }`}
                  >
                    🥚 With Egg
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-1.5">
                  Message Written on Cake
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Happy 25th Anniversary Mom & Dad"
                  className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-1.5">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-bold mb-1.5">
                    Reference Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://pinterest.com/pin/example..."
                    className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Summary Card */}
          <div className="lg:col-span-5 bg-[#FAF2EC] rounded-3xl p-8 border border-[#EADCD3] space-y-6">
            <h3 className="font-heading text-2xl font-bold text-[#2C1A10]">
              Custom Order Summary
            </h3>

            <div className="space-y-3 text-xs text-[#2C1A10]">
              <div className="flex justify-between py-2 border-b border-[#EADCD3]">
                <span className="text-[#7A6255]">Weight & Portion:</span>
                <span className="font-semibold">{weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EADCD3]">
                <span className="text-[#7A6255]">Flavor Profile:</span>
                <span className="font-semibold">{flavor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EADCD3]">
                <span className="text-[#7A6255]">Shape:</span>
                <span className="font-semibold">{shape}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EADCD3]">
                <span className="text-[#7A6255]">Dietary:</span>
                <span className="font-semibold">{isEggless ? "🌿 100% Eggless" : "🥚 With Egg"}</span>
              </div>
              {customMessage && (
                <div className="flex justify-between py-2 border-b border-[#EADCD3]">
                  <span className="text-[#7A6255]">Inscription:</span>
                  <span className="font-heading italic">"{customMessage}"</span>
                </div>
              )}
            </div>

            <div className="bg-[#FFF9F4] rounded-2xl p-5 border border-[#EADCD3] text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#7A6255] font-semibold block">
                Estimated Quote
              </span>
              <span className="font-heading text-4xl font-bold text-[#2C1A10] block mt-1">
                {settings.currency}{basePrice}
              </span>
            </div>

            <button
              onClick={handleCustomOrder}
              className="btn-primary w-full py-4 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Spec on WhatsApp</span>
            </button>
          </div>

        </div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
