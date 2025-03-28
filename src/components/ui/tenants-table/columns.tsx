import { Badge } from "@/components/Badge";
import { formatters } from "@/lib/utils";
import { PropertyType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// Define the tenant status types
export const tenantStatuses = [
  { value: "active", label: "Aktiv", color: "success" },
  { value: "inactive", label: "Inaktiv", color: "warning" },
];

// Define the tenant data interface
export interface TenantData {
  id: string;
  name: string;
  organizationNumber?: string;
  email: string;
  phone?: string;
  status: string;
  totalRentedArea: number;
  buildingCount: number;
  unitCount: number;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  paymentStatus: boolean;
  remainingDays: number;
  createdAt: string;
}

// Columns definition for the tenants table
export const columns: ColumnDef<TenantData>[] = [
  {
    accessorKey: "name",
    header: "Navn",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "organizationNumber",
    header: "Org. nummer",
    cell: ({ row }) => {
      const orgNumber = row.getValue("organizationNumber");
      return orgNumber || "—";
    },
  },
  {
    accessorKey: "totalRentedArea",
    header: "Leid areal (m²)",
    cell: ({ row }) => formatters.number(row.getValue("totalRentedArea")),
  },
  {
    accessorKey: "buildingCount",
    header: "Bygninger",
    cell: ({ row }) => row.getValue("buildingCount"),
  },
  {
    accessorKey: "unitCount",
    header: "Enheter",
    cell: ({ row }) => row.getValue("unitCount"),
  },
  {
    accessorKey: "monthlyRent",
    header: "Månedlig leie",
    cell: ({ row }) => formatters.currency(row.getValue("monthlyRent"), "NOK"),
  },
  {
    accessorKey: "leaseEnd",
    header: "Leieavslutning",
    cell: ({ row }) => formatters.date(row.getValue("leaseEnd")),
  },
  {
    accessorKey: "remainingDays",
    header: "Gjenstående tid",
    cell: ({ row }) => {
      const days = row.getValue("remainingDays") as number;
      return days > 0 ? `${days} dager` : "Utløpt";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const tenantStatus = tenantStatuses.find((s) => s.value === status);

      return (
        <Badge variant={tenantStatus?.color as "success" | "warning" | "error"}>
          {tenantStatus?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Betalingsstatus",
    cell: ({ row }) => (
      <Badge variant={row.getValue("paymentStatus") ? "success" : "error"}>
        {row.getValue("paymentStatus") ? "Betalt" : "Forfalt"}
      </Badge>
    ),
  },
];

// Simple tenant data for demo purposes
export const tenantDemoData: TenantData[] = [
  {
    id: "1",
    name: "Johan Andersen AS",
    organizationNumber: "987654321",
    email: "johan@example.com",
    phone: "+47 951 23 456",
    status: "active",
    totalRentedArea: 250,
    buildingCount: 1,
    unitCount: 2,
    monthlyRent: 45000,
    leaseStart: "2023-01-15",
    leaseEnd: "2024-01-14",
    paymentStatus: true,
    remainingDays: 120,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    name: "Marie Olsen Rådgivning",
    organizationNumber: "876543210",
    email: "marie@example.com",
    phone: "+47 952 34 567",
    status: "active",
    totalRentedArea: 180,
    buildingCount: 1,
    unitCount: 1,
    monthlyRent: 32000,
    leaseStart: "2023-03-01",
    leaseEnd: "2024-02-28",
    paymentStatus: true,
    remainingDays: 180,
    createdAt: "2023-02-15",
  },
  {
    id: "3",
    name: "Lars Hansen Teknologi",
    organizationNumber: "765432109",
    email: "lars@example.com",
    phone: "+47 953 45 678",
    status: "inactive",
    totalRentedArea: 120,
    buildingCount: 1,
    unitCount: 1,
    monthlyRent: 28000,
    leaseStart: "2023-05-10",
    leaseEnd: "2023-11-09",
    paymentStatus: false,
    remainingDays: 0,
    createdAt: "2023-04-20",
  },
  {
    id: "4",
    name: "Eriksen Eiendom",
    organizationNumber: "654321098",
    email: "eriksen@example.com",
    phone: "+47 954 56 789",
    status: "active",
    totalRentedArea: 420,
    buildingCount: 2,
    unitCount: 3,
    monthlyRent: 76000,
    leaseStart: "2023-02-01",
    leaseEnd: "2025-01-31",
    paymentStatus: true,
    remainingDays: 450,
    createdAt: "2023-01-15",
  },
  {
    id: "5",
    name: "Simonsen Butikk",
    organizationNumber: "543210987",
    email: "simonsen@example.com",
    phone: "+47 955 67 890",
    status: "active",
    totalRentedArea: 95,
    buildingCount: 1,
    unitCount: 1,
    monthlyRent: 22000,
    leaseStart: "2023-06-15",
    leaseEnd: "2024-06-14",
    paymentStatus: false,
    remainingDays: 260,
    createdAt: "2023-06-01",
  },
];
