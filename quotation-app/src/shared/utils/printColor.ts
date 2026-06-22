export const NO_PRINT_VALUE = '不印刷';

export const PRINT_COLOR_OPTIONS = ['', '1色', '2色', '3色', '4色', '5色', '6色'];

export function formatPrintColor(frontColor?: string, reverseColor?: string, specialColor?: string): string {
  const front = (frontColor || '').trim();
  const back = (reverseColor || '').trim();
  const special = (specialColor || '').trim();

  const parts: string[] = [];
  if (front === NO_PRINT_VALUE) {
    parts.push(NO_PRINT_VALUE);
  } else if (front) {
    parts.push(`正${front}`);
  }
  if (back) parts.push(`反${back}`);
  if (special) parts.push(`特別色${special}`);

  return parts.join(' / ');
}
