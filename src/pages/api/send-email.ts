import { defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { getEntry } from "astro:content";
import sendGrid from "@sendgrid/mail";

const RECAPTCHA_MIN_SCORE = 0.5;

interface RecaptchaVerificationResult {
  valid: boolean;
  score: number;
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

async function verifyRecaptcha(
  token: string,
): Promise<RecaptchaVerificationResult> {
  const RECAPTCHA_SECRET_KEY = getSecret("RECAPTCHA_SECRET_KEY");
  const PROJECT_ID = getSecret("GCLOUD_PROJECT_ID");
  const SITE_KEY = getSecret("PUBLIC_RECAPTCHA_SITE_KEY");

  const verifyRes = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey: SITE_KEY,
          expectedAction: "submit",
        },
      }),
    },
  );

  const verifyData = await verifyRes.json();

  return {
    valid: verifyData?.tokenProperties?.valid ?? false,
    score: verifyData?.riskAnalysis?.score ?? 0,
  };
}

function initializeSendGrid(): void {
  const apiKey = getSecret("SENDGRID_API_KEY");
  if (apiKey) {
    sendGrid.setApiKey(apiKey);
  }
}

function formatContactFormEmail(
  email: string,
  message: string,
  name?: string,
  company?: string,
): string {
  const nameText = name ? `Name: ${name}\n` : "";
  const companyText = company ? `Company: ${company}\n` : "";
  return `${nameText}${companyText}Email: ${email}\n\nMessage:\n${message}`;
}

function formatReservationEmail(
  name: string,
  email: string,
  selectedDate: string,
  selectedRoom: { name: string; price?: number } | undefined,
  company?: string,
  needsInvoice?: boolean,
  additionalNotes?: string,
  accommodationNotes?: string,
): string {
  const companyText = company ? `Company: ${company}\n` : "";
  const invoiceText = needsInvoice ? "Yes, invoice needed\n" : "";
  const additionalNotesText = additionalNotes
    ? `Additional Notes: ${additionalNotes}\n`
    : "";
  const accommodationNotesText = accommodationNotes
    ? `Accommodation Notes: ${accommodationNotes}\n`
    : "";
  const roomPriceText = selectedRoom?.price
    ? `${selectedRoom.price}€`
    : "Individual offer";

  return `Reservation Request\n\nContact Information:\nName: ${name}\nEmail: ${email}\n${companyText}${invoiceText}${additionalNotesText}\nSelected Date: ${selectedDate || "N/A"}\nSelected Room: ${selectedRoom?.name || "N/A"}\nRoom Price: ${roomPriceText}\n${accommodationNotesText}`;
}

export const server = {
  submitForm: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      name: z.string().optional(),
      company: z.string().optional(),
      message: z.string().min(1),
      recaptchaToken: z.string().optional(),
    }),
    handler: async ({
      email,
      name,
      company,
      message,
      recaptchaToken,
    }): Promise<ActionResponse> => {
      if (recaptchaToken) {
        const verification = await verifyRecaptcha(recaptchaToken);
        if (!verification.valid || verification.score < RECAPTCHA_MIN_SCORE) {
          return { success: false, error: "Failed reCAPTCHA verification" };
        }
      }

      initializeSendGrid();

      try {
        const settings = await getEntry("settings", "settings");
        const subject = `Contact Form Submission from ${email.split("@")[0]}`;
        const emailBody = formatContactFormEmail(email, message, name, company);

        const msg = {
          to: settings.data.contactFormEmail,
          from: settings.data.contactFormEmail,
          replyTo: email,
          subject,
          text: emailBody,
        };

        await sendGrid.send(msg);

        return { success: true };
      } catch (error) {
        console.error("Contact form submission error:", error);
        return { success: false, error: "Failed to send email" };
      }
    },
  }),
  submitReservation: defineAction({
    accept: "json",
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      company: z.string().optional(),
      needsInvoice: z.boolean(),
      additionalNotes: z.string().optional(),
      selectedDate: z.string(),
      selectedRoomId: z.string(),
      accommodationNotes: z.string().optional(),
      recaptchaToken: z.string().optional(),
    }),
    handler: async ({
      name,
      email,
      company,
      needsInvoice,
      additionalNotes,
      selectedDate,
      selectedRoomId,
      accommodationNotes,
      recaptchaToken,
    }): Promise<ActionResponse> => {
      if (recaptchaToken) {
        const verification = await verifyRecaptcha(recaptchaToken);
        if (!verification.valid || verification.score < RECAPTCHA_MIN_SCORE) {
          return { success: false, error: "Failed reCAPTCHA verification" };
        }
      }

      initializeSendGrid();

      try {
        const [settings, reservation] = await Promise.all([
          getEntry("settings", "settings"),
          getEntry("reservation", "reservation"),
        ]);

        const dateOption = reservation.data.dateOptions.find(
          (d: { id: string }) => d.id === selectedDate,
        );
        const room = reservation.data.rooms.find(
          (r: { id: string }) => r.id === selectedRoomId,
        );

        const subject = `Reservation Request from ${name}`;
        const emailBody = formatReservationEmail(
          name,
          email,
          dateOption?.label || selectedDate,
          room ? { name: room.name, price: room.price } : undefined,
          company,
          needsInvoice,
          additionalNotes,
          accommodationNotes,
        );

        const msg = {
          to: settings.data.reservationFormEmail,
          from: settings.data.reservationFormEmail,
          replyTo: email,
          subject,
          text: emailBody,
        };

        await sendGrid.send(msg);

        return { success: true };
      } catch (error) {
        console.error("Reservation submission error:", error);
        return { success: false, error: "Failed to send reservation" };
      }
    },
  }),
};
