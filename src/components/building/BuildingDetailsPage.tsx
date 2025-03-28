"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CategoryBar } from "@/components/CategoryBar";
import { Divider } from "@/components/Divider";
import { LineChartSupport } from "@/components/LineChartSupport";
import { ProgressCircle } from "@/components/ProgressCircle";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { BuildingData } from "@/components/ui/buildings-table/columns";
import { Badge } from "@/components/Badge";
import { formatters } from "@/lib/utils";
import { propertyTypes } from "@/components/ui/buildings-table/columns";
import {
  RiAddLine,
  RiEditLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
} from "@remixicon/react";
import React, { useState, useEffect, useCallback } from "react";
import { AddTenant } from "./AddTenant";
import { AddUnit } from "./AddUnit";
import { CamCalculator } from "./CamCalculator";
import { PropertyType } from "@prisma/client";
import {
  getBuildingUnits,
  CommercialUnitData,
} from "@/actions/building/get-building-units";

// Define an extended tenant type that includes unit information
interface ExtendedTenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  rentPaid: boolean;
  status: string;
  rentDurationDays: number;
  rentRemainingDays: number;
  unitNumber: string;
  rentedArea: number;
  monthlyRent: number;
  paymentStatus: boolean;
}

// Mock data for tenants (would come from API in real implementation)
const tenants = [
  {
    id: "1",
    name: "Johan Andersen",
    email: "johan@example.com",
    phone: "+47 951 23 456",
    leaseStart: "2023-01-15",
    leaseEnd: "2024-01-14",
    rentPaid: true,
    status: "active",
    rentDurationDays: 365,
    rentRemainingDays: 120,
  },
  {
    id: "2",
    name: "Marie Olsen",
    email: "marie@example.com",
    phone: "+47 952 34 567",
    leaseStart: "2023-03-01",
    leaseEnd: "2024-02-28",
    rentPaid: true,
    status: "active",
    rentDurationDays: 365,
    rentRemainingDays: 180,
  },
  {
    id: "3",
    name: "Lars Hansen",
    email: "lars@example.com",
    phone: "+47 953 45 678",
    leaseStart: "2023-05-10",
    leaseEnd: "2023-11-09",
    rentPaid: false,
    status: "inactive",
    rentDurationDays: 180,
    rentRemainingDays: 0,
  },
];

// Mock data for financial history
const financialHistory = [
  { date: "Jan", income: 25000, expenses: 5000 },
  { date: "Feb", income: 25000, expenses: 4800 },
  { date: "Mar", income: 25000, expenses: 6200 },
  { date: "Apr", income: 25000, expenses: 4500 },
  { date: "May", income: 25000, expenses: 7300 },
  { date: "Jun", income: 25000, expenses: 5100 },
];

// Mock data for invoices
const invoices = [
  {
    id: "1",
    tenantName: "Johan Andersen",
    amount: 12500,
    dueDate: "2023-12-01",
    status: "paid",
    paidDate: "2023-11-28",
  },
  {
    id: "2",
    tenantName: "Marie Olsen",
    amount: 9500,
    dueDate: "2023-12-01",
    status: "paid",
    paidDate: "2023-11-30",
  },
  {
    id: "3",
    tenantName: "Lars Hansen",
    amount: 7800,
    dueDate: "2023-12-01",
    status: "overdue",
    paidDate: null,
  },
  {
    id: "4",
    tenantName: "Johan Andersen",
    amount: 12500,
    dueDate: "2024-01-01",
    status: "pending",
    paidDate: null,
  },
  {
    id: "5",
    tenantName: "Marie Olsen",
    amount: 9500,
    dueDate: "2024-01-01",
    status: "pending",
    paidDate: null,
  },
];

