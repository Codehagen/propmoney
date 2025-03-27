"use client";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer";
import { RadioCardGroup, RadioCardItem } from "@/components/RadioCardGroup";

import React, { useState } from "react";
import { Input } from "../Input";
import { Label } from "../Label";
import { DatePicker } from "../DatePicker";
import { Checkbox } from "../Checkbox";
import {
  RiAddLine,
  RiUser3Line,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";

// Define tenant status options
const tenantStatusOptions = [
  {
    value: "active",
    label: "Aktiv",
    description: "Leietaker med aktiv kontrakt",
  },
  {
    value: "inactive",
    label: "Inaktiv",
    description: "Tidligere leietaker eller utløpt kontrakt",
  },
];

// Define tenant form data type
interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  leaseStart: Date | undefined;
  leaseEnd: Date | undefined;
  rentAmount: string;
  rentPaid: boolean;
  status: string;
}

interface AddTenantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buildingId?: string;
  userId?: string;
  onAddTenant?: (tenant: any) => void;
}

interface FormPageProps {
  formData: TenantFormData;
  onUpdateForm: (updates: Partial<TenantFormData>) => void;
}

const FormField = ({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <Label className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="mt-2">{children}</div>
  </div>
);

const ContactInfoPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Legg til leietaker</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
          Kontaktinformasjon
        </span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Navn" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiUser3Line />
          </span>
          <Input
            name="name"
            value={formData.name}
            onChange={(e) => onUpdateForm({ name: e.target.value })}
            placeholder="Ola Nordmann"
            className="w-full pl-10"
          />
        </div>
      </FormField>

      <FormField label="E-post">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiMailLine />
          </span>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateForm({ email: e.target.value })}
            placeholder="ola.nordmann@example.com"
            className="w-full pl-10"
          />
        </div>
      </FormField>

      <FormField label="Telefon">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiPhoneLine />
          </span>
          <Input
            name="phone"
            value={formData.phone}
            onChange={(e) => onUpdateForm({ phone: e.target.value })}
            placeholder="+47 123 45 678"
            className="w-full pl-10"
          />
        </div>
      </FormField>

      <FormField label="Status">
        <RadioCardGroup
          defaultValue={formData.status}
          className="grid grid-cols-1 gap-2 text-sm"
          onValueChange={(value) => onUpdateForm({ status: value })}
        >
          {tenantStatusOptions.map((status) => (
            <RadioCardItem
              key={status.value}
              value={status.value}
              className="p-2.5 text-base duration-75 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500 data-[state=checked]:text-white sm:text-sm dark:focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{status.label}</span>
              </div>
              <span className="block text-sm opacity-75 sm:text-xs">
                {status.description}
              </span>
            </RadioCardItem>
          ))}
        </RadioCardGroup>
      </FormField>
    </DrawerBody>
  </>
);

const LeaseDetailsPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Leiekontrakt</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
          Kontraktsinformasjon
        </span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Leieperiode start" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiCalendarLine />
          </span>
          <div className="pl-10">
            <DatePicker
              value={formData.leaseStart}
              onChange={(date) => onUpdateForm({ leaseStart: date })}
            />
          </div>
        </div>
      </FormField>

      <FormField label="Leieperiode slutt" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiCalendarLine />
          </span>
          <div className="pl-10">
            <DatePicker
              value={formData.leaseEnd}
              onChange={(date) => onUpdateForm({ leaseEnd: date })}
            />
          </div>
        </div>
      </FormField>

      <FormField label="Månedlig leie (NOK)" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiMoneyDollarCircleLine />
          </span>
          <Input
            name="rentAmount"
            type="number"
            value={formData.rentAmount}
            onChange={(e) => onUpdateForm({ rentAmount: e.target.value })}
            placeholder="10000"
            className="w-full pl-10"
          />
        </div>
      </FormField>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rentPaid"
          checked={formData.rentPaid}
          onCheckedChange={(checked) =>
            onUpdateForm({ rentPaid: checked === true })
          }
        />
        <label
          htmlFor="rentPaid"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Leie er betalt for gjeldende periode
        </label>
      </div>
    </DrawerBody>
  </>
);

