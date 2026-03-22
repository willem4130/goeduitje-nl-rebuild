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

interface BookingConfirmationEmailProps {
  firstName: string;
  lastName: string;
  workshopDate: string;
  numberOfPeople: number;
  totalPrice: number;
  paymentMethod: string;
  giftCardId?: string;
  location: string;
  dietaryRequirement?: string;
  allergies?: string;
}

export const BookingConfirmationEmail = ({
  firstName,
  lastName,
  workshopDate,
  numberOfPeople,
  totalPrice,
  paymentMethod,
  giftCardId,
  location,
  dietaryRequirement,
  allergies,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Boeking bevestigd - Open Kookworkshop</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Boeking Bevestigd!</Heading>
          <Text style={paragraph}>
            Hallo {firstName} {lastName},
          </Text>
          <Text style={paragraph}>
            Bedankt voor je boeking! Je deelname aan de open kookworkshop is
            bevestigd. Hieronder vind je de details van je boeking.
          </Text>

          <Hr style={hr} />

          <Text style={subheading}>Boekingsdetails:</Text>

          <Text style={detailItem}>
            <strong>Datum:</strong> {workshopDate}
          </Text>

          <Text style={detailItem}>
            <strong>Locatie:</strong> {location}
          </Text>

          <Text style={detailItem}>
            <strong>Aantal personen:</strong> {numberOfPeople}
          </Text>

          <Text style={detailItem}>
            <strong>Totaalprijs:</strong> €
            {totalPrice.toFixed(2).replace(".", ",")}
          </Text>

          <Text style={detailItem}>
            <strong>Betaalmethode:</strong>{" "}
            {paymentMethod === "gift_card" ? "Cadeaubon" : "Online betaling"}
          </Text>

          {giftCardId && (
            <Text style={detailItem}>
              <strong>Cadeaubon:</strong> {giftCardId}
            </Text>
          )}

          {dietaryRequirement && dietaryRequirement !== "geen" && (
            <Text style={detailItem}>
              <strong>Dieetwensen:</strong> {dietaryRequirement}
            </Text>
          )}

          {allergies && (
            <Text style={detailItem}>
              <strong>Allergieën:</strong> {allergies}
            </Text>
          )}

          <Hr style={hr} />

          <Text style={paragraph}>
            We kijken ernaar uit je te verwelkomen! Mocht je nog vragen hebben of
            wijzigingen willen doorgeven, neem dan gerust contact met ons op door
            te antwoorden op deze e-mail.
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

export default BookingConfirmationEmail;

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
