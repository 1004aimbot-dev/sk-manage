"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function FacilitiesPage() {
  const floors = [
    { floor: "3F", facil: "대예배실, 방송실, 자모실" },
    { floor: "2F", facil: "중예배실, 찬양대연습실, 제1-3교육실" },
    { floor: "1F", facil: "교회사무실, 목양실, 카페, 소예배실" },
    { floor: "B1", facil: "비전홀(식당), 주차장" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">시설안내</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>층별 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {floors.map((item) => (
              <div key={item.floor} className="flex border-b pb-4 last:border-0 last:pb-0">
                <div className="w-12 font-bold text-blue-600 text-xl">{item.floor}</div>
                <div className="text-slate-700">{item.facil}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>주요 시설 사진</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-video bg-slate-100 rounded flex items-center justify-center">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
