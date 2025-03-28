import { TenantDetailsPage } from "@/components/tenant/TenantDetailsPage";

interface TenantDetailsRouteProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function TenantDetailsRoute({
  params,
  searchParams,
}: TenantDetailsRouteProps) {
  return <TenantDetailsPage tenantId={params.id} />;
}
