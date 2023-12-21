export function getEnumValueByKey(myEnum: any, key: string): string {
  return myEnum[key as keyof typeof myEnum];
}
