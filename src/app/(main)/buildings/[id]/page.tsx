import { getBuildingById } from "@/actions/building/get-building-by-id";
import { getCurrentUser } from "@/actions/user";
import { BuildingDetailsPage } from "@/components/building/BuildingDetailsPage";
import { notFound, redirect } from "next/navigation";

// Main page component - async server component
export default async function BuildingPage({
  params,
}: {
  params: { id: string };
}) {
  // Get current user
  const currentUser = await getCurrentUser();

  // If not logged in, redirect to login
  if (!currentUser) {
    redirect("/login");
  }

  // Get building data
  const result = await getBuildingById({
    buildingId: params.id,
    userId: currentUser.id,
  });

  // Handle error cases
  if (!result.success || !result.data) {
    notFound();
  }

  return <BuildingDetailsPage building={result.data} userId={currentUser.id} />;
}
