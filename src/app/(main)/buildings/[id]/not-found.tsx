import { Button } from "@/components/Button";
import Link from "next/link";

export default function BuildingNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
        404
      </h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Eiendommen ble ikke funnet
      </h2>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        Eiendommen du leter etter eksisterer ikke eller du har ikke tilgang til
        den.
      </p>
      <Button asChild className="mt-8">
        <Link href="/buildings">Tilbake til eiendommer</Link>
      </Button>
    </div>
  );
}
