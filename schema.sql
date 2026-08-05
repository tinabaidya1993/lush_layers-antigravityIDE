-- =============================================
-- Lush Layer PostgreSQL / Supabase Schema
-- =============================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products / Cakes Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    images TEXT[] DEFAULT '{}',
    flavors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    is_eggless BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '919876543210',
    store_name VARCHAR(255) NOT NULL DEFAULT 'Lush Layer',
    tagline VARCHAR(255) DEFAULT 'Artisanal Confections & Bespoke Cakes',
    admin_pin VARCHAR(50) DEFAULT '7890',
    announcement_text TEXT DEFAULT '✨ Freshly baked on order | Direct WhatsApp Ordering Available',
    currency VARCHAR(10) DEFAULT '₹',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
