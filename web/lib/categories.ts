// Mirror of the public.categories seed rows. Kept here so client components
// can render icons/colors without a round-trip. Source of truth is the DB.
export const CATEGORIES = [
  { id: "cards", name: "Playing Cards", icon: "🂡", cls: "c-cards" },
  { id: "dominoes", name: "Dominoes", icon: "🁫", cls: "c-dominoes" },
  { id: "crafts", name: "Knitting & Crafts", icon: "🧶", cls: "c-crafts" },
  { id: "walking", name: "Walking Group", icon: "🚶", cls: "c-walking" },
  { id: "coffee", name: "Coffee & Chat", icon: "☕", cls: "c-coffee" },
  { id: "games", name: "Board Games", icon: "🎲", cls: "c-games" },
  { id: "garden", name: "Gardening", icon: "🌷", cls: "c-garden" },
  { id: "books", name: "Book Club", icon: "📚", cls: "c-books" },
  { id: "music", name: "Music & Singing", icon: "🎵", cls: "c-music" },
  { id: "meal", name: "Shared Meal", icon: "🍲", cls: "c-meal" },
] as const;

export type CategoryMeta = (typeof CATEGORIES)[number];

export function categoryById(id: string): { id: string; name: string; icon: string; cls: string } {
  return CATEGORIES.find((c) => c.id === id) ?? { id, name: "Activity", icon: "📌", cls: "c-default" };
}
