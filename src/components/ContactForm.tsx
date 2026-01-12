import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Captcha } from "@/utils/recaptcha";
import type { CaptchaRef } from "@/utils/recaptcha";

interface ContactFormProps {
  siteKey: string;
  discordUrl: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ siteKey, discordUrl }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const captchaRef = useRef<CaptchaRef>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateRows = () => {
      if (messageTextareaRef.current) {
        messageTextareaRef.current.rows = window.innerWidth >= 1025 ? 13 : 6;
      }
    };
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const message = formData.get("message") as string;

    try {
      let recaptchaToken = "";
      if (captchaRef.current) {
        recaptchaToken = await captchaRef.current.execute("submit");
      }

      const submitData = new FormData();
      submitData.append("email", email);
      if (name) submitData.append("name", name);
      if (company) submitData.append("company", company);
      submitData.append("message", message);
      if (recaptchaToken) submitData.append("recaptchaToken", recaptchaToken);

      const response = await fetch("/api/submit-contact", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setFormState("success");
        form.reset();
        if (captchaRef.current) {
          captchaRef.current.reset();
        }
      } else {
        setFormState("error");
        setErrorMessage(data.error || "Failed to send message");
      }
    } catch (error) {
      setFormState("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <Captcha ref={captchaRef} siteKey={siteKey} />
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full flex-col gap-6 bg-white px-14 py-12 shadow-md md:flex-row md:gap-8"
      >
        <div className="absolute top-8 right-8 md:hidden">
          <img
            src="/assets/logo-with-stamp.png"
            alt="React Native Paradise Logo"
            className="h-20 w-auto"
          />
        </div>

        <div className="border-gray-border flex w-full flex-col gap-6 pr-0 md:w-1/2 md:border-r md:pr-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-primary text-xl/9 font-medium">
              Have more questions? <br /> Contact us here!
            </h2>
            <p className="text-primary text-sm font-normal">
              Or join our{" "}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Discord channel
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-primary text-sm font-medium"
            >
              Message <span className="text-primary/80">(required)</span>
            </label>
            <textarea
              ref={messageTextareaRef}
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Message"
              disabled={formState === "submitting"}
              className="text-primary border-gray-border resize-none border bg-gray-50 px-4 py-3 text-sm placeholder:text-sm placeholder:text-gray-300 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-8 pl-0 md:w-1/2 md:justify-between md:pl-8">
          <div className="hidden justify-end md:flex">
            <img
              src="/assets/logo-with-stamp.png"
              alt="React Native Paradise Logo"
              className="h-32 w-auto"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-primary text-sm font-medium"
              >
                Email <span className="text-primary/80">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email"
                disabled={formState === "submitting"}
                className="text-primary border-gray-border border bg-gray-50 px-4 py-3 text-sm placeholder:text-sm placeholder:text-gray-300 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-primary text-sm font-medium"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                disabled={formState === "submitting"}
                className="text-primary border-gray-border border bg-gray-50 px-4 py-3 text-sm placeholder:text-sm placeholder:text-gray-300 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="company"
                className="text-primary text-sm font-medium"
              >
                Company name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Company name"
                disabled={formState === "submitting"}
                className="text-primary border-gray-border border bg-gray-50 px-4 py-3 text-sm placeholder:text-sm placeholder:text-gray-300 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
            <p className="text-primary/80 text-2xs w-full md:w-1/2">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={formState === "submitting"}
              className="bg-secondary w-full md:w-1/2"
            >
              {formState === "submitting" ? "Sending..." : "Submit"}
            </Button>
          </div>

          {formState === "success" && (
            <div className="text-primary rounded border border-green-200 bg-green-50 px-4 py-3 text-sm">
              Thank you! Your message has been sent successfully.
            </div>
          )}

          {formState === "error" && errorMessage && (
            <div className="text-primary rounded border border-red-200 bg-red-50 px-4 py-3 text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      </form>
    </>
  );
}
