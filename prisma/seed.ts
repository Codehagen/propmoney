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
    "CamExpenseItem",
    "CamCharge",
    "RentEscalation",
    "Lease",
    "Application",
    "PropertyImage",
    "PropertyAmenity",
    "CommercialUnit",
    "OperatingExpense",
    "CamSettings",
    "FinancialYearSettings",
    "PropertyManager_Property",
    "Property",
    "TenantFinancial",
    "TenantContact",
    "CommercialTenant",
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
      title: "Oslo Business Center",
      description:
        "Moderne kontorbygg i Oslo sentrum med fleksible kontorløsninger og førsteklasses fasiliteter.",
      address: "Osloveien 123",
      city: "Oslo",
      state: "Oslo",
      zipCode: "0370",
      country: "Norway",
      latitude: 59.9139,
      longitude: 10.7522,
      propertyType: "OFFICE",
      propertyClass: "CLASS_A",
      totalBTA: 5000, // Bruttoareal (m²)
      totalBRA: 4500, // Bruksareal (m²)
      commonAreaBRA: 500, // Fellesareal (m²)
      floors: 5,
      parkingSpaces: 50,
      yearBuilt: 2015,
      availabilityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dager i fremtiden
      isActive: true,
      landlordId,
      organizationId,
      amenities: {
        create: [
          {
            name: "Konferanserom",
            description: "10 møterom i ulike størrelser",
          },
          {
            name: "Kantine",
            description: "Moderne kantine med varierte menyer",
          },
          {
            name: "Parkering",
            description: "Innendørs parkering med ladestasjoner",
          },
          {
            name: "Treningssenter",
            description: "Bedriftstreningssenter med garderober",
          },
        ],
      },
      images: {
        create: [
          {
            url: "https://placehold.co/800x600?text=Kontorbygg+Eksteriør",
            caption: "Bygningens eksteriør",
            isPrimary: true,
          },
          {
            url: "https://placehold.co/800x600?text=Resepsjon",
            caption: "Moderne resepsjonsområde",
          },
          {
            url: "https://placehold.co/800x600?text=Kontor",
            caption: "Eksempel på kontorløsning",
          },
        ],
      },
      units: {
        create: [
          {
            unitNumber: "A101",
            floor: 1,
            bra: 300,
            commonAreaFactor: 1.15,
            basePrice: 3500, // NOK per m² per år
            isAvailable: true,
            description: "Hjørnelokale med god eksponering og mye dagslys",
          },
          {
            unitNumber: "B205",
            floor: 2,
            bra: 500,
            commonAreaFactor: 1.15,
            basePrice: 3200, // NOK per m² per år
            isAvailable: true,
            description: "Åpen kontorløsning med dedikerte møterom",
          },
        ],
      },
      camSettings: {
        create: {
          reconciliationMonth: 12, // Desember
          estimationMethod: "PREVIOUS_YEAR",
          adminFeePercentage: 3.5,
        },
      },
      financialYearSettings: {
        create: {
          startMonth: 1, // Januar
          startDay: 1,
        },
      },
    },
  });

  // Add sample operating expenses
  await prisma.operatingExpense.createMany({
    data: [
      {
        propertyId: property.id,
        category: "CLEANING",
        description: "Månedlig renhold av fellesarealer",
        vendorName: "Oslo Renhold AS",
        amount: 35000,
        date: new Date(),
        billable: true,
      },
      {
        propertyId: property.id,
        category: "MAINTENANCE",
        description: "HVAC-system vedlikehold",
        vendorName: "Teknisk Service AS",
        amount: 45000,
        date: new Date(),
        billable: true,
      },
      {
        propertyId: property.id,
        category: "UTILITIES",
        description: "Strøm og vannforbruk",
        vendorName: "Oslo Energi",
        amount: 85000,
        date: new Date(),
        billable: true,
      },
    ],
  });

  console.log(`🏢 Opprettet eiendom: ${property.title}`);
  return property;
}

