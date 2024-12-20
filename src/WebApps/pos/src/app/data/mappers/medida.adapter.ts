import {MedidaProducto} from "@domain/models/inventory/medida.model";

export const mergeMeasureFromAdapter = function (principalMedidas: unknown, fraccionadoMedidas: unknown): MedidaProducto[] {

  const parseMedidas = (medidas: unknown): any[] => {
    if (typeof medidas === 'string') {
      return JSON.parse(medidas) || [];
    } else if (Array.isArray(medidas)) {
      return medidas;
    }
    return [];
  };

  const medidasPrincipalTemp: any[] = parseMedidas(principalMedidas);
  const medidasFraccionadoTemp: any[] = parseMedidas(fraccionadoMedidas);

  const mapMedida = (medida: any, tipo: string) => ({
    ...medida,
    precioCosto: medida.precioCosto || 0,
    precioCostoFraccionado: medida.precioCostoFraccionado || 0,
    tipo
  });

  const medidasPrincipalMapper = medidasPrincipalTemp.map(medida => mapMedida(medida, 'PRINCIPAL'));
  const medidasFraccionadoMapper = medidasFraccionadoTemp.map(medida => mapMedida(medida, 'FRACCIONADO'));


  /**
   * Combinar los dos arrays de medidas en uno solo
   *
   * Parámetros:
   *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
   */
    // Combinar los dos arrays de medidas en uno solo

  const mergedMedidasArray = [...medidasFraccionadoMapper, ...medidasPrincipalMapper];

  /**
   * Ordenar el array de medidas en función de la propiedad "orden" y
   * establecer la propiedad "defaultMedida" en falso para todos los elementos
   *
   * Parámetros:
   *  - orderMedidaArray: El array de medidas ordenado
   */
  let orderMedidaArray = mergedMedidasArray.slice().sort((a, b) => a.orden - b.orden).map(medida => ({
    ...medida,
    defaultMedida: false
  }));
  orderMedidaArray = orderMedidaArray || []

  // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
  if (orderMedidaArray[0]) {
    orderMedidaArray[0].defaultMedida = true;
  }


  // Crear un nuevo array de medidas con un formato específico
  return orderMedidaArray.map(item => {
    const tarifasParse = (typeof item.tarifas === "string" ? JSON.parse(item.tarifas) : item.tarifas) || [];
    const tarifas = tarifasParse.map((t: any) => ({
      idTarifa: t.idTarifa,
      precioVenta: t.precioVenta,
      precioConIva: t.precioConIva,
      descripcion: t.tarifa,
      default: t.predeterminada
    }))
    return {
      idMedida: item.idMedida,
      conversion: item.conversion || 1,
      descripcion: item.descripcion || item.medida,
      defaultMedida: item.defaultMedida,
      tipo: item.tipo,
      precioCosto: item.precioCosto,
      precioCostoFraccionado: item.precioCostoFraccionado,
      pvps: tarifas,
    }
  });
}
