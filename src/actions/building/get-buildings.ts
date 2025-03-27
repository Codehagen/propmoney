"use server";

import { prisma } from "@/lib/prisma";
import { BuildingData } from "@/components/ui/buildings-table/columns";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
        properties: true,
      },
    });

    if (!landlord) {
      return {
        success: false,
        data: [],
        error: "No landlord profile found for user",
      };
    }

    // Map properties to BuildingData format
    const buildingsData = landlord.properties.map((property) => ({
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
    }));

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
      title: "Moderne Leilighet i Sentrum",
      address: "Storgata 123",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0150",
      propertyType: "Leilighet",
      bedrooms: 2,
      bathrooms: 1.5,
      price: 15000, // Monthly rental price in NOK
      isActive: true,
      availabilityDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Koselig Rekkehus med Hage",
      address: "Kirkeveien 45",
      city: "Bergen",
      state: "Vestland",
      zipCode: "5008",
      propertyType: "Rekkehus",
      bedrooms: 3,
      bathrooms: 2,
      price: 18500, // Monthly rental price in NOK
      isActive: true,
      availabilityDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Luksuriøs Enebolig med Sjøutsikt",
      address: "Fjordveien 89",
      city: "Stavanger",
      state: "Rogaland",
      zipCode: "4021",
      propertyType: "Enebolig",
      bedrooms: 4,
      bathrooms: 3,
      price: 25000, // Monthly rental price in NOK
      isActive: false,
      availabilityDate: "",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Hytte ved Fjorden",
      address: "Fjellveien 12",
      city: "Tromsø",
      state: "Troms og Finnmark",
      zipCode: "9016",
      propertyType: "Fritidsbolig",
      bedrooms: 3,
      bathrooms: 1,
      price: 12000, // Monthly rental price in NOK
      isActive: true,
      availabilityDate: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Loftsleilighet i Gamlebyen",
      address: "Kongensgate 78",
      city: "Trondheim",
      state: "Trøndelag",
      zipCode: "7011",
      propertyType: "Leilighet",
      bedrooms: 1,
      bathrooms: 1,
      price: 9500, // Monthly rental price in NOK
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
