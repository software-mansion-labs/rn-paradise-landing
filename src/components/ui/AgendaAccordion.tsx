import {
  Accordion as BaseAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AgendaAccordionProps {
  data: {
    title: string;
    description: string;
  }[];
  startDay: number;
}

export function AgendaAccordion({ data, startDay }: AgendaAccordionProps) {
  const getDayName = (index: number) => {
    const dayIndex = (startDay + index) % 7;
    return DAY_NAMES[dayIndex];
  };

  return (
    <BaseAccordion
      type="single"
      collapsible
      defaultValue={`item-0`}
      className="w-full"
    >
      {data.map((item, i) => {
        return (
          <AccordionItem value={`item-${i.toFixed()}`} key={item.title}>
            <AccordionTrigger className="items-center">
              <div className="grid w-full gap-4 sm:grid-cols-[170px_1fr] md:grid-cols-[200px_1fr]">
                <p className="text-primary shrink-0 text-left text-sm font-normal">
                  <strong>Day {i + 1}</strong> - {getDayName(i)}
                </p>
                <p className="text-primary text-left text-sm font-normal">
                  {item.title}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid w-full pr-8 sm:grid-cols-[170px_1fr] sm:gap-4 md:grid-cols-[200px_1fr]">
                <div></div>
                <p className="text-primary text-left text-xs text-balance">
                  {item.description}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </BaseAccordion>
  );
}
