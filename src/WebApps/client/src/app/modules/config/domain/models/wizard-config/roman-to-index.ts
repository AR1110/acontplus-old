const romanToIntMap: { [key: string]: number } = {
  IV: 1,
  V: 2,
  VI: 3,
  VII: 4,
};

export function romanToInt(roman: string): number {
  return romanToIntMap[roman] || 0;
}
