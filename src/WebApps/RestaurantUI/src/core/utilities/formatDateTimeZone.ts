
const formatDateTimeSoze = (date: any) => {
    const x = new Date(date);
    const hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
    const minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
    x.setHours(hoursDiff);
    x.setMinutes(minutesDiff);
    return x;
}

export default formatDateTimeSoze;