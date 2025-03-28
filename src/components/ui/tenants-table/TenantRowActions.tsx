"use client";

import { Button } from "@/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import {
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMailLine,
  RiFileTextLine,
} from "@remixicon/react";
import Link from "next/link";

interface TenantRowActionsProps {
  tenantId: string;
}

export function TenantRowActions({ tenantId }: TenantRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex aspect-square h-8 w-8 items-center justify-center p-0"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8C8.5 7.72386 8.27614 7.5 8 7.5C7.72386 7.5 7.5 7.72386 7.5 8C7.5 8.27614 7.72386 8.5 8 8.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 4C8.27614 4 8.5 3.77614 8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5C7.5 3.77614 7.72386 4 8 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 13C8.27614 13 8.5 12.7761 8.5 12.5C8.5 12.2239 8.27614 12 8 12C7.72386 12 7.5 12.2239 7.5 12.5C7.5 12.7761 7.72386 13 8 13Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Leietaker</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/tenants/${tenantId}`} className="w-full">
          <DropdownMenuItem>
            <RiEyeLine className="mr-2 size-4" />
            Se detaljer
          </DropdownMenuItem>
        </Link>
        <Link href={`/tenants/${tenantId}/edit`} className="w-full">
          <DropdownMenuItem>
            <RiEditLine className="mr-2 size-4" />
            Rediger
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <RiMailLine className="mr-2 size-4" />
          Send melding
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RiFileTextLine className="mr-2 size-4" />
          Generer faktura
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300">
          <RiDeleteBinLine className="mr-2 size-4" />
          Slett
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