// Define columns for the tenant table
const tenantColumns = [
  {
    accessorKey: "name",
    header: "Leietaker",
    cell: ({ row }: { row: any }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "unitNumber",
    header: "Enhet",
  },
  {
    accessorKey: "rentedArea",
    header: "Leid areal (m²)",
    cell: ({ row }: { row: any }) =>
      formatters.number(row.getValue("rentedArea")),
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
  {
    accessorKey: "remainingDays",
    header: "Gjenstående tid",
    cell: ({ row }: { row: any }) => {
      const days = row.getValue("remainingDays");
      return days > 0 ? `${days} dager` : "Utløpt";
    },
  },
  {
    accessorKey: "monthlyRent",
    header: "Månedlig leie",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("monthlyRent"), "NOK"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <Badge
        variant={row.getValue("status") === "active" ? "success" : "warning"}
      >
        {row.getValue("status") === "active" ? "Aktiv" : "Inaktiv"}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Betalingsstatus",
    cell: ({ row }: { row: any }) => (
      <Badge variant={row.getValue("paymentStatus") ? "success" : "error"}>
        {row.getValue("paymentStatus") ? "Betalt" : "Forfalt"}
      </Badge>
    ),
  },
];

// Define columns for the invoice table
const invoiceColumns = [
  {
    accessorKey: "tenantName",
    header: "Leietaker",
  },
  {
    accessorKey: "amount",
    header: "Beløp",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("amount"), "NOK"),
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.getValue("status");
      let variant: "success" | "warning" | "error" = "warning";
      let label = "Venter";

      if (status === "paid") {
        variant = "success";
        label = "Betalt";
      } else if (status === "overdue") {
        variant = "error";
        label = "Forfalt";
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
];

// Create a tenant drawer component (placeholder for now)
function TenantDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className={open ? "block" : "hidden"}>
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-lg dark:bg-gray-900">
        <h2 className="text-xl font-semibold">Legg til leietaker</h2>
        <p className="text-sm text-gray-500">
          Denne funksjonaliteten er under utvikling.
        </p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Lukk</Button>
        </div>
      </div>
    </div>
  );
}

// Define tabs
const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tenants", label: "Leietakere" },
  { id: "units", label: "Enheter" },
  { id: "invoices", label: "Faktura" },
  { id: "cam", label: "Felleskostnader" },
  { id: "settings", label: "Innstillinger" },
];

// Define columns for the commercial units table
const unitColumns = [
  {
    accessorKey: "unitNumber",
    header: "Enhet",
  },
  {
    accessorKey: "description",
    header: "Navn/beskrivelse",
    cell: ({ row }: { row: any }) => {
      const description = row.getValue("description");
      return description || "—";
    },
  },
  {
    accessorKey: "floor",
    header: "Etasje",
  },
  {
    accessorKey: "bra",
    header: "Areal (BRA)",
    cell: ({ row }: { row: any }) => `${row.getValue("bra")} m²`,
  },
  {
    accessorKey: "basePrice",
    header: "Grunnpris per m²",
    cell: ({ row }: { row: any }) =>
      formatters.currency(row.getValue("basePrice"), "NOK"),
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <Badge variant={row.getValue("isAvailable") ? "warning" : "success"}>
        {row.getValue("isAvailable") ? "Ledig" : "Utleid"}
      </Badge>
    ),
  },
  {
    accessorKey: "currentTenant",
    header: "Nåværende leietaker",
    cell: ({ row }: { row: any }) => {
      const tenant = row.getValue("currentTenant");
      return tenant ? tenant.name : "—";
    },
  },
  {
    accessorKey: "leaseExpiration",
    header: "Utløpsdato",
    cell: ({ row }: { row: any }) => {
      const date = row.getValue("leaseExpiration");
      return date ? formatters.date(date) : "—";
    },
  },
  {
    accessorKey: "commonAreaFactor",
    header: "Fellesarealfaktor",
    cell: ({ row }: { row: any }) =>
      row.getValue("commonAreaFactor").toFixed(2),
  },
  {
    accessorKey: "rent",
    header: "Månedlig leie",
    cell: ({ row }: { row: any }) => {
      const rent = row.getValue("rent");
      return rent ? formatters.currency(rent, "NOK") : "—";
    },
  },
];

