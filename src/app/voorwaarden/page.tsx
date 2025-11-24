import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Goeduitje.nl",
  description:
    "Lees onze algemene voorwaarden voor het boeken van workshops en teambuildinguitjes bij Goeduitje.nl",
};

export default function VoorwaardenPage() {
  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          Algemene Voorwaarden
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg">
            Laatst bijgewerkt: november 2024
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">1. Definities</h2>
            <p>In deze algemene voorwaarden wordt verstaan onder:</p>
            <ul>
              <li>
                <strong>Goeduitje.nl:</strong> de organisator van workshops en
                teambuildinguitjes, gevestigd in Nederland.
              </li>
              <li>
                <strong>Klant:</strong> de natuurlijke of rechtspersoon die een
                overeenkomst aangaat met Goeduitje.nl.
              </li>
              <li>
                <strong>Workshop:</strong> een activiteit georganiseerd door
                Goeduitje.nl, waaronder maar niet beperkt tot kookworkshops,
                creatieve workshops en teambuildingactiviteiten.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">2. Toepasselijkheid</h2>
            <p>
              Deze algemene voorwaarden zijn van toepassing op alle
              aanbiedingen, offertes en overeenkomsten tussen Goeduitje.nl en de
              Klant.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">3. Boekingen</h2>
            <p>
              Een boeking komt tot stand op het moment dat de Klant de boeking
              bevestigt en de aanbetaling heeft voldaan. Na bevestiging ontvangt
              de Klant een bevestigingsmail met alle relevante informatie.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">4. Betaling</h2>
            <p>
              Betaling dient te geschieden binnen 14 dagen na factuurdatum,
              tenzij anders overeengekomen. Bij boekingen binnen 14 dagen voor
              de activiteit dient direct betaald te worden.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">5. Annulering</h2>
            <p>
              Annulering door de Klant is mogelijk onder de volgende
              voorwaarden:
            </p>
            <ul>
              <li>
                Tot 30 dagen voor de activiteit: volledige restitutie minus €25
                administratiekosten
              </li>
              <li>14-30 dagen voor de activiteit: 50% restitutie</li>
              <li>Minder dan 14 dagen voor de activiteit: geen restitutie</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">6. Aansprakelijkheid</h2>
            <p>
              Goeduitje.nl is niet aansprakelijk voor schade die voortvloeit uit
              deelname aan workshops, tenzij deze schade het directe gevolg is
              van opzet of grove nalatigheid van Goeduitje.nl. Deelname aan
              activiteiten geschiedt op eigen risico.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">7. Overmacht</h2>
            <p>
              In geval van overmacht is Goeduitje.nl gerechtigd de uitvoering
              van de overeenkomst op te schorten of de overeenkomst te
              ontbinden, zonder gehouden te zijn tot enige schadevergoeding.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">8. Intellectueel eigendom</h2>
            <p>
              Alle intellectuele eigendomsrechten op de inhoud van de website en
              workshops berusten bij Goeduitje.nl. Niets mag zonder voorafgaande
              schriftelijke toestemming worden verveelvoudigd of openbaar
              gemaakt.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">9. Toepasselijk recht</h2>
            <p>
              Op alle overeenkomsten is Nederlands recht van toepassing.
              Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">10. Contact</h2>
            <p>
              Voor vragen over deze voorwaarden kunt u contact opnemen via{" "}
              <a
                href="mailto:info@goeduitje.nl"
                className="text-primary hover:underline"
              >
                info@goeduitje.nl
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
