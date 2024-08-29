import { BodegaEstablecimiento } from "@/models/bodega.model";
import { GroupedEstab } from "@/models/estab.model";
import { PuntoEmisionEstablecimiento } from "@/models/punto-emision.model";

type GroupEstabProps = {
  puntosEmisionEstab?: PuntoEmisionEstablecimiento[];
  bodegasEstab?: BodegaEstablecimiento[];
  isGroupBodega?: boolean;
  isGroupPuntoEmision?: boolean;
};

export const groupEstabUtil = function (obj: GroupEstabProps): GroupedEstab[] {
  const { puntosEmisionEstab, bodegasEstab, isGroupBodega, isGroupPuntoEmision } = obj;

  let groupEstabs: GroupedEstab[] = [];

  if (isGroupPuntoEmision && puntosEmisionEstab) {
    groupEstabs = puntosEmisionEstab.reduce((acc, item) => {
      const existingItem = acc.find(
        (el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab
      );

      if (!existingItem) {
        acc.push({
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          name: item.nombreComercial,
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
        bodegas: bodegasEstab?.filter((bodega) => bodega.idEstablecimiento === estab.idEstablecimiento).map((bodega) => ({
          idBodega: bodega.idBodega,
          bodega: bodega.bodega,
          descripcion: bodega.bodega,
          defaultBodega: bodega.defaultBodega,
        })) || [],
      }));
    }
    return groupEstabs;
  }

  if (isGroupBodega && bodegasEstab) {
    groupEstabs = bodegasEstab.reduce((acc, item) => {
      const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

      if (!existingItem) {
        acc.push({
          idEstablecimiento: item.idEstablecimiento,
          nombreComercial: item.nombreComercial,
          name: item.nombreComercial,
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
