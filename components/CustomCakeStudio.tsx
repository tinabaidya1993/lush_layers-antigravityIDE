"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCustomCakeWhatsAppUrl } from "@/lib/whatsapp";
import { CustomCakeOrder } from "@/lib/types";
import { Sparkles, MessageCircle, Cake, Check, Palette, Award, Shield } from "lucide-react";

export const CustomCakeStudio: React.FC = () => {
  const { settings } = useStore();

  const [weight, setWeight] = useState<string>("1.0 Kg (Serves 6-8)");
  const [basePrice, setBasePrice] = useState<number>(850);
  const [flavor, setFlavor] = useState<string>("Rich Belgian Chocolate");
  const [frosting, setFrosting] = useState<string>("Silky Swiss Buttercream");
  const [shape, setShape] = useState<string>("Classic Round");
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("Evening (4 PM - 7 PM)");
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

  const calculatedPrice = basePrice + (isEggless ? 0 : 0);

  const handleCustomOrder = () => {
    const orderData: CustomCakeOrder = {
      weight,
      flavor: `${flavor} with ${frosting} (${shape})`,
      isEggless,
      customMessage,
      deliveryDate,
      deliveryTimeSlot: timeSlot,
      notes,
      calculatedPrice,
    };

    const whatsappUrl = formatCustomCakeWhatsAppUrl(orderData, settings);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="custom-studio" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="glass-panel-gold rounded-3xl p-8 lg:p-12 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F4D068] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Designer</span>
          </div>
          <h2 className="font-serif-luxury text-3xl lg:text-5xl font-bold text-[#FAF7F2]">
            Bespoke Custom Cake Studio
          </h2>
          <p className="text-sm text-[#B3A89E] mt-3 leading-relaxed">
            Have a unique theme or flavor combination in mind? Design your custom cake parameters below and get an instant estimated quote directly on WhatsApp!
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Weight & Size */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F4D068] mb-3">
                <Cake className="w-4 h-4" />
                <span>1. Select Size & Weight</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {weights.map((w) => (
                  <button
                    key={w.label}
                    onClick={() => {
                      setWeight(w.label);
                      setBasePrice(w.price);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                      weight === w.label
                        ? "bg-[#D4AF37] text-[#0D0A08] border-[#D4AF37] shadow-md shadow-[#D4AF37]/20"
                        : "bg-[#171310] text-[#FAF7F2] border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                    }`}
                  >
                    <span className="text-xs font-semibold">{w.label}</span>
                    <span className="text-xs font-mono font-bold">
                      {settings.currency}{w.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Flavor Selection */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F4D068] mb-3">
                <Palette className="w-4 h-4" />
                <span>2. Choose Base Flavor</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {flavors.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-medium border transition-all ${
                      flavor === f
                        ? "bg-[#D4AF37] text-[#0D0A08] border-[#D4AF37]"
                        : "bg-[#171310] text-[#B3A89E] border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Shape & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B3A89E] font-medium mb-2">
                  Cake Shape
                </label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D4AF37]"
                >
                  {shapes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B3A89E] font-medium mb-2">
                  Dietary Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      isEggless
                        ? "bg-[#1B2E1E] text-[#4ADE80] border-[#4ADE80]/50"
                        : "bg-[#171310] text-[#B3A89E] border-[#D4AF37]/20"
                    }`}
                  >
                    🌿 Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      !isEggless
                        ? "bg-[#2E201B] text-[#F87171] border-[#F87171]/50"
                        : "bg-[#171310] text-[#B3A89E] border-[#D4AF37]/20"
                    }`}
                  >
                    🥚 With Egg
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Custom Message & Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B3A89E] font-medium mb-1.5">
                  Name / Inscription Written on Cake
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Happy 25th Anniversary Mom & Dad"
                  className="w-full bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs text-[#FAF7F2] placeholder-[#4A3E35] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B3A89E] font-medium mb-1.5">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B3A89E] font-medium mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option>Morning (10 AM - 1 PM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (4 PM - 7 PM)</option>
                    <option>Night / Midnight Slot</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Live Preview Summary Card Column */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-[#D4AF37]/40 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#231D18]">
              <h3 className="font-serif-luxury text-xl font-bold text-[#FAF7F2]">
                Custom Creation Summary
              </h3>
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>

            <div className="py-6 space-y-4 text-xs text-[#FAF7F2]">
              <div className="flex justify-between py-2 border-b border-[#231D18]">
                <span className="text-[#B3A89E]">Weight & Portion:</span>
                <span className="font-semibold text-[#F4D068]">{weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#231D18]">
                <span className="text-[#B3A89E]">Flavor Profile:</span>
                <span className="font-semibold text-right max-w-[180px]">{flavor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#231D18]">
                <span className="text-[#B3A89E]">Shape & Style:</span>
                <span className="font-semibold">{shape}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#231D18]">
                <span className="text-[#B3A89E]">Dietary:</span>
                <span className="font-semibold">{isEggless ? "🌿 100% Eggless" : "🥚 With Egg"}</span>
              </div>
              {customMessage && (
                <div className="flex justify-between py-2 border-b border-[#231D18]">
                  <span className="text-[#B3A89E]">Message on Cake:</span>
                  <span className="font-serif-luxury italic text-[#F4D068]">"{customMessage}"</span>
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-[#0D0A08] rounded-xl p-5 border border-[#D4AF37]/30 my-4 text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#B3A89E] font-medium block">
                Estimated Price
              </span>
              <span className="font-serif-luxury text-4xl font-bold gold-gradient-text block mt-1">
                {settings.currency}{calculatedPrice}
              </span>
              <span className="text-[10px] text-[#8C6D1F] block mt-1">
                *Final price may vary based on complex reference photo designs
              </span>
            </div>

            <button
              onClick={handleCustomOrder}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] text-white font-bold text-sm shadow-xl shadow-[#25D366]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send Custom Spec on WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
