import React from "react";

export default function BuildingDetailsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-8 w-64 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 w-48 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-9 w-36 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="h-1 w-full bg-gray-200 rounded dark:bg-gray-700"></div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
          >
            <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
            <div className="h-8 w-48 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-9 w-36 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div className="h-8 w-full bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-gray-200 rounded dark:bg-gray-700"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
