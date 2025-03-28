"use client";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { DataTable } from "@/components/ui/data-table/DataTable";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiFilterLine,
  RiSearch2Line,
} from "@remixicon/react";
import { useState } from "react";
import { TenantData, columns, tenantDemoData, tenantStatuses } from "./columns";
import { TenantRowActions } from "./TenantRowActions";
import { Input } from "@/components/Input";
import { Divider } from "@/components/Divider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import Link from "next/link";
import { Row } from "@tanstack/react-table";

// Add row actions to the columns
const columnsWithRowActions = [
  ...columns,
  {
    id: "actions",
    cell: ({ row }: { row: Row<TenantData> }) => (
      <TenantRowActions tenantId={row.original.id} />
    ),
  },
];

interface TenantsTableProps {
  data?: TenantData[];
}

export function TenantsTable({ data = tenantDemoData }: TenantsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof TenantData | null>(null);

  // Filter data based on search query and status filter
  const filteredData = data.filter((tenant) => {
    // Search filtering
    const matchesSearch =
      searchQuery === "" ||
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.organizationNumber &&
        tenant.organizationNumber.includes(searchQuery));

    // Status filtering
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(tenant.status);

    return matchesSearch && matchesStatus;
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (
      (typeof aValue === "number" || typeof aValue === "boolean") &&
      (typeof bValue === "number" || typeof bValue === "boolean")
    ) {
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    return 0;
  });

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Handle sort change
  const handleSortChange = (field: keyof TenantData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Søk etter leietakere..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <RiSearch2Line className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                <RiFilterLine className="size-5" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenantStatuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  className="flex items-center gap-2"
                  onClick={() => handleStatusFilterChange(status.value)}
                >
                  <Checkbox
                    checked={statusFilter.includes(status.value)}
                    onCheckedChange={() => {}}
                    className="mr-2"
                    aria-label={`Filter by ${status.label}`}
                  />
                  <Badge variant={status.color as "success" | "warning"}>
                    {status.label}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                {sortDirection === "asc" ? (
                  <RiArrowUpLine className="size-5" />
                ) : (
                  <RiArrowDownLine className="size-5" />
                )}
                Sorter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sorter etter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSortChange("name")}>
                Navn
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("totalRentedArea")}
              >
                Leid areal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("monthlyRent")}>
                Månedlig leie
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("leaseEnd")}>
                Leieavslutning
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("remainingDays")}
              >
                Gjenstående tid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/tenants/add">
            <Button className="flex items-center gap-2">
              <RiAddLine className="size-5" />
              Legg til leietaker
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg">
        <DataTable data={sortedData} columns={columnsWithRowActions} />
      </div>

      <div className="mt-2 text-center text-sm text-gray-500">
        Viser {filteredData.length} av {data.length} leietakere
      </div>
    </div>
  );
}
