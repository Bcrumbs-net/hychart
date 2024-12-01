export const fetchTranslations = async (
  lang: string
): Promise<Record<string, string | Record<string, string>>> => {
  let translations: Record<string, string | Record<string, string>> = {};

  try {
    const response = await fetch(`/assets/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    translations = await response.json();
  } catch (error) {
    console.error("Error fetching translations:", error);
  }

  return translations;
};
