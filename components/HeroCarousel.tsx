"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const HeroCarousel: React.FC = () => {
  const { settings, heroSlides } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) {
    return (
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="w-full h-[240px] sm:h-[300px] rounded-2xl bg-white border border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[#C2185B]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">
            Welcome to {settings.storeName}
          </h2>
          <p className="text-xs text-gray-600 max-w-md">
            Your homepage hero carousel is ready. Log into the secret Admin Panel to publish your signature slides!
          </p>
          <Link
            href="/menu"
            className="btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full"
          >
            Explore Cakes Menu
          </Link>
        </div>
      </section>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isExternal = slide.ctaLink?.startsWith("http");
          const slidePrice = slide.price !== undefined && slide.price !== null && Number(slide.price) > 0 ? Number(slide.price) : null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Full-bleed Cake Photo Background (100% Unobstructed Focus on Cake) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover object-center"
                />
                {/* Subtle Bottom Gradient (Light at top for cake focus, dark at very bottom edge for text) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              {/* Extreme Bottom Text & Slim Soft CTA Button Overlay */}
              <div className="relative z-10 w-full h-full p-3 sm:p-5 md:p-6 flex flex-col justify-end items-center text-center pb-4">
                <div className="max-w-xl mx-auto space-y-1">
                  
                  {/* Subtext Pill */}
                  {slide.subtext && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-[#C2185B] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-xs border border-pink-200">
                      <Sparkles className="w-2.5 h-2.5 text-[#C2185B]" />
                      <span>{slide.subtext}</span>
                    </div>
                  )}

                  {/* Headline Title */}
                  <h2 className="font-heading text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                    {slide.headline}
                  </h2>

                  {/* Ultra-Slim Soft CTA Button (Keeps Focus 100% on Cake) */}
                  <div className="pt-0.5">
                    {isExternal ? (
                      <a
                        href={slide.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-full bg-white/90 hover:bg-[#C2185B] text-[#C2185B] hover:text-white transition-all shadow-xs border border-pink-200/80 inline-flex items-center gap-1"
                      >
                        <span>{slide.ctaText || "Explore Menu"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={slide.ctaLink || "/menu"}
                        className="px-3.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-full bg-white/90 hover:bg-[#C2185B] text-[#C2185B] hover:text-white transition-all shadow-xs border border-pink-200/80 inline-flex items-center gap-1"
                      >
                        <span>{slide.ctaText || "Explore Menu"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrow Triggers */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center transition-all shadow-md backdrop-blur-xs"
              title="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center transition-all shadow-md backdrop-blur-xs"
              title="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 rounded-full transition-all ${
                    currentSlide === idx ? "w-4 bg-[#C2185B]" : "w-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
