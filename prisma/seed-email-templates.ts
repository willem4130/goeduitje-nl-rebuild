import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    key: "workshop-confirmation",
    name: "Uitje Configuratie Bevestiging",
    subject: "Uitje Configuratie Ontvangen - #{workshopId}",
    variables: [
      "{name}",
      "{workshopId}",
      "{workshops}",
      "{participantCount}",
      "{location}",
      "{date}",
      "{time}",
      "{duration}",
      "{type}",
      "{companyName}",
      "{btwNumber}",
      "{phone}",
    ],
    body: `<h1 style="font-size:32px;font-weight:700;color:#484848;">Uitje Configuratie Ontvangen!</h1>
<p style="font-size:16px;line-height:1.6;color:#484848;">Hallo {name},</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Bedankt voor je aanvraag! We hebben je uitje configuratie succesvol ontvangen en zullen deze zo snel mogelijk verwerken.</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<h2 style="font-size:20px;font-weight:600;color:#484848;">Configuratie Details:</h2>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Aantal deelnemers:</strong> {participantCount} personen</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Geselecteerde uitjes:</strong> {workshops}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Locatie:</strong> {location}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Datum:</strong> {date}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Aanvangsttijd:</strong> {time}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Tijdsduur:</strong> {duration} uur</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Type:</strong> {type}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Bedrijfsnaam:</strong> {companyName}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>BTW-nummer:</strong> {btwNumber}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Telefoon:</strong> {phone}</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<p style="font-size:16px;line-height:1.6;color:#484848;">Ons team zal binnen 24 uur contact met je opnemen om de details te bespreken en de boeking definitief te maken.</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Je configuratie ID is: <strong>{workshopId}</strong></p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Heb je nog vragen of wil je wijzigingen doorgeven? Antwoord dan gerust op deze e-mail met je configuratie ID.</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Met vriendelijke groet,<br />Het Goeduitje.nl Team</p>`,
  },
  {
    key: "contact-confirmation",
    name: "Contact Formulier Bevestiging",
    subject: "Bedankt voor je bericht - {subject}",
    variables: ["{name}", "{subject}", "{message}"],
    body: `<h1 style="font-size:32px;font-weight:700;color:#484848;">Bedankt voor je bericht!</h1>
<p style="font-size:16px;line-height:1.6;color:#484848;">Hallo {name},</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">We hebben je bericht ontvangen en zullen zo snel mogelijk contact met je opnemen.</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<h2 style="font-size:20px;font-weight:600;color:#484848;">Jouw bericht:</h2>
<p style="font-size:16px;line-height:1.6;color:#484848;white-space:pre-wrap;background-color:#f9f9f9;padding:16px;border-radius:4px;">{message}</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<p style="font-size:16px;line-height:1.6;color:#484848;">Ons team reageert doorgaans binnen 24 uur op werkdagen. Heb je in de tussentijd nog vragen of aanvullende informatie? Antwoord dan gerust op deze e-mail.</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Met vriendelijke groet,<br />Het Goeduitje.nl Team</p>`,
  },
  {
    key: "booking-confirmation",
    name: "Open Kookworkshop Boeking Bevestiging",
    subject: "Boeking Bevestigd - Open Kookworkshop",
    variables: [
      "{firstName}",
      "{lastName}",
      "{workshopDate}",
      "{numberOfPeople}",
      "{totalPrice}",
      "{paymentMethod}",
      "{giftCardId}",
      "{location}",
      "{dietaryRequirement}",
      "{allergies}",
    ],
    body: `<h1 style="font-size:32px;font-weight:700;color:#484848;">Boeking Bevestigd!</h1>
<p style="font-size:16px;line-height:1.6;color:#484848;">Hallo {firstName} {lastName},</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Bedankt voor je boeking! Je deelname aan de open kookworkshop is bevestigd. Hieronder vind je de details van je boeking.</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<h2 style="font-size:20px;font-weight:600;color:#484848;">Boekingsdetails:</h2>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Datum:</strong> {workshopDate}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Locatie:</strong> {location}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Aantal personen:</strong> {numberOfPeople}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Totaalprijs:</strong> €{totalPrice}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Betaalmethode:</strong> {paymentMethod}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Dieetwensen:</strong> {dietaryRequirement}</p>
<p style="font-size:16px;color:#484848;margin-bottom:8px;"><strong>Allergieën:</strong> {allergies}</p>
<hr style="border-color:#e6ebf1;margin:20px 0;" />
<p style="font-size:16px;line-height:1.6;color:#484848;">We kijken ernaar uit je te verwelkomen! Mocht je nog vragen hebben of wijzigingen willen doorgeven, neem dan gerust contact met ons op door te antwoorden op deze e-mail.</p>
<p style="font-size:16px;line-height:1.6;color:#484848;">Met vriendelijke groet,<br />Het Goeduitje.nl Team</p>`,
  },
];

async function main() {
  console.log("Seeding email templates...");

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: template.key },
      update: {
        name: template.name,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
      },
      create: template,
    });
    console.log(`  ✅ ${template.name} (${template.key})`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
