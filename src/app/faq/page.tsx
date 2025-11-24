"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Boekingen",
    questions: [
      {
        question: "Hoe kan ik een workshop boeken?",
        answer:
          "U kunt eenvoudig een workshop boeken via onze website. Kies de gewenste workshop, selecteer een datum en vul uw gegevens in. Na betaling ontvangt u direct een bevestiging per e-mail.",
      },
      {
        question: "Hoeveel personen moeten er minimaal deelnemen?",
        answer:
          "Het minimum aantal deelnemers verschilt per workshop. Over het algemeen is het minimum 8 personen. Bij sommige workshops is dit 6 of 10 personen. U vindt dit bij de workshopbeschrijving.",
      },
      {
        question: "Kan ik ook een privé-workshop boeken?",
        answer:
          "Ja, al onze workshops kunnen als privé-workshop worden geboekt voor uw groep. Neem contact met ons op voor een offerte op maat.",
      },
      {
        question: "Hoe ver van tevoren moet ik boeken?",
        answer:
          "Wij adviseren om minimaal 2 weken van tevoren te boeken. Voor populaire data en in het hoogseizoen raden we aan om nog eerder te reserveren. Last-minute boekingen zijn soms mogelijk, neem hiervoor contact met ons op.",
      },
    ],
  },
  {
    title: "Betaling & Annulering",
    questions: [
      {
        question: "Welke betaalmethoden accepteren jullie?",
        answer:
          "Wij accepteren iDEAL, creditcard (Visa, Mastercard), en betaling op factuur voor zakelijke klanten. De betaling verloopt via Stripe, een beveiligde betalingsverwerker.",
      },
      {
        question: "Kan ik mijn boeking annuleren?",
        answer:
          "Ja, annuleren is mogelijk. Tot 30 dagen voor de activiteit ontvangt u volledige restitutie minus €25 administratiekosten. Tussen 14-30 dagen krijgt u 50% terug. Binnen 14 dagen is helaas geen restitutie mogelijk.",
      },
      {
        question: "Wat gebeurt er bij slecht weer?",
        answer:
          "Bij buitenactiviteiten houden we de weersverwachting in de gaten. Bij extreme weersomstandigheden nemen we contact met u op om de workshop te verplaatsen naar een andere datum. Dit is kosteloos.",
      },
    ],
  },
  {
    title: "Praktische informatie",
    questions: [
      {
        question: "Wat moet ik meenemen naar een workshop?",
        answer:
          "Dit hangt af van de workshop. Bij kookworkshops zorgen wij voor alle ingrediënten en materialen. We adviseren comfortabele kleding te dragen. Specifieke benodigdheden staan vermeld in uw bevestigingsmail.",
      },
      {
        question: "Zijn er dieetopties beschikbaar?",
        answer:
          "Ja, bij onze kookworkshops kunnen we rekening houden met vegetarische, veganistische, glutenvrije en andere dieetwensen. Geef dit aan bij het boeken of neem vooraf contact met ons op.",
      },
      {
        question: "Waar vinden de workshops plaats?",
        answer:
          "Onze workshops vinden plaats op diverse locaties door heel Nederland. De exacte locatie en routebeschrijving ontvangt u in uw bevestigingsmail. We kunnen ook op locatie bij uw bedrijf komen voor grotere groepen.",
      },
      {
        question: "Hoe lang duurt een workshop?",
        answer:
          "De duur varieert per workshop, meestal tussen 2 en 4 uur. De exacte duur staat vermeld bij elke workshop op onze website.",
      },
    ],
  },
  {
    title: "Voor bedrijven",
    questions: [
      {
        question: "Kunnen jullie een factuur sturen?",
        answer:
          "Ja, voor zakelijke klanten kunnen we een factuur sturen met een betalingstermijn van 14 dagen. Neem contact met ons op voor deze optie.",
      },
      {
        question: "Bieden jullie teambuilding op maat aan?",
        answer:
          "Absoluut! We denken graag mee over een programma dat past bij uw team en doelstellingen. Neem contact op voor een vrijblijvende offerte.",
      },
      {
        question: "Kunnen jullie catering verzorgen?",
        answer:
          "Bij veel van onze workshops is catering inbegrepen. Voor extra catering of speciale wensen kunnen we in overleg aanvullende arrangementen aanbieden.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
            Veelgestelde vragen
          </h1>
          <p className="text-muted-foreground text-lg">
            Vind antwoorden op de meest gestelde vragen over onze workshops en
            boekingen.
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category) => (
            <section key={category.title}>
              <h2 className="mb-4 text-xl font-semibold">{category.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                  >
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="bg-muted/50 mt-12 rounded-lg p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Staat uw vraag er niet tussen?
          </h2>
          <p className="text-muted-foreground mb-4">
            Neem gerust contact met ons op. We helpen u graag verder!
          </p>
          <a
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            Neem contact op
          </a>
        </div>
      </div>
    </main>
  );
}
