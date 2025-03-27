"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UnitCamCharge } from "./calculate-cam-charges";

const saveCamChargesSchema = z.object({
  propertyId: z.string(),
  year: z.number(),
  calculationMethod: z.enum(["FIXED_RATE", "ACTUAL_COST"]),
  totalAnnualCost: z.number(),
  unitCharges: z.array(
    z.object({
      unitId: z.string(),
      leaseIds: z.array(z.string()),
      annualCamCharge: z.number(),
      monthlyCamCharge: z.number(),
    })
  ),
});

export type SaveCamChargesInput = z.infer<typeof saveCamChargesSchema>;

export type SaveCamChargesResult = {
  success: boolean;
  error?: string;
  data?: {
    savedCharges: number;
  };
};

/**
 * Saves calculated CAM charges to the database
 */
export async function saveCamCharges(
  input: SaveCamChargesInput
): Promise<SaveCamChargesResult> {
  try {
    // Validate input data
    const validatedData = saveCamChargesSchema.parse(input);

    // For each unit with active leases, create or update CamCharge records
    const createdCamCharges = [];

    for (const unitCharge of validatedData.unitCharges) {
      // Skip units without active leases
      if (unitCharge.leaseIds.length === 0) {
        continue;
      }

      // For each lease, create a CAM charge
      for (const leaseId of unitCharge.leaseIds) {
        // Check if there's already a CamCharge for this lease and year
        const existingCamCharge = await prisma.camCharge.findFirst({
          where: {
            leaseId: leaseId,
            year: validatedData.year,
          },
        });

        // Create or update the CamCharge
        const camCharge = await prisma.camCharge.upsert({
          where: {
            id: existingCamCharge?.id || "",
          },
          update: {
            monthlyEstimate: unitCharge.monthlyCamCharge,
            annualEstimate: unitCharge.annualCamCharge,
          },
          create: {
            leaseId: leaseId,
            year: validatedData.year,
            monthlyEstimate: unitCharge.monthlyCamCharge,
            annualEstimate: unitCharge.annualCamCharge,
            reconciled: false,
          },
        });

        createdCamCharges.push(camCharge);
      }
    }

    return {
      success: true,
      data: {
        savedCharges: createdCamCharges.length,
      },
    };
  } catch (error) {
    console.error("Error saving CAM charges:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
