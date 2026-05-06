-- FINAL SECURITY MIGRATION: RLS & PERMISSIONS
-- Role: Senior DBA / Security Engineer
-- Target: Beauty Bees DB
-- Objective: Fix persistence errors & lock down the backend

BEGIN;

-- ==========================================
-- 1. SECURITY HELPERS
-- ==========================================

-- Verifies if the authenticated user has the 'admin' role in the public.User table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."User" 
    WHERE id = auth.uid()::text AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 2. DATABASE TABLES (Product & Brand)
-- ==========================================

-- Enable Row Level Security
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;

-- Product Policies
DROP POLICY IF EXISTS "Public Read Product" ON "Product";
CREATE POLICY "Public Read Product" ON "Product" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Product" ON "Product";
CREATE POLICY "Admin Manage Product" ON "Product" 
FOR ALL TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Brand Policies
DROP POLICY IF EXISTS "Public Read Brand" ON "Brand";
CREATE POLICY "Public Read Brand" ON "Brand" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Brand" ON "Brand";
CREATE POLICY "Admin Manage Brand" ON "Brand" 
FOR ALL TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());


-- ==========================================
-- 3. STORAGE BUCKETS (products, brands, branding)
-- ==========================================

-- Ensure storage buckets exist and are public for display
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('products', 'products', true, 52428800), -- 50MB
  ('brands', 'brands', true, 5242880),       -- 5MB
  ('branding', 'branding', true, 5242880)    -- 5MB (for site logo)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Storage Read Policy: Anyone can view
DROP POLICY IF EXISTS "Public Select Storage" ON storage.objects;
CREATE POLICY "Public Select Storage" ON storage.objects
FOR SELECT USING (bucket_id IN ('products', 'brands', 'branding'));

-- Storage Write Policy: Only authenticated admins can manage
DROP POLICY IF EXISTS "Admin Manage Storage" ON storage.objects;
CREATE POLICY "Admin Manage Storage" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id IN ('products', 'brands', 'branding') AND public.is_admin())
WITH CHECK (bucket_id IN ('products', 'brands', 'branding') AND public.is_admin());

COMMIT;

-- VERIFICATION SUMMARY:
-- 1. public.Product & public.Brand are now secured by RLS.
-- 2. Storage buckets 'products', 'brands', and 'branding' are initialized with public access.
-- 3. Logo Ghosting Fix: 'branding' bucket is now explicitly authorized for public read.

