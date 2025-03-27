"use client";

import { Badge, BadgeProps } from "@/components/Badge";
import { Checkbox } from "@/components/Checkbox";
import { formatters } from "@/lib/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { ConditionFilter } from "../data-table/DataTableFilter";
import { BuildingRowActions } from "./BuildingRowActions";
import { DataTableFilter } from "../data-table/DataTableFilter";
import Link from "next/link";
import { PropertyType, PropertyClass } from "@prisma/client";

// Define the Property type based on our commercial real estate schema
export type BuildingData = {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  propertyClass?: PropertyClass;
  totalBTA: number; // Total gross area in m²
  totalBRA: number; // Total usable area in m²
  unitCount?: number; // Number of units
  units?: { id: string }[]; // For counting units
  isActive: boolean;
  availabilityDate: string;
  createdAt: string;
  occupancyRate?: number; // Calculated field (percentage)
};

// Define column meta type to include filterVariant
type ColumnMeta = {
  className?: string;
  displayName: string;
  filterVariant?: "text" | "select" | "number" | "checkbox";
  options?: { label: string; value: string }[];
};

// Define commercial property types
export const propertyTypes = [
  { label: "Kontor", value: "OFFICE" },
  { label: "Butikk", value: "RETAIL" },
  { label: "Lager", value: "WAREHOUSE" },
  { label: "Industri", value: "INDUSTRIAL" },
  { label: "Kombinasjon", value: "MIXED_USE" },
  { label: "Hotell", value: "HOSPITALITY" },
  { label: "Helse", value: "HEALTHCARE" },
  { label: "Annet", value: "OTHER" },
];

// Define Norwegian cities
export const norwegianCities = [
  { label: "Oslo", value: "Oslo" },
  { label: "Bergen", value: "Bergen" },
  { label: "Trondheim", value: "Trondheim" },
  { label: "Stavanger", value: "Stavanger" },
  { label: "Tromsø", value: "Tromsø" },
  { label: "Kristiansand", value: "Kristiansand" },
  { label: "Drammen", value: "Drammen" },
];

// Status options
export const statusOptions = [
  { label: "Aktiv", value: "true" },
  { label: "Inaktiv", value: "false" },
];

// Define number conditions for area filtering
export const areaConditions = [
  { label: "Er lik", value: "is-equal-to" },
  { label: "Er mellom", value: "is-between" },
  { label: "Er større enn", value: "is-greater-than" },
  { label: "Er mindre enn", value: "is-less-than" },
];

const columnHelper = createColumnHelper<BuildingData>();

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Velg alle"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Velg rad"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Velg",
    } as ColumnMeta,
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eiendom" />
    ),
    enableSorting: true,
    filterFn: "includesString",
    meta: {
      className: "text-left",
      displayName: "Eiendom",
      filterVariant: "text",
    } as ColumnMeta,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const { address, city, zipCode, id } = row.original;

      return (
        <Link
          href={`/buildings/${id}`}
          className="block hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-500">{`${address}, ${city} ${zipCode}`}</div>
        </Link>
      );
    },
  }),
  columnHelper.accessor("propertyType", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: true,
    filterFn: "equals",
    meta: {
      className: "text-left",
      displayName: "Type",
      filterVariant: "select",
      options: propertyTypes,
    } as ColumnMeta,
    cell: ({ row }) => {
      const propertyType = row.getValue("propertyType") as PropertyType;

      // Map enum value to display label
      const typeLabel =
        propertyTypes.find((t) => t.value === propertyType)?.label ||
        propertyType;

      return <span>{typeLabel}</span>;
    },
  }),
  columnHelper.accessor("totalBTA", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Areal (BTA)" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Areal (BTA)",
      filterVariant: "number",
      options: areaConditions,
    } as ColumnMeta,
    cell: ({ getValue }) => {
      const bta = getValue() as number;
      return <span className="font-medium">{formatters.number(bta)} m²</span>;
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number;
      const [min, max] = filterValue.value as [number, number];

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min;
        case "is-between":
          return value >= min && value <= max;
        case "is-greater-than":
          return value > min;
        case "is-less-than":
          return value < min;
        default:
          return true;
      }
    },
  }),
  columnHelper.accessor((row) => row.units?.length || 0, {
    id: "unitCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Antall enheter" />
    ),
    enableSorting: true,
    meta: {
      className: "text-center",
      displayName: "Antall enheter",
    } as ColumnMeta,
  }),
  columnHelper.accessor((row) => row.occupancyRate || 0, {
    id: "occupancyRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Utleiegrad" />
    ),
    enableSorting: true,
    meta: {
      className: "text-center",
      displayName: "Utleiegrad",
    } as ColumnMeta,
    cell: ({ getValue }) => {
      const rate = getValue() as number;

      let variant: BadgeProps["variant"] = "default";
      if (rate >= 90) variant = "success";
      else if (rate >= 70) variant = "warning";
      else if (rate < 70) variant = "error";

      return (
        <div className="flex justify-center">
          <Badge variant={variant}>{formatters.percent(rate / 100)}</Badge>
        </div>
      );
    },
  }),
  columnHelper.accessor("isActive", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableSorting: true,
    filterFn: (row, columnId, filterValue) => {
      const isActive = row.getValue(columnId) as boolean;
      const filterBool = filterValue === "true";
      return isActive === filterBool;
    },
    meta: {
      className: "text-left",
      displayName: "Status",
      filterVariant: "select",
      options: statusOptions,
    } as ColumnMeta,
    cell: ({ getValue }) => {
      const isActive = getValue() as boolean;
      return (
        <Badge variant={isActive ? "success" : "warning"}>
          {isActive ? "Aktiv" : "Inaktiv"}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <BuildingRowActions row={row} />,
    meta: {
      className: "text-right",
      displayName: "Handlinger",
    } as ColumnMeta,
  }),
];
