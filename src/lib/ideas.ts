export type IdeaTemplate = {
  slug: string;
  title: string;
  description: string;
  suggestedFeatures: string[];
};

export const ideaTemplates: IdeaTemplate[] = [
  {
    slug: "yoga-booking",
    title: "A booking app for a yoga studio",
    description:
      "Let students browse the weekly schedule, book a spot in a class and get a reminder before it starts.",
    suggestedFeatures: [
      "Weekly class schedule",
      "Book and cancel a spot",
      "Teacher profiles",
      "Email reminders",
    ],
  },
  {
    slug: "internal-crm",
    title: "An internal CRM dashboard",
    description:
      "Keep every customer, deal and follow-up in one place, with a clear view of what the team should do next.",
    suggestedFeatures: ["Contact list", "Deal pipeline", "Notes and tasks", "Team permissions"],
  },
  {
    slug: "portfolio-blog",
    title: "A personal portfolio with a blog",
    description:
      "Show your best work on a beautiful homepage and publish writing that keeps people coming back.",
    suggestedFeatures: ["Project gallery", "Blog posts", "About page", "Contact form"],
  },
  {
    slug: "camera-marketplace",
    title: "A marketplace for vintage cameras",
    description:
      "Let sellers list their cameras with photos and prices, and buyers search, message and check out.",
    suggestedFeatures: ["Listings with photos", "Search and filters", "Messaging", "Checkout"],
  },
];

export function findIdea(slug: string | undefined) {
  return ideaTemplates.find((idea) => idea.slug === slug);
}
