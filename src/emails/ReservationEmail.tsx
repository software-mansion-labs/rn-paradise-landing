import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReservationEmailProps {
  name: string;
  email: string;
  selectedDate: string;
  selectedRoom?: { name: string; price?: number };
  company?: string;
  needsInvoice?: boolean;
  additionalNotes?: string;
  accommodationNotes?: string;
}

export const ReservationEmail = ({
  name,
  email,
  selectedDate,
  selectedRoom,
  company,
  needsInvoice,
  additionalNotes,
  accommodationNotes,
}: ReservationEmailProps) => {
  const roomPriceText = selectedRoom?.price
    ? `${selectedRoom.price}€`
    : "Individual offer";

  return (
    <Html>
      <Head />
      <Preview>RN Paradise - Reservation Request from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>RN Paradise - Reservation Request ⛱️</Heading>
          <Hr style={hr} />
          <Section style={section}>
            <Heading style={h2}>📞 Contact Information</Heading>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {email}
            </Text>
            {company && (
              <Text style={text}>
                <strong>Company:</strong> {company}
              </Text>
            )}
            <Text style={text}>
              <strong>Invoice needed:</strong>{" "}
              {needsInvoice ? "Yes ✅" : "No ❌"}
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={section}>
            <Heading style={h2}>🛏️ Reservation Details</Heading>
            <Text style={text}>
              <strong>Selected Date:</strong> {selectedDate || "N/A"}
            </Text>
            <Text style={text}>
              <strong>Selected Room:</strong> {selectedRoom?.name || "N/A"}
            </Text>
            <Text style={text}>
              <strong>Room Price:</strong> {roomPriceText}
            </Text>
            {accommodationNotes && (
              <>
                <Section style={section}>
                  <Heading style={h2}>Accommodation Notes</Heading>
                  <Text style={text}>{accommodationNotes}</Text>
                </Section>
              </>
            )}
          </Section>
          {additionalNotes && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Additional Notes</Heading>
                <Text style={text}>{additionalNotes}</Text>
              </Section>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#26251f",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const h2 = {
  color: "#26251f",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
  padding: "0",
};

const text = {
  color: "#26251f",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
};

const section = {
  padding: "0 20px",
};

const hr = {
  borderColor: "#d9dde8",
  margin: "20px 0",
};
