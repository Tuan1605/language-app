/** Strip HTML tags from Anki-imported data or user input. */
export const stripHtml = (s: string): string =>
  s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
