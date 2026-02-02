import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { getEntry } from "astro:content";
import sendGrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import { ReservationEmail } from "@/emails/ReservationEmail";

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const company = formData.get("company") as string | null;
    const needsInvoice = formData.get("needsInvoice") === "true";
    const additionalNotes = formData.get("additionalNotes") as string | null;
    const selectedDate = formData.get("selectedDate") as string;
    const selectedRoomId = formData.get("selectedRoomId") as string;
    const accommodationNotes = formData.get("accommodationNotes") as
      | string
      | null;
    const recaptchaToken = formData.get("recaptchaToken") as string | null;

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Name must be at least 2 characters",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!selectedDate || !selectedRoomId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Date and room selection are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "reCAPTCHA verification is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

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

    // initialize SendGrid
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

    let settings, reservation;
    try {
      [settings, reservation] = await Promise.all([
        getEntry("settings", "settings"),
        getEntry("reservation", "reservation"),
      ]);
    } catch (error) {
      console.error("Failed to load CMS data:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to load reservation data",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!settings || !reservation) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to load reservation data",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // find selected date and room details
    const dateOption = reservation.data.dateOptions.find(
      (d: { id: string }) => d.id === selectedDate,
    );
    const room = reservation.data.rooms.find(
      (r: { id: string }) => r.id === selectedRoomId,
    );

    const subject = `RN Paradise ⛱️ - Reservation Request from ${name}`;

    if (!settings.data.reservationFormEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Reservation email is not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const emailHtml = await render(
      ReservationEmail({
        name,
        email,
        selectedDate: dateOption?.label || selectedDate,
        selectedRoom: room ? { name: room.name, price: room.price } : undefined,
        company: company || undefined,
        needsInvoice,
        additionalNotes: additionalNotes || undefined,
        accommodationNotes: accommodationNotes || undefined,
      }),
    );

    const msg = {
      to: settings.data.reservationFormEmail,
      from: settings.data.reservationFormEmail,
      replyTo: email,
      subject,
      html: emailHtml,
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
    console.error("Reservation submission error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send reservation";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
