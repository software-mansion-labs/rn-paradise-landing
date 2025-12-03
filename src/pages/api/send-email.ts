import { defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
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
        const nameText = name ? `Name: ${name}\n` : "";
        const companyText = company ? `Company: ${company}\n` : "";
        const subject = `Contact Form Submission from ${email.split("@")[0]}`;

        const msg = {
          to: "", // TODO: Add email to receive the form submissions
          from: "",
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
};
