import { READING_WORDS_PER_MINUTE } from "./constants";

/**
 * Estimativa de tempo de leitura em minutos, ignorando blocos de código
 * e marcações de Markdown.
 */
export function estimateReadingTime(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ");

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / READING_WORDS_PER_MINUTE));
}

export function readingTimeLabel(minutes: number): string {
  return `${minutes} min de leitura`;
}
