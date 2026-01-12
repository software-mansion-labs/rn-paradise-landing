import { defineCollection, z } from "astro:content";

const generalCollection = defineCollection({
  type: "data",
  schema: z.object({
    editionNumber: z.string(),
    editionYear: z.string(),
  }),
});

const heroCollection = defineCollection({
  type: "data",
  schema: z.object({
    eventDate: z.string(),
    eventLocation: z.string(),
  }),
});

const aboutCollection = defineCollection({
  type: "data",
  schema: z.object({
    featureCards: z.array(
      z.object({
        text: z.string(),
        order: z.number().optional(),
      }),
    ),
    polaroidGallery: z.array(
      z.object({
        image: z.string(),
        caption: z.string(),
        order: z.number().optional(),
      }),
    ),
  }),
});

const teamCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string().optional(),
    bio: z.string().optional(),
    image: z.string(),
    order: z.number().optional(),
    social: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
      })
      .optional(),
  }),
});

const venueCollection = defineCollection({
  type: "data",
  schema: z.object({
    description_paragraph1: z.string(),
    description_paragraph2: z.string(),
    description_paragraph3: z.string(),
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
    order: z.number().optional(),
  }),
});

const previousEditionsCollection = defineCollection({
  type: "data",
  schema: z.object({
    polaroidCardImages: z.array(z.string()),
    carouselImages: z.array(z.string()),
  }),
});

const unforgettableExperienceCollection = defineCollection({
  type: "data",
  schema: z.object({
    backgroundVideo: z.string(),
  }),
});

const contactCollection = defineCollection({
  type: "data",
  schema: z.object({
    discordUrl: z.string(),
  }),
});

const settingsCollection = defineCollection({
  type: "data",
  schema: z.object({
    contactFormEmail: z.string().email(),
    reservationFormEmail: z.string().email(),
  }),
});

const reservationCollection = defineCollection({
  type: "data",
  schema: z.object({
    dateOptions: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        available: z.preprocess((val) => {
          if (val === false || val === "false" || val === 0) return false;
          if (val === true || val === "true" || val === 1) return true;
          return Boolean(val);
        }, z.boolean()),
      }),
    ),
    rooms: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        descriptions: z.array(z.string()),
        price: z.number().optional(),
        people_count: z.number().optional(),
      }),
    ),
    dateRoomAvailability: z.array(
      z.object({
        dateId: z.string(),
        availableRoomIds: z.array(z.string()).optional().default([]),
      }),
    ),
  }),
});

export const collections = {
  general: generalCollection,
  hero: heroCollection,
  about: aboutCollection,
  team: teamCollection,
  venue: venueCollection,
  tickets: ticketsCollection,
  faq: faqCollection,
  previousEditions: previousEditionsCollection,
  unforgettableExperience: unforgettableExperienceCollection,
  contact: contactCollection,
  reservation: reservationCollection,
  settings: settingsCollection,
};
