"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const calculateCamChargesSchema = z.object({
  propertyId: z.string(),
  year: z.number(),
  calculationMethod: z.enum(["FIXED_RATE", "ACTUAL_COST"]),
  fixedRatePerSquareMeter: z.number().min(0).optional(),
  totalAnnualCost: z.number().min(0).optional(),
});

export type CalculateCamChargesInput = z.infer<
  typeof calculateCamChargesSchema
>;

// Type for a unit with its calculated CAM charge
export type UnitCamCharge = {
  unitId: string;
  unitNumber: string;
  bra: number;
  commonAreaFactor: number;
  leaseIds: string[];
  annualCamCharge: number;
  monthlyCamCharge: number;
  share: number; // Proportion of total area
};

export type CalculateCamChargesResult = {
  success: boolean;
  error?: string;
  data?: {
    propertyId: string;
    year: number;
    calculationMethod: string;
    unitCharges: UnitCamCharge[];
    totalPropertyBra: number;
    totalAnnualCost: number;
  };
};

/**
 * Calculates CAM charges for all units in a property
 */
export async function calculateCamCharges(
  input: CalculateCamChargesInput
): Promise<CalculateCamChargesResult> {
  try {
    // Validate input data
    const validatedData = calculateCamChargesSchema.parse(input);

    // Check if required fields are present based on calculation method
    if (
      validatedData.calculationMethod === "FIXED_RATE" &&
      (!validatedData.fixedRatePerSquareMeter ||
        validatedData.fixedRatePerSquareMeter <= 0)
    ) {
      return {
        success: false,
        error:
          "Fixed rate per square meter is required for FIXED_RATE calculation method",
      };
    }

    if (
      validatedData.calculationMethod === "ACTUAL_COST" &&
      (!validatedData.totalAnnualCost || validatedData.totalAnnualCost <= 0)
    ) {
      return {
        success: false,
        error:
          "Total annual cost is required for ACTUAL_COST calculation method",
      };
    }

    // Get property
    const property = await prisma.property.findUnique({
      where: {
        id: validatedData.propertyId,
      },
      select: {
        id: true,
        totalBRA: true,
      },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    // Get all units for the property with their active leases
    const units = await prisma.commercialUnit.findMany({
      where: {
        propertyId: validatedData.propertyId,
      },
      include: {
        leases: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (units.length === 0) {
      return {
        success: false,
        error: "No units found for this property",
      };
    }

    // Calculate total leasable area (considering common area factor)
    const totalBra = property.totalBRA;

    // Calculate total annual cost based on method
    const totalAnnualCost =
      validatedData.calculationMethod === "FIXED_RATE"
        ? totalBra * (validatedData.fixedRatePerSquareMeter || 0)
        : validatedData.totalAnnualCost || 0;

    // Calculate CAM charges for each unit
    const unitCharges: UnitCamCharge[] = units.map((unit) => {
      // Calculate unit's share of total area
      const share = unit.bra / totalBra;

      // Calculate annual CAM charge based on method
      let annualCamCharge = 0;

      if (validatedData.calculationMethod === "FIXED_RATE") {
        annualCamCharge =
          unit.bra * (validatedData.fixedRatePerSquareMeter || 0);
      } else if (validatedData.calculationMethod === "ACTUAL_COST") {
        annualCamCharge = share * (validatedData.totalAnnualCost || 0);
      }

      // Calculate monthly CAM charge
      const monthlyCamCharge = annualCamCharge / 12;

      return {
        unitId: unit.id,
        unitNumber: unit.unitNumber,
        bra: unit.bra,
        commonAreaFactor: unit.commonAreaFactor,
        leaseIds: unit.leases.map((lease) => lease.id),
        annualCamCharge,
        monthlyCamCharge,
        share,
      };
    });

    return {
      success: true,
      data: {
        propertyId: validatedData.propertyId,
        year: validatedData.year,
        calculationMethod: validatedData.calculationMethod,
        unitCharges,
        totalPropertyBra: totalBra,
        totalAnnualCost,
      },
    };
  } catch (error) {
    console.error("Error calculating CAM charges:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
