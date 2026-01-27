"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function PeoplePage() {
  const pastors = [
    { role: "담임목사", name: "홍길동", desc: "총괄 목회" },
    { role: "부목사", name: "김철수", desc: "행정 / 청년부" },
    { role: "부목사", name: "이영희", desc: "교구 / 훈련" },
    { role: "전도사", name: "박민수", desc: "초등부 / 찬양" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">섬기는 사람들</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pastors.map((person) => (
          <Card key={person.name} className="overflow-hidden">
            <div className="aspect-square bg-slate-100 flex items-center justify-center">
              <User className="w-20 h-20 text-slate-300" />
            </div>
            <CardHeader className="text-center p-4">
              <CardTitle className="text-lg">{person.name} {person.role}</CardTitle>
              <p className="text-sm text-slate-500">{person.desc}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>장로회</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            김장로, 이장로, 박장로, 최장로... (명단 준비 중)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
