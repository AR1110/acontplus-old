import { format } from "@formkit/tempo";
import moment from "moment";

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
  var date = moment.tz(fecha, 'America/Guayaquil');
  var htmlDateTime = date.format('YYYY-MM-DDTHH:mm:ss');
  // let _getFecha = new Date(fecha);
  // _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
  return new Date(htmlDateTime);
}


export const dateIsAfterCurrentDate = function (fecha: any) {
  const zonaHorariaEcuador = 'America/Guayaquil'; // Utilizamos la zona horaria de la Costa del Ecuador (ECT)

  const fechaActual = moment().tz(zonaHorariaEcuador); // Obtener la fecha actual en la zona horaria de Ecuador
  const fechaIngresada = moment.tz(fecha, 'YYYY-MM-DD', zonaHorariaEcuador); // Utilizar la zona horaria de Ecuador para la fecha ingresada

  if (fechaIngresada.isValid() && fechaIngresada.isAfter(fechaActual, 'day')) {
    return true;
  }
  return false;
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

export const formatDateToString = function (date:Date){
  if (!isDateValid(date)) {
    throw new Error("La fecha es inválida");
  }
  return moment(date).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss A')
}

export const isDateValid = function (dateString: Date) {
  if (dateString === null) {
    return false; // Valor nulo no es válido
  }
  let date = new Date(dateString);
  return date instanceof Date;
}


export const fechaString = (t:Date)=>{
  const l = "en"
  return format(t,"DD/MM/YYYY", l)
}
