export function calcReadingTime(content: string): number {
  const WPM = 230;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WPM));
}
