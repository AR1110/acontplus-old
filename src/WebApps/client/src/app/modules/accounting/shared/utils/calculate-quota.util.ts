import { roundNumber } from '@core/utils/round-number.utils';
import { TiempoCredito } from '@accounting/shared/models/tiempo-credito.interface';
import { formatDateToString } from '@core/utils/date.util';

// Función para calcular detalles de cuotas basadas en términos de crédito
interface QuotaProps {
  id?: number;
  fechaEmision: Date;
  tiemposCredito: TiempoCredito[];
  idTiempoCredito: number;
  total: number;
  cuotas: any[];
}
export const registerGenerateQuota = (obj: QuotaProps) => {
  // Desestructuración de propiedades del objeto para mayor legibilidad
  const { fechaEmision, tiemposCredito, idTiempoCredito, total } = obj;

  // Encontrar datos de tiempo de crédito según el id proporcionado
  const dataTiempoCredito = tiemposCredito.find((t) => t.idTiempoCredito === idTiempoCredito);

  // Manejo del caso en que no se encuentran datos de tiempo de crédito
  if (!dataTiempoCredito) {
    console.error('Tiempo de crédito no encontrado.');
    return {
      cuotas: [] as any[],
      montoTotalCuota: 0,
    };
  }

  // Cálculo de la cantidad de días por cuota
  const diaCuota = dataTiempoCredito.diasCredito / dataTiempoCredito.numeroCuota;

  // Cálculo del monto de cada cuota
  const valorCuota = total / dataTiempoCredito.numeroCuota;

  // Extracción del valor de la entrada desde los datos de tiempo de crédito
  const entrada = dataTiempoCredito.entrada;

  // Creación de un array que representa los números de cuota
  let cuotasArray = Array.from({ length: dataTiempoCredito.numeroCuota }, (_, index) => index + 1);

  cuotasArray = entrada ? [...cuotasArray, cuotasArray.length + 1] : cuotasArray;

  // Mapeo de detalles de cuotas basado en el array
  const resultCuotas = cuotasArray.map((num, index) => {
    // Verificación de si la cuota tiene entrada y es la primera
    const tieneEntrada = entrada && num === 1;

    // Cálculo de los días acumulados hasta la cuota actual
    let sumDia = 0;
    let nroCuota = 0;
    if (entrada) {
      sumDia = index * diaCuota;
      nroCuota = index;
    } else {
      sumDia = num * diaCuota;
      nroCuota = num;
    }

    // Manejo del caso en que hay una entrada en la primera cuota
    if (tieneEntrada) {
      return {
        nroCuota: nroCuota,
        cuota: 0,
        fechaVencimiento: formatDateToString(fechaEmision),
        entrada: 1,
      };
    }

    // Cálculo de la fecha de vencimiento para la cuota
    const fechaVencimiento = new Date(fechaEmision.getTime() + sumDia * 24 * 60 * 60 * 1000);

    // Retorno de detalles de la cuota
    return {
      nroCuota: nroCuota,
      cuota: roundNumber(valorCuota, 5),
      fechaVencimiento: formatDateToString(fechaVencimiento),
      entrada: 0,
    };
  });

  // Retorno del array de cuotas calculadas
  return {
    cuotas: resultCuotas,
    montoTotalCuota: resultCuotas.reduce((acc, curr) => acc + curr.cuota, 0),
  };
};

export const updateGeneratQCuota = (obj: QuotaProps) => {
  const { fechaEmision, tiemposCredito, idTiempoCredito, total, cuotas } = obj;

  // Encontrar datos de tiempo de crédito según el id proporcionado
  const dataTiempoCredito = tiemposCredito.find((t) => t.idTiempoCredito === idTiempoCredito);

  // Manejo del caso en que no se encuentran datos de tiempo de crédito
  if (!dataTiempoCredito) {
    console.error('Tiempo de crédito no encontrado.');
    return {
      cuotas: [] as any[],
      montoTotalCuota: 0,
    };
  }

  // Cálculo de la cantidad de días por cuota
  const diaCuota = dataTiempoCredito.diasCredito / dataTiempoCredito.numeroCuota;

  // Cálculo del monto de cada cuota
  const valorCuota = total / dataTiempoCredito.numeroCuota;

  const resultCuotas = cuotas.map((cuota) => {
    if (!cuota.entrada) {
      const sumDia = cuota.nroCuota * diaCuota;
      // Cálculo de la fecha de vencimiento para la cuota
      const fechaVencimiento = new Date(fechaEmision.getTime() + sumDia * 24 * 60 * 60 * 1000);

      // Retorno de detalles de la cuota
      return {
        nroCuota: cuota.nroCuota,
        cuota: roundNumber(valorCuota, 5),
        fechaVencimiento: formatDateToString(fechaVencimiento),
        entrada: cuota.entrada,
        idCuotaPorPagar: cuota.idCuotaPorPagar,
        idCuotaPorCobrar: cuota.idCuotaPorCobrar,
      };
    }

    return {
      nroCuota: cuota.nroCuota,
      cuota: cuota.cuota,
      fechaVencimiento: formatDateToString(cuota.fechaVencimiento),
      entrada: cuota.entrada,
      idCuotaPorPagar: cuota.idCuotaPorPagar,
      idCuotaPorCobrar: cuota.idCuotaPorCobrar,
    };
  });

  // Retorno del array de cuotas calculadas
  return {
    cuotas: resultCuotas,
    montoTotalCuota: resultCuotas.reduce((acc, curr) => acc + curr.cuota, 0),
  };
};

export const isValidGeneratorQuota = (obj: QuotaProps) => {
  let cuotas: any[] = [];
  let montoTotalCuota = 0;

  if (!(obj.id && obj.id > 0)) {
    const dataCuota = registerGenerateQuota(obj);
    cuotas = dataCuota.cuotas;
    montoTotalCuota = dataCuota.montoTotalCuota;
  }
  if (obj.id && obj.id > 0) {
    const dataCuota = updateGeneratQCuota(obj);
    cuotas = dataCuota.cuotas;
    montoTotalCuota = dataCuota.montoTotalCuota;
  }

  if (roundNumber(montoTotalCuota, 2) !== roundNumber(obj.total, 2)) {
    console.log('warning', 'No coincide el total de la cuota con el importe total del documento.');
    return [];
  }

  return cuotas;
};
