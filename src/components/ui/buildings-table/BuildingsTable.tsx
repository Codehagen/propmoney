"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table";
import { Button } from "@/components/Button";
import { Searchbar } from "@/components/Searchbar";
import { cx } from "@/lib/utils";
import * as React from "react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { RiDownloadLine, RiFilterLine } from "@remixicon/react";
import { useRouter } from "next/navigation";

import { DataTableBulkEditor } from "../data-table/DataTableBulkEditor";
import { DataTablePagination } from "../data-table/DataTablePagination";
import { DataTableFilter } from "../data-table/DataTableFilter";
import {
  BuildingData,
  norwegianCities,
  areaConditions,
  propertyTypes,
  statusOptions,
} from "./columns";

import {
  ColumnDef,
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Import or define ColumnMeta type
type ColumnMeta = {
  className?: string;
  displayName: string;
  filterVariant?: "text" | "select" | "number" | "checkbox";
  options?: { label: string; value: string }[];
};

// We need to match our filterVariant to the expected FilterType in DataTableFilter
type FilterType = "select" | "checkbox" | "number";

const filterVariantToFilterType = (
  variant: string | undefined
): FilterType | undefined => {
  switch (variant) {
    case "select":
    case "checkbox":
      return variant as FilterType;
    case "number":
      return "number";
    case "text":
      // Text searches typically use select in the filter UI
      return "select";
    default:
      return undefined;
  }
};

// Create a Filterbar component similar to DataTableFilterbar
interface FilterbarProps {
  table: TableType<BuildingData>;
}

function Filterbar({ table }: FilterbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSetFilterValue = useDebouncedCallback((value) => {
    table.getColumn("title")?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSetFilterValue(value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {table.getColumn("propertyType")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("propertyType")}
            title="Type"
            options={propertyTypes}
            type="select"
          />
        )}
        {table.getColumn("totalBTA")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("totalBTA")}
            title="Areal (BTA)"
            type="number"
            options={areaConditions}
          />
        )}
        {table.getColumn("isActive")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("isActive")}
            title="Status"
            options={statusOptions}
            type="select"
          />
        )}
        {table.getColumn("title")?.getIsVisible() && (
          <Searchbar
            type="search"
            placeholder="Søk på eiendom..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:max-w-[250px] sm:[&>input]:h-[30px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="border border-gray-200 px-2 font-semibold text-indigo-600 sm:border-none sm:py-1 dark:border-gray-800 dark:text-indigo-500"
          >
            Fjern filtre
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
        >
          <RiDownloadLine className="size-4 shrink-0" aria-hidden="true" />
          Eksporter
        </Button>
      </div>
    </div>
  );
}

interface BuildingsTableProps {
  columns: ColumnDef<BuildingData, any>[];
  data: BuildingData[];
}

export function BuildingsTable({ columns, data }: BuildingsTableProps) {
  const pageSize = 20;
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  // Function to handle row click for navigation
  const handleRowClick = (id: string) => {
    router.push(`/buildings/${id}`);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="space-y-3">
        <Filterbar table={table} />
        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-y border-gray-200 dark:border-gray-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      className={cx(
                        "whitespace-nowrap py-1 text-sm sm:text-xs",
                        header.column.columnDef.meta?.className
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={(e) => {
                      // Don't navigate if clicking on a checkbox or action
                      const target = e.target as HTMLElement;
                      const isCheckbox = target.closest(
                        'input[type="checkbox"]'
                      );
                      const isAction = target.closest(".actions-dropdown");

                      if (!isCheckbox && !isAction) {
                        handleRowClick(row.original.id);
                      } else {
                        row.toggleSelected(!row.getIsSelected());
                      }
                    }}
                    className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cx(
                          "align-middle py-2 px-4",
                          cell.column.columnDef.meta?.className
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-8 text-center text-gray-500"
                  >
                    Ingen eiendommer funnet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-y-4 p-1">
          <div className="text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} eiendommer
          </div>
          <DataTablePagination table={table} pageSize={pageSize} />
        </div>
      </div>
    </>
  );
}