async function createSecondProperty(landlordId, organizationId) {
  const property = await prisma.property.create({
    data: {
      title: "Bergen Retail Center",
      description:
        "Moderne shoppingsenter i Bergen sentrum med god synlighet og høy kundetrafikk.",
      address: "Bergensgaten 45",
      city: "Bergen",
      state: "Vestland",
      zipCode: "5003",
      country: "Norway",
      latitude: 60.3913,
      longitude: 5.3221,
      propertyType: "RETAIL",
      propertyClass: "CLASS_B",
      totalBTA: 8000, // Bruttoareal (m²)
      totalBRA: 7200, // Bruksareal (m²)
      commonAreaBRA: 800, // Fellesareal (m²)
      floors: 3,
      parkingSpaces: 120,
      yearBuilt: 2010,
      availabilityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
      landlordId,
      organizationId,
      amenities: {
        create: [
          { name: "Food Court", description: "10 ulike spisesteder" },
          {
            name: "Gratis WiFi",
            description: "Høyhastighets WiFi i hele bygget",
          },
          { name: "Kundeparkering", description: "2 timers gratis parkering" },
          {
            name: "Vareheis",
            description: "Stor vareheis for butikkleveranser",
          },
        ],
      },
      images: {
        create: [
          {
            url: "https://placehold.co/800x600?text=Kjøpesenter+Eksteriør",
            caption: "Kjøpesenterets fasade",
            isPrimary: true,
          },
          {
            url: "https://placehold.co/800x600?text=Food+Court",
            caption: "Food Court område",
          },
          {
            url: "https://placehold.co/800x600?text=Butikkområde",
            caption: "Hovedetasje butikkområde",
          },
        ],
      },
      units: {
        create: [
          {
            unitNumber: "R101",
            floor: 1,
            bra: 150,
            commonAreaFactor: 1.25,
            basePrice: 6500, // NOK per m² per år
            isAvailable: true,
            description: "Butikklokale med høy eksponering mot hovedinngang",
          },
          {
            unitNumber: "R102",
            floor: 1,
            bra: 200,
            commonAreaFactor: 1.25,
            basePrice: 5800, // NOK per m² per år
            isAvailable: true,
            description: "Butikklokale med store vindusflater",
          },
          {
            unitNumber: "R201",
            floor: 2,
            bra: 350,
            commonAreaFactor: 1.2,
            basePrice: 4500, // NOK per m² per år
            isAvailable: false,
            description: "Lokale for serveringsbedrift med utgang til terrasse",
          },
        ],
      },
      camSettings: {
        create: {
          reconciliationMonth: 12, // Desember
          estimationMethod: "BUDGET",
          adminFeePercentage: 4.0,
        },
      },
      financialYearSettings: {
        create: {
          startMonth: 1, // Januar
          startDay: 1,
        },
      },
    },
  });

  // Add sample operating expenses
  await prisma.operatingExpense.createMany({
    data: [
      {
        propertyId: property.id,
        category: "CLEANING",
        description: "Daglig renhold av fellesarealer",
        vendorName: "Bergen Renhold AS",
        amount: 65000,
        date: new Date(),
        billable: true,
      },
      {
        propertyId: property.id,
        category: "SECURITY",
        description: "Sikkerhetstjenester og vektere",
        vendorName: "Sikker Vakt AS",
        amount: 85000,
        date: new Date(),
        billable: true,
      },
      {
        propertyId: property.id,
        category: "UTILITIES",
        description: "Strøm, vann og oppvarming",
        vendorName: "Bergen Energi",
        amount: 120000,
        date: new Date(),
        billable: true,
      },
      {
        propertyId: property.id,
        category: "MANAGEMENT_FEE",
        description: "Administrasjonshonorar",
        vendorName: "PropMoney Eiendom AS",
        amount: 75000,
        date: new Date(),
        billable: true,
      },
    ],
  });

  // Create a commercial tenant
  const tenant = await prisma.commercialTenant.create({
    data: {
      name: "Fjellet Sport AS",
      organizationNumber: "123456789",
      vatNumber: "NO123456789MVA",
      industry: "Retail - Sporting Goods",
      foundedYear: 2005,
      website: "https://example.com/fjelletsport",
      organizationId: organizationId,
      contacts: {
        create: [
          {
            name: "Lars Sportsen",
            email: "lars@fjelletsport.no",
            phone: "+47 98765432",
            position: "Daglig leder",
            isPrimary: true,
          },
          {
            name: "Marte Fjell",
            email: "marte@fjelletsport.no",
            phone: "+47 91234567",
            position: "Økonomiansvarlig",
            isPrimary: false,
          },
        ],
      },
    },
  });

  // Create a lease for the tenant
  const unit = await prisma.commercialUnit.findFirst({
    where: {
      propertyId: property.id,
      unitNumber: "R201",
    },
  });

  if (unit) {
    const lease = await prisma.lease.create({
      data: {
        unitId: unit.id,
        tenantId: tenant.id,
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Started 1 year ago
        endDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // Ends in 2 years
        leaseType: "TRIPLE_NET",
        baseRentAmount: unit.basePrice * unit.bra, // Annual base rent
        rentPerSqm: unit.basePrice,
        securityDeposit: (unit.basePrice * unit.bra) / 4, // 3 months rent
        noticePeriodDays: 180,
        hasTenantOptionToRenew: true,
        status: "ACTIVE",
        rentEscalations: {
          create: {
            type: "CPI",
            frequency: 12, // Annual
            rate: 2.5, // 2.5%
            effectiveDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // One year from now
          },
        },
      },
    });

    // Create a CAM charge for the lease
    await prisma.camCharge.create({
      data: {
        leaseId: lease.id,
        year: new Date().getFullYear(),
        monthlyEstimate: 15000,
        annualEstimate: 180000,
        reconciled: false,
        expenseItems: {
          create: [
            {
              category: "CLEANING",
              description: "Renhold fellesarealer",
              estimate: 45000,
            },
            {
              category: "SECURITY",
              description: "Sikkerhetstjenester",
              estimate: 35000,
            },
            {
              category: "UTILITIES",
              description: "Strøm og oppvarming fellesarealer",
              estimate: 65000,
            },
            {
              category: "MANAGEMENT_FEE",
              description: "Administrasjonskostnader",
              estimate: 35000,
            },
          ],
        },
      },
    });
  }

  console.log(`🏢 Opprettet eiendom: ${property.title}`);
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