const SummaryPage = ({ formData }: { formData: TenantFormData }) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Oppsummering</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
          Bekreft informasjonen før du lagrer
        </span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-4 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="font-medium">Kontaktinformasjon</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Navn</span>
              <span className="text-sm font-medium">
                {formData.name || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">E-post</span>
              <span className="text-sm font-medium">
                {formData.email || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Telefon</span>
              <span className="text-sm font-medium">
                {formData.phone || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium">
                {tenantStatusOptions.find((s) => s.value === formData.status)
                  ?.label || "Ikke oppgitt"}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium">Leiekontrakt</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Leieperiode start</span>
              <span className="text-sm font-medium">
                {formData.leaseStart
                  ? formData.leaseStart.toLocaleDateString()
                  : "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Leieperiode slutt</span>
              <span className="text-sm font-medium">
                {formData.leaseEnd
                  ? formData.leaseEnd.toLocaleDateString()
                  : "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Varighet</span>
              <span className="text-sm font-medium">
                {formData.leaseStart && formData.leaseEnd
                  ? Math.ceil(
                      (formData.leaseEnd.getTime() -
                        formData.leaseStart.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + " dager"
                  : "Ikke tilgjengelig"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Månedlig leie</span>
              <span className="text-sm font-medium">
                {formData.rentAmount
                  ? `${formData.rentAmount} NOK`
                  : "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                Betalt for gjeldende periode
              </span>
              <span className="text-sm font-medium">
                {formData.rentPaid ? "Ja" : "Nei"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DrawerBody>
  </>
);

export function AddTenant({
  open,
  onOpenChange,
  buildingId,
  userId,
  onAddTenant,
}: AddTenantProps) {
  const [formData, setFormData] = useState<TenantFormData>({
    name: "",
    email: "",
    phone: "",
    leaseStart: new Date(),
    leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    rentAmount: "",
    rentPaid: false,
    status: "active",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleUpdateForm = (updates: Partial<TenantFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const calculateDuration = () => {
    if (formData.leaseStart && formData.leaseEnd) {
      return Math.ceil(
        (formData.leaseEnd.getTime() - formData.leaseStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }
    return 0;
  };

  const handleSubmit = () => {
    const newTenant = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      leaseStart: formData.leaseStart?.toISOString().split("T")[0],
      leaseEnd: formData.leaseEnd?.toISOString().split("T")[0],
      rentPaid: formData.rentPaid,
      status: formData.status,
      rentDurationDays: calculateDuration(),
      rentRemainingDays: calculateDuration(),
      buildingId: buildingId,
    };

    console.log("Tenant created:", newTenant);
    if (onAddTenant) onAddTenant(newTenant);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      leaseStart: new Date(),
      leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: "",
      rentPaid: false,
      status: "active",
    });
    setCurrentPage(1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <ContactInfoPage
            formData={formData}
            onUpdateForm={handleUpdateForm}
          />
        );
      case 2:
        return (
          <LeaseDetailsPage
            formData={formData}
            onUpdateForm={handleUpdateForm}
          />
        );
      case 3:
        return <SummaryPage formData={formData} />;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (currentPage === 1) {
      return (
        <>
          <DrawerClose asChild>
            <Button variant="secondary">Avbryt</Button>
          </DrawerClose>
          <Button onClick={() => setCurrentPage(2)}>Fortsett</Button>
        </>
      );
    }
    if (currentPage === 2) {
      return (
        <>
          <Button variant="secondary" onClick={() => setCurrentPage(1)}>
            Tilbake
          </Button>
          <Button onClick={() => setCurrentPage(3)}>Se oppsummering</Button>
        </>
      );
    }
    return (
      <>
        <Button variant="secondary" onClick={() => setCurrentPage(2)}>
          Tilbake
        </Button>
        <Button onClick={handleSubmit}>Legg til leietaker</Button>
      </>
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-x-hidden sm:max-w-lg">
        {renderPage()}
        <DrawerFooter className="-mx-6 -mb-2 gap-2 px-6 sm:justify-between">
          {renderFooter()}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
