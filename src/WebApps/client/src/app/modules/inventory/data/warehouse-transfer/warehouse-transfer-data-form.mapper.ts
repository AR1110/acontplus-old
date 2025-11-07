import { groupEstabUtil } from '@core/utils/group-estab.util';
import { GroupedEstab } from '@core/models/estab.model';

export class WarehouseTransferDataFormMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 3,
    });
  }

  static fromJson(response: any): any {
    const data = {
      establishments: [] as GroupedEstab[],
      transactionTypes: [],
      documentTypes: [],
      categories: [],
    };
    if (response !== null && typeof response === 'object') {
      const { ptoEmision, bodega, tipoTransaccion, tipoDocumento } = response;
      data.establishments = groupEstabUtil({
        estabs: ptoEmision,
        bodegas: bodega,
        isGroupBodega: true,
        isGroupPuntoEmision: true,
      });
      data.transactionTypes = tipoTransaccion.map((item: any) => {
        return {
          id: item.idTipoTransaccion,
          code: item.codigo,
          name: item.descripcion,
        };
      });
      data.documentTypes = tipoDocumento.map((item: any) => {
        return {
          id: item.idTipoDocumento,
          code: item.codigo,
          name: item.descripcion,
        };
      });
      data.categories = response.subFamilias.reduce((acc: any, obj: any) => {
        const key = obj.idFamilia;
        const existingGroup = acc.find(function (group: any) {
          return group.id === key;
        });

        if (existingGroup) {
          existingGroup.subCategories.push({
            id: obj.idSubFamilia,
            name: obj.nomSubFamilia,
          });
        } else {
          acc.push({
            name: obj.nomFamilia,
            id: obj.idFamilia,
            subCategories: [
              {
                id: obj.idSubFamilia,
                name: obj.nomSubFamilia,
              },
            ],
          });
        }

        return acc;
      }, []);
    }

    return data;
  }
}
