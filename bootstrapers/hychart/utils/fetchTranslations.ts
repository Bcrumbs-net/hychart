export const fetchTranslations = async (
  lang: string
): Promise<Record<string, string | Record<string, string>>> => {
  let translations: Record<string, string | Record<string, string>> = {};

  try {
    const baseUrl = "http://localhost:3000";
    const url = `${baseUrl}/assets/locales/${lang}.json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    translations = await response.json();
  } catch (error) {
    console.error("Error fetching translations:", error);
  }

  return translations;
};
