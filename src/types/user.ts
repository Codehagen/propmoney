import {
  User as PrismaUser,
  UserRole,
  Landlord,
  PropertyManager,
  TenantContact,
  OrganizationMember,
  Organization,
  CommercialTenant,
  Property,
  CamSettings,
  CommercialUnit,
  Lease,
  LeaseType,
  PropertyType,
  PropertyClass,
} from "@prisma/client";

// Full User type with relationships
export interface User extends PrismaUser {
  landlordProfile?: Landlord | null;
  managerProfile?: PropertyManager | null;
  tenantContacts?: TenantContact[] | null;
  organizations?:
    | (OrganizationMember & {
        organization: Organization;
      })[]
    | null;
}

// Commercial tenant with its contacts
export interface CommercialTenantWithContacts extends CommercialTenant {
  contacts: TenantContact[];
}

// Property with related data
export interface PropertyWithDetails extends Property {
  images: { url: string; isPrimary: boolean; caption?: string | null }[];
  amenities: { name: string; description?: string | null }[];
  units?: CommercialUnit[];
  camSettings?: CamSettings | null;
}

// Unit with lease information
export interface CommercialUnitWithLeases extends CommercialUnit {
  leases: (Lease & {
    tenant: CommercialTenantWithContacts;
  })[];
}

// Property with units and lease details
export interface PropertyWithUnits extends PropertyWithDetails {
  units: CommercialUnitWithLeases[];
}

// Landlord with properties
export interface LandlordWithProperties extends Landlord {
  properties: PropertyWithDetails[];
  user: User;
}

// Dashboard data
export interface LandlordDashboard {
  landlord: LandlordWithProperties;
  stats: {
    propertyCount: number;
    unitCount: number;
    [key: string]: any;
  };
}
