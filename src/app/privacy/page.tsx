import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid | Goeduitje.nl",
  description:
    "Lees ons privacybeleid en ontdek hoe wij omgaan met uw persoonsgegevens.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          Privacybeleid
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg">
            Laatst bijgewerkt: november 2024
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">1. Wie zijn wij?</h2>
            <p>
              Goeduitje.nl is verantwoordelijk voor de verwerking van
              persoonsgegevens zoals weergegeven in dit privacybeleid. Wij
              organiseren workshops en teambuildinguitjes door heel Nederland.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              2. Welke gegevens verzamelen wij?
            </h2>
            <p>Wij verzamelen de volgende persoonsgegevens:</p>
            <ul>
              <li>Voor- en achternaam</li>
              <li>E-mailadres</li>
              <li>Telefoonnummer</li>
              <li>Bedrijfsnaam (indien van toepassing)</li>
              <li>Factuurgegevens</li>
              <li>Dieetwensen en allergieën (voor kookworkshops)</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              3. Waarom verzamelen wij deze gegevens?
            </h2>
            <p>Wij gebruiken uw gegevens voor:</p>
            <ul>
              <li>Het verwerken van boekingen en reserveringen</li>
              <li>Het versturen van bevestigingen en facturen</li>
              <li>Communicatie over uw boeking</li>
              <li>Het informeren over wijzigingen of annuleringen</li>
              <li>
                Het verzenden van nieuwsbrieven (alleen met uw toestemming)
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              4. Hoe lang bewaren wij uw gegevens?
            </h2>
            <p>
              Wij bewaren uw persoonsgegevens niet langer dan strikt
              noodzakelijk is om de doelen te realiseren waarvoor uw gegevens
              worden verzameld. Factuurgegevens worden 7 jaar bewaard conform de
              wettelijke bewaarplicht.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">5. Delen met derden</h2>
            <p>
              Wij delen uw gegevens alleen met derden als dit noodzakelijk is
              voor de uitvoering van onze diensten:
            </p>
            <ul>
              <li>Workshoplocaties en instructeurs</li>
              <li>Betalingsverwerkers (Stripe)</li>
              <li>E-mailserviceproviders (voor boekingsbevestigingen)</li>
            </ul>
            <p>
              Wij verkopen uw gegevens nooit aan derden voor
              marketingdoeleinden.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">6. Uw rechten</h2>
            <p>U heeft het recht om:</p>
            <ul>
              <li>Inzage te vragen in uw persoonsgegevens</li>
              <li>Uw gegevens te laten corrigeren of verwijderen</li>
              <li>Bezwaar te maken tegen de verwerking</li>
              <li>Uw gegevens over te laten dragen</li>
              <li>
                Een klacht in te dienen bij de Autoriteit Persoonsgegevens
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">7. Beveiliging</h2>
            <p>
              Wij nemen de bescherming van uw gegevens serieus en nemen passende
              maatregelen om misbruik, verlies, onbevoegde toegang, en
              ongewenste openbaarmaking tegen te gaan. Onze website maakt
              gebruik van een beveiligde SSL-verbinding.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">8. Contact</h2>
            <p>
              Voor vragen over dit privacybeleid of een verzoek met betrekking
              tot uw persoonsgegevens kunt u contact opnemen via{" "}
              <a
                href="mailto:privacy@goeduitje.nl"
                className="text-primary hover:underline"
              >
                privacy@goeduitje.nl
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
