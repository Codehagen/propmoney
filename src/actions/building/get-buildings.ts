"use server";

import { prisma } from "@/lib/prisma";
import { BuildingData } from "@/components/ui/buildings-table/columns";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PropertyType, PropertyClass, LeaseStatus } from "@prisma/client";

// Define input schema for getBuildings
const getBuildingsSchema = z.object({
  userId: z.string(),
});

type GetBuildingsInput = z.infer<typeof getBuildingsSchema>;

export async function getBuildings(
  input: GetBuildingsInput
): Promise<{ success: boolean; data: BuildingData[]; error?: string }> {
  try {
    // Validate input
    const validData = getBuildingsSchema.parse(input);

    // Find the landlord profile associated with the user ID
    const landlord = await prisma.landlord.findUnique({
      where: {
        userId: validData.userId,
      },
      include: {
        properties: {
          include: {
            units: {
              include: {
                leases: {
                  include: {
                    tenant: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!landlord) {
      return {
        success: false,
        data: [],
        error: "No landlord profile found for user",
      };
    }

    // Map properties to BuildingData format with commercial property data
    const buildingsData = landlord.properties.map((property) => {
      // Calculate occupancy rate
      const totalUnits = property.units.length;
      const occupiedUnits = property.units.filter((unit) =>
        unit.leases.some(
          (lease) =>
            lease.status === LeaseStatus.ACTIVE &&
            (!lease.endDate || new Date(lease.endDate) > new Date())
        )
      ).length;

      const occupancyRate = totalUnits
        ? Math.round((occupiedUnits / totalUnits) * 100)
        : 0;

      // Use the property's totalBTA and totalBRA fields
      const totalBTA = property.totalBTA;
      const totalBRA = property.totalBRA;

      return {
        id: property.id,
        title: property.title || property.address,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        propertyType: property.propertyType,
        propertyClass: property.propertyClass || PropertyClass.CLASS_C,
        totalBTA: totalBTA,
        totalBRA: totalBRA,
        unitCount: totalUnits,
        occupancyRate: occupancyRate,
        isActive: property.isActive,
        availabilityDate: property.availabilityDate?.toISOString() || "",
        createdAt: property.createdAt.toISOString(),
      };
    });

    return {
      success: true,
      data: buildingsData,
    };
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch buildings",
    };
  }
}

// Get buildings with mock data for demo purposes
export async function getMockBuildings(): Promise<BuildingData[]> {
  return [
    {
      id: "1",
      title: "Office Building Skøyen",
      address: "Karenslyst Allé 20",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0278",
      propertyType: PropertyType.OFFICE,
      propertyClass: PropertyClass.CLASS_A,
      totalBTA: 2500,
      totalBRA: 2300,
      unitCount: 8,
      occupancyRate: 95,
      isActive: true,
      availabilityDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Retail Center Grünerløkka",
      address: "Markveien 58",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0550",
      propertyType: PropertyType.RETAIL,
      propertyClass: PropertyClass.CLASS_B,
      totalBTA: 1800,
      totalBRA: 1650,
      unitCount: 12,
      occupancyRate: 85,
      isActive: true,
      availabilityDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Industrial Complex Alnabru",
      address: "Alfasetveien 35",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0668",
      propertyType: PropertyType.INDUSTRIAL,
      propertyClass: PropertyClass.CLASS_C,
      totalBTA: 5500,
      totalBRA: 5200,
      unitCount: 4,
      occupancyRate: 100,
      isActive: true,
      availabilityDate: "",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Mixed Use Property Nydalen",
      address: "Nydalsveien 28",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0484",
      propertyType: PropertyType.MIXED_USE,
      propertyClass: PropertyClass.CLASS_B,
      totalBTA: 3200,
      totalBRA: 2900,
      unitCount: 15,
      occupancyRate: 78,
      isActive: true,
      availabilityDate: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Hotel Sentrum",
      address: "Karl Johans gate 15",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0154",
      propertyType: PropertyType.HOSPITALITY,
      propertyClass: PropertyClass.CLASS_A,
      totalBTA: 7800,
      totalBRA: 7200,
      unitCount: 1,
      occupancyRate: 100,
      isActive: true,
      availabilityDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export async function refreshBuildings() {
  revalidatePath("/landlord/properties");
}
