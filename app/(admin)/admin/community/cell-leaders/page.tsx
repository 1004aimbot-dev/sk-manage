import { CellLeaderManagement } from "@/components/admin/community/CellLeaderManagement";
import { getCellLeaders } from "@/actions/cell-leader-actions";

export default async function Page() {
    const { data } = await getCellLeaders();

    // Convert Date objects to strings for Client Component
    const formattedData = data?.map(leader => ({
        ...leader,
        id: leader.id,
        // Ensure all required fields are present; optional fields can be null/undefined
        name: leader.name,
        district: leader.district || "",
        cellName: leader.cellName || "",
        region: leader.region || "",
        phone: leader.phone || "",
        appointedDate: leader.appointedDate ? leader.appointedDate.toISOString().split('T')[0] : "",
    })) || [];

    return <CellLeaderManagement initialData={formattedData} />;
}
