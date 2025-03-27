"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CommercialUnitData } from "./get-building-units";

// Define input schema
const addBuildingUnitSchema = z.object({
  buildingId: z.string(),
  userId: z.string(),
  unitNumber: z.string(),
  floor: z.number().int(),
  bra: z.number().int().positive(),
  basePrice: z.number().positive(),
  commonAreaFactor: z.number().positive(),
  description: z.string().optional(),
});

type AddBuildingUnitInput = z.infer<typeof addBuildingUnitSchema>;

export async function addBuildingUnit(
  input: AddBuildingUnitInput
): Promise<{ success: boolean; data?: CommercialUnitData; error?: string }> {
  try {
    // Validate input
    const validData = addBuildingUnitSchema.parse(input);

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

    // Check ownership permissions
    const isLandlord = property.landlord?.userId === validData.userId;
    const isManager = property.managers.some(
      (m) => m.manager.userId === validData.userId
    );

    // If neither landlord nor manager, deny access
    if (!isLandlord && !isManager) {
      return {
        success: false,
        error:
          "Access denied - you don't have permission to modify this property",
      };
    }

    // Check if the unit number already exists in this building
    const existingUnit = await prisma.commercialUnit.findFirst({
      where: {
        propertyId: validData.buildingId,
        unitNumber: validData.unitNumber,
      },
    });

    if (existingUnit) {
      return {
        success: false,
        error: `Unit number ${validData.unitNumber} already exists in this building`,
      };
    }

    // Create the new commercial unit
    const newUnit = await prisma.commercialUnit.create({
      data: {
        propertyId: validData.buildingId,
        unitNumber: validData.unitNumber,
        floor: validData.floor,
        bra: validData.bra,
        basePrice: validData.basePrice,
        commonAreaFactor: validData.commonAreaFactor,
        isAvailable: true,
        description: validData.description || null,
      },
    });

    // Return the new unit
    const unitData: CommercialUnitData = {
      id: newUnit.id,
      unitNumber: newUnit.unitNumber,
      floor: newUnit.floor,
      bra: newUnit.bra,
      basePrice: Number(newUnit.basePrice),
      isAvailable: newUnit.isAvailable,
      description: newUnit.description,
      currentTenant: null,
      leaseExpiration: null,
      commonAreaFactor: Number(newUnit.commonAreaFactor),
      rent: null,
    };

    return {
      success: true,
      data: unitData,
    };
  } catch (error) {
    console.error("Error adding building unit:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add building unit",
    };
  }
}
