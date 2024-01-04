import { IBodegaEstablecimiento } from "@core/models/bodega.model";
import { GroupedEstab } from "@core/models/estab.model";
import { IPuntoEmisionEstablecimiento } from "@core/models/punto-emision.model";

 
export const groupEstabUtil = function (obj: {
    estabs: IPuntoEmisionEstablecimiento[];
    bodegas: IBodegaEstablecimiento[];
    isGroupBodega: boolean;
}): GroupedEstab[] {
    const { estabs, bodegas, isGroupBodega } = obj;

    const tempEstabs = estabs.reduce((acc, item) => {
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
        const estabsWithBodegas = tempEstabs.map((estab) => ({
            ...estab,
            bodegas: bodegas
                .filter((bodega) => bodega.idEstablecimiento === estab.idEstablecimiento)
                .map((bodega) => ({
                    idBodega: bodega.idBodega,
                    bodega: bodega.bodega,
                    descripcion: bodega.bodega,
                    defaultBodega: bodega.defaultBodega,
                })),
        }));
        return estabsWithBodegas;
    }
    return tempEstabs;
};