// Sample commercial units data (replace with API call in production)
const commercialUnits = [
  {
    id: "1",
    unitNumber: "A101",
    floor: 1,
    bra: 120,
    basePrice: 1800,
    isAvailable: false,
    currentTenant: { id: "1", name: "Johan Andersen" },
    leaseExpiration: "2024-01-14",
    commonAreaFactor: 1.25,
    rent: 225000,
  },
  {
    id: "2",
    unitNumber: "A102",
    floor: 1,
    bra: 95,
    basePrice: 1700,
    isAvailable: false,
    currentTenant: { id: "2", name: "Marie Olsen" },
    leaseExpiration: "2024-02-28",
    commonAreaFactor: 1.25,
    rent: 168000,
  },
  {
    id: "3",
    unitNumber: "B201",
    floor: 2,
    bra: 150,
    basePrice: 2000,
    isAvailable: true,
    currentTenant: null,
    leaseExpiration: null,
    commonAreaFactor: 1.2,
    rent: null,
  },
  {
    id: "4",
    unitNumber: "B202",
    floor: 2,
    bra: 110,
    basePrice: 1900,
    isAvailable: true,
    currentTenant: null,
    leaseExpiration: null,
    commonAreaFactor: 1.2,
    rent: null,
  },
];

interface BuildingDetailsPageProps {
  building: BuildingData;
  userId: string;
}

