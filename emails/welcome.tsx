import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  name,
  dashboardUrl = "https://example.com/dashboard",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our platform! Let&apos;s get you started.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Welcome Aboard, {name}! 🎉</Heading>
          <Text style={paragraph}>
            We&apos;re thrilled to have you join our community. Your account is
            now active and ready to use.
          </Text>
          <Text style={paragraph}>Here&apos;s what you can do next:</Text>
          <Text style={list}>
            • Complete your profile to get the most out of your account
            <br />
            • Explore our features and tools
            <br />
            • Check out our getting started guide
            <br />• Join our community discussions
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={paragraph}>
            If you have any questions or need help getting started, don&apos;t
            hesitate to reach out to our support team. We&apos;re here to help!
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

export default WelcomeEmail;

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

const list = {
  fontSize: "16px",
  lineHeight: "2",
  color: "#484848",
  paddingLeft: "20px",
};

const buttonContainer = {
  padding: "27px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};
