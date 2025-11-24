import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookiebeleid | Goeduitje.nl",
  description:
    "Lees ons cookiebeleid en ontdek hoe wij cookies gebruiken op onze website.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          Cookiebeleid
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg">
            Laatst bijgewerkt: november 2024
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Wat zijn cookies?</h2>
            <p>
              Cookies zijn kleine tekstbestanden die op uw computer of mobiele
              apparaat worden opgeslagen wanneer u onze website bezoekt. Ze
              helpen ons om uw ervaring op onze website te verbeteren.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              Welke cookies gebruiken wij?
            </h2>

            <h3 className="mt-4 text-lg font-medium">Noodzakelijke cookies</h3>
            <p>
              Deze cookies zijn essentieel voor het functioneren van de website.
              Zonder deze cookies kunnen bepaalde functies niet werken.
            </p>
            <ul>
              <li>Sessiecookies voor inloggen</li>
              <li>Beveiligingscookies</li>
              <li>Cookies voor het winkelwagentje/boekingsproces</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Analytische cookies</h3>
            <p>
              Deze cookies helpen ons begrijpen hoe bezoekers onze website
              gebruiken. De verzamelde gegevens zijn anoniem.
            </p>
            <ul>
              <li>Google Analytics (geanonimiseerd)</li>
              <li>Paginaviews en bezoekersaantallen</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium">Functionele cookies</h3>
            <p>
              Deze cookies onthouden uw voorkeuren en keuzes voor een betere
              gebruikerservaring.
            </p>
            <ul>
              <li>Taalvoorkeur</li>
              <li>Themavoorkeur (licht/donker)</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Cookies van derden</h2>
            <p>
              Wij gebruiken mogelijk cookies van de volgende externe partijen:
            </p>
            <ul>
              <li>
                <strong>Stripe:</strong> Voor veilige betalingsverwerking
              </li>
              <li>
                <strong>Google:</strong> Voor analytische doeleinden
              </li>
              <li>
                <strong>Social media:</strong> Voor het delen van content
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              Hoe kunt u cookies beheren?
            </h2>
            <p>
              U kunt uw cookievoorkeuren op elk moment aanpassen. De meeste
              browsers staan u toe om cookies te weigeren of te verwijderen.
              Houd er rekening mee dat het uitschakelen van cookies de
              functionaliteit van onze website kan beïnvloeden.
            </p>
            <p>
              Instructies voor het beheren van cookies vindt u in de help-sectie
              van uw browser:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/nl-nl/guide/safari/sfri11471"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/nl-nl/windows/cookies-verwijderen-en-beheren-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Bewaartermijn</h2>
            <p>
              De bewaartermijn van cookies varieert. Sessiecookies worden
              verwijderd wanneer u uw browser sluit. Permanente cookies kunnen
              tot 2 jaar worden bewaard.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>
              Voor vragen over ons cookiebeleid kunt u contact opnemen via{" "}
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
