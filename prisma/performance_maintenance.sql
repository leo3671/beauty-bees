-- =====================================================================
-- Beauty Bees Cosmetics - Supabase PostgreSQL Performance & Maintenance
-- =====================================================================
-- Execute the following scripts in the Supabase SQL Editor to optimize 
-- query speeds and clean up storage.
-- =====================================================================

------------------------------------------------------------------------
-- 1. Create Partial Indexes
------------------------------------------------------------------------
-- Purpose: Speed up common e-commerce filters without indexing the 
-- entire table, keeping the index storage footprint small.

-- Index 1: Partial index for Pending Orders (admin dashboard filter)
-- Prevents scanning all completed/delivered orders.
CREATE INDEX IF NOT EXISTS idx_orders_pending 
ON "Order" (id, date) 
WHERE status = 'Pending';

-- Index 2: Partial index for Out of Stock Products
-- Accelerates stock checking alerts and "Notify Me" forms.
CREATE INDEX IF NOT EXISTS idx_products_out_of_stock 
ON "Product" (id) 
WHERE stock = 0;

-- Index 3: Partial index for New Arrivals
-- Speeds up homepage new product tabs.
CREATE INDEX IF NOT EXISTS idx_products_new_arrivals 
ON "Product" (id) 
WHERE "isNew" = true;


------------------------------------------------------------------------
-- 2. Identify Unused Indexes
------------------------------------------------------------------------
-- Purpose: Finds indexes that are taking up disk space but have 
-- never been read by queries (excluding primary keys/unique constraints).

SELECT
    schemaname AS schema,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan AS index_scans_count,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
JOIN pg_index USING(indexrelid)
WHERE indisunique = false -- Exclude unique index/primary keys
  AND idx_scan = 0        -- Exclude indexes that have been scanned
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;


------------------------------------------------------------------------
-- 3. Database Cleanup & Archiving Procedure
------------------------------------------------------------------------
-- Purpose: Delete expired OTP codes, verification tokens, and 
-- old temporary records to keep the database well under the 500MB limit.

CREATE OR REPLACE FUNCTION public.cleanup_old_records()
RETURNS void AS $$
DECLARE
    deleted_tokens INT;
    deleted_notifications INT;
BEGIN
    -- 1. Delete verification tokens expired older than 30 days
    DELETE FROM "VerificationToken" 
    WHERE expires < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_tokens = ROW_COUNT;

    -- 2. Delete stock notifications older than 90 days (keeps history clean)
    DELETE FROM "StockNotification" 
    WHERE "createdAt" < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_notifications = ROW_COUNT;

    RAISE NOTICE 'Cleanup complete. Deleted % expired tokens, % old notifications.', 
                 deleted_tokens, deleted_notifications;
END;
$$ LANGUAGE plpgsql;


------------------------------------------------------------------------
-- 4. Supabase Cron Job (pg_cron)
------------------------------------------------------------------------
-- Run the cleanup function automatically every day at midnight (00:00 UTC).

-- Step A: Enable pg_cron extension if not active
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step B: Schedule the cron job
SELECT cron.schedule(
    'daily-db-cleanup-job', -- unique job name
    '0 0 * * *',            -- cron schedule (midnight daily)
    'SELECT public.cleanup_old_records();'
);

-- Note: To list scheduled cron jobs: SELECT * FROM cron.job;
-- Note: To unschedule: SELECT cron.unschedule('daily-db-cleanup-job');
