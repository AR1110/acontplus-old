import { BodegaEstablecimiento } from "@core/models/bodega.model";
import { GroupedEstab } from "@core/models/estab.model";
import { PuntoEmisionEstablecimiento } from "@core/models/punto-emision.model";

type GroupEstabProps = {
  estabs?: PuntoEmisionEstablecimiento[];
  bodegas?: BodegaEstablecimiento[];
  isGroupBodega?: boolean;
  isGroupPuntoEmision?: boolean;
};

export const groupEstabUtil = function (obj: GroupEstabProps): GroupedEstab[] {
  const { estabs, bodegas, isGroupBodega, isGroupPuntoEmision } = obj;

  let groupEstabs: GroupedEstab[] = [];

  if (isGroupPuntoEmision && estabs) {
    groupEstabs = estabs.reduce((acc, item) => {
      const existingItem = acc.find(
        (el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab
      );

      if (!existingItem) {
        acc.push({
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          codEstab: item.codEstab,
          defaultEstab: item.defaultEstab,
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
        bodegas: bodegas?.filter((bodega) => bodega.idEstablecimiento === estab.idEstablecimiento).map((bodega) => ({
          idBodega: bodega.idBodega,
          bodega: bodega.bodega,
          descripcion: bodega.bodega,
          defaultBodega: bodega.defaultBodega,
        })) || [],
      }));
    }
  }

  if (isGroupBodega && bodegas) {
    groupEstabs = bodegas.reduce((acc, item) => {
      const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

      if (!existingItem) {
        acc.push({
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          codEstab: item.codEstab,
          defaultEstab: item.defaultEstab,
          puntosEmision: [],
          bodegas: [
            {
              idBodega: item.idBodega,
              descripcion: item.bodega,
              defaultBodega: item.defaultBodega,
            },
          ],
        });
      } else {
        existingItem.bodegas?.push({
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
