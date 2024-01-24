export function getEnumValueByKey<T>(myEnum: T, key: keyof T) {
    return myEnum[key];
}