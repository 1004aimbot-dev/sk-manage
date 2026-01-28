import { CommitteeManagement } from "@/components/admin/ministry/CommitteeManagement";
import { getMinistries } from "@/actions/ministry";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { success, data } = await getMinistries('COMMITTEE');

  const committees = success && data ? data.map(c => {
    let roleInfo: any = {};
    try {
      roleInfo = c.roleInfo ? JSON.parse(c.roleInfo) : {};
    } catch (e) { }

    return {
      id: c.id,
      name: c.name,
      iconName: c.icon || "Users",
      desc: c.description || "",
      chair: roleInfo.chair,
      director: roleInfo.director,
      deputy: roleInfo.deputy,
      generalManager: roleInfo.generalManager,
      accountant: roleInfo.accountant,
      secretary: roleInfo.secretary
    };
  }) : [];

  return <CommitteeManagement initialData={committees} />;
}
