//Custom steps for numbers
const romanToIntMap: Record<string, number> = {
  II: 1,
  III: 2,
  IV: 3,
  V: 4,
};

export function romanToInt(roman: string): number {
  return romanToIntMap[roman] || 0;
}
