"use client";

import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { TenantsTable } from "@/components/ui/tenants-table/TenantsTable";
import {
  TenantData,
  tenantDemoData,
} from "@/components/ui/tenants-table/columns";
import { formatters } from "@/lib/utils";
import {
  RiUserLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
  RiPercentLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";

interface TenantsPageProps {
  userId: string;
}

export function TenantsPage({ userId }: TenantsPageProps) {
  const [tenants, setTenants] = useState<TenantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real implementation, this would fetch tenants from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTenants(tenantDemoData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Calculate summary statistics
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "active"
  ).length;
  const totalRentedArea = tenants.reduce(
    (sum, tenant) => sum + tenant.totalRentedArea,
    0
  );
  const totalMonthlyRent = tenants.reduce(
    (sum, tenant) => sum + tenant.monthlyRent,
    0
  );

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Leietakere
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Administrer alle dine leietakere på et sted
          </p>
        </div>
      </div>

      <Divider />

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center">
          <p className="text-gray-500">Laster leietakere...</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                  <RiUserLine className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Totalt antall leietakere
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {totalTenants}
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                  <RiPercentLine className="size-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Aktive leietakere
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {formatters.percent(activeTenants / totalTenants)}
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
                  <RiBuilding2Line className="size-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Total utleid areal
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {formatters.number(totalRentedArea)} m²
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                  <RiMoneyDollarCircleLine className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Månedlige leieinntekter
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {formatters.currency(totalMonthlyRent, "NOK")}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <TenantsTable data={tenants} />
          </div>
        </>
      )}
    </main>
  );
}
