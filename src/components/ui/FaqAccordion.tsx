import {
  Accordion as BaseAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqAccordionProps {
  data: {
    question: string;
    answer: string;
  }[];
}

export function FaqAccordion({ data }: FaqAccordionProps) {
  return (
    <BaseAccordion
      type="single"
      collapsible
      defaultValue={`item-0`}
      className="w-full"
    >
      {data.map((item, i) => {
        return (
          <AccordionItem value={`item-${i.toFixed()}`} key={item.question}>
            <AccordionTrigger>
              <p className="text-primary cursor-pointer text-left text-sm font-bold">
                {item.question}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-primary text-left text-xs">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </BaseAccordion>
  );
}
