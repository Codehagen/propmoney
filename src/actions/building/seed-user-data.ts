"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the input schema for the seed function
const seedUserDataSchema = z.object({
  userId: z.string(),
});

type SeedUserDataInput = z.infer<typeof seedUserDataSchema>;

/**
 * Seeds test data for a specific user, creating:
 * - Organization
 * - Landlord profile (if not exists)
 * - Sample properties
 */
export async function seedUserData(input: SeedUserDataInput) {
  try {
    // Validate input
    const validData = seedUserDataSchema.parse(input);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validData.userId },
      include: {
        landlordProfile: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Create organization if needed
    const organization = await prisma.organization.create({
      data: {
        name: "PropMoney Eiendom AS",
        logo: "https://placehold.co/400x400?text=PropMoney",
        billingEmail: "faktura@propmoney.no",
      },
    });

    // Create or update the organization membership
    await prisma.organizationMember.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
      update: {
        role: "LANDLORD",
      },
      create: {
        userId: user.id,
        organizationId: organization.id,
        role: "LANDLORD",
      },
    });

    // Create or update landlord profile
    let landlord = user.landlordProfile;

    if (!landlord) {
      landlord = await prisma.landlord.create({
        data: {
          userId: user.id,
          businessName: "Jens Eiendom AS",
          taxId: "987654321",
          businessAddress: "Storgata 123, 0370 Oslo, Norge",
        },
      });
    }

    // Create first property - Apartment
    const property1 = await prisma.property.create({
      data: {
        title: "Solnedgang Leiligheter",
        description:
          "Moderne leiligheter midt i hjertet av byen med vakker utsikt mot solnedgangen.",
        address: "Osloveien 123",
        city: "Oslo",
        state: "Oslo",
        zipCode: "0370",
        country: "Norge",
        latitude: 59.9139,
        longitude: 10.7522,
        price: 12000,
        bedrooms: 2,
        bathrooms: 1.5,
        squareFootage: 75,
        yearBuilt: 2015,
        propertyType: "Leilighet",
        availabilityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in the future
        isActive: true,
        landlordId: landlord.id,
        organizationId: organization.id,
        amenities: {
          create: [
            {
              name: "Svømmebasseng",
              description: "Utendørsbasseng med soldekk",
            },
            {
              name: "Treningssenter",
              description: "Tilgang 24/7 med moderne utstyr",
            },
            {
              name: "Parkering",
              description: "Innendørs parkering tilgjengelig",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://placehold.co/800x600?text=Leilighet+Eksteriør",
              caption: "Bygningens eksteriør",
              isPrimary: true,
            },
            {
              url: "https://placehold.co/800x600?text=Stue",
              caption: "Stue",
            },
            {
              url: "https://placehold.co/800x600?text=Kjøkken",
              caption: "Moderne kjøkken",
            },
          ],
        },
      },
    });

    // Create second property - Villa
    const property2 = await prisma.property.create({
      data: {
        title: "Fjordvilla",
        description:
          "Luksuriøs villa med panoramautsikt over fjorden. Perfekt for familier.",
        address: "Fjordveien 45",
        city: "Bergen",
        state: "Vestland",
        zipCode: "5003",
        country: "Norge",
        latitude: 60.3913,
        longitude: 5.3221,
        price: 25000,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFootage: 200,
        yearBuilt: 2018,
        propertyType: "Villa",
        availabilityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in the future
        isActive: true,
        landlordId: landlord.id,
        organizationId: organization.id,
        amenities: {
          create: [
            { name: "Hage", description: "Velholdt privat hage med terrasse" },
            { name: "Badstue", description: "Finsk badstue med fjordutsikt" },
            {
              name: "Garasje",
              description: "Dobbel garasje med ladestasjoner",
            },
            { name: "Hjemmekontor", description: "Fullt utstyrt hjemmekontor" },
          ],
        },
        images: {
          create: [
            {
              url: "https://placehold.co/800x600?text=Villa+Eksteriør",
              caption: "Villa eksteriør",
              isPrimary: true,
            },
            {
              url: "https://placehold.co/800x600?text=Fjordutsikt",
              caption: "Utsikt over fjorden",
            },
            {
              url: "https://placehold.co/800x600?text=Kjøkken",
              caption: "Moderne kjøkken med øy",
            },
            {
              url: "https://placehold.co/800x600?text=Stue",
              caption: "Romslig stue med peis",
            },
          ],
        },
      },
    });

    // Create a third property - Hytte
    const property3 = await prisma.property.create({
      data: {
        title: "Fjellhytte",
        description:
          "Koselig hytte i fjellet, perfekt for helgeturer og vinterferier.",
        address: "Fjellveien 78",
        city: "Trysil",
        state: "Innlandet",
        zipCode: "2420",
        country: "Norge",
        latitude: 61.3102,
        longitude: 12.2679,
        price: 9500,
        bedrooms: 3,
        bathrooms: 1,
        squareFootage: 85,
        yearBuilt: 2010,
        propertyType: "Hytte",
        availabilityDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in the future
        isActive: true,
        landlordId: landlord.id,
        organizationId: organization.id,
        amenities: {
          create: [
            {
              name: "Ski-in/ski-out",
              description: "Direkte tilgang til skiløyper",
            },
            { name: "Peis", description: "Vedfyrt peis i stua" },
            { name: "Sauna", description: "Tradisjonell norsk badstue" },
          ],
        },
        images: {
          create: [
            {
              url: "https://placehold.co/800x600?text=Hytte+Eksteriør",
              caption: "Hytte eksteriør",
              isPrimary: true,
            },
            {
              url: "https://placehold.co/800x600?text=Fjellsyn",
              caption: "Utsikt over fjellandskapet",
            },
            {
              url: "https://placehold.co/800x600?text=Stue+med+peis",
              caption: "Koselig stue med peis",
            },
          ],
        },
      },
    });

    // Revalidate paths to refresh data
    revalidatePath("/buildings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Test data successfully seeded for user",
      data: {
        organization,
        landlord,
        properties: [property1, property2, property3],
      },
    };
  } catch (error) {
    console.error("Error seeding user data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to seed user data",
    };
  }
}
