"use server";

import { prisma } from "@/lib/prisma";
import { BuildingData } from "@/components/ui/buildings-table/columns";
import { z } from "zod";

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

    // Map property data to BuildingData format
    const buildingData: BuildingData = {
      id: property.id,
      title: property.title || "",
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      price: Number(property.price),
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
