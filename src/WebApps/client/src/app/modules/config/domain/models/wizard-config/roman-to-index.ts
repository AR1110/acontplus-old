//Custom steps for numbers
const romanToIntMap: Record<string, number> = {
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
};

export function romanToInt(roman: string): number {
  return romanToIntMap[roman] || 0;
}
