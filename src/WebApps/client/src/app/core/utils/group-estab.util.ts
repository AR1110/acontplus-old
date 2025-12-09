import { BodegaEstablecimiento } from '@core/models/bodega.model';
import { GroupedEstab } from '@core/models/estab.model';
import { PuntoEmisionEstablecimiento } from '@core/models/punto-emision.model';
import { GroupedEstablishment } from '@core/models/establishment';

interface GroupEstabProps {
  estabs?: PuntoEmisionEstablecimiento[];
  bodegas?: BodegaEstablecimiento[];
  isGroupBodega?: boolean;
  isGroupPuntoEmision?: boolean;
}

/**
 * @deprecated
 * This utility function is deprecated.
 * Use the improved version `groupEstablishments()` instead.
 *
 * Reason:
 * - It contains duplicated logic between warehouses and emission points.
 * - Uses flags (`isGroupBodega`, `isGroupPuntoEmision`) that create dependency complexity.
 * - The new implementation is more dynamic and automatically groups based on data provided.
 *
 * Replacement:
 * ```ts
 * import { groupEstablishments } from '@/utils/group-estab.util';
 * ```
 */
export const groupEstabUtil = function (obj: GroupEstabProps): GroupedEstab[] {
  const { estabs, bodegas, isGroupBodega, isGroupPuntoEmision } = obj;
  let groupEstabs: GroupedEstab[] = [];

  if (isGroupPuntoEmision && estabs) {
    groupEstabs = estabs.reduce((acc, item) => {
      const existingItem = acc.find(
        (el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab,
      );

      if (!existingItem) {
        acc.push({
          id: item.idEstablecimiento,
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          nombreEstab: item.nombreComercial,
          codEstab: item.codEstab,
          defaultEstab: item.defaultEstab,
          correo: item.correo,
          puntosEmision: [
            {
              idPuntoEmision: item.idPuntoEmision,
              ptoEmi: item.ptoEmi,
              defaultPtoEmi: item.defaultPtoEmi,
            },
          ],
          bodegas: [],
        });
      } else {
        existingItem.puntosEmision.push({
          idPuntoEmision: item.idPuntoEmision,
          ptoEmi: item.ptoEmi,
          defaultPtoEmi: item.defaultPtoEmi,
        });
      }

      return acc;
    }, [] as GroupedEstab[]);

    if (isGroupBodega) {
      groupEstabs = groupEstabs.map((estab) => ({
        ...estab,
        bodegas:
          bodegas
            ?.filter((bodega) => bodega.idEstablecimiento === estab.idEstablecimiento)
            .map((bodega) => ({
              idBodega: bodega.idBodega,
              bodega: bodega.bodega,
              descripcion: bodega.bodega,
              defaultBodega: bodega.defaultBodega,
              idEstablecimiento: bodega.idEstablecimiento,
            })) || [],
      }));
    }
    return groupEstabs;
  }

  if (isGroupBodega && bodegas) {
    groupEstabs = bodegas.reduce((acc, item) => {
      const existingItem = acc.find(
        (el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab,
      );

      if (!existingItem) {
        acc.push({
          id: item.idEstablecimiento,
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          nombreEstab: item.nombreComercial,
          codEstab: item.codEstab,
          defaultEstab: item.defaultEstab,
          puntosEmision: [],
          correo: item.correo,
          bodegas: [
            {
              idEstablecimiento: item.idEstablecimiento,
              idBodega: item.idBodega,
              descripcion: item.bodega,
              defaultBodega: item.defaultBodega,
            },
          ],
        });
      } else {
        existingItem.bodegas?.push({
          idEstablecimiento: item.idEstablecimiento,
          idBodega: item.idBodega,
          descripcion: item.bodega,
          defaultBodega: item.defaultBodega,
        });
      }

      return acc;
    }, [] as GroupedEstab[]);
  }

  return groupEstabs;
};

interface GroupEstablishmentProps {
  emissionPoints?: any[];
  warehouses?: any[];
}

/**
 * Versión mejorada que reemplaza `groupEstabUtil`.
 * Combina en una sola pasada los establecimientos con sus puntos de emisión y bodegas.
 */
export const groupEstablishments = ({
  emissionPoints,
  warehouses,
}: GroupEstablishmentProps): GroupedEstablishment[] => {
  const groupedMap = new Map<number, GroupedEstablishment>();

  const getMapEstablishment = (establishment: any) => ({
    id: establishment.idEstablecimiento,
    tradeName: establishment.nombreComercial,
    code: establishment.codEstab,
    isDefault: establishment.defaultEstab,
    email: establishment.correo,
  });
  const getMapEmissionPoint = (point: any) => ({
    id: point.idPuntoEmision,
    name: point.ptoEmi,
    isDefault: point.defaultPtoEmi,
  });

  // Agrupar primero por puntos de emisión
  emissionPoints?.forEach((point) => {
    const existing = groupedMap.get(point.idEstablecimiento);
    if (!existing) {
      groupedMap.set(point.idEstablecimiento, {
        ...getMapEstablishment(point),
        emissionPoints: [getMapEmissionPoint(point)],
        warehouses: [],
      });
    } else {
      existing.emissionPoints.push(getMapEmissionPoint(point));
    }
  });

  // Agregar bodegas al mismo establecimiento si existen
  warehouses?.forEach((warehouse) => {
    let estab = groupedMap.get(warehouse.idEstablecimiento);

    // Si no existía aún (sin puntos de emisión)
    if (!estab) {
      estab = {
        ...getMapEstablishment(warehouse),
        emissionPoints: [],
        warehouses: [],
      };
      groupedMap.set(warehouse.idEstablecimiento, estab);
    }

    estab?.warehouses.push({
      id: warehouse.idBodega,
      name: warehouse.bodega ?? warehouse.descripcion,
      isDefault: warehouse.defaultBodega,
      establishmentId: warehouse.idEstablecimiento,
    });
  });

  return Array.from(groupedMap.values());
};
