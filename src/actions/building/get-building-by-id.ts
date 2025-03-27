"use server";

import { prisma } from "@/lib/prisma";
import { BuildingData } from "@/components/ui/buildings-table/columns";
import { z } from "zod";
import { PropertyClass, LeaseStatus } from "@prisma/client";

// Define input schema
const getBuildingByIdSchema = z.object({
  buildingId: z.string(),
  userId: z.string().optional(),
});

type GetBuildingByIdInput = z.infer<typeof getBuildingByIdSchema>;

export async function getBuildingById(
  input: GetBuildingByIdInput
): Promise<{ success: boolean; data?: BuildingData; error?: string }> {
  try {
    // Validate input
    const validData = getBuildingByIdSchema.parse(input);

    // Find the property by ID
    const property = await prisma.property.findUnique({
      where: {
        id: validData.buildingId,
      },
      include: {
        landlord: {
          include: {
            user: true,
          },
        },
        images: true,
        amenities: true,
        units: {
          include: {
            leases: true,
          },
        },
        managers: {
          include: {
            manager: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    // If userId is provided, check ownership permissions
    if (validData.userId) {
      // Check if the user is the landlord
      const isLandlord = property.landlord?.userId === validData.userId;

      // Check if the user is a manager
      const isManager = property.managers.some(
        (m) => m.manager.userId === validData.userId
      );

      // If neither landlord nor manager, deny access
      if (!isLandlord && !isManager) {
        return {
          success: false,
          error:
            "Access denied - you don't have permission to view this property",
        };
      }
    }

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

    // Map property data to BuildingData format for commercial properties
    const buildingData: BuildingData = {
      id: property.id,
      title: property.title || property.address,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      propertyType: property.propertyType,
      propertyClass: property.propertyClass || PropertyClass.CLASS_C,
      totalBTA: property.totalBTA,
      totalBRA: property.totalBRA,
      unitCount: totalUnits,
      occupancyRate: occupancyRate,
      isActive: property.isActive,
      availabilityDate: property.availabilityDate?.toISOString() || "",
      createdAt: property.createdAt.toISOString(),
    };

    return {
      success: true,
      data: buildingData,
    };
  } catch (error) {
    console.error("Error fetching building by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch building",
    };
  }
}