export function BuildingDetailsPage({
  building,
  userId,
}: BuildingDetailsPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [buildingTenants, setBuildingTenants] = useState(tenants);
  const [commercialUnits, setCommercialUnits] = useState<CommercialUnitData[]>(
    []
  );
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  // Monitor table row selection and show tenant details when a row is selected
  useEffect(() => {
    // In a real implementation, we would integrate with the table's row selection
    // and navigate to tenant details when selected
    // For now we just show our existing details view on selection
    // In a production app with Next.js, we would use:
    // router.push(`/tenants/${selectedTenant.id}`);
  }, [selectedTenant]);

  // Fetch commercial units when the tab is activated
  useEffect(() => {
    if (activeTab === "units") {
      fetchCommercialUnits();
    }
  }, [activeTab, building.id]);

  const fetchCommercialUnits = async () => {
    try {
      setIsLoadingUnits(true);
      const result = await getBuildingUnits({
        buildingId: building.id,
      });

      if (result.success && result.data) {
        setCommercialUnits(result.data);
      }
    } catch (error) {
      console.error("Error fetching commercial units:", error);
    } finally {
      setIsLoadingUnits(false);
    }
  };

  // Function to show tenant details - would be used with router navigation in production
  const showTenantDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    // In a real implementation, we would navigate to the tenant detail page
    // For example with Next.js router:
    // router.push(`/tenants/${tenant.id}`);
    console.log(`Navigate to tenant details page for: ${tenant.id}`);
  };

  // Close tenant details
  const closeTenantDetails = () => {
    setSelectedTenant(null);
  };

  // Handle adding a new tenant
  const handleAddTenant = (newTenant: any) => {
    setBuildingTenants((current) => [...current, newTenant]);
  };

  // Handle adding a new unit
  const handleAddUnit = (newUnit: CommercialUnitData) => {
    setCommercialUnits((current) => [...current, newUnit]);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Building Information Cards */}
            <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Eiendomsdetaljer
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {propertyTypes.find((p) => p.value === building.propertyType)
                    ?.label || building.propertyType}
                </dd>
                <ul
                  role="list"
                  className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4 text-sm"
                >
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Klasse</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      {building.propertyClass || "Ikke spesifisert"}
                    </span>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Areal (BTA)</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      {formatters.number(building.totalBTA)} m²
                    </span>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Areal (BRA)</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      {formatters.number(building.totalBRA)} m²
                    </span>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status</span>
                    </div>
                    <span className="flex items-center gap-2">
                      <Badge
                        variant={building.isActive ? "success" : "warning"}
                      >
                        {building.isActive ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </span>
                  </li>
                </ul>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Utleie Status
                </dt>
                <div className="mt-4 flex flex-nowrap items-center justify-between gap-y-4">
                  <dd className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm">Enheter</span>
                      </div>
                      <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {building.unitCount || 0}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-sm bg-green-500 dark:bg-green-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-50">
                          Utleiegrad
                        </span>
                      </div>
                      <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {formatters.percent(
                          building.occupancyRate
                            ? building.occupancyRate / 100
                            : 0
                        )}
                      </span>
                    </div>
                  </dd>
                  <ProgressCircle
                    value={building.occupancyRate || 0}
                    radius={45}
                    strokeWidth={7}
                  />
                </div>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Finansiell Oversikt
                </dt>
                <div className="mt-4 flex items-center gap-x-8 gap-y-4">
                  <dd className="space-y-3 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm">Beregnet inntekt</span>
                      </div>
                      <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {formatters.currency(
                          ((building.occupancyRate || 0) *
                            building.totalBRA *
                            1500) /
                            100,
                          "NOK"
                        )}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-sm bg-gray-400 dark:bg-gray-600"
                          aria-hidden="true"
                        />
                        <span className="text-sm">Årlige utgifter (est.)</span>
                      </div>
                      <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {formatters.currency(building.totalBTA * 300, "NOK")}
                      </span>
                    </div>
                  </dd>
                  <LineChartSupport
                    className="h-28"
                    data={financialHistory}
                    index="date"
                    categories={["income", "expenses"]}
                    colors={["blue", "gray"]}
                    showTooltip={false}
                    valueFormatter={(number: number) =>
                      formatters.currency(number, "NOK")
                    }
                    startEndOnly={true}
                    showYAxis={false}
                    showLegend={false}
                  />
                </div>
              </Card>
            </dl>
          </>
        );
      case "tenants":
        return (
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Leietakere
              </h2>
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(true)}
              >
                <RiAddLine className="size-4" />
                Legg til leietaker
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Totalt antall leietakere
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {buildingTenants.length}
                </dd>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Total utleid areal
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatters.number(
                    (building.totalBRA * (building.occupancyRate || 0)) / 100
                  )}{" "}
                  m²
                </dd>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Gjennomsnittlig leietid
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatters.number(
                    buildingTenants.reduce(
                      (sum, t) => sum + t.rentDurationDays,
                      0
                    ) /
                      (buildingTenants.length || 1) /
                      30
                  )}{" "}
                  mnd
                </dd>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Betalingsstatus
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatters.percent(
                    buildingTenants.filter((t) => t.rentPaid).length /
                      (buildingTenants.length || 1)
                  )}
                </dd>
              </Card>
            </div>

            {buildingTenants.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-10 dark:border-gray-700">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Ingen leietakere er registrert ennå. Klikk "Legg til
                  leietaker" for å komme i gang.
                </p>
              </div>
            ) : (
              <div>
                <div className="rounded-lg">
                  <DataTable
                    data={buildingTenants.map((tenant) => {
                      // Find tenant's unit if available
                      const tenantUnit = commercialUnits.find(
                        (unit) => unit.currentTenant?.id === tenant.id
                      );

                      return {
                        ...tenant,
                        unitNumber: tenantUnit?.unitNumber || "-",
                        rentedArea: tenantUnit?.bra || 0,
                        monthlyRent:
                          tenantUnit?.rent || building.totalBRA * 150,
                        paymentStatus: tenant.rentPaid,
                        remainingDays: tenant.rentRemainingDays,
                      };
                    })}
                    columns={tenantColumns}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "units":
        return (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Enheter
              </h2>
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setIsAddUnitOpen(true)}
              >
                <RiAddLine className="size-4" />
                Legg til enhet
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Total enheter
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {commercialUnits.length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  Total areal:{" "}
                  {formatters.number(
                    commercialUnits.reduce((sum, unit) => sum + unit.bra, 0)
                  )}{" "}
                  m²
                </p>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Utleide enheter
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {commercialUnits.filter((unit) => !unit.isAvailable).length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  {formatters.percent(
                    commercialUnits.length
                      ? commercialUnits.filter((unit) => !unit.isAvailable)
                          .length / commercialUnits.length
                      : 0
                  )}
                </p>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Ledige enheter
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {commercialUnits.filter((unit) => unit.isAvailable).length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  Ledig areal:{" "}
                  {formatters.number(
                    commercialUnits
                      .filter((unit) => unit.isAvailable)
                      .reduce((sum, unit) => sum + unit.bra, 0)
                  )}{" "}
                  m²
                </p>
              </Card>
            </div>

            {isLoadingUnits ? (
              <div className="py-10 text-center">
                <p className="text-gray-500">Laster enheter...</p>
              </div>
            ) : commercialUnits.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-10 dark:border-gray-700">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Ingen enheter er registrert ennå. Klikk "Legg til enhet" for å
                  komme i gang.
                </p>
              </div>
            ) : (
              <div className="rounded-lg">
                <DataTable data={commercialUnits} columns={unitColumns} />
              </div>
            )}

            <AddUnit
              open={isAddUnitOpen}
              onOpenChange={setIsAddUnitOpen}
              buildingId={building.id}
              userId={userId}
              onAddUnit={handleAddUnit}
            />
          </div>
        );
      case "invoices":
        return (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Fakturaoversikt
              </h2>
              <Button variant="secondary" className="flex items-center gap-2">
                <RiAddLine className="size-4" />
                Opprett faktura
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Betalte fakturaer
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {invoices.filter((inv) => inv.status === "paid").length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  Total:{" "}
                  {formatters.currency(
                    invoices
                      .filter((inv) => inv.status === "paid")
                      .reduce((sum, inv) => sum + inv.amount, 0),
                    "NOK"
                  )}
                </p>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Ventende fakturaer
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  {invoices.filter((inv) => inv.status === "pending").length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  Total:{" "}
                  {formatters.currency(
                    invoices
                      .filter((inv) => inv.status === "pending")
                      .reduce((sum, inv) => sum + inv.amount, 0),
                    "NOK"
                  )}
                </p>
              </Card>

              <Card>
                <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Forfalte fakturaer
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50 text-red-500">
                  {invoices.filter((inv) => inv.status === "overdue").length}
                </dd>
                <p className="mt-2 text-sm text-gray-500">
                  Total:{" "}
                  {formatters.currency(
                    invoices
                      .filter((inv) => inv.status === "overdue")
                      .reduce((sum, inv) => sum + inv.amount, 0),
                    "NOK"
                  )}
                </p>
              </Card>
            </div>

            <div className="rounded-lg">
              <DataTable data={invoices} columns={invoiceColumns} />
            </div>
          </div>
        );
      case "cam":
        return (
          <CamCalculator
            buildingId={building.id}
            buildingTotalBRA={building.totalBRA}
            userId={userId}
          />
        );
      case "settings":
        return (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Innstillinger
            </h2>
            <p className="mt-2 text-gray-500">
              Innstillinger-funksjonalitet er under utvikling.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            {building.title}
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            {building.address}, {building.city} {building.zipCode}
          </p>
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
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-base sm:text-sm"
          >
            Legg til leietaker
            <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
          </Button>
        </div>
        <AddTenant
          open={isOpen}
          onOpenChange={setIsOpen}
          buildingId={building.id}
          userId={userId}
          onAddTenant={handleAddTenant}
        />
      </div>
      <Divider />

      {/* Tab Navigation */}
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

      {/* Tab Content */}
      {renderTabContent()}
    </main>
  );
}
