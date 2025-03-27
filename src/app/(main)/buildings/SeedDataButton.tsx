"use client";

import { seedUserData } from "@/actions/building";
import { Button } from "@/components/Button";
import { useState } from "react";

interface SeedDataButtonProps {
  userId: string;
  hasData: boolean;
}

export function SeedDataButton({ userId, hasData }: SeedDataButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleSeed = async () => {
    try {
      setIsLoading(true);
      setResult(null);

      const seedResult = await seedUserData({ userId });

      setResult({
        success: seedResult.success,
        message: seedResult.success
          ? "Test data added successfully!"
          : undefined,
        error: seedResult.error,
      });

      // Refresh the page to show the new data
      if (seedResult.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleSeed}
        variant={hasData ? "secondary" : "primary"}
        className="text-sm"
        disabled={isLoading}
      >
        {isLoading
          ? "Adding test data..."
          : hasData
            ? "Refresh test data"
            : "Add test data"}
      </Button>

      {result && (
        <div
          className={`text-sm ${
            result.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.success ? result.message : result.error}
        </div>
      )}
    </div>
  );
}
