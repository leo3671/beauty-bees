-- Supabase Security Fix: Enable Row-Level Security (RLS)
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable RLS for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiscountVoucher" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShippingZone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;

-- 2. Define Public Access Policies (Read-only for public data)

-- Product: Allow everyone to view products
CREATE POLICY "Allow public read access for Product" ON "Product"
  FOR SELECT USING (true);

-- Brand: Allow everyone to view brands
CREATE POLICY "Allow public read access for Brand" ON "Brand"
  FOR SELECT USING (true);

-- ShippingZone: Allow everyone to view shipping zones
CREATE POLICY "Allow public read access for ShippingZone" ON "ShippingZone"
  FOR SELECT USING (true);

-- Review: Allow everyone to view reviews
CREATE POLICY "Allow public read access for Review" ON "Review"
  FOR SELECT USING (true);

-- 3. Lockdown Sensitive Tables
-- User, Order, OrderItem, VerificationToken, DiscountVoucher, ChatSession, ChatMessage
-- By enabling RLS and NOT adding any policies, these tables are completely locked
-- down to the public API. Prisma will still work because it uses the admin role.

-- NOTE: If you decide to use Supabase Auth for client-side queries later,
-- you will need to add specific policies for these tables (e.g., "auth.uid() = id").
