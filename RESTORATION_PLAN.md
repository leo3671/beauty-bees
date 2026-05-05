# Beauty Bees Cosmetics: Disaster Recovery & Restoration Plan

In the event of data loss or server failure, follow these steps to restore the platform to a stable state.

## 1. Code Restoration
The source code is maintained in a private GitHub repository.
- **Repository**: `beauty-bees`
- **Command**: `git pull origin main`
- **Deploy**: `vercel --prod`

## 2. Database Restoration (Supabase)
Supabase provides automated daily backups. 
- Access the [Supabase Dashboard](https://app.supabase.com)
- Go to **Database > Backups**
- Select the desired point-in-time and click **Restore**

## 3. Manual Data Injection (JSON Backup)
If a granular restoration is needed (e.g., accidental deletion of specific products), use the local JSON backups.
- Backups are stored in the `/backups` directory.
- Run the restoration script (to be implemented if needed) to parse the JSON and upsert to Prisma.

## 4. Disaster Recovery Contacts
- **Tech Lead**: Antigravity AI
- **Database Provider**: Supabase Support
- **Hosting Provider**: Vercel Status Page

## 5. Daily Backup Schedule
- **Automated**: Supabase Daily Snapshots (Midnight UTC)
- **Manual**: Run `node scripts/backup-db.js` before any major deployment.
