import moment from 'moment-timezone';

export const formatDate = function (fecha: any) {
  let date = moment.tz(fecha, 'America/Guayaquil');
  let htmlDateTime = date.format('YYYY-MM-DDTHH:mm:ss');
  // let _getFecha = new Date(fecha);
  // _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
  return new Date(htmlDateTime);
};

export function setDateWithCurrentTime(date: Date): Date {
  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentSeconds = currentDate.getSeconds();

  const newDate = new Date(date);
  newDate.setHours(currentHours, currentMinutes, currentSeconds);

  return newDate;
}

export const addDayToDate = function (fechaEmision: Date, dia: number) {
  let newDate = new Date(fechaEmision);
  newDate.setDate(newDate.getDate() + dia);
  return newDate;
};

export function formatDateString(date: unknown): string {
  const d = new Date(date as Date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
