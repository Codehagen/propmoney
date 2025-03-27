// @ts-nocheck
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (skip user tables)
  await clearDatabase();

  // Create sample data - focusing on landlord path
  const organization = await createOrganization();
  const landlord = await createLandlord();
  const property = await createProperty(landlord.id, organization.id);
  const property2 = await createSecondProperty(landlord.id, organization.id);

  console.log("✅ Database seeding completed!");
  console.log("\n===========================================");
  console.log("📝 Properties have been seeded successfully");
  console.log("🏢 You can now log in with your credentials");
  console.log("✨ If a new user was created, you'll need to");
  console.log("   create a password through the auth system");
  console.log("===========================================\n");
}

async function clearDatabase() {
  // Don't clear user-related tables since we want to keep the registered user
  const tablesToClear = [
    "FinancialSummary",
    "PropertyAnalytics",
    "MaintenanceUpdate",
    "MaintenanceRequestImage",
    "MaintenanceRequest",
    "Message",
    "Notification",
    "Document",
    "Payment",
    "InvoiceItem",
    "Invoice",
    "Lease",
    "Application",
    "PropertyImage",
    "PropertyAmenity",
    "Unit",
    "PropertyManager_Property",
    "Property",
    "Tenant",
    "PropertyManager",
    "Landlord",
    "OrganizationMember",
    "Organization",
    // Skip user-related tables
    // "user",
    // "session",
    // "account",
    // "verification",
  ];

  for (const table of tablesToClear) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      console.log(`Cleared table: ${table}`);
    } catch (error) {
      console.log(
        `Table ${table} does not exist or couldn't be cleared: ${error.message}`
      );
    }
  }

  console.log("🧹 Cleared existing property data (preserved user accounts)");
}

async function createOrganization() {
  const organization = await prisma.organization.create({
    data: {
      name: "PropMoney Eiendom AS",
      logo: "https://placehold.co/400x400?text=PropMoney",
      billingEmail: "faktura@propmoney.com",
    },
  });

  console.log(`🏢 Opprettet organisasjon: ${organization.name}`);
  return organization;
}

async function createLandlord() {
  // Try to find existing user or create a new one
  console.log("Looking for registered user or creating new one...");

  // Ask for email at runtime or hardcode your email here
  const userEmail = process.env.SEED_EMAIL || "utleier@eksempel.com";

  // First try to find the user that was created through the UI registration
  let user = await prisma.user.findFirst({
    where: {
      email: {
        contains: userEmail,
        mode: "insensitive", // Case-insensitive search
      },
    },
  });

  // If no user found, create a new one
  if (!user) {
    console.log(
      `User with email ${userEmail} not found. Creating a new user...`
    );
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: "Jens Eier",
        role: "LANDLORD",
        verified: true,
        emailVerified: true,
        image: null,
      },
    });
    console.log(`Created new user: ${user.name || user.email} (${user.id})`);
  } else {
    console.log(`Found existing user: ${user.name || user.email} (${user.id})`);
  }

  // Create or update the landlord profile for this user
  const landlord = await prisma.landlord.upsert({
    where: { userId: user.id },
    update: {
      businessName: "Jens Eiendom AS",
      taxId: "987654321",
      businessAddress: "Storgata 123, 0370 Oslo, Norge",
    },
    create: {
      userId: user.id,
      businessName: "Jens Eiendom AS",
      taxId: "987654321",
      businessAddress: "Storgata 123, 0370 Oslo, Norge",
    },
  });

  console.log(
    `🏘️ Created/updated landlord profile for: ${user.name || user.email}`
  );
  return landlord;
}

async function createProperty(landlordId, organizationId) {
  const property = await prisma.property.create({
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
      availabilityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dager i fremtiden
      isActive: true,
      landlordId,
      organizationId,
      amenities: {
        create: [
          { name: "Svømmebasseng", description: "Utendørsbasseng med soldekk" },
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

  console.log(`🏢 Opprettet eiendom: ${property.title}`);
  return property;
}

async function createSecondProperty(landlordId, organizationId) {
  const property = await prisma.property.create({
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
      availabilityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dager i fremtiden
      isActive: true,
      landlordId,
      organizationId,
      amenities: {
        create: [
          { name: "Hage", description: "Velholdt privat hage med terrasse" },
          {
            name: "Badstue",
            description: "Finsk badstue med fjordutsikt",
          },
          { name: "Garasje", description: "Dobbel garasje med ladestasjoner" },
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

  console.log(`🏡 Opprettet eiendom: ${property.title}`);
  return property;
}

main()
  .catch((e) => {
    console.error("❌ Feil under seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
