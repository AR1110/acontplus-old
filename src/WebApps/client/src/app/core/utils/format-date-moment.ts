import moment from 'moment-timezone';

export const isDateValid = function (dateString: Date) {
  if (dateString === null) {
    return false; // Valor nulo no es válido
  }
  let date = new Date(dateString);
  return date instanceof Date; 
}

export const formatDateMoment = function (dateString: Date) {
  if (!isDateValid(dateString)) {
    throw new Error("La fecha es inválida");
  }
  return moment(dateString).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss A')
}
