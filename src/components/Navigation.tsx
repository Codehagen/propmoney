"use client";

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import Link from "next/link";

import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();
  return (
    <div className="shadow-s sticky top-0 z-20 bg-white dark:bg-gray-950">
      <TabNavigation className="mt-5">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6">
          <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/support"}
          >
            <Link href="/support">Support</Link>
          </TabNavigationLink>
          <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/retention"}
          >
            <Link href="/retention">Retention</Link>
          </TabNavigationLink>
          <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/workflow"}
          >
            <Link href="/workflow">Workflow</Link>
          </TabNavigationLink>
          <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/agents"}
          >
            <Link href="/agents">Agents</Link>
          </TabNavigationLink>
        </div>
      </TabNavigation>
    </div>
  );
}

export { Navigation };
