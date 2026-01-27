const fs = require('fs');
const path = require('path');

const pages = [
    'app/(admin)/admin/intro/greeting/page.tsx',
    'app/(admin)/admin/intro/vision/page.tsx',
    'app/(admin)/admin/intro/training/page.tsx',
    'app/(admin)/admin/intro/history/page.tsx',
    'app/(admin)/admin/intro/people/page.tsx',
    'app/(admin)/admin/intro/guide/page.tsx',
    'app/(admin)/admin/intro/facilities/page.tsx',
    'app/(admin)/admin/intro/location/page.tsx',

    'app/(admin)/admin/worship/sermons/page.tsx',
    // 'app/(admin)/admin/worship/choir/page.tsx', // Exists

    'app/(admin)/admin/next-gen/preschool/page.tsx',
    'app/(admin)/admin/next-gen/elementary/page.tsx',
    'app/(admin)/admin/next-gen/youth/page.tsx',
    'app/(admin)/admin/next-gen/young-adult/page.tsx',

    'app/(admin)/admin/ministry/domestic/page.tsx',
    'app/(admin)/admin/ministry/overseas/page.tsx',
    'app/(admin)/admin/ministry/committees/page.tsx',
    'app/(admin)/admin/ministry/men/page.tsx',
    'app/(admin)/admin/ministry/women/page.tsx',

    'app/(admin)/admin/community/bulletin/page.tsx',
    'app/(admin)/admin/community/album/page.tsx',
    'app/(admin)/admin/community/newcomers/page.tsx',
    'app/(admin)/admin/community/news/page.tsx',
    'app/(admin)/admin/community/resources/page.tsx',
];

const template = (title) => `"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">${title}</h2>
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-slate-400 bg-slate-50 border-dashed">
          <Construction className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">페이지 준비 중입니다</p>
          <p className="text-sm">이 메뉴는 아직 구현되지 않았습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
`;

pages.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(fullPath)) {
        // Extract title from path (e.g., 'greeting' -> 'Greeting')
        const parts = filePath.split('/');
        const folderName = parts[parts.length - 2];
        const title = folderName.charAt(0).toUpperCase() + folderName.slice(1);

        fs.writeFileSync(fullPath, template(title));
        console.log(`Created: ${filePath}`);
    } else {
        console.log(`Skipped (exists): ${filePath}`);
    }
});
