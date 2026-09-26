export type FlavorId =
  | "schoko"
  | "matcha"
  | "erdbeere"
  | "blaubeere"
  | "zimt"
  | "vanille"
  | "salzkaramell"
  | "minze"
  | "kokos"
  | "honig"
  | "fanta"
  | "fantaexotik"
  | "uboot"
  | "doener"
  | "mittelalter";

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
  { id: "salzkaramell", name: "Salzkaramell", emoji: "🧈", tagline: "Süß mit einer Prise Salz" },
  { id: "minze", name: "Minze", emoji: "🌿", tagline: "Frisch, kühl, grün schimmernd" },
  { id: "kokos", name: "Kokos", emoji: "🥥", tagline: "Exotisch, weiß, wolkenweich" },
  { id: "honig", name: "Honig", emoji: "🍯", tagline: "Goldig, süß, sonnig" },
];

export const SECRET_FLAVORS: (Flavor & { code: string[] })[] = [
  { id: "fanta", name: "Fanta", emoji: "🍊", tagline: "Spritzig orange", code: ["fanta"] },
  { id: "fantaexotik", name: "Fanta Exotik", emoji: "🥭", tagline: "Tropisch, gelb-pink", code: ["fanta"] },
  { id: "uboot", name: "U-Boot", emoji: "🌊", tagline: "Tief unter Wasser", code: ["uboot", "ubot", "u-boot"] },
  { id: "doener", name: "Döner", emoji: "🥙", tagline: "Frisch vom Spieß", code: ["döner", "doener", "doner"] },
  { id: "mittelalter", name: "Mittelalter", emoji: "🏰", tagline: "Burgen und Ritter", code: ["mittelalter"] },
];

export const ALL_FLAVORS: Flavor[] = [...FLAVORS, ...SECRET_FLAVORS];

export const DEFAULT_FLAVOR: FlavorId = "schoko";
