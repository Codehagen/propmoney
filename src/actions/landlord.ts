"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user";

/**
 * Gets detailed landlord data for the current authenticated user
 * Includes properties, organization memberships, and stats
 */
export async function getLandlordDashboardData() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    currentUser.role !== "LANDLORD" ||
    !currentUser.landlordProfile
  ) {
    return null;
  }

  // Get landlord with properties and stats
  const landlord = await prisma.landlord.findUnique({
    where: {
      id: currentUser.landlordProfile.id,
    },
    include: {
      properties: {
        include: {
          units: true,
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
          amenities: true,
        },
      },
      user: {
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  });

  // Gather some additional stats
  const propertyCount = landlord?.properties.length || 0;

  // Calculate total units
  const unitCount =
    landlord?.properties.reduce((total, property) => {
      return total + (property.units?.length || 0);
    }, 0) || 0;

  // You could add more stats here - financial summaries, occupancy rates, etc.

  return {
    landlord,
    stats: {
      propertyCount,
      unitCount,
    },
  };
}

/**
 * Gets all properties for the current authenticated landlord
 */
export async function getLandlordProperties() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    currentUser.role !== "LANDLORD" ||
    !currentUser.landlordProfile
  ) {
    return [];
  }

  return prisma.property.findMany({
    where: {
      landlordId: currentUser.landlordProfile.id,
    },
    include: {
      images: true,
      amenities: true,
      units: {
        include: {
          leases: {
            where: {
              status: "ACTIVE",
            },
            include: {
              tenant: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
