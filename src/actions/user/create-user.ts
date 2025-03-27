"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const userProfileSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole).default("LANDLORD"),
});

type UserProfileInput = z.infer<typeof userProfileSchema>;

/**
 * Adds a role-specific profile to an existing user
 * Used after Better Auth has already created the user in the database
 */
export async function createUserProfile(input: UserProfileInput) {
  try {
    // Validate input
    const validData = userProfileSchema.parse(input);

    // Find the user that Better Auth created
    const user = await prisma.user.findUnique({
      where: { email: validData.email },
      include: {
        landlordProfile: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found. Better Auth may not have created the user yet.",
      };
    }

    // Update user role
    await prisma.user.update({
      where: { id: user.id },
      data: { role: validData.role },
    });

    // Create the landlord profile if it doesn't exist and role is LANDLORD
    if (validData.role === "LANDLORD" && !user.landlordProfile) {
      await prisma.landlord.create({
        data: {
          userId: user.id,
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error creating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create profile",
    };
  }
}
