import { TenantsPage } from "@/components/tenant/TenantsPage";

interface TenantsPageProps {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function TenantsRoute({ searchParams }: TenantsPageProps) {
  return <TenantsPage userId="demo-user" />;
}
