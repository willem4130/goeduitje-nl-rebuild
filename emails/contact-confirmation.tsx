import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
}

export const ContactConfirmationEmail = ({
  name,
  subject,
}: ContactConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>We received your message - {subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Thank You for Contacting Us!</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            We&apos;ve received your message regarding &quot;{subject}&quot; and
            wanted to let you know that we&apos;re on it.
          </Text>
          <Text style={paragraph}>
            Our team typically responds within 24 hours during business days.
            We&apos;ll review your inquiry and get back to you as soon as
            possible.
          </Text>
          <Text style={paragraph}>
            In the meantime, if you have any urgent questions or additional
            information to share, feel free to reply to this email.
          </Text>
          <Text style={paragraph}>
            Best regards,
            <br />
            The Team
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

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
};
