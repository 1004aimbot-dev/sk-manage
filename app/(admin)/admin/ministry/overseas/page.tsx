import { MissionaryManagement } from "@/components/admin/ministry/MissionaryManagement";
import { getMinistries } from "@/actions/ministry";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { success, data } = await getMinistries('OVERSEAS');

  const missionaries = success && data ? data.map(m => {
    let roleInfo: any = {};
    try {
      roleInfo = m.roleInfo ? JSON.parse(m.roleInfo) : {};
    } catch (e) { }

    return {
      id: m.id,
      location: m.location || "",
      name: m.name,
      spouse: roleInfo.spouse || "",
      children: roleInfo.children || "",
      believers: m.count || 0
    };
  }) : [];

  return <MissionaryManagement initialData={missionaries} />;
}
