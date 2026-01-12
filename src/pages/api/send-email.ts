import { defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { getEntry } from "astro:content";
import sendGrid from "@sendgrid/mail";

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
    handler: async ({ email, name, company, message, recaptchaToken }) => {
      const RECAPTCHA_SECRET_KEY = getSecret("RECAPTCHA_SECRET_KEY");
      const PROJECT_ID = getSecret("GCLOUD_PROJECT_ID");
      const SITE_KEY = getSecret("PUBLIC_RECAPTCHA_SITE_KEY");

      if (recaptchaToken) {
        const verifyRes = await fetch(
          `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: {
                token: recaptchaToken,
                siteKey: SITE_KEY,
                expectedAction: "submit",
              },
            }),
          },
        );
        const verifyData = await verifyRes.json();

        if (
          !verifyData?.tokenProperties?.valid ||
          verifyData?.riskAnalysis?.score < 0.5
        ) {
          return { success: false, error: "Failed reCAPTCHA verification" };
        }
      }

      sendGrid.setApiKey(getSecret("SENDGRID_API_KEY") ?? "");

      try {
        const settings = await getEntry("settings", "settings");
        const nameText = name ? `Name: ${name}\n` : "";
        const companyText = company ? `Company: ${company}\n` : "";
        const subject = `Contact Form Submission from ${email.split("@")[0]}`;

        const msg = {
          to: settings.data.contactFormEmail,
          from: settings.data.contactFormEmail,
          replyTo: email,
          subject,
          text: `${nameText}${companyText}Email: ${email}\n\nMessage:\n${message}`, // TODO: update mail body message format
        };

        await sendGrid.send(msg);
      } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to send email" };
      }
      return { success: true };
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
    }) => {
      sendGrid.setApiKey(getSecret("SENDGRID_API_KEY") ?? "");

      try {
        const settings = await getEntry("settings", "settings");
        const reservation = await getEntry("reservation", "reservation");

        // Find selected date and room details
        const dateOption = reservation.data.dateOptions.find(
          (d: { id: string }) => d.id === selectedDate,
        );
        const room = reservation.data.rooms.find(
          (r: { id: string }) => r.id === selectedRoomId,
        );

        const companyText = company ? `Company: ${company}\n` : "";
        const invoiceText = needsInvoice ? "Yes, invoice needed\n" : "";
        const additionalNotesText = additionalNotes
          ? `Additional Notes: ${additionalNotes}\n`
          : "";
        const accommodationNotesText = accommodationNotes
          ? `Accommodation Notes: ${accommodationNotes}\n`
          : "";

        const subject = `Reservation Request from ${name}`;

        const msg = {
          to: settings.data.reservationFormEmail,
          from: settings.data.reservationFormEmail,
          replyTo: email,
          subject,
          text: `Reservation Request\n\nContact Information:\nName: ${name}\nEmail: ${email}\n${companyText}${invoiceText}${additionalNotesText}\nSelected Date: ${dateOption?.label || selectedDate}\nSelected Room: ${room?.name || selectedRoomId}\nRoom Price: ${room?.price ? `${room.price}€` : "Individual offer"}\n${accommodationNotesText}`,
        };

        await sendGrid.send(msg);
      } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to send reservation" };
      }
      return { success: true };
    },
  }),
};
