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
