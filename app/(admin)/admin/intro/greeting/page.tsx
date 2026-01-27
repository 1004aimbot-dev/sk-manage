"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GreetingPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">인사말</h2>
      <Card>
        <CardHeader>
          <CardTitle>환영합니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 leading-relaxed text-slate-700">
          <p>
            주님의 이름으로 환영하고 축복합니다.<br />
            성남신광교회 홈페이지를 방문해주신 여러분께 하나님의 크신 은혜와 평강이 함께 하시기를 기원합니다.
          </p>
          <p>
            우리 교회는 <strong>"하나님을 기쁘시게, 사람을 행복하게"</strong>라는 비전을 품고 <br />
            예배의 감격이 살아있는 교회, 다음 세대를 세우는 교회, 지역사회를 섬기는 교회가 되기를 소망합니다.
          </p>
          <p>
            이 공간이 성도님들의 교제와 소통의 장이 되며,<br />
            방문하시는 모든 분들에게 예수 그리스도의 복음과 사랑이 전달되는 통로가 되기를 바랍니다.
          </p>
          <div className="mt-8 font-serif font-bold text-right text-lg">
            담임목사 올림
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
