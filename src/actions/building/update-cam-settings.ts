"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating input data
const updateCamSettingsSchema = z.object({
  propertyId: z.string(),
  reconciliationMonth: z.number().min(1).max(12).optional(),
  estimationMethod: z.enum(["PREVIOUS_YEAR", "BUDGET", "FIXED"]).optional(),
  adminFeePercentage: z.number().min(0).max(100).optional(),
  // Additional fields for CAM calculations
  calculationMethod: z.enum(["FIXED_RATE", "ACTUAL_COST"]).optional(),
  fixedRatePerSquareMeter: z.number().min(0).optional(),
  totalAnnualCost: z.number().min(0).optional(),
});

export type UpdateCamSettingsInput = z.infer<typeof updateCamSettingsSchema>;

export type UpdateCamSettingsResult = {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    propertyId: string;
    reconciliationMonth: number;
    estimationMethod: string;
    adminFeePercentage: number;
  };
};

/**
 * Updates CAM settings for a property
 */
export async function updateCamSettings(
  input: UpdateCamSettingsInput
): Promise<UpdateCamSettingsResult> {
  try {
    // Validate input data
    const validatedData = updateCamSettingsSchema.parse(input);

    // Check if CAM settings already exist for this property
    const existingSettings = await prisma.camSettings.findUnique({
      where: {
        propertyId: validatedData.propertyId,
      },
    });

    // Update or create CAM settings
    const updatedSettings = await prisma.camSettings.upsert({
      where: {
        propertyId: validatedData.propertyId,
      },
      update: {
        reconciliationMonth: validatedData.reconciliationMonth,
        estimationMethod: validatedData.estimationMethod,
        adminFeePercentage: validatedData.adminFeePercentage
          ? parseFloat(validatedData.adminFeePercentage.toString())
          : undefined,
      },
      create: {
        propertyId: validatedData.propertyId,
        reconciliationMonth: validatedData.reconciliationMonth || 12,
        estimationMethod: validatedData.estimationMethod || "PREVIOUS_YEAR",
        adminFeePercentage: validatedData.adminFeePercentage
          ? parseFloat(validatedData.adminFeePercentage.toString())
          : 0,
      },
    });

    // Store calculation method preferences in metadata
    // This would typically be stored in a separate table, but for simplicity
    // we're assuming you might extend the schema later with these fields

    return {
      success: true,
      data: {
        id: updatedSettings.id,
        propertyId: updatedSettings.propertyId,
        reconciliationMonth: updatedSettings.reconciliationMonth,
        estimationMethod: updatedSettings.estimationMethod,
        adminFeePercentage: Number(updatedSettings.adminFeePercentage),
      },
    };
  } catch (error) {
    console.error("Error updating CAM settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
