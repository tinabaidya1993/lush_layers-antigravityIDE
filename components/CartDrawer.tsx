"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { X, ShoppingBag, MessageCircle, ShieldCheck, Trash2, ArrowRight } from "lucide-react";

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F4] border-l border-[#EADCD3] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#EADCD3]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D48C95]">
                <ShoppingBag className="w-4 h-4" />
                <span>Your Order Basket</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#7A6255] hover:text-[#2C1A10] hover:bg-[#FAF2EC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Placeholder */}
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF2EC] border border-[#EADCD3] flex items-center justify-center mx-auto text-[#D48C95]">
                <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#2C1A10]">
                Direct WhatsApp Checkout
              </h3>
              <p className="text-xs text-[#7A6255] max-w-xs mx-auto leading-relaxed">
                At Lush Layer, all orders are placed directly via WhatsApp to ensure 100% fresh baking schedules and real-time custom message confirmation.
              </p>

              <div className="pt-4 space-y-2 text-left bg-[#FAF2EC] rounded-2xl p-4 border border-[#EADCD3] text-xs">
                <div className="flex items-center gap-2 text-[#2C1A10] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#D48C95]" />
                  <span>100% Freshness & Handcrafted Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C1A10] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#D48C95]" />
                  <span>Eggless Customization Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t border-[#EADCD3]">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Lush%20Layer!%20I%20want%20to%20place%20an%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Proceed to WhatsApp Checkout</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
