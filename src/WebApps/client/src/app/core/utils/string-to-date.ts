export function stringToDate(_date: string, _format: string, _delimiter: string): Date | null {
  const [dateValues, timeValues] = _date.split(' ');

  const [hours, minutes] = timeValues
    ? timeValues.split(':').map(part => parseInt(part, 10))
    : [0, 0];

  const normalizedDate = dateValues.replace(/[^a-zA-Z0-9]/g, _delimiter);
  const normalizedFormat = _format.toLowerCase().replace(/[^a-zA-Z0-9]/g, _delimiter);
  const formatItems = normalizedFormat.split(_delimiter);
  const dateItems = normalizedDate.split(_delimiter);

  const monthIndex = formatItems.indexOf('mm');
  const dayIndex = formatItems.indexOf('dd');
  const yearIndex = formatItems.indexOf('yyyy');
  const hourIndex = formatItems.indexOf('hh');
  const minutesIndex = formatItems.indexOf('ii');
  const secondsIndex = formatItems.indexOf('ss');

  const today = new Date();

  const year = yearIndex > -1 ? parseInt(dateItems[yearIndex], 10) : today.getFullYear();
  const month = monthIndex > -1 ? parseInt(dateItems[monthIndex], 10) - 1 : today.getMonth();
  const day = dayIndex > -1 ? parseInt(dateItems[dayIndex], 10) : today.getDate();

  const hour = hourIndex > -1 && !isNaN(hours) ? hours : 0;
  const minute = minutesIndex > -1 && !isNaN(minutes) ? minutes : 0;
  const second =
    secondsIndex > -1 && !isNaN(parseInt(dateItems[secondsIndex], 10))
      ? parseInt(dateItems[secondsIndex], 10)
      : 0;

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error('Formato de fecha no válido');
    return null;
  }

  return new Date(year, month, day, hour, minute, second);
}
