import { useReservationStore } from "@/stores/reservationStore";
import { Button } from "@/components/ui/button";

export function Step2() {
  const { personalDetails, updatePersonalDetails, setCurrentStep } =
    useReservationStore();

  const handleNext = () => {
    if (personalDetails.name && personalDetails.email) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-primary text-lg font-medium">Contact person:</h4>

        <div className="gap- flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="relative [&:has(input:placeholder-shown)::after]:pointer-events-none [&:has(input:placeholder-shown)::after]:absolute [&:has(input:placeholder-shown)::after]:top-1/2 [&:has(input:placeholder-shown)::after]:left-[16ch] [&:has(input:placeholder-shown)::after]:-translate-y-1/2 [&:has(input:placeholder-shown)::after]:text-sm [&:has(input:placeholder-shown)::after]:text-red-500 [&:has(input:placeholder-shown)::after]:content-['*']">
              <input
                type="text"
                id="name"
                value={personalDetails.name}
                onChange={(e) =>
                  updatePersonalDetails({ name: e.target.value })
                }
                placeholder="Name and surname"
                required
                className="text-primary border-primary placeholder:text-primary/50 w-full rounded-sm border px-4 py-3 text-sm placeholder:text-sm"
              />
            </div>

            <div className="flex w-full gap-3">
              <div className="relative w-full [&:has(input:placeholder-shown)::after]:pointer-events-none [&:has(input:placeholder-shown)::after]:absolute [&:has(input:placeholder-shown)::after]:top-1/2 [&:has(input:placeholder-shown)::after]:left-[5.5ch] [&:has(input:placeholder-shown)::after]:-translate-y-1/2 [&:has(input:placeholder-shown)::after]:text-sm [&:has(input:placeholder-shown)::after]:text-red-500 [&:has(input:placeholder-shown)::after]:content-['*']">
                <input
                  type="email"
                  id="email"
                  value={personalDetails.email}
                  onChange={(e) =>
                    updatePersonalDetails({ email: e.target.value })
                  }
                  placeholder="Email"
                  required
                  className="text-primary border-primary placeholder:text-primary/50 w-full rounded-sm border px-4 py-3 text-sm placeholder:text-sm"
                />
              </div>
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
          disabled={!personalDetails.name || !personalDetails.email}
          size="xl"
        >
          Next step →
        </Button>
      </div>
    </div>
  );
}
