import { v4 as uuidv4 } from "uuid";

export const turkceKarakterTemizle = (text: string): string => {
  const karakterMap: { [key: string]: string } = {
    ı: "i",
    İ: "I",
    ş: "s",
    Ş: "S",
    ğ: "g",
    Ğ: "G",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
    ç: "c",
    Ç: "C",
  };

  return text
    .split("")
    .map((char) => karakterMap[char] || char)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
};

export const generateUUID = (): string => {
  return `UUID-${uuidv4().split("-")[0].toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
};

export const formatDate = (): string => {
  return new Date().toISOString();
};
