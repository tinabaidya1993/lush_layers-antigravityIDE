"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CartDrawer } from "@/components/CartDrawer";
import { ChevronDown, Sparkles, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I place an order for a cake?",
      answer: "Placing an order is super simple! Browse our menu, choose your preferred cake, select the size, flavor, and 100% eggless option, then click 'Order via WhatsApp'. You will be redirected to WhatsApp with your pre-formatted order details for instant confirmation.",
    },
    {
      question: "What are your delivery timings & same-day options?",
      answer: "We offer same-day delivery across local delivery zones for orders placed before 4:00 PM. Earliest delivery slot is within 3 hours of order placement.",
    },
    {
      question: "Are your cakes 100% eggless?",
      answer: "Yes! All our cakes can be prepared 100% vegetarian & eggless in dedicated eggless kitchen lines. Simply select the '100% Eggless' toggle when customizing your cake.",
    },
    {
      question: "Can I order a custom bespoke cake with a reference photo?",
      answer: "Absolutely! Visit our `/custom-cake` page to upload a reference photo, choose flavors, weight, and delivery date. Our baker will review the design and confirm the quote via WhatsApp.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and online bank transfers upon WhatsApp order confirmation.",
    },
    {
      question: "What is your refund & cancellation policy?",
      answer: "Cancellations made 24 hours prior to scheduled delivery are eligible for a full refund or store credit. For custom photo cakes already in preparation, partial material costs may apply.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#2C1A10] flex flex-col font-body">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-1">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D48C95] font-semibold flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Customer Help & Guidance
          </span>
          <h1 className="font-heading text-4xl font-bold text-[#2C1A10]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#7A6255] mt-2">
            Everything you need to know about ordering, delivery timings, eggless preparations, and custom cake orders.
          </p>
        </div>

        {/* Minimal Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div key={idx} className="border-b border-[#EADCD3] pb-4">
                <button
                  onClick={() => setOpenAccordionIndex(isOpen ? null : idx)}
                  className="w-full text-left py-3 flex items-center justify-between font-heading text-lg font-bold text-[#2C1A10] hover:text-[#D48C95] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#D48C95] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <p className="text-xs text-[#7A6255] leading-relaxed pt-1 pb-2 animate-fadeIn">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
