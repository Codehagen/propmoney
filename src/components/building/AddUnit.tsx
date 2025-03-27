"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer";
import { addBuildingUnit } from "@/actions/building/add-building-unit";
import { CommercialUnitData } from "@/actions/building/get-building-units";
import { toast } from "sonner";
import {
  RiAddLine,
  RiBuilding2Line,
  RiDoorOpenLine,
  RiRulerLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";

// Define form data type
interface UnitFormData {
  unitNumber: string;
  floor: number;
  bra: number; // Area in square meters
  basePrice: number;
  commonAreaFactor: number;
  description: string;
}

interface AddUnitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buildingId: string;
  userId: string;
  onAddUnit: (unit: CommercialUnitData) => void;
}

interface FormPageProps {
  formData: UnitFormData;
  onUpdateForm: (updates: Partial<UnitFormData>) => void;
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

const BasicInfoPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Legg til enhet</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
          Grunnleggende informasjon
        </span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Enhetsnummer" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiDoorOpenLine />
          </span>
          <Input
            name="unitNumber"
            value={formData.unitNumber}
            onChange={(e) => onUpdateForm({ unitNumber: e.target.value })}
            placeholder="A101"
            className="w-full pl-10"
            required
          />
        </div>
      </FormField>

      <FormField label="Navn/beskrivelse">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiBuilding2Line />
          </span>
          <Input
            name="description"
            value={formData.description}
            onChange={(e) => onUpdateForm({ description: e.target.value })}
            placeholder="F.eks. Hjørnekontor, Butikklokale vest"
            className="w-full pl-10"
          />
        </div>
      </FormField>

      <FormField label="Etasje" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiBuilding2Line />
          </span>
          <Input
            name="floor"
            type="number"
            value={formData.floor}
            onChange={(e) => onUpdateForm({ floor: Number(e.target.value) })}
            placeholder="1"
            className="w-full pl-10"
            required
          />
        </div>
      </FormField>

      <FormField label="Areal (BRA) i m²" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiRulerLine />
          </span>
          <Input
            name="bra"
            type="number"
            value={formData.bra}
            onChange={(e) => onUpdateForm({ bra: Number(e.target.value) })}
            placeholder="100"
            className="w-full pl-10"
            required
          />
        </div>
      </FormField>
    </DrawerBody>
  </>
);

const FinancialDetailsPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Finansielle detaljer</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
          Pris og felles arealer
        </span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Grunnpris per m²" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiMoneyDollarCircleLine />
          </span>
          <Input
            name="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) =>
              onUpdateForm({ basePrice: Number(e.target.value) })
            }
            placeholder="1500"
            className="w-full pl-10"
            required
          />
        </div>
      </FormField>

      <FormField label="Fellesarealfaktor" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RiBuilding2Line />
          </span>
          <Input
            name="commonAreaFactor"
            type="number"
            step="0.01"
            value={formData.commonAreaFactor}
            onChange={(e) =>
              onUpdateForm({ commonAreaFactor: Number(e.target.value) })
            }
            placeholder="1.25"
            className="w-full pl-10"
            required
          />
        </div>
      </FormField>

      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Estimert månedsleie:{" "}
              <span className="font-semibold">
                {(
                  (formData.bra *
                    formData.basePrice *
                    formData.commonAreaFactor) /
                  12
                ).toLocaleString("no-NO")}{" "}
                NOK
              </span>
            </p>
          </div>
        </div>
      </div>
    </DrawerBody>
  </>
);

const SummaryPage = ({ formData }: { formData: UnitFormData }) => (
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
          <h3 className="font-medium">Enhetsdetaljer</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Enhetsnummer</span>
              <span className="text-sm font-medium">
                {formData.unitNumber || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Navn/beskrivelse</span>
              <span className="text-sm font-medium">
                {formData.description || "Ingen navn/beskrivelse"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Etasje</span>
              <span className="text-sm font-medium">
                {formData.floor || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Areal (BRA)</span>
              <span className="text-sm font-medium">
                {formData.bra ? `${formData.bra} m²` : "Ikke oppgitt"}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium">Finansielle detaljer</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Grunnpris per m²</span>
              <span className="text-sm font-medium">
                {formData.basePrice
                  ? `${formData.basePrice.toLocaleString("no-NO")} NOK`
                  : "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fellesarealfaktor</span>
              <span className="text-sm font-medium">
                {formData.commonAreaFactor || "Ikke oppgitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Estimert årlig leie</span>
              <span className="text-sm font-medium">
                {formData.bra && formData.basePrice
                  ? `${(formData.bra * formData.basePrice * formData.commonAreaFactor).toLocaleString("no-NO")} NOK`
                  : "Ikke tilgjengelig"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                Estimert månedlig leie
              </span>
              <span className="text-sm font-medium">
                {formData.bra && formData.basePrice
                  ? `${((formData.bra * formData.basePrice * formData.commonAreaFactor) / 12).toLocaleString("no-NO")} NOK`
                  : "Ikke tilgjengelig"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DrawerBody>
  </>
);

export function AddUnit({
  open,
  onOpenChange,
  buildingId,
  userId,
  onAddUnit,
}: AddUnitProps) {
  const [formData, setFormData] = useState<UnitFormData>({
    unitNumber: "",
    floor: 1,
    bra: 0,
    basePrice: 0,
    commonAreaFactor: 1.25,
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateForm = (updates: Partial<UnitFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await addBuildingUnit({
        buildingId,
        userId,
        unitNumber: formData.unitNumber,
        floor: formData.floor,
        bra: formData.bra,
        basePrice: formData.basePrice,
        commonAreaFactor: formData.commonAreaFactor,
        description: formData.description,
      });

      if (result.success && result.data) {
        onAddUnit(result.data);
        toast.success("Enheten ble lagt til");

        // Reset form
        setFormData({
          unitNumber: "",
          floor: 1,
          bra: 0,
          basePrice: 0,
          commonAreaFactor: 1.25,
          description: "",
        });
        setCurrentPage(1);
        onOpenChange(false);
      } else {
        setError(result.error || "Kunne ikke legge til enheten");
        toast.error(result.error || "Kunne ikke legge til enheten");
      }
    } catch (error) {
      setError("Det oppstod en feil. Vennligst prøv igjen.");
      toast.error("Det oppstod en feil. Vennligst prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <BasicInfoPage formData={formData} onUpdateForm={handleUpdateForm} />
        );
      case 2:
        return (
          <FinancialDetailsPage
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
          <Button
            onClick={() => setCurrentPage(2)}
            disabled={!formData.unitNumber || !formData.bra}
          >
            Fortsett
          </Button>
        </>
      );
    }
    if (currentPage === 2) {
      return (
        <>
          <Button variant="secondary" onClick={() => setCurrentPage(1)}>
            Tilbake
          </Button>
          <Button
            onClick={() => setCurrentPage(3)}
            disabled={!formData.basePrice}
          >
            Se oppsummering
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="secondary" onClick={() => setCurrentPage(2)}>
          Tilbake
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Lagrer..." : "Legg til enhet"}
        </Button>
      </>
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-x-hidden sm:max-w-lg">
        {error && (
          <div className="mx-6 mt-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
        {renderPage()}
        <DrawerFooter className="-mx-6 -mb-2 gap-2 px-6 sm:justify-between">
          {renderFooter()}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
