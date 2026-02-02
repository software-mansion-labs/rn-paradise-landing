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

interface ContactEmailProps {
  email: string;
  message: string;
  name?: string;
  company?: string;
}

export const ContactEmail = ({
  email,
  message,
  name,
  company,
}: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        RN Paradise - Contact Form Submission from {name || email.split("@")[0]}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>RN Paradise - Contact Form Submission ☎️</Heading>
          <Hr style={hr} />
          <Section style={section}>
            <Heading style={h2}>📞 Contact Information</Heading>
            {name && (
              <Text style={text}>
                <strong>Name:</strong> {name}
              </Text>
            )}
            {company && (
              <Text style={text}>
                <strong>Company:</strong> {company}
              </Text>
            )}
            <Text style={text}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={section}>
            <Heading style={h2}>📝 Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>
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

const messageText = {
  color: "#26251f",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
  whiteSpace: "pre-wrap",
};

const section = {
  padding: "0 20px",
};

const hr = {
  borderColor: "#d9dde8",
  margin: "20px 0",
};
