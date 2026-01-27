"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Heart } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">비전/핵심가치</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <Target className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">예배의 감격</CardTitle>
          </CardHeader>
          <CardContent>
            하나님의 임재를 경험하고<br />
            영광 돌리는 예배 공동체
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardHeader>
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">다음 세대</CardTitle>
          </CardHeader>
          <CardContent>
            말씀으로 양육하며<br />
            미래의 리더를 세우는 교육 공동체
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardHeader>
            <Heart className="w-8 h-8 text-red-600 mb-2" />
            <CardTitle className="text-lg">섬김과 나눔</CardTitle>
          </CardHeader>
          <CardContent>
            지역사회를 섬기며<br />
            그리스도의 사랑을 실천하는 봉사 공동체
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>표어</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <h3 className="text-2xl font-bold text-blue-900">
            "일어나라 빛을 발하라 (사 60:1)"
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
