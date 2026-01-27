"use client";

import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";

const dummyData = {
  pastor: "김사랑 전도사",
  director: "이은혜 권사",
  deputy: "박믿음 집사",
  teachers: [
    { id: "t1", name: "김선생", role: "교사", phone: "010-1234-5678" },
    { id: "t2", name: "이선생", role: "보조교사", phone: "010-2345-6789" },
  ],
  students: [
    { id: "s1", name: "이아기", role: "4세", phone: "010-9999-8888 (부)" },
    { id: "s2", name: "최어린", role: "5세", phone: "010-7777-6666 (모)" },
    { id: "s3", name: "박유치", role: "6세", phone: "010-5555-4444 (부)" },
  ]
};

export default function Page() {
  return <MinistryManagement title="영유아유치부" initialData={dummyData} departmentId="preschool" />;
}
