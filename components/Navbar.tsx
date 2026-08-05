"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Lock, Sparkles, MessageCircle, Menu as MenuIcon, X, ShoppingBag, Search, MapPin } from "lucide-react";

export const Navbar: React.FC<{
  onOpenAdminPinModal: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
}> = ({ onOpenAdminPinModal, onOpenCart, cartCount = 0 }) => {
  const { settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cakes Menu", href: "/menu" },
    { label: "Custom Cake", href: "/custom-cake" },
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Announcement Bar (Winni Magenta Style) */}
      <div className="bg-[#C2185B] text-white py-1.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{settings.announcementText || "🎉 Same Day Delivery Available across India | Order on WhatsApp"}</span>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#C2185B] text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-sm">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-[#C2185B] tracking-tight">
                {settings.storeName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold -mt-1">
                Online Bakery & Gifts
              </span>
            </div>
          </Link>

          {/* Winni-Style Location / Search Input (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full flex items-center">
              <MapPin className="w-4 h-4 text-[#C2185B] absolute left-3" />
              <input
                type="text"
                placeholder="Search cakes, flavors, occasions..."
                className="w-full bg-gray-50 border border-gray-300 rounded-full pl-9 pr-10 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C2185B] focus:bg-white"
              />
              <button className="absolute right-1 w-7 h-7 rounded-full bg-[#C2185B] text-white flex items-center justify-center">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-[#FCE4EC] hover:text-[#C2185B] transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C2185B] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin PIN Access */}
            <button
              onClick={onOpenAdminPinModal}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-[#C2185B] transition-colors"
              title="Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* WhatsApp CTA (Desktop) */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex btn-primary px-4 py-2 text-xs flex items-center gap-1.5 font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Category Navigation Bar (Desktop Winni Sub-nav) */}
        <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 text-xs font-semibold text-gray-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2.5 transition-colors relative hover:text-[#C2185B] ${
                    isActive ? "text-[#C2185B] font-bold" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C2185B]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3 text-sm font-semibold animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 text-gray-800 hover:text-[#C2185B]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 btn-primary w-full text-center flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Order via WhatsApp
          </a>
        </div>
      )}

      {/* Floating Sticky Mobile CTA */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-5 py-3 text-xs shadow-xl flex items-center gap-2 border border-white"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order Now</span>
        </a>
      </div>
    </>
  );
};
