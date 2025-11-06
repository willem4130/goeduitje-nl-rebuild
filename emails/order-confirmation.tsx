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

interface OrderConfirmationEmailProps {
  name: string;
  orderNumber: string;
  amount: string;
  productName: string;
  receiptUrl?: string;
}

export const OrderConfirmationEmail = ({
  name,
  orderNumber,
  amount,
  productName,
  receiptUrl,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your order has been confirmed - Order #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Order Confirmed! 🎊</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            Thank you for your purchase! Your order has been successfully
            processed and confirmed.
          </Text>
          <Section style={orderDetails}>
            <Text style={orderDetailsHeading}>Order Details</Text>
            <Hr style={hr} />
            <Text style={orderDetailsItem}>
              <strong>Order Number:</strong> #{orderNumber}
            </Text>
            <Text style={orderDetailsItem}>
              <strong>Product:</strong> {productName}
            </Text>
            <Text style={orderDetailsItem}>
              <strong>Amount:</strong> {amount}
            </Text>
          </Section>
          {receiptUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={receiptUrl}>
                View Receipt
              </Button>
            </Section>
          )}
          <Hr style={hr} />
          <Text style={paragraph}>
            You should receive access to your purchase shortly. If you have any
            questions or concerns, please don&apos;t hesitate to contact our
            support team.
          </Text>
          <Text style={paragraph}>
            Thank you for your business!
            <br />
            The Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

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

const orderDetails = {
  backgroundColor: "#f6f9fc",
  borderRadius: "5px",
  padding: "24px",
  marginTop: "24px",
  marginBottom: "24px",
};

const orderDetailsHeading = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#484848",
  marginBottom: "12px",
};

const orderDetailsItem = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#484848",
  margin: "8px 0",
};

const buttonContainer = {
  padding: "27px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "16px 0",
};
