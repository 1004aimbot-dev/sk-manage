"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Training</h2>
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
