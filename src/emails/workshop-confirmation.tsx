import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface WorkshopConfirmationEmailProps {
  name: string;
  workshopId: string;
  workshops: string[];
  participantCount: number;
  location: string;
  date: string;
  time: string;
  duration?: number;
}

export const WorkshopConfirmationEmail = ({
  name,
  workshopId,
  workshops,
  participantCount,
  location,
  date,
  time,
  duration,
}: WorkshopConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Bevestiging uitje configuratie - {workshopId}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Uitje Configuratie Ontvangen!</Heading>
          <Text style={paragraph}>Hallo {name},</Text>
          <Text style={paragraph}>
            Bedankt voor je aanvraag! We hebben je uitje configuratie succesvol
            ontvangen en zullen deze zo snel mogelijk verwerken.
          </Text>

          <Hr style={hr} />

          <Text style={subheading}>Configuratie Details:</Text>

          <Text style={detailItem}>
            <strong>Aantal deelnemers:</strong> {participantCount} personen
          </Text>

          <Text style={detailItem}>
            <strong>Geselecteerde uitjes:</strong>
          </Text>
          <ul style={list}>
            {workshops.map((workshop, index) => (
              <li key={index} style={listItem}>
                {workshop}
              </li>
            ))}
          </ul>

          <Text style={detailItem}>
            <strong>Locatie:</strong> {location}
          </Text>

          <Text style={detailItem}>
            <strong>Datum:</strong> {date}
          </Text>

          <Text style={detailItem}>
            <strong>Aanvangsttijd:</strong> {time}
          </Text>

          {duration && (
            <Text style={detailItem}>
              <strong>Tijdsduur:</strong> {duration}{" "}
              {duration === 1 ? "uur" : "uren"}
            </Text>
          )}

          <Hr style={hr} />

          <Text style={paragraph}>
            Ons team zal binnen 24 uur contact met je opnemen om de details te
            bespreken en de boeking definitief te maken.
          </Text>

          <Text style={paragraph}>
            Je configuratie ID is: <strong>{workshopId}</strong>
          </Text>

          <Text style={paragraph}>
            Heb je nog vragen of wil je wijzigingen doorgeven? Antwoord dan
            gerust op deze e-mail met je configuratie ID.
          </Text>

          <Text style={paragraph}>
            Met vriendelijke groet,
            <br />
            Het Goeduitje.nl Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WorkshopConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const subheading = {
  fontSize: "20px",
  lineHeight: "1.4",
  fontWeight: "600",
  color: "#484848",
  marginTop: "24px",
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
};

const detailItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
  marginBottom: "8px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const list = {
  margin: "8px 0 16px 0",
  paddingLeft: "20px",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
  marginBottom: "4px",
};
