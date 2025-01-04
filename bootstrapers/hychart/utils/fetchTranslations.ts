import path from "path";
import fs from "fs";

export const fetchTranslations = async (
  lang: string
): Promise<Record<string, string | Record<string, string>>> => {
  let translations: Record<string, string | Record<string, string>> = {};

  try {
    const filePath = path.join(
      process.cwd(),
      `public/assets/locales/${lang}.json`
    );

    const fileContents = fs.readFileSync(filePath, "utf8");

    translations = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching translations:", error);
  }

  return translations;
};
