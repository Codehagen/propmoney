"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { LeaseStatus } from "@prisma/client";

// Define the commercial unit data interface
export interface CommercialUnitData {
  id: string;
  unitNumber: string;
  floor: number;
  bra: number;
  basePrice: number;
  isAvailable: boolean;
  description: string | null;
  currentTenant: {
    id: string;
    name: string;
  } | null;
  leaseExpiration: string | null;
  commonAreaFactor: number;
  rent: number | null;
}

// Define input schema
const getBuildingUnitsSchema = z.object({
  buildingId: z.string(),
  userId: z.string().optional(),
});

type GetBuildingUnitsInput = z.infer<typeof getBuildingUnitsSchema>;

export async function getBuildingUnits(
  input: GetBuildingUnitsInput
): Promise<{ success: boolean; data?: CommercialUnitData[]; error?: string }> {
  try {
    // Validate input
    const validData = getBuildingUnitsSchema.parse(input);

    // Check if the user has access to the building
    const property = await prisma.property.findUnique({
      where: {
        id: validData.buildingId,
      },
      include: {
        landlord: true,
        managers: {
          include: {
            manager: true,
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

    // Fetch all commercial units for the building with their active leases
    const units = await prisma.commercialUnit.findMany({
      where: {
        propertyId: validData.buildingId,
      },
      include: {
        leases: {
          where: {
            status: LeaseStatus.ACTIVE,
          },
          include: {
            tenant: true,
          },
        },
      },
    });

    // Map the units to the CommercialUnitData format
    const commercialUnitsData: CommercialUnitData[] = units.map((unit) => {
      // Get the active lease if any
      const activeLease = unit.leases.find(
        (lease) =>
          lease.status === LeaseStatus.ACTIVE &&
          (!lease.endDate || new Date(lease.endDate) > new Date())
      );

      // Check if unit is available (no active lease)
      const isAvailable = !activeLease;

      return {
        id: unit.id,
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        bra: unit.bra,
        basePrice: Number(unit.basePrice),
        isAvailable,
        description: unit.description,
        currentTenant: activeLease
          ? {
              id: activeLease.tenant.id,
              name: activeLease.tenant.name,
            }
          : null,
        leaseExpiration: activeLease?.endDate?.toISOString() || null,
        commonAreaFactor: Number(unit.commonAreaFactor),
        rent: activeLease ? Number(activeLease.baseRentAmount) / 12 : null, // Convert annual to monthly
      };
    });

    return {
      success: true,
      data: commercialUnitsData,
    };
  } catch (error) {
    console.error("Error fetching building units:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch building units",
    };
  }
}
