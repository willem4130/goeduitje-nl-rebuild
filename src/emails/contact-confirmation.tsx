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

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
  message?: string;
}

export const ContactConfirmationEmail = ({
  name,
  subject,
  message,
}: ContactConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Bedankt voor je bericht - {subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Bedankt voor je bericht!</Heading>
          <Text style={paragraph}>Hallo {name},</Text>
          <Text style={paragraph}>
            We hebben je bericht ontvangen en zullen zo snel mogelijk contact
            met je opnemen.
          </Text>

          {message && (
            <>
              <Hr style={hr} />
              <Text style={subheading}>Jouw bericht:</Text>
              <Text style={messageStyle}>{message}</Text>
              <Hr style={hr} />
            </>
          )}

          <Text style={paragraph}>
            Ons team reageert doorgaans binnen 24 uur op werkdagen. Heb je in de
            tussentijd nog vragen of aanvullende informatie? Antwoord dan gerust
            op deze e-mail.
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

export default ContactConfirmationEmail;

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

const messageStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#f9f9f9",
  padding: "16px",
  borderRadius: "4px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};
