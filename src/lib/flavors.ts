export type FlavorId = "schoko" | "matcha" | "erdbeere" | "blaubeere" | "zimt" | "vanille";

export type Flavor = {
  id: FlavorId;
  name: string;
  emoji: string;
  tagline: string;
};

export const FLAVORS: Flavor[] = [
  { id: "schoko", name: "Schokolade", emoji: "🍪", tagline: "Klassisch, warm, doppelt Schoko" },
  { id: "matcha", name: "Matcha", emoji: "🍵", tagline: "Grün, ruhig, leicht herb" },
  { id: "erdbeere", name: "Erdbeere", emoji: "🍓", tagline: "Fruchtig und verspielt" },
  { id: "blaubeere", name: "Blaubeere", emoji: "🫐", tagline: "Kühl und beerig" },
  { id: "zimt", name: "Zimt", emoji: "🥮", tagline: "Würzig, gemütlich, Ofenwarm" },
  { id: "vanille", name: "Vanille", emoji: "🍦", tagline: "Sanft, cremig, hell" },
];

export const DEFAULT_FLAVOR: FlavorId = "schoko";
