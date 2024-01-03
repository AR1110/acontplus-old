export function getEnumValueByKey<T>(data: T, key: keyof T) {
  return data[key];
}
