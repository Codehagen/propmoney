"use client";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DataTable } from "@/components/ui/data-table/DataTable";
import {
  TenantData,
  tenantDemoData,
} from "@/components/ui/tenants-table/columns";
import { formatters } from "@/lib/utils";
import {
  RiArrowLeftLine,
  RiEditLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiBuilding2Line,
  RiCalendarCheckLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChartSupport } from "@/components/LineChartSupport";

// Define tabs for tenant details
const tabs = [
  { id: "overview", label: "Oversikt" },
  { id: "units", label: "Enheter" },
  { id: "payments", label: "Betalinger" },
  { id: "invoices", label: "Fakturaer" },
  { id: "documents", label: "Dokumenter" },
  { id: "settings", label: "Innstillinger" },
];

// Mock data for payment history
const paymentHistory = [
  { date: "Jan", amount: 45000, onTime: true },
  { date: "Feb", amount: 45000, onTime: true },
  { date: "Mar", amount: 45000, onTime: true },
  { date: "Apr", amount: 45000, onTime: false },
  { date: "May", amount: 45000, onTime: true },
  { date: "Jun", amount: 45000, onTime: true },
];

// Mock data for units
const unitData = [
  {
    id: "1",
    unitNumber: "A101",
    description: "Kontorlokale 1. etasje",
    building: "Storgata 1",
    bra: 150,
    rentPerSqm: 1800,
    monthlyRent: 22500,
    leaseStart: "2023-01-15",
    leaseEnd: "2024-01-14",
  },
  {
    id: "2",
    unitNumber: "B202",
    description: "Kontorlokale 2. etasje",
    building: "Storgata 1",
    bra: 100,
    rentPerSqm: 1700,
    monthlyRent: 14167,
    leaseStart: "2023-03-01",
    leaseEnd: "2024-02-28",
  },
];

// Define columns for the units table
const unitColumns = [
  {
    accessorKey: "unitNumber",
    header: "Enhet",
  },
  {
    accessorKey: "description",
    header: "Beskrivelse",
  },
  {
    accessorKey: "building",
    header: "Bygning",
  },
  {
    accessorKey: "bra",
    header: "Areal (BRA)",
    cell: ({ row }: { row: any }) =>
      `${formatters.number(row.getValue("bra"))} m²`,
  },
  {
    accessorKey: "rentPerSqm",
    header: "Pris per m²",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("rentPerSqm"), "NOK"),
  },
  {
    accessorKey: "monthlyRent",
    header: "Månedlig leie",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("monthlyRent"), "NOK"),
  },
  {
    accessorKey: "leaseStart",
    header: "Leiestart",
    cell: ({ row }: { row: any }) =>
      formatters.date(row.getValue("leaseStart")),
  },
  {
    accessorKey: "leaseEnd",
    header: "Leieavslutning",
    cell: ({ row }: { row: any }) => formatters.date(row.getValue("leaseEnd")),
  },
];

// Define columns for the payments table
const paymentColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Dato",
    cell: ({ row }: { row: any }) => formatters.date(row.getValue("date")),
  },
  {
    accessorKey: "amount",
    header: "Beløp",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("amount"), "NOK"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "paid"
              ? "success"
              : status === "pending"
                ? "warning"
                : "error"
          }
        >
          {status === "paid"
            ? "Betalt"
            : status === "pending"
              ? "Venter"
              : "Forfalt"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Forfallsdato",
    cell: ({ row }: { row: any }) => formatters.date(row.getValue("dueDate")),
  },
  {
    accessorKey: "paidDate",
    header: "Betalt dato",
    cell: ({ row }: { row: any }) => {
      const paidDate = row.getValue("paidDate");
      return paidDate ? formatters.date(paidDate) : "—";
    },
  },
];

// Mock data for payments
const payments = [
  {
    id: "P001",
    date: "2023-01-01",
    amount: 45000,
    status: "paid",
    dueDate: "2023-01-15",
    paidDate: "2023-01-10",
  },
  {
    id: "P002",
    date: "2023-02-01",
    amount: 45000,
    status: "paid",
    dueDate: "2023-02-15",
    paidDate: "2023-02-12",
  },
  {
    id: "P003",
    date: "2023-03-01",
    amount: 45000,
    status: "paid",
    dueDate: "2023-03-15",
    paidDate: "2023-03-14",
  },
  {
    id: "P004",
    date: "2023-04-01",
    amount: 45000,
    status: "paid",
    dueDate: "2023-04-15",
    paidDate: "2023-04-22",
  },
  {
    id: "P005",
    date: "2023-05-01",
    amount: 45000,
    status: "paid",
    dueDate: "2023-05-15",
    paidDate: "2023-05-08",
  },
  {
    id: "P006",
    date: "2023-06-01",
    amount: 45000,
    status: "pending",
    dueDate: "2023-06-15",
    paidDate: null,
  },
];

// Mock data for documents
const documents = [
  {
    id: "D001",
    name: "Leiekontrakt 2023-2024",
    type: "Kontrakt",
    date: "2022-12-20",
    size: "2.4 MB",
  },
  {
    id: "D002",
    name: "Forsikringsbevis",
    type: "Forsikring",
    date: "2022-12-22",
    size: "1.1 MB",
  },
  {
    id: "D003",
    name: "Vedlegg til leiekontrakt",
    type: "Kontrakt",
    date: "2022-12-20",
    size: "0.8 MB",
  },
  {
    id: "D004",
    name: "Selskapsregister",
    type: "Offentlig dokument",
    date: "2022-11-05",
    size: "1.3 MB",
  },
];

