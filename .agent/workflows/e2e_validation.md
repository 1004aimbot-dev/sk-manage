---
description: Run a full end-to-end validation of the Church Management System to ensure all modules are functioning correctly.
---

This workflow validates the core components of the system: Database, Authentication, and UI Modules.

# 1. Database & Schema Validation
First, we ensure the database schema is up-to-date and the connection is stable.

// turbo
1. Validate Prisma Schema
   - Run `npx prisma validate` to check `schema.prisma` syntax.
   - If error, print "Schema Error".

// turbo
2. Check Database Connectivity
   - Run `npx prisma db pull` (dry-run) or a simple query script to verify `dev.db` access.
   - Run `node -e 'require("@prisma/client").PrismaClient().$connect().then(() => console.log("DB Connected")).catch(e => { console.error(e); process.exit(1); })'`

# 2. Build & Type Check
Ensure the application code compiles without TypeScript errors.

// turbo
3. Type Check
   - Run `npx tsc --noEmit` to verify type integrity.
   - **Fix Strategy**: If this step fails, read the error log and fix specific missing types or imports (e.g., `lib/utils` or `auth` exports).

// turbo
4. Build Test
   - Run `npm run build` to ensure the production build succeeds.
   - This validates all pages, layouts, and components.

# 3. Server Health & Route Verification
Verify that the `dev` server can start and critical routes respond with 200 OK.

// turbo
5. Start Server (Background)
   - Run `npm run dev` in the background.
   - Wait 10 seconds for startup.

// turbo
6. Health Check (Curl)
   - Use `curl -I http://localhost:3000/admin` to assert 200 OK (or 307 Redirect if not logged in).
   - Use `curl -I http://localhost:3000/api/auth/session` to verify Auth API.

# 4. Rollback & Recovery (Manual Trigger)
If any of the above steps fail significantly (e.g., Build Failed), follow this recovery procedure:

- **Auth Error**: Re-apply `v4` downgrade to `auth.ts` and `route.ts`.
- **Import Error**: Verify `tsconfig.json` paths and `lib/utils.ts` existence.
- **Port Conflict**: Run `taskkill /F /IM node.exe` and restart.

---
**Success Criteria**: All steps 1-4 must pass. If successful, print "✅ SYSTEM INTEGRITY VERIFIED".
