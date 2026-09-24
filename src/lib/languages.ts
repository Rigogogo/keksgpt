export type LangId =
  | "de-DE"
  | "en-US"
  | "fr-FR"
  | "es-ES"
  | "it-IT"
  | "nl-NL"
  | "pl-PL"
  | "tr-TR"
  | "pt-PT"
  | "ru-RU"
  | "ar-SA"
  | "ja-JP";

export type Lang = {
  id: LangId;
  name: string;
  flag: string;
};

export const LANGUAGES: Lang[] = [
  { id: "de-DE", name: "Deutsch", flag: "🇩🇪" },
  { id: "en-US", name: "Englisch", flag: "🇺🇸" },
  { id: "fr-FR", name: "Französisch", flag: "🇫🇷" },
  { id: "es-ES", name: "Spanisch", flag: "🇪🇸" },
  { id: "it-IT", name: "Italienisch", flag: "🇮🇹" },
  { id: "nl-NL", name: "Niederländisch", flag: "🇳🇱" },
  { id: "pl-PL", name: "Polnisch", flag: "🇵🇱" },
  { id: "tr-TR", name: "Türkisch", flag: "🇹🇷" },
  { id: "pt-PT", name: "Portugiesisch", flag: "🇵🇹" },
  { id: "ru-RU", name: "Russisch", flag: "🇷🇺" },
  { id: "ar-SA", name: "Arabisch", flag: "🇸🇦" },
  { id: "ja-JP", name: "Japanisch", flag: "🇯🇵" },
];

export const DEFAULT_LANG: LangId = "de-DE";

export function langName(id: LangId): string {
  return LANGUAGES.find((l) => l.id === id)?.name ?? "Deutsch";
}
