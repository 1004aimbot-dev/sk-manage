"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function WorshipGuidePage() {
  const schedules = [
    { name: "주일 1부 예배", time: "오전 7:00", place: "본당 3층 대예배실" },
    { name: "주일 2부 예배", time: "오전 9:00", place: "본당 3층 대예배실" },
    { name: "주일 3부 예배", time: "오전 11:00", place: "본당 3층 대예배실" },
    { name: "주일 오후 예배", time: "오후 2:00", place: "본당 3층 대예배실" },
    { name: "수요 예배", time: "오후 7:30", place: "본당 3층 대예배실" },
    { name: "금요 기도회", time: "오후 9:00", place: "본당 3층 대예배실" },
    { name: "새벽 기도회", time: "오전 5:00", place: "본당 3층 대예배실" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">예배 안내</h2>

      <Card>
        <CardHeader>
          <CardTitle>공예배 및 기도회 시간</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">구분</TableHead>
                <TableHead>시간</TableHead>
                <TableHead>장소</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.place}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-500 mt-4">
        * 청년부, 교회학교 예배 시간은 '다음세대' 메뉴를 참고해주세요.
      </div>
    </div>
  );
}
