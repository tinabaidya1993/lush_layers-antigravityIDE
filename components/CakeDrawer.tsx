"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { formatProductWhatsAppUrl } from "@/lib/whatsapp";
import { X, Sparkles, MessageCircle, Check, Cake, ShieldCheck } from "lucide-react";

export const CakeDrawer: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const { settings } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "1 Kg");
      setSelectedFlavor(product.flavors[0] || "Standard");
      setIsEggless(product.isEggless);
      setCustomMessage("");
      setDeliveryDate("");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const calculatePrice = () => {
    let multiplier = 1;
    if (selectedSize.includes("0.5")) multiplier = 0.6;
    else if (selectedSize.includes("1.5")) multiplier = 1.4;
    else if (selectedSize.includes("2")) multiplier = 1.85;
    else if (selectedSize.includes("3")) multiplier = 2.7;

    return Math.round(product.price * multiplier);
  };

  const finalPrice = calculatePrice();

  const handleOrderWhatsApp = () => {
    const whatsappUrl = formatProductWhatsAppUrl(product, settings, {
      weight: selectedSize,
      flavor: selectedFlavor,
      isEggless,
      customMessage,
      deliveryDate,
    });
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F4] border-l border-[#EADCD3] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative text-[#2C1A10]">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#EADCD3]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D48C95]">
                <Sparkles className="w-4 h-4" />
                <span>Cake Customization</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#7A6255] hover:text-[#2C1A10] hover:bg-[#FAF2EC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image & Title */}
            <div className="mt-6">
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#EADCD3] bg-[#FAF2EC]">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#7A6255]">
                    <Cake className="w-12 h-12 stroke-[1.2]" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#FFF9F4]/90 backdrop-blur-md text-[11px] font-bold text-[#2C1A10] border border-[#EADCD3]">
                  {product.category}
                </div>
              </div>

              <h2 className="font-heading text-2xl font-bold text-[#2C1A10] mt-4">
                {product.name}
              </h2>
              <p className="text-xs text-[#7A6255] mt-1 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Customization Controls */}
            <div className="mt-6 space-y-5">
              
              {/* Weight Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-semibold mb-2">
                    Select Weight / Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSize === size
                            ? "bg-[#2C1A10] text-[#FFF9F4] border-[#2C1A10]"
                            : "bg-[#FAF2EC] text-[#2C1A10] border-[#EADCD3] hover:border-[#D48C95]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor Selection */}
              {product.flavors && product.flavors.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-semibold mb-2">
                    Flavor Profile
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedFlavor === flavor
                            ? "bg-[#2C1A10] text-[#FFF9F4] border-[#2C1A10]"
                            : "bg-[#FAF2EC] text-[#2C1A10] border-[#EADCD3] hover:border-[#D48C95]"
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Option */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-semibold mb-2">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsEggless(true)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      isEggless
                        ? "bg-[#E6F4EA] text-[#137333] border-[#137333]/30"
                        : "bg-[#FAF2EC] text-[#7A6255] border-[#EADCD3]"
                    }`}
                  >
                    <span>🌿 100% Eggless</span>
                    {isEggless && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsEggless(false)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      !isEggless
                        ? "bg-[#FCE8E6] text-[#C5221F] border-[#C5221F]/30"
                        : "bg-[#FAF2EC] text-[#7A6255] border-[#EADCD3]"
                    }`}
                  >
                    <span>🥚 Contains Egg</span>
                    {!isEggless && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-semibold mb-1.5">
                  Name / Inscription Written on Cake
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Rahul!"
                  className="w-full bg-[#FAF2EC] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10] placeholder-[#7A6255]/60 focus:outline-none focus:border-[#D48C95]"
                />
              </div>

              {/* Preferred Delivery Date */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A6255] font-semibold mb-1.5">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10] focus:outline-none focus:border-[#D48C95]"
                />
              </div>

            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8 pt-6 border-t border-[#EADCD3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase text-[#7A6255]">Calculated Price</span>
                <div className="font-heading text-3xl font-bold text-[#2C1A10]">
                  {settings.currency}{finalPrice}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#D48C95] bg-[#FAF2EC] px-3 py-1 rounded-full border border-[#EADCD3]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
