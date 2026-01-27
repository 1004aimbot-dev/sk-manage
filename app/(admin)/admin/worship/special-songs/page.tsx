"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function SpecialSongsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Video className="w-6 h-6" /> 특송 영상 관리
            </h2>
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                    <Video className="w-12 h-12 mb-4 opacity-50" />
                    <p>특송 영상 목록 페이지 준비 중입니다.</p>
                </CardContent>
            </Card>
        </div>
    );
}
