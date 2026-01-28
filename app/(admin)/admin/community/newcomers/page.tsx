import { NewcomerManagement } from "@/components/admin/community/NewcomerManagement";
import { getNewcomers } from "@/actions/newcomer";

export default async function Page() {
  const res = await getNewcomers();
  const initialData = res.success ? (res.data as any[]) : [];

  return <NewcomerManagement initialData={initialData} />;
}
