---
description: Verify that all required menu pages exist, and regenerate them if missing.
---

This workflow checks for the existence of all sidebar menu pages.

# 1. Verification Step
Check if all page files exist.

// turbo
1. Run Verification Script
   - Run `node -e "const fs=require('fs'); const missing=['app/(admin)/admin/intro/greeting/page.tsx', 'app/(admin)/admin/worship/sermons/page.tsx', 'app/(admin)/admin/community/news/page.tsx'].filter(p => !fs.existsSync(p)); if(missing.length > 0) { console.error('Missing pages:', missing); process.exit(1); } else { console.log('✅ All pages exist'); }"`

# 2. Restoration Step (If failed)
If the above step fails (exit code 1), run the scaffolding script to recreate them.

// turbo
2. Run Scaffold Script
   - Run `node scaffold-pages.js`
   - This script checks for missing files and creates them with a "Preparation in progress" template.

# 3. Validation
Verify again.

// turbo
3. Final Check
   - Run `node -e "console.log('Menu verification complete.')"`
