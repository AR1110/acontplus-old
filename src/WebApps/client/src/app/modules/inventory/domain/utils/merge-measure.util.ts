import { MedidaProducto } from '../models/measure.model';
import { ProductMeasure } from '@inventory/domain/models/product-measure';

/**
 * @deprecated
 * Use `mergeProductMeasures` instead.
 * This legacy version remains for backward compatibility.
 */
export const mergeMeasureUtil = function (
  principalMedidas: any,
  fraccionadoMedidas: any,
): MedidaProducto[] {
  const parseMedidas = (medidas: any): any[] => {
    if (typeof medidas === 'string') {
      try {
        return JSON.parse(medidas) || [];
      } catch {
        return [];
      }
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
    precioUnitario: medida.precioUnitario || 0,
    tipo,
  });

  const medidasPrincipalMapper = medidasPrincipalTemp.map((medida) =>
    mapMedida(medida, 'PRINCIPAL'),
  );
  const medidasFraccionadoMapper = medidasFraccionadoTemp.map((medida) =>
    mapMedida(medida, 'FRACCIONADO'),
  );

  const orderMedidaArray = [...medidasFraccionadoMapper, ...medidasPrincipalMapper]
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map((medida) => ({
      ...medida,
      defaultMedida: false,
    }));

  if (orderMedidaArray[0]) {
    orderMedidaArray[0].defaultMedida = true;
  }

  const medidas = orderMedidaArray.map((item) => {
    const tarifasParse =
      (typeof item.tarifas === 'string' ? JSON.parse(item.tarifas) : item.tarifas) || [];
    const tarifas = tarifasParse.map((t: any) => ({
      idTarifa: t.idTarifa,
      precioVenta: t.precioVenta,
      precioConIva: t.precioConIva,
      descripcion: t.tarifa,
      defaultTarifa: t.predeterminada,

      id: t.idTarifa,
      salePrice: t.precioVenta,
      priceWithTax: t.precioConIva,
      name: t.tarifa,
      isDefault: t.predeterminada,
    }));

    return {
      idMedida: item.idMedida,
      conversion: item.conversion || 1,
      descripcion: item.descripcion || item.medida,
      defaultMedida: item.defaultMedida,
      tipo: item.tipo,
      precioUnitario: item.precioUnitario,
      precioCosto: item.precioCosto,
      precioCostoFraccionado: item.precioCostoFraccionado,
      tarifas,
      fees: tarifas,
    };
  });

  return medidas;
};

/**
 * ✅ New standardized version (English)
 * Replaces `mergeMeasureUtil`
 */
export const mergeProductMeasures = function (
  mainMeasures: any,
  fractionalMeasures: any,
): ProductMeasure[] {
  const parseMeasures = (measures: any): any[] => {
    if (typeof measures === 'string') {
      try {
        return JSON.parse(measures) ?? [];
      } catch {
        return [];
      }
    } else if (Array.isArray(measures)) {
      return measures;
    }
    return [];
  };

  const mainParsed: any[] = parseMeasures(mainMeasures);
  const fractionalParsed: any[] = parseMeasures(fractionalMeasures);

  const parseFees = (fees: any): any[] => {
    const parsed = typeof fees === 'string' ? JSON.parse(fees) : fees;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((f) => ({
      id: f.idTarifa ?? f.rateId ?? 0,
      name: f.tarifa ?? f.name ?? '',
      salePrice: f.precioVenta ?? f.salePrice ?? 0,
      priceWithTax: f.precioConIva ?? f.priceWithTax ?? 0,
      isDefault: f.predeterminada ?? f.isDefault ?? false,
    }));
  };

  const normalizeMeasure = (measure: any, type: 'MAIN' | 'FRACTIONAL') => ({
    id: measure.idMedida ?? measure.measureId ?? 0,
    conversion: measure.conversion ?? 1,
    name: measure.name ?? measure.descripcion ?? measure.medida ?? '',
    unitPrice: measure.unitPrice ?? measure.precioUnitario ?? 0,
    costPrice: measure.costPrice ?? measure.precioCosto ?? 0,
    fractionalCostPrice: measure.fractionalCostPrice ?? measure.precioCostoFraccionado ?? 0,
    order: measure.orden ?? 0,
    type,
    defaultMeasure: false,
    fees: parseFees(measure.tarifas ?? measure.fees ?? []),
  });

  const merged = [
    ...fractionalParsed.map((m) => normalizeMeasure(m, 'FRACTIONAL')),
    ...mainParsed.map((m) => normalizeMeasure(m, 'MAIN')),
  ].sort((a, b) => a.order - b.order);

  if (merged.length > 0) merged[0].defaultMeasure = true;

  return merged;
};
