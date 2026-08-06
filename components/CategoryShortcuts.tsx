"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Cake } from "lucide-react";

export const CategoryShortcuts: React.FC = () => {
  const { categories } = useStore();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white border-b border-gray-200 py-3 sm:py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
          {categories.map((item) => {
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={item.id || slug}
                href={`/category/${slug}`}
                className="group flex flex-col items-center flex-shrink-0 transition-transform duration-200 hover:-translate-y-1 w-20 sm:w-24"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-pink-200 group-hover:border-[#C2185B] p-0.5 bg-pink-50 shadow-sm transition-all flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Cake className="w-6 h-6 sm:w-7 sm:h-7 text-[#C2185B]" />
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-gray-800 group-hover:text-[#C2185B] mt-1.5 text-center leading-tight transition-colors line-clamp-2">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
