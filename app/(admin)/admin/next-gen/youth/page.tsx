"use client";

import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";

const dummyData = {
  pastor: "최소망 목사",
  director: "박열정 집사",
  deputy: "강헌신 집사",
  teachers: [
    { id: "t1", name: "송교사", role: "부장", phone: "010-9876-5432" },
    { id: "t2", name: "민교사", role: "교사", phone: "010-8765-4321" },
  ],
  students: [
    { id: "s1", name: "한중딩", role: "중2", phone: "010-1010-2020" },
    { id: "s2", name: "오고딩", role: "고1", phone: "010-3030-4040" },
  ]
};

export default function Page() {
  return <MinistryManagement title="청소년부" initialData={dummyData} departmentId="youth" />;
}
