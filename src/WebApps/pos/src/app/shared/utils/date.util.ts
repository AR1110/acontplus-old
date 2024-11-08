import  {format, tzDate}   from "@formkit/tempo";

export const zonaHorariaEcuador  = 'America/Guayaquil';
export const language = 'en';

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
      esMismoAnio: false
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
    esMismoAnio: fecha1.getFullYear() === fecha2.getFullYear()
  };
}


export const formatDate = function (fecha: any) {
  let dt = tzDate(fecha, zonaHorariaEcuador)
  return dt;
}


export const dateIsAfterCurrentDate = function (fechaIngresada: any) {

  const fechaActual = new Date();
    const fechaActualFormat = format({
      date: fechaActual,
      format: { time: 'full' },
      tz: zonaHorariaEcuador,
    });

    const fechaIngresadaFormat = format({
      date: fechaIngresada,
      format: 'YYYY-MM-DD',
      tz: zonaHorariaEcuador,
    });

    return fechaIngresadaFormat > fechaActualFormat
}



export function ajustarFechaEmisionModificada<T extends { fechaEmision: any, fechaEmisionDocCreado?: any, setHoursZero: boolean }>(obj: T) {
  const { fechaEmision, fechaEmisionDocCreado, setHoursZero } = obj;
  let fechaEmisionModificada = new Date(fechaEmision);
  let fechaActual = new Date();

  if (fechaEmisionDocCreado) {
    let dataFechaAnterior = isDatesEqual(fechaEmisionModificada, fechaEmisionDocCreado);
    if (dataFechaAnterior.esMismaFecha) {
      return fechaEmisionDocCreado;
    }
  }

  let dataFechaActual = isDatesEqual(fechaEmisionModificada, fechaActual);

  if (dataFechaActual.esMismaFecha) {
    fechaEmisionModificada.setHours(
      fechaActual.getHours(),
      fechaActual.getMinutes(),
      fechaActual.getSeconds(),
      fechaActual.getMilliseconds()
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
  let newDate = new Date(fechaEmision);
  newDate.setDate(newDate.getDate() + dia);
  return newDate;
};


export function isDateValid(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any);
}





export const formatDateToString = function (date:Date){
  if (!isDateValid(date)) {
    throw new Error("La fecha es inválida");
  }
  return format ({
    date,
    format: 'YYYY-MM-DD HH:mm:ss A',
    tz: zonaHorariaEcuador,
  })
}
