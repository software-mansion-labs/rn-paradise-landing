import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { getEntry } from "astro:content";
import sendGrid from "@sendgrid/mail";

export const prerender = false;

const RECAPTCHA_MIN_SCORE = 0.5;

async function verifyRecaptcha(token: string): Promise<{
  valid: boolean;
  score: number;
}> {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    // Log the Content-Type header for debugging
    const contentType = request.headers.get("content-type");
    console.log("Received Content-Type:", contentType);

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error("Failed to parse form data:", error);
      console.error(
        "Request headers:",
        Object.fromEntries(request.headers.entries()),
      );
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Invalid request format. Please ensure the form is submitted correctly.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string | null;
    const company = formData.get("company") as string | null;
    const message = formData.get("message") as string;
    const recaptchaToken = formData.get("recaptchaToken") as string | null;

    // Validate required fields
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      const verification = await verifyRecaptcha(recaptchaToken);
      if (!verification.valid || verification.score < RECAPTCHA_MIN_SCORE) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed reCAPTCHA verification",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // Initialize SendGrid
    const apiKey = getSecret("SENDGRID_API_KEY");
    if (!apiKey) {
      console.error("SENDGRID_API_KEY is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service is not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
    sendGrid.setApiKey(apiKey);

    // Get settings
    let settings;
    try {
      settings = await getEntry("settings", "settings");
    } catch (error) {
      console.error("Failed to load CMS data:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to load settings",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!settings.data.contactFormEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Contact email is not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const subject = `Contact Form Submission from ${email.split("@")[0]}`;
    const emailBody = formatContactFormEmail(
      email,
      message,
      name || undefined,
      company || undefined,
    );

    const msg = {
      to: settings.data.contactFormEmail,
      from: settings.data.contactFormEmail,
      replyTo: email,
      subject,
      text: emailBody,
    };

    try {
      await sendGrid.send(msg);
    } catch (sendError) {
      console.error("SendGrid error:", sendError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send email. Please try again later.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
