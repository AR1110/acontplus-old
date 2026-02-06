import { format, isAfter, tzDate } from '@formkit/tempo';

export const zonaHorariaEcuador = 'America/Guayaquil';
export const language = 'es';

interface ResultadoComparacionFechas {
  esMismaFecha: boolean;
  esMismoDia: boolean;
  esMismoMes: boolean;
  esMismoAnio: boolean;
}

export const isDatesEqual = function (fecha1: Date, fecha2: Date): ResultadoComparacionFechas {
  // Verificar si alguna fecha es null
  if (!fecha1 || !fecha2) {
    return {
      esMismaFecha: false,
      esMismoDia: false,
      esMismoMes: false,
      esMismoAnio: false,
    };
  }

  // Comparar solo el día, mes y año
  const esMismaFecha =
    fecha1.getDate() === fecha2.getDate() &&
    fecha1.getMonth() === fecha2.getMonth() &&
    fecha1.getFullYear() === fecha2.getFullYear();

  return {
    esMismaFecha,
    esMismoDia: fecha1.getDate() === fecha2.getDate(),
    esMismoMes: fecha1.getMonth() === fecha2.getMonth(),
    esMismoAnio: fecha1.getFullYear() === fecha2.getFullYear(),
  };
};

export const formatDate = function (fecha: any) {
  return tzDate(fecha, zonaHorariaEcuador);
};

export const dateIsAfterCurrentDate = function (fecha: any) {
  const currentDate = format(new Date(), 'YYYY-MM-DD', language);
  const inputDate = format(fecha, 'YYYY-MM-DD', language);

  return isAfter(inputDate, currentDate);
};

export function ajustarFechaEmisionModificada<
  T extends {
    fechaEmision: any;
    fechaEmisionDocCreado?: any;
    setHoursZero: boolean;
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
    if (setHoursZero) {
      fechaEmisionModificada.setHours(0, 0, 0, 0);
    } else {
      fechaEmisionModificada.setHours(23, 59, 0, 0);
    }
  }

  return fechaEmisionModificada;
}

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
  const newDate = new Date(fechaEmision);
  newDate.setDate(newDate.getDate() + dia);
  return newDate;
};

export const formatDateToString = function (date: Date) {
  if (!isDateValid(date)) {
    throw new Error('La fecha es inválida');
  }
  const dateZone = tzDate(date, zonaHorariaEcuador);
  return format({
    date: dateZone,
    format: 'YYYY-MM-DD h:mm:ss',
    tz: zonaHorariaEcuador,
  });
};

export const isDateValid = function (dateString: string | Date): boolean {
  // If the input is null, undefined, or an empty string, it's invalid
  if (dateString === null || dateString === undefined || dateString === '') {
    return false;
  }

  // If the input is already a Date object, check if it's valid
  if (dateString instanceof Date) {
    return !isNaN(dateString.getTime());
  }

  // If the input is a string, try to parse it into a Date object
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
export const fechaString = (t: Date) => {
  return format(t, 'DD/MM/YYYY', language);
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
