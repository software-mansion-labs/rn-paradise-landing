import { useState } from "react";
import { z } from "zod";
import { useReservationStore } from "@/stores/reservationStore";
import { Button } from "@/components/ui/button";

const personalDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  needsInvoice: z.boolean(),
  additionalNotes: z.string().optional(),
});

export function Step2() {
  const { personalDetails, updatePersonalDetails, setCurrentStep } =
    useReservationStore();
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const validateField = (field: "name" | "email", value: string) => {
    try {
      if (field === "name") {
        personalDetailsSchema.shape.name.parse(value);
      } else if (field === "email") {
        personalDetailsSchema.shape.email.parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0]?.message,
        }));
      }
    }
  };

  const handleNext = () => {
    const result = personalDetailsSchema.safeParse(personalDetails);
    if (result.success) {
      setCurrentStep(2);
      setErrors({});
    } else {
      const fieldErrors: { name?: string; email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name" || err.path[0] === "email") {
          fieldErrors[err.path[0] as "name" | "email"] = err.message;
        }
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-primary text-lg font-medium">Contact person:</h4>

        <div className="gap- flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="relative [&:has(input:placeholder-shown)::after]:pointer-events-none [&:has(input:placeholder-shown)::after]:absolute [&:has(input:placeholder-shown)::after]:top-1/2 [&:has(input:placeholder-shown)::after]:left-[16ch] [&:has(input:placeholder-shown)::after]:-translate-y-1/2 [&:has(input:placeholder-shown)::after]:text-sm [&:has(input:placeholder-shown)::after]:text-red-500 [&:has(input:placeholder-shown)::after]:content-['*']">
                <input
                  type="text"
                  id="name"
                  value={personalDetails.name}
                  onChange={(e) => {
                    updatePersonalDetails({ name: e.target.value });
                    validateField("name", e.target.value);
                  }}
                  onBlur={(e) => validateField("name", e.target.value)}
                  placeholder="Name and surname"
                  required
                  className={`text-primary border-primary placeholder:text-primary/50 w-full rounded-sm border px-4 py-3 text-sm placeholder:text-sm ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="flex w-full gap-3">
              <div className="relative flex w-full flex-col gap-1">
                <div className="relative [&:has(input:placeholder-shown)::after]:pointer-events-none [&:has(input:placeholder-shown)::after]:absolute [&:has(input:placeholder-shown)::after]:top-1/2 [&:has(input:placeholder-shown)::after]:left-[5.5ch] [&:has(input:placeholder-shown)::after]:-translate-y-1/2 [&:has(input:placeholder-shown)::after]:text-sm [&:has(input:placeholder-shown)::after]:text-red-500 [&:has(input:placeholder-shown)::after]:content-['*']">
                  <input
                    type="email"
                    id="email"
                    value={personalDetails.email}
                    onChange={(e) => {
                      updatePersonalDetails({ email: e.target.value });
                      validateField("email", e.target.value);
                    }}
                    onBlur={(e) => validateField("email", e.target.value)}
                    placeholder="Email"
                    required
                    className={`text-primary border-primary placeholder:text-primary/50 w-full rounded-sm border px-4 py-3 text-sm placeholder:text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
                {!errors.email && (
                  <p className="invisible text-xs">placeholder</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-1">
                <input
                  type="text"
                  id="company"
                  value={personalDetails.company}
                  onChange={(e) =>
                    updatePersonalDetails({ company: e.target.value })
                  }
                  placeholder="Company name"
                  className="text-primary border-primary placeholder:text-primary/50 w-full rounded-sm border px-4 py-3 text-sm placeholder:text-sm"
                />
                <p className="invisible text-xs">placeholder</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="needs-invoice"
              checked={personalDetails.needsInvoice}
              onChange={(e) =>
                updatePersonalDetails({ needsInvoice: e.target.checked })
              }
              className="border-primary text-primary focus:ring-primary h-4 w-4"
            />
            <label
              htmlFor="needs-invoice"
              className="text-primary cursor-pointer text-sm font-medium"
            >
              I need an invoice
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="additional-notes"
            className="text-primary text-sm font-medium"
          >
            Additional notes:
          </label>
          <textarea
            id="additional-notes"
            value={personalDetails.additionalNotes}
            onChange={(e) =>
              updatePersonalDetails({ additionalNotes: e.target.value })
            }
            placeholder="Write something..."
            rows={4}
            className="text-primary border-primary placeholder:text-primary/50 resize-none rounded-sm border px-4 py-3 text-sm placeholder:text-sm focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-start pt-4">
        <Button
          onClick={handleNext}
          disabled={
            !personalDetails.name ||
            !personalDetails.email ||
            !!errors.name ||
            !!errors.email
          }
          size="xl"
        >
          Next step →
        </Button>
      </div>
    </div>
  );
}