// Define document table columns
const documentColumns = [
  {
    accessorKey: "name",
    header: "Navn",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: "Dato",
    cell: ({ row }: { row: any }) => formatters.date(row.getValue("date")),
  },
  {
    accessorKey: "size",
    header: "Størrelse",
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" className="p-0">
        <RiFileTextLine className="size-5" />
        <span className="ml-2">Last ned</span>
      </Button>
    ),
  },
];

interface TenantDetailsPageProps {
  tenantId: string;
}

export function TenantDetailsPage({ tenantId }: TenantDetailsPageProps) {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // In a real implementation, this would fetch the tenant from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundTenant = tenantDemoData.find((t) => t.id === tenantId);
      if (foundTenant) {
        setTenant(foundTenant);
      }
      setIsLoading(false);
    }, 500);
  }, [tenantId]);

  // Calculate lease progress
  const calculateLeaseProgress = (tenant: TenantData) => {
    if (!tenant) return 0;

    const startDate = new Date(tenant.leaseStart).getTime();
    const endDate = new Date(tenant.leaseEnd).getTime();
    const now = new Date().getTime();

    const totalDuration = endDate - startDate;
    const elapsedDuration = now - startDate;

    return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (!tenant) return null;

    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Kontaktinformasjon
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <RiMailLine className="mt-0.5 size-5 shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">E-post</p>
                      <a
                        href={`mailto:${tenant.email}`}
                        className="text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {tenant.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RiPhoneLine className="mt-0.5 size-5 shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <a
                        href={`tel:${tenant.phone}`}
                        className="text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {tenant.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RiMapPinLine className="mt-0.5 size-5 shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Organisasjonsnummer
                      </p>
                      <p>{tenant.organizationNumber || "—"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Leiekontraktdetaljer
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Startdato</p>
                    <p className="font-medium">
                      {formatters.date(tenant.leaseStart)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Sluttdato</p>
                    <p className="font-medium">
                      {formatters.date(tenant.leaseEnd)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gjenstående tid</p>
                    <p className="font-medium">
                      {tenant.remainingDays > 0
                        ? `${tenant.remainingDays} dager`
                        : "Utløpt"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Framgang</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                        style={{
                          width: `${calculateLeaseProgress(tenant)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Betalingshistorikk
                </h3>
                <div className="mt-4">
                  <LineChartSupport
                    className="h-72"
                    data={paymentHistory}
                    index="date"
                    categories={["amount"]}
                    colors={["blue"]}
                    valueFormatter={(number: number) =>
                      formatters.currency(number, "NOK")
                    }
                  />
                </div>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                    <RiBuilding2Line className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Enheter
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {tenant.unitCount}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
                    <RiMapPinLine className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Total areal
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {formatters.number(tenant.totalRentedArea)} m²
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                    <RiMoneyDollarCircleLine className="size-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Månedlig leie
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {formatters.currency(tenant.monthlyRent, "NOK")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        );
      case "units":
        return (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                Enheter
              </h3>
              <Button variant="secondary" className="flex items-center gap-2">
                <RiCalendarCheckLine className="size-5" />
                Legg til enhet
              </Button>
            </div>
            <div className="rounded-lg">
              <DataTable data={unitData} columns={unitColumns} />
            </div>
          </div>
        );
      case "payments":
        return (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                Betalinger
              </h3>
              <Button variant="secondary" className="flex items-center gap-2">
                <RiFileTextLine className="size-5" />
                Eksporter til CSV
              </Button>
            </div>
            <div className="rounded-lg">
              <DataTable data={payments} columns={paymentColumns} />
            </div>
          </div>
        );
      case "documents":
        return (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                Dokumenter
              </h3>
              <Button className="flex items-center gap-2">
                <RiFileTextLine className="size-5" />
                Last opp dokument
              </Button>
            </div>
            <div className="rounded-lg">
              <DataTable data={documents} columns={documentColumns} />
            </div>
          </div>
        );
      case "invoices":
        return (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Fakturaer
            </h3>
            <p className="mt-2 text-gray-500">
              Faktura-funksjonalitet er under utvikling.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Innstillinger
            </h3>
            <p className="mt-2 text-gray-500">
              Innstillinger-funksjonalitet er under utvikling.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster leietakerdetaljer...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Kunne ikke finne leietaker</p>
      </div>
    );
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tenants">
            <Button variant="ghost" className="p-2">
              <RiArrowLeftLine className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {tenant.name}
            </h1>
            <div className="flex items-center gap-2">
              <Badge
                variant={tenant.status === "active" ? "success" : "warning"}
              >
                {tenant.status === "active" ? "Aktiv" : "Inaktiv"}
              </Badge>
              <span className="text-sm text-gray-500">
                Kunde siden {formatters.date(tenant.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2 text-base sm:text-sm"
          >
            Rediger
            <RiEditLine
              className="-mr-0.5 size-5 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>

      <Divider />

      <div className="mt-6">
        <TabNavigation className="mb-6">
          {tabs.map((tab) => (
            <TabNavigationLink
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabNavigationLink>
          ))}
        </TabNavigation>
      </div>

      {renderTabContent()}
    </main>
  );
}
