"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  const history = [
    { year: "2024", content: "교회 본당 리모델링 완료" },
    { year: "2023", content: "다음세대 비전센터 개관" },
    { year: "2020", content: "창립 40주년 기념 예배" },
    { year: "2010", content: "새 성전 건축 및 입당" },
    { year: "2000", content: "지역사회 섬김 센터 오픈" },
    { year: "1980", content: "성남신광교회 개척 (초대 담임목사 부임)" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">연혁</h2>
      <Card>
        <CardHeader>
          <CardTitle>걸어온 길</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-slate-200 ml-3 space-y-10 py-4">
            {history.map((item, index) => (
              <div key={index} className="relative pl-8">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-lg font-bold text-blue-900">{item.year}</span>
                  <p className="text-slate-700">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
