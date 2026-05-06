-- SECURITY MIGRATION: ENABLE RLS AND SET ADMIN-ONLY WRITE POLICIES
-- Project: Beauty Bees DB
-- Date: 2026-05-06
-- Engineer: Antigravity (Senior Security Engineer)

BEGIN;

-- 1. IDENTIFY & ENABLE RLS FOR ALL TABLES
-- This block ensures RLS is active on every table in the public schema.
DO $$ 
DECLARE 
    tbl RECORD;
BEGIN
    FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl.tablename);
    END LOOP;
END $$;

-- 2. CREATE SECURITY HELPER FUNCTION
-- Checks if the requesting user has the 'admin' role in the "User" table.
-- SECURITY DEFINER ensures this runs with elevated privileges to check the User table even if it's restricted.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- We use auth.uid()::text because Prisma IDs (cuid) are strings, not UUIDs.
  SELECT role INTO user_role FROM public."User" WHERE id = auth.uid()::text;
  RETURN (user_role = 'admin');
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. APPLY POLICIES TO ALL TABLES
-- Policy Pattern: 
-- - SELECT: Open to all (Public)
-- - INSERT/UPDATE/DELETE: Restricted to authenticated users with 'admin' role.

DO $$ 
DECLARE 
    tbl RECORD;
BEGIN
    FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        -- Drop existing policies to avoid conflicts
        EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON public.%I', tbl.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Admin Write Access" ON public.%I', tbl.tablename);

        -- Create SELECT Policy
        EXECUTE format('CREATE POLICY "Public Read Access" ON public.%I FOR SELECT USING (true)', tbl.tablename);

        -- Create INSERT/UPDATE/DELETE Policy
        -- Note: We use FOR ALL to cover INSERT, UPDATE, and DELETE in one policy
        EXECUTE format('
            CREATE POLICY "Admin Write Access" ON public.%I 
            FOR ALL 
            TO authenticated 
            USING (public.is_admin())
            WITH CHECK (public.is_admin())', tbl.tablename);
    END LOOP;
END $$;

COMMIT;

-- VERIFICATION QUERIES
-- Check if RLS is enabled:
-- SELECT relname, relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r';

-- Check active policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
