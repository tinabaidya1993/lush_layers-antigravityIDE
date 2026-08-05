"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Cake } from "lucide-react";

export const CategoryShortcuts: React.FC = () => {
  const { categories } = useStore();

  if (categories.length === 0) {
    return null; // Start completely empty until categories are added from Admin Panel
  }

  return (
    <section className="w-full bg-white border-b border-gray-200 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((item) => {
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={item.id || slug}
                href={`/category/${slug}`}
                className="group flex flex-col items-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-pink-200 group-hover:border-[#C2185B] p-0.5 bg-pink-50 shadow-xs transition-colors flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Cake className="w-8 h-8 text-[#C2185B]" />
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-[#C2185B] mt-2 text-center max-w-[84px] line-clamp-1 transition-colors">
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
