import { format, isAfter, tzDate } from '@formkit/tempo';

/**
 * Zona horaria principal usada en Ecuador
 */
export const zonaHorariaEcuador = 'America/Guayaquil';

/**
 * Idioma base para formatos de fecha
 */
export const language = 'es';

/**
 * Interfaz de resultado para comparar dos fechas
 */
interface ResultadoComparacionFechas {
  esMismaFecha: boolean;
  esMismoDia: boolean;
  esMismoMes: boolean;
  esMismoAnio: boolean;
}

/**
 * Compara dos fechas y devuelve información sobre si son iguales
 * en día, mes y año.
 */
export function isDatesEqual(fecha1: Date, fecha2: Date): ResultadoComparacionFechas {
  if (!fecha1 || !fecha2) {
    return {
      esMismaFecha: false,
      esMismoDia: false,
      esMismoMes: false,
      esMismoAnio: false,
    };
  }

  return {
    esMismaFecha:
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear(),
    esMismoDia: fecha1.getDate() === fecha2.getDate(),
    esMismoMes: fecha1.getMonth() === fecha2.getMonth(),
    esMismoAnio: fecha1.getFullYear() === fecha2.getFullYear(),
  };
}

/**
 * Convierte una fecha a la zona horaria de Ecuador.
 */
export function formatDate(fecha: any) {
  return tzDate(fecha, zonaHorariaEcuador);
}

/**
 * Verifica si una fecha es posterior a la fecha actual.
 */
export function dateIsAfterCurrentDate(fecha: any) {
  const currentDate = format(new Date(), 'YYYY-MM-DD', language);
  const inputDate = format(fecha, 'YYYY-MM-DD', language);
  return isAfter(inputDate, currentDate);
}

/**
 * Ajusta la fecha de emisión según condiciones:
 * - Si coincide con la fecha anterior, se conserva.
 * - Si coincide con la fecha actual, se actualiza la hora actual.
 * - Si no coincide, puede ponerse hora 00:00 o 23:59.
 */
export function ajustarFechaEmisionModificada<
  T extends {
    fechaEmision: any;
    fechaEmisionDocCreado?: any;
    setHoursZero?: boolean;
  },
>(obj: T) {
  const { fechaEmision, fechaEmisionDocCreado, setHoursZero } = obj;
  const fechaEmisionModificada = new Date(fechaEmision);
  const fechaActual = new Date();

  if (fechaEmisionDocCreado) {
    const dataFechaAnterior = isDatesEqual(fechaEmisionModificada, fechaEmisionDocCreado);
    if (dataFechaAnterior.esMismaFecha) {
      return fechaEmisionDocCreado;
    }
  }

  const dataFechaActual = isDatesEqual(fechaEmisionModificada, fechaActual);

  if (dataFechaActual.esMismaFecha) {
    fechaEmisionModificada.setHours(
      fechaActual.getHours(),
      fechaActual.getMinutes(),
      fechaActual.getSeconds(),
      fechaActual.getMilliseconds(),
    );
  } else {
    fechaEmisionModificada.setHours(setHoursZero ? 0 : 23, setHoursZero ? 0 : 59, 0, 0);
  }

  return fechaEmisionModificada;
}

/**
 * Retorna una nueva fecha combinando la fecha dada con la hora actual.
 */
export function setDateWithCurrentTime(date: Date): Date {
  const now = new Date();
  const newDate = new Date(date);
  newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
  return newDate;
}

/**
 * Suma o resta días a una fecha dada.
 */
export function addDayToDate(fechaEmision: Date, dias: number) {
  const newDate = new Date(fechaEmision);
  newDate.setDate(newDate.getDate() + dias);
  return newDate;
}

/**
 * Formatea una fecha válida a cadena con zona horaria Ecuador.
 */
export function formatDateToString(date: Date) {
  if (!isDateValid(date)) throw new Error('La fecha es inválida');

  const dateZone = tzDate(date, zonaHorariaEcuador);

  // 🔸 Formato con hora 12h + AM/PM
  return format({
    date: dateZone,
    format: 'YYYY-MM-DD hh:mm:ss A',
    tz: zonaHorariaEcuador,
  });
}
/**
 * Verifica si una fecha es válida.
 */
export function isDateValid(dateInput: string | Date): boolean {
  if (!dateInput) return false;

  if (dateInput instanceof Date) {
    return !isNaN(dateInput.getTime());
  }

  const date = new Date(dateInput);
  return !isNaN(date.getTime());
}

/**
 * Formatea una fecha al estilo DD/MM/YYYY (usado comúnmente en Ecuador).
 */
export function fechaString(fecha: Date): string {
  return format(fecha, 'DD/MM/YYYY', language);
}

export const getTimeString = function (date: Date | string): string {
  const d = new Date(date);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

/**
 * Formatea una fecha a un string legible (solo día, mes, año).
 * @param {Date} date
 * @returns {string}
 */
export const formatDisplayDate = (date: Date | number) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};


export const formatDateOnly = (date: Date | string): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
