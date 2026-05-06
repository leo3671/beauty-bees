-- SUPABASE BACKEND REMEDIATION: DATABASE & STORAGE PERMISSIONS
-- Project: Beauty Bees DB
-- Engineer: Supabase Architect
-- Objective: Fix "Unable to Save" errors for Products and Brands

BEGIN;

-- ==========================================
-- 1. DATABASE TABLES (RLS & POLICIES)
-- ==========================================

-- Enable RLS
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
-- 2. STORAGE BUCKETS (INITIALIZATION)
-- ==========================================

-- Ensure the buckets exist and are public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 52428800, '{image/jpeg,image/png,image/webp,image/gif}'),
  ('brands', 'brands', true, 10485760, '{image/jpeg,image/png,image/svg+xml,image/webp}')
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ==========================================
-- 3. STORAGE POLICIES (RLS)
-- ==========================================

-- Select: Allow anyone to view images (Public)
DROP POLICY IF EXISTS "Public Select Storage" ON storage.objects;
CREATE POLICY "Public Select Storage" ON storage.objects
FOR SELECT USING (bucket_id IN ('products', 'brands'));

-- Write: Allow authenticated admins to Upload/Update/Delete
DROP POLICY IF EXISTS "Admin Manage Storage" ON storage.objects;
CREATE POLICY "Admin Manage Storage" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id IN ('products', 'brands') AND public.is_admin())
WITH CHECK (bucket_id IN ('products', 'brands') AND public.is_admin());

COMMIT;

-- SUMMARY:
-- 1. Product and Brand tables are now protected but readable by the public.
-- 2. 'products' and 'brands' storage buckets are initialized with 50MB and 10MB limits respectively.
-- 3. Writing to these tables/buckets is strictly limited to users with the 'admin' role in public.User.
