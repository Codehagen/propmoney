import { columns } from "@/components/ui/buildings-table/columns";
import { BuildingsTable } from "@/components/ui/buildings-table/BuildingsTable";
import { getBuildings } from "@/actions/building";
import { getCurrentUser } from "@/actions/user";
import { BuildingData } from "@/components/ui/buildings-table/columns";

export default async function BuildingsPage() {
  // Get the current authenticated user
  const currentUser = await getCurrentUser();

  // Default empty array for buildings
  let buildings: BuildingData[] = [];
  let hasData = false;

  // Only try to fetch data if we have a logged in user
  if (currentUser?.id) {
    const result = await getBuildings({ userId: currentUser.id });

    if (result.success) {
      buildings = result.data;
      hasData = buildings.length > 0;
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Bygninger
        </h1>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <BuildingsTable data={buildings} columns={columns} />
      </div>
    </>
  );
}
