import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThankYouDialog({ open, onOpenChange }: ThankYouDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogClose className="border-primary text-primary absolute top-4 right-4 flex cursor-pointer rounded-full border p-1 focus:outline-none">
          <X className="h-4 w-4" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-center text-lg leading-[110%]">
            Thank you for your request!
          </DialogTitle>
          <DialogDescription className="pt-2 text-center leading-[150%]">
            You should receive a confirmation email shortly. We'll get back to
            you within 5 business days.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-7">
          <span className="text-5xl">🎉</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
