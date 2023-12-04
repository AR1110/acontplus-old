export function formatDateShort(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function formatDateLong(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
 