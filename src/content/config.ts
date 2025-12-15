import { defineCollection, z } from "astro:content";

const generalCollection = defineCollection({
  type: "content",
  schema: z.object({
    editionNumber: z.string(),
    editionYear: z.string(),
    buyTicketUrl: z.string(),
  }),
});

const heroCollection = defineCollection({
  type: "content",
  schema: z.object({
    eventDate: z.string(),
    eventLocation: z.string(),
    eventLocation2: z.string(),
    polaroidCardImages: z.array(z.string()),
  }),
});

const teamCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    image: z.string(),
    social: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
      })
      .optional(),
  }),
});

const venueCollection = defineCollection({
  type: "content",
  schema: z.object({
    description: z.string(),
    eventLocation: z.string(),
    polaroidCardImages: z.array(z.string()),
    carouselImages: z.array(z.string()),
  }),
});

const ticketsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    features: z.array(z.string()).optional(),
    link: z.string().optional(),
  }),
});

const faqCollection = defineCollection({
  type: "content",
  schema: z.object({
    question: z.string(),
    answer: z.string(),
  }),
});

const previousEditionsCollection = defineCollection({
  type: "content",
  schema: z.object({
    polaroidCardImages: z.array(z.string()),
    carouselImages: z.array(z.string()),
  }),
});

const unforgettableExperienceCollection = defineCollection({
  type: "content",
  schema: z.object({
    backgroundVideo: z.string(),
  }),
});

export const collections = {
  general: generalCollection,
  hero: heroCollection,
  team: teamCollection,
  venue: venueCollection,
  tickets: ticketsCollection,
  faq: faqCollection,
  previousEditions: previousEditionsCollection,
  unforgettableExperience: unforgettableExperienceCollection,
};
