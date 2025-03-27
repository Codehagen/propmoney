"use client";

import { Button } from "@/components/Button";
import { RiMoreFill } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { BuildingData } from "./columns";

interface BuildingRowActionsProps {
  row: Row<BuildingData>;
}

export function BuildingRowActions({ row }: BuildingRowActionsProps) {
  // Get the building ID from the row
  const building = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group aspect-square p-1.5 hover:border hover:border-gray-300 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
        >
          <RiMoreFill
            className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700 group-hover:dark:text-gray-300 group-data-[state=open]:dark:text-gray-300"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <Link href={`/buildings/${building.id}`} passHref>
          <DropdownMenuItem>Vis detaljer</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Rediger</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 dark:text-red-500">
          Slett
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
