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

    // Validate required fields
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

    // Get settings and reservation data
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

    // Find selected date and room details
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
      company || undefined,
      needsInvoice,
      additionalNotes || undefined,
      accommodationNotes || undefined,
    );

    if (!settings.data.reservationFormEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Reservation email is not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const msg = {
      to: settings.data.reservationFormEmail,
      from: settings.data.reservationFormEmail,
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
