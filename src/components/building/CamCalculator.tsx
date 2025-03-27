"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { RadioCardItem, RadioCardGroup } from "@/components/RadioCardGroup";
import { formatters } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table/DataTable";
import {
  calculateCamCharges,
  UnitCamCharge,
} from "@/actions/building/calculate-cam-charges";
import { saveCamCharges } from "@/actions/building/save-cam-charges";
import { updateCamSettings } from "@/actions/building/update-cam-settings";
import { Badge } from "@/components/Badge";
import { Tooltip } from "@/components/Tooltip";
import { Divider } from "@/components/Divider";
import {
  RiCalculatorLine,
  RiSaveLine,
  RiInformationLine,
  RiPercentLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";

interface CamCalculatorProps {
  buildingId: string;
  buildingTotalBRA: number;
  userId: string;
}

export function CamCalculator({
  buildingId,
  buildingTotalBRA,
  userId,
}: CamCalculatorProps) {
  const [calculationMethod, setCalculationMethod] = useState<
    "FIXED_RATE" | "ACTUAL_COST"
  >("FIXED_RATE");
  const [fixedRatePerSquareMeter, setFixedRatePerSquareMeter] =
    useState<number>(0);
  const [totalAnnualCost, setTotalAnnualCost] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<
    UnitCamCharge[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset the relevant fields when calculation method changes
  useEffect(() => {
    if (calculationMethod === "FIXED_RATE") {
      setTotalAnnualCost(0);
    } else {
      setFixedRatePerSquareMeter(0);
    }
    // Clear previous calculation results
    setCalculationResult(null);
    setError(null);
    setSuccessMessage(null);
  }, [calculationMethod]);

  // Auto-calculate the total annual cost based on fixed rate and total area
  useEffect(() => {
    if (calculationMethod === "FIXED_RATE" && fixedRatePerSquareMeter > 0) {
      setTotalAnnualCost(fixedRatePerSquareMeter * buildingTotalBRA);
    }
  }, [calculationMethod, fixedRatePerSquareMeter, buildingTotalBRA]);

  // Handle calculation of CAM charges
  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (
        calculationMethod === "FIXED_RATE" &&
        (!fixedRatePerSquareMeter || fixedRatePerSquareMeter <= 0)
      ) {
        setError("Vennligst angi en gyldig sats per kvadratmeter.");
        return;
      }

      if (
        calculationMethod === "ACTUAL_COST" &&
        (!totalAnnualCost || totalAnnualCost <= 0)
      ) {
        setError("Vennligst angi en gyldig total årlig kostnad.");
        return;
      }

      const result = await calculateCamCharges({
        propertyId: buildingId,
        year,
        calculationMethod,
        fixedRatePerSquareMeter:
          calculationMethod === "FIXED_RATE"
            ? fixedRatePerSquareMeter
            : undefined,
        totalAnnualCost:
          calculationMethod === "ACTUAL_COST" ? totalAnnualCost : undefined,
      });

      if (result.success && result.data) {
        setCalculationResult(result.data.unitCharges);
        setSuccessMessage("CAM-kostnader beregnet");
      } else {
        setError(result.error || "Kunne ikke beregne CAM-kostnader");
      }
    } catch (error) {
      console.error("Error calculating CAM charges:", error);
      setError("En feil oppstod under beregning av CAM-kostnader");
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle saving CAM charges
  const handleSave = async () => {
    if (!calculationResult || calculationResult.length === 0) {
      setError("Du må beregne CAM-kostnader før du kan lagre");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // First, save the CAM settings
      await updateCamSettings({
        propertyId: buildingId,
        estimationMethod:
          calculationMethod === "FIXED_RATE" ? "FIXED" : "BUDGET",
        calculationMethod,
        fixedRatePerSquareMeter:
          calculationMethod === "FIXED_RATE"
            ? fixedRatePerSquareMeter
            : undefined,
        totalAnnualCost: totalAnnualCost,
      });

      // Then, save the calculated charges
      const result = await saveCamCharges({
        propertyId: buildingId,
        year,
        calculationMethod,
        totalAnnualCost,
        unitCharges: calculationResult.map((unit) => ({
          unitId: unit.unitId,
          leaseIds: unit.leaseIds,
          annualCamCharge: unit.annualCamCharge,
          monthlyCamCharge: unit.monthlyCamCharge,
        })),
      });

      if (result.success) {
        setSuccessMessage(
          `CAM-kostnader lagret for ${result.data?.savedCharges || 0} leiekontrakter`
        );
      } else {
        setError(result.error || "Kunne ikke lagre CAM-kostnader");
      }
    } catch (error) {
      console.error("Error saving CAM charges:", error);
      setError("En feil oppstod under lagring av CAM-kostnader");
    } finally {
      setIsSaving(false);
    }
  };

  // Define columns for the units table
  const unitColumns = [
    {
      accessorKey: "unitNumber",
      header: "Enhet",
    },
    {
      accessorKey: "bra",
      header: "Areal (BRA)",
      cell: ({ row }: { row: any }) =>
        `${formatters.number(row.getValue("bra"))} m²`,
    },
    {
      accessorKey: "share",
      header: () => (
        <div className="flex items-center gap-1">
          <span>Andel</span>
          <Tooltip content="Andel viser prosentandelen av byggets totale areal som denne enheten utgjør. Denne prosenten brukes for å beregne enhetens andel av de totale CAM-kostnadene.">
            <RiInformationLine className="h-4 w-4 cursor-help text-gray-400" />
          </Tooltip>
        </div>
      ),
      cell: ({ row }: { row: any }) =>
        formatters.percent(row.getValue("share")),
    },
    {
      accessorKey: "annualCamCharge",
      header: "Årlig CAM",
      cell: ({ row }: { row: any }) =>
        formatters.currency(row.getValue("annualCamCharge"), "NOK"),
    },
    {
      accessorKey: "monthlyCamCharge",
      header: "Månedlig CAM",
      cell: ({ row }: { row: any }) =>
        formatters.currency(row.getValue("monthlyCamCharge"), "NOK"),
    },
    {
      accessorKey: "leaseIds",
      header: "Leiekontrakter",
      cell: ({ row }: { row: any }) => {
        const leaseIds = row.getValue("leaseIds");
        return leaseIds.length > 0 ? (
          <Badge variant="success">{leaseIds.length} aktive</Badge>
        ) : (
          <Badge variant="warning">Ingen</Badge>
        );
      },
    },
  ];

  // Add a SafeguardSection component after the table
  function SafeguardChecks({
    calculationResult,
    totalAnnualCost,
    buildingTotalBRA,
  }: {
    calculationResult: UnitCamCharge[] | null;
    totalAnnualCost: number;
    buildingTotalBRA: number;
  }) {
    if (!calculationResult || calculationResult.length === 0) return null;

    // Calculate sum of all shares to check if they equal 100%
    const totalShare = calculationResult.reduce(
      (sum, unit) => sum + (unit.share || 0),
      0
    );
    const shareDiscrepancy = Math.abs(1 - totalShare) > 0.001; // Check if not close to 1 (100%)

    // Calculate sum of all charges to check if they match total annual cost
    const totalCharges = calculationResult.reduce(
      (sum, unit) => sum + unit.annualCamCharge,
      0
    );
    const costDiscrepancy = Math.abs(totalAnnualCost - totalCharges) > 1; // More than 1 NOK difference

    // Check if any units have no active leases
    const unitsWithoutLeases = calculationResult.filter(
      (unit) => unit.leaseIds.length === 0
    );

    // Check if there are any units with very small or very large shares
    const unusualShares = calculationResult.filter(
      (unit) => unit.share < 0.01 || unit.share > 0.5
    );

    // If no issues found
    if (
      !shareDiscrepancy &&
      !costDiscrepancy &&
      unitsWithoutLeases.length === 0 &&
      unusualShares.length === 0
    ) {
      return (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </span>
            <h4 className="font-medium text-green-800 dark:text-green-400">
              CAM-beregningen ser korrekt ut
            </h4>
          </div>
          <p className="mt-2 pl-10 text-sm text-green-700 dark:text-green-300">
            Alle enhetsandeler summerer seg til 100%, og kostnadsfordelingen er
            i balanse.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
          <h4 className="font-medium text-amber-800 dark:text-amber-400">
            Kontrollpunkter for CAM-beregning
          </h4>
        </div>

        <div className="mt-3 space-y-3 pl-10">
          {shareDiscrepancy && (
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-400">
                Andelsprosenter summerer ikke til 100%
              </h5>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Totalsum av andeler: {formatters.percent(totalShare)}. Dette kan
                skyldes avrundingsfeil eller at noen arealer mangler i
                beregningen.
              </p>
            </div>
          )}

          {costDiscrepancy && (
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-400">
                Kostnadsfordelingen samsvarer ikke med total årlig kostnad
              </h5>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Total årlig kostnad:{" "}
                {formatters.currency(totalAnnualCost, "NOK")}
                <br />
                Sum av fordelte kostnader:{" "}
                {formatters.currency(totalCharges, "NOK")}
                <br />
                Differanse:{" "}
                {formatters.currency(
                  Math.abs(totalAnnualCost - totalCharges),
                  "NOK"
                )}
              </p>
            </div>
          )}

          {unitsWithoutLeases.length > 0 && (
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-400">
                Enheter uten aktive leiekontrakter
              </h5>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                {unitsWithoutLeases.length}{" "}
                {unitsWithoutLeases.length === 1 ? "enhet" : "enheter"} har
                ingen aktive leiekontrakter, men vil fortsatt bli tildelt
                CAM-kostnader. Disse kostnadene bør dekkes av utleier eller
                fordeles på andre måter.
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-700 dark:text-amber-300">
                {unitsWithoutLeases.map((unit) => (
                  <li key={unit.unitId}>
                    Enhet {unit.unitNumber}: {formatters.number(unit.bra)} m² (
                    {formatters.percent(unit.share)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {unusualShares.length > 0 && (
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-400">
                Enheter med uvanlige andelsstørrelser
              </h5>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Følgende enheter har enten meget små (under 1%) eller meget
                store (over 50%) andeler, noe som kan være verdt å undersøke:
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-700 dark:text-amber-300">
                {unusualShares.map((unit) => (
                  <li key={unit.unitId}>
                    Enhet {unit.unitNumber}: {formatters.number(unit.bra)} m² (
                    {formatters.percent(unit.share)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-1 text-sm text-amber-700 dark:text-amber-300">
            <p className="font-medium">Forklaring av "Andel %" i tabellen:</p>
            <p className="mt-1">
              Andel prosent viser hver enhets brøkdel av byggets totale areal.
              Denne andelen brukes til å beregne hvor stor del av
              fellesutgiftene enheten skal betale. Beregningen er: (Enhetens BRA
              ÷ Totalt BRA) × 100%.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            CAM Kalkulator
          </h2>
          <Tooltip content="CAM (Common Area Maintenance) er kostnader for vedlikehold og drift av fellesarealer som fordeles mellom leietakere basert på deres andel av byggets totale areal.">
            <div className="flex cursor-help items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <RiInformationLine className="h-4 w-4" />
              <span>Hva er CAM?</span>
            </div>
          </Tooltip>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Beregn og fordel fellesarealkostnader (CAM) mellom leietakere basert
          på deres andel av byggets areal. Kostnadene kan beregnes enten ved å
          bruke en fast sats per kvadratmeter eller ved å fordele faktiske
          kostnader.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <Card className="col-span-1 xl:col-span-1">
          <div className="flex items-center gap-2">
            <RiCalculatorLine className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
              Beregningsmetode
            </h3>
          </div>

          <Divider className="my-4" />

          <RadioCardGroup
            value={calculationMethod}
            onValueChange={(value) =>
              setCalculationMethod(value as "FIXED_RATE" | "ACTUAL_COST")
            }
            className="mb-6 grid grid-cols-1 gap-4"
          >
            <RadioCardItem value="FIXED_RATE">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="h-4 w-4 text-indigo-500" />
                  <span className="text-base font-medium">
                    Fast sats per m²
                  </span>
                </div>
                <span className="mt-1 text-sm text-gray-500">
                  Angi en fast sats per kvadratmeter for CAM-kostnader
                </span>
              </div>
            </RadioCardItem>
            <RadioCardItem value="ACTUAL_COST">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <RiPercentLine className="h-4 w-4 text-indigo-500" />
                  <span className="text-base font-medium">
                    Faktiske kostnader
                  </span>
                </div>
                <span className="mt-1 text-sm text-gray-500">
                  Fordel de faktiske kostnadene basert på areal
                </span>
              </div>
            </RadioCardItem>
          </RadioCardGroup>

          <div className="mb-6 space-y-4">
            <div>
              <Label htmlFor="year" className="flex items-center gap-2">
                <span>År</span>
                <Tooltip content="Velg året som CAM-beregningen gjelder for">
                  <RiInformationLine className="h-4 w-4 cursor-help text-gray-400" />
                </Tooltip>
              </Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={new Date().getFullYear() - 1}
                max={new Date().getFullYear() + 5}
              />
            </div>

            {calculationMethod === "FIXED_RATE" ? (
              <div>
                <Label htmlFor="fixedRate" className="flex items-center gap-2">
                  <span>Sats per m² (NOK/år)</span>
                  <Tooltip content="Angi beløpet som skal belastes per kvadratmeter per år">
                    <RiInformationLine className="h-4 w-4 cursor-help text-gray-400" />
                  </Tooltip>
                </Label>
                <Input
                  id="fixedRate"
                  type="number"
                  value={fixedRatePerSquareMeter || ""}
                  onChange={(e) =>
                    setFixedRatePerSquareMeter(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={0.01}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="totalCost" className="flex items-center gap-2">
                  <span>Total kostnad (NOK/år)</span>
                  <Tooltip content="Angi den totale årlige kostnaden for fellesarealer som skal fordeles">
                    <RiInformationLine className="h-4 w-4 cursor-help text-gray-400" />
                  </Tooltip>
                </Label>
                <Input
                  id="totalCost"
                  type="number"
                  value={totalAnnualCost || ""}
                  onChange={(e) =>
                    setTotalAnnualCost(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={100}
                />
              </div>
            )}
          </div>

          <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <RiBuilding2Line className="h-5 w-5 text-indigo-500" />
              <h4 className="font-medium text-gray-900 dark:text-gray-50">
                Eiendomsinformasjon
              </h4>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Total bruksareal (BRA):
                </span>
                <span className="font-medium">
                  {formatters.number(buildingTotalBRA)} m²
                </span>
              </div>

              {calculationMethod === "FIXED_RATE" &&
                fixedRatePerSquareMeter > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Total årlig kostnad:
                    </span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {formatters.currency(totalAnnualCost, "NOK")}
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <RiCalculatorLine className="h-4 w-4" />
              {isCalculating ? "Beregner..." : "Beregn CAM"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !calculationResult}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RiSaveLine className="h-4 w-4" />
              {isSaving ? "Lagrer..." : "Lagre CAM"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
            </div>
          )}
        </Card>

        <Card className="col-span-1 xl:col-span-3">
          <div className="flex items-center gap-2">
            <RiPercentLine className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
              CAM-kostnader per enhet
            </h3>
          </div>

          <Divider className="my-4" />

          {calculationResult && calculationResult.length > 0 ? (
            <div className="mt-4">
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <DataTable data={calculationResult} columns={unitColumns} />
              </div>

              <SafeguardChecks
                calculationResult={calculationResult}
                totalAnnualCost={totalAnnualCost}
                buildingTotalBRA={buildingTotalBRA}
              />

              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-50">
                  Oppsummering
                </h4>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <li className="rounded-md bg-white p-3 shadow-sm dark:bg-gray-900">
                    <span className="text-sm text-gray-500">
                      Beregningsmetode
                    </span>
                    <p className="mt-1 font-medium">
                      {calculationMethod === "FIXED_RATE"
                        ? "Fast sats per m²"
                        : "Faktiske kostnader"}
                    </p>
                  </li>
                  <li className="rounded-md bg-white p-3 shadow-sm dark:bg-gray-900">
                    <span className="text-sm text-gray-500">
                      Total årlig CAM
                    </span>
                    <p className="mt-1 font-medium text-indigo-600 dark:text-indigo-400">
                      {formatters.currency(totalAnnualCost, "NOK")}
                    </p>
                  </li>
                  <li className="rounded-md bg-white p-3 shadow-sm dark:bg-gray-900">
                    <span className="text-sm text-gray-500">
                      Total månedlig CAM
                    </span>
                    <p className="mt-1 font-medium text-indigo-600 dark:text-indigo-400">
                      {formatters.currency(totalAnnualCost / 12, "NOK")}
                    </p>
                  </li>
                  <li className="rounded-md bg-white p-3 shadow-sm dark:bg-gray-900">
                    <span className="text-sm text-gray-500">Sats per m²</span>
                    <p className="mt-1 font-medium">
                      {formatters.currency(
                        totalAnnualCost / buildingTotalBRA,
                        "NOK"
                      )}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-md border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/50 dark:bg-indigo-900/20">
                <h4 className="flex items-center gap-2 font-medium text-indigo-700 dark:text-indigo-400">
                  <RiInformationLine className="h-5 w-5" />
                  Om CAM-beregningen
                </h4>
                <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
                  CAM-kostnader (Common Area Maintenance) er utgifter knyttet
                  til drift og vedlikehold av fellesarealer i en bygning. Disse
                  kostnadene fordeles vanligvis mellom leietakere basert på
                  deres prosentvise andel av byggets totale areal. Ved å bruke
                  denne kalkulatoren kan du beregne hvor mye hver enhet skal
                  betale basert på enten en fast pris per m² eller ved å fordele
                  de faktiske kostnadene proporsjonalt.
                </p>

                <div className="mt-4 rounded-md bg-white p-3 dark:bg-gray-800">
                  <h5 className="font-medium text-indigo-700 dark:text-indigo-400">
                    Hva betyr "Andel %" i tabellen?
                  </h5>
                  <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-300">
                    Andel % viser hver enhets prosentandel av byggets totale
                    bruksareal (BRA). Denne prosenten brukes direkte for å
                    beregne hvor stor del av de totale CAM-kostnadene som skal
                    belastes enheten.
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-indigo-100 pt-2 md:grid-cols-2 dark:border-indigo-900/30">
                    <div>
                      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                        Beregningsformel:
                      </p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300">
                        Andel (%) = (Enhetens BRA ÷ Byggets totale BRA) × 100%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                        Eksempel:
                      </p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300">
                        Enhet: 100 m², Byggets totale BRA: 1000 m²
                        <br />
                        Andel = (100 ÷ 1000) × 100% = 10%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-10 dark:border-gray-700">
              <RiCalculatorLine className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
                Ingen beregninger utført ennå. Angi beregningsmetode og verdier
                i panelet til venstre, og klikk deretter på "Beregn CAM" for å
                se kostnadsfordelingen for hver enhet.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
