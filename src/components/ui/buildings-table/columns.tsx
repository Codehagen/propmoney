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

// Define the Property type based on our schema
export type BuildingData = {
  id: string;
  title: string; // Keep in type but don't show in table
  address: string;
  city: string;
  state: string; // Keep in type but don't show in table
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  price: number; // This is now rental price
  isActive: boolean;
  availabilityDate: string;
  createdAt: string; // Keep in type but don't show in table
};

// Define column meta type to include filterVariant
type ColumnMeta = {
  className?: string;
  displayName: string;
  filterVariant?: "text" | "select" | "number" | "checkbox";
  options?: { label: string; value: string }[];
};

// Define property types available in Norway
export const propertyTypes = [
  { label: "Leilighet", value: "Leilighet" },
  { label: "Enebolig", value: "Enebolig" },
  { label: "Rekkehus", value: "Rekkehus" },
  { label: "Tomannsbolig", value: "Tomannsbolig" },
  { label: "Fritidsbolig", value: "Fritidsbolig" },
  { label: "Hytte", value: "Hytte" },
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

// Define number conditions for price filtering
export const priceConditions = [
  { label: "Er lik", value: "is-equal-to" },
  { label: "Er mellom", value: "is-between" },
  { label: "Er større enn", value: "is-greater-than" },
  { label: "Er mindre enn", value: "is-less-than" },
];

export const bedroomOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5" },
];

export const bathroomOptions = [
  { label: "1", value: "1" },
  { label: "1.5", value: "1.5" },
  { label: "2", value: "2" },
  { label: "2.5", value: "2.5" },
  { label: "3+", value: "3" },
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
  columnHelper.accessor("address", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse" />
    ),
    enableSorting: true,
    filterFn: "includesString",
    meta: {
      className: "text-left",
      displayName: "Adresse",
      filterVariant: "text",
    } as ColumnMeta,
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      const city = row.getValue("city") as string;
      const zipCode = row.getValue("zipCode") as string;
      const id = row.original.id;

      return (
        <Link
          href={`/buildings/${id}`}
          className="block hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <div className="font-medium">{address}</div>
          <div className="text-xs text-gray-500">{`${city} ${zipCode}`}</div>
        </Link>
      );
    },
  }),
  columnHelper.accessor("city", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="By" />
    ),
    enableSorting: true,
    filterFn: "equals",
    meta: {
      className: "text-left",
      displayName: "By",
      filterVariant: "select",
      options: norwegianCities,
    } as ColumnMeta,
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
  }),
  columnHelper.accessor("bedrooms", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soverom" />
    ),
    enableSorting: true,
    filterFn: "equals",
    meta: {
      className: "text-center",
      displayName: "Soverom",
      filterVariant: "select",
      options: bedroomOptions,
    } as ColumnMeta,
  }),
  columnHelper.accessor("bathrooms", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bad" />
    ),
    enableSorting: true,
    filterFn: "equals",
    meta: {
      className: "text-center",
      displayName: "Bad",
      filterVariant: "select",
      options: bathroomOptions,
    } as ColumnMeta,
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leiepris" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Leiepris",
      filterVariant: "number",
      options: priceConditions,
    } as ColumnMeta,
    cell: ({ getValue }) => {
      return (
        <span className="font-medium">
          {formatters.currency(getValue(), "NOK")}/mnd
        </span>
      );
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
      const isActive = getValue();
      return (
        <Badge variant={isActive ? "success" : "warning"}>
          {isActive ? "Aktiv" : "Inaktiv"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("availabilityDate", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tilgjengelig" />
    ),
    enableSorting: true,
    meta: {
      className: "tabular-nums",
      displayName: "Tilgjengelig",
    } as ColumnMeta,
    cell: ({ getValue }) => {
      const dateValue = getValue() as string;
      return formatters.date(dateValue);
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Handlinger",
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "text-right",
      displayName: "Handlinger",
    } as ColumnMeta,
    cell: ({ row }) => <BuildingRowActions row={row} />,
  }),
] as ColumnDef<BuildingData>[];
