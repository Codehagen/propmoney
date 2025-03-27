"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User, PropertyWithDetails } from "@/types/user";

/**
 * Gets the current authenticated user with full profile details from the database
 * Includes tenant, landlord, and manager profiles if they exist
 */
export async function getCurrentUser(): Promise<User | null> {
  // Get the current session from auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session or user, return null
  if (!session?.user) {
    return null;
  }

  // Fetch the user with their profile details from Prisma
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      // Include related profiles based on user role
      tenantContacts: true,
      landlordProfile: true,
      managerProfile: true,
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  return user as User | null;
}

/**
 * Gets a user by their ID with full profile details
 * Used for admin or authorized operations where you need to fetch other users
 */
export async function getUserById(userId: string): Promise<User | null> {
  // Get the current session to verify authorization
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Only allow this for authenticated users
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  // You might want to check if the current user has permission to view other users
  // For example, only users with ADMIN role can view other users
  // if (session.user.role !== "ADMIN" && session.user.id !== userId) {
  //   throw new Error("Not authorized");
  // }

  // Fetch the user with their profile details
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tenantContacts: true,
      landlordProfile: true,
      managerProfile: true,
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  return user as User | null;
}

/**
 * Gets properties associated with the current user based on their role
 */
export async function getCurrentUserProperties(): Promise<
  PropertyWithDetails[] | null
> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  // Different query based on user role
  if (currentUser.role === "LANDLORD" && currentUser.landlordProfile) {
    // Fetch properties for landlord
    return prisma.property.findMany({
      where: {
        landlordId: currentUser.landlordProfile.id,
      },
      include: {
        images: true,
        amenities: true,
      },
    }) as Promise<PropertyWithDetails[]>;
  } else if (
    currentUser.role === "PROPERTY_MANAGER" &&
    currentUser.managerProfile
  ) {
    // Fetch properties for property manager
    return prisma.property.findMany({
      where: {
        managers: {
          some: {
            managerId: currentUser.managerProfile.id,
          },
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    }) as Promise<PropertyWithDetails[]>;
  } else if (
    currentUser.role === "TENANT" &&
    currentUser.tenantContacts &&
    currentUser.tenantContacts.length > 0
  ) {
    // Get all tenant IDs this user is a contact for
    const tenantIds = currentUser.tenantContacts.map(
      (contact) => contact.tenantId
    );

    // Fetch properties for tenant via leases
    const leases = await prisma.lease.findMany({
      where: {
        tenantId: {
          in: tenantIds,
        },
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                images: true,
                amenities: true,
              },
            },
          },
        },
      },
    });

    // Extract properties from leases
    return leases.map((lease) => lease.unit.property) as PropertyWithDetails[];
  }

  return [];
}
