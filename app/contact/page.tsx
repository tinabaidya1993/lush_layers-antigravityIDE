"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { AdminPinModal } from "@/components/AdminPinModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Sparkles, MessageCircle, Phone, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const { settings } = useStore();
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#2C1A10] flex flex-col font-body">
      <Navbar />

      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D48C95] font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Get in Touch
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#2C1A10]">
            Contact Lush Layer Bakery
          </h1>
          <p className="text-sm text-[#7A6255] mt-2">
            Have questions about custom orders, corporate catering, or dietary options? Reach out directly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Info Details */}
          <div className="lg:col-span-5 bg-[#FAF2EC] rounded-3xl p-8 border border-[#EADCD3] space-y-6">
            <h3 className="font-heading text-2xl font-bold text-[#2C1A10]">
              Bakery Store Info
            </h3>

            <div className="space-y-4 text-xs text-[#2C1A10]">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#D48C95] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Direct WhatsApp Order</span>
                  <span className="text-[#7A6255] font-mono">{settings.whatsappNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D48C95] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Working Hours</span>
                  <span className="text-[#7A6255]">Monday – Sunday: 9:00 AM – 9:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D48C95] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Location</span>
                  <span className="text-[#7A6255]">Main Market Road, Local Bakery Store</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EADCD3]">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#FAF2EC] rounded-3xl p-8 border border-[#EADCD3]">
            <h3 className="font-heading text-2xl font-bold text-[#2C1A10] mb-4">
              Send an Inquiry
            </h3>

            {submitted && (
              <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#137333]/30 text-[#137333] text-xs flex items-center gap-2 mb-4">
                <Check className="w-4 h-4" /> Inquiry sent! We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7A6255] font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Verma"
                  className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#7A6255] font-bold mb-1">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#7A6255] font-bold mb-1">Message / Inquiry</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your custom order inquiry..."
                  className="w-full bg-[#FFF9F4] border border-[#EADCD3] rounded-xl px-4 py-3 text-xs text-[#2C1A10]"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminPinModal isOpen={isAdminPinModalOpen} onClose={() => setIsAdminPinModalOpen(false)} />
    </div>
  );
}
