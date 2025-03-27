import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { Badge } from "@/components/Badge";
import {
  RiInformationLine,
  RiCalculatorLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiQuestionLine,
  RiTimeLine,
  RiErrorWarningLine,
} from "@remixicon/react";

export function CamExplanation() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
          Forstå CAM-kostnader
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          En omfattende guide til Common Area Maintenance (CAM) kostnader i
          kommersiell eiendom
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <div className="flex items-center gap-2">
            <RiInformationLine className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Hva er CAM?
            </h2>
          </div>

          <Divider className="my-4" />

          <p className="text-gray-700 dark:text-gray-300">
            CAM (Common Area Maintenance) er kostnader forbundet med drift og
            vedlikehold av fellesarealer i kommersielle bygninger. Disse
            områdene er tilgjengelige for alle leietakere, men eies og forvaltes
            av bygningens eier.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                Typiske fellesarealer inkluderer:
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li>Trappehus og korridorer</li>
                <li>Heiser og inngangspartier</li>
                <li>Felles toaletter og kjøkkenfasiliteter</li>
                <li>Parkeringsplasser og uteområder</li>
                <li>Felles møterom og fellesarealer</li>
              </ul>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                Typiske CAM-kostnader inkluderer:
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li>Renhold og vaktmestertjenester</li>
                <li>Snømåking og gressklipping</li>
                <li>Vedlikehold av heis og HVAC-systemer</li>
                <li>Felles strøm og belysning</li>
                <li>Sikkerhetstjenester</li>
                <li>Administrasjonskostnader</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <RiCalculatorLine className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Hvordan beregnes CAM-kostnader?
            </h2>
          </div>

          <Divider className="my-4" />

          <p className="text-gray-700 dark:text-gray-300">
            CAM-kostnader fordeles vanligvis mellom leietakere basert på deres
            prosentvise andel av byggets totale leieareal. Det finnes
            hovedsakelig to metoder for å beregne CAM-kostnader:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-md border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900/50 dark:bg-indigo-900/20">
              <div className="mb-3 flex items-center gap-2">
                <RiMoneyDollarCircleLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-medium text-indigo-700 dark:text-indigo-400">
                  Fast sats per m²
                </h3>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Ved denne metoden fastsettes en standardpris per kvadratmeter
                som hver leietaker betaler basert på leieareal. Dette er enkelt
                å administrere og gir forutsigbare kostnader for både eier og
                leietaker.
              </p>
              <div className="mt-4 rounded-md bg-white p-3 text-sm dark:bg-gray-800">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Beregning: Leieareal × Fast sats per m²
                </p>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Eksempel: 100 m² × 200 NOK/m² = 20 000 NOK per år
                </p>
              </div>
            </div>

            <div className="rounded-md border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900/50 dark:bg-indigo-900/20">
              <div className="mb-3 flex items-center gap-2">
                <RiPercentLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-medium text-indigo-700 dark:text-indigo-400">
                  Faktiske kostnader
                </h3>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Ved denne metoden fordeles de faktiske kostnadene for drift og
                vedlikehold av fellesarealer mellom leietakerne basert på deres
                prosentvise andel av byggets totale areal. Dette sikrer at
                kostnadene reflekterer de faktiske utgiftene.
              </p>
              <div className="mt-4 rounded-md bg-white p-3 text-sm dark:bg-gray-800">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Beregning: (Leieareal ÷ Totalt areal) × Totale CAM-kostnader
                </p>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Eksempel: (100 m² ÷ 1000 m²) × 200 000 NOK = 20 000 NOK per år
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <RiTimeLine className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              CAM-avregning og estimering
            </h2>
          </div>

          <Divider className="my-4" />

          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Siden de faktiske CAM-kostnadene kan variere gjennom året, er det
            vanlig å bruke estimater for månedlige betalinger, med en årlig
            avstemming som justerer for forskjeller mellom estimerte og faktiske
            kostnader.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-gray-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  1
                </span>
                Månedlige estimater
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leietakere betaler vanligvis månedlige estimater basert på
                forventede årlige CAM-kostnader. Disse estimatene beregnes ofte
                på grunnlag av foregående års kostnader pluss forventede
                økninger.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-gray-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  2
                </span>
                Årlig avstemming
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ved slutten av året gjøres en avstemming mellom de estimerte
                betalingene og de faktiske kostnadene. Hvis de faktiske
                kostnadene var høyere enn estimatene, må leietakeren betale
                forskjellen. Hvis de var lavere, kan leietakeren motta en
                kreditt eller refusjon.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <RiQuestionLine className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Vanlige spørsmål om CAM
            </h2>
          </div>

          <Divider className="my-4" />

          <div className="space-y-5">
            <div>
              <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-50">
                Er alle CAM-kostnader belastbare til leietakerne?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ikke nødvendigvis. Hva som kan belastes leietakerne er definert
                i leieavtalen. Noen kostnader, som strukturelle reparasjoner
                eller kapitalutgifter, kan være utleiers ansvar.
              </p>
            </div>

            <div>
              <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-50">
                Hva er forskjellen mellom CAM og triple-net (NNN) leie?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                I en triple-net leieavtale betaler leietakeren CAM-kostnader
                pluss eiendomsskatt og bygningsforsikring, i tillegg til
                grunnleien. CAM er bare en del av de totale kostnadene i en
                triple-net leieavtale.
              </p>
            </div>

            <div>
              <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-50">
                Kan CAM-kostnader øke under leieperioden?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ja, CAM-kostnader kan variere fra år til år basert på faktiske
                utgifter. Noen leieavtaler inkluderer et CAM-tak for å begrense
                hvor mye disse kostnadene kan øke hvert år.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <RiErrorWarningLine className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Beste praksis for CAM-håndtering
            </h2>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                For utleiere:
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Vær transparent om CAM-kostnader og beregninger</li>
                <li>Dokumenter alle utgifter grundig</li>
                <li>Gjennomfør regelmessige inspeksjoner og vedlikehold</li>
                <li>Sørg for at CAM-vilkårene er tydelige i leieavtalen</li>
                <li>Budsjetter nøyaktig for å minimere store svingninger</li>
              </ul>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                For leietakere:
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Forstå CAM-vilkårene i leieavtalen før signering</li>
                <li>Be om detaljerte årsrapporter for CAM-utgifter</li>
                <li>Vurder å forhandle om et CAM-tak for forutsigbarhet</li>
                <li>Kontroller årlige avstemminger nøye</li>
                <li>
                  Diskuter muligheten for å utelukke visse utgifter fra CAM
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Badge
          variant="default"
          className="px-4 py-2 text-gray-500 dark:text-gray-400"
        >
          PropMoney CAM Guide
        </Badge>
      </div>
    </div>
  );
}
