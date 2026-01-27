"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">오시는 길</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>교회 위치</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border">
              {/* 지도 API 연동 시 여기에 지도 표시 */}
              <span className="text-slate-500">지도 영역 (카카오맵/네이버지도 연동 필요)</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-1" />
              <div>
                <h4 className="font-semibold">주소</h4>
                <p className="text-slate-600">경기도 성남시 ... (상세 주소 필요)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연락처 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold">전화번호</h4>
                <p className="text-lg">031-000-0000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold">이메일</h4>
                <p>info@sk-church.or.kr</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
              <strong>교통편 안내</strong><br />
              - 버스: ...<br />
              - 지하철: ...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
