import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

export const metadata: Metadata = {
  title: "Lush Layer | Artisanal Confections & Bespoke Cakes",
  description:
    "Lush Layer - Premium Handcrafted Gourmet Cakes, Bespoke Celebration Creations, and Artisanal Pastries. Direct WhatsApp Ordering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0D0A08] text-[#FAF7F2]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
