import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

export class TransferenciaBodegaMapper {
  static fromApiAll(response: any) {
    const result = {
      data: [] as any[],
      totalRecords: 0,
    };
    if (response && typeof response === 'object') {
      const { tranferencias = [] } = response;

      result.data = tranferencias.map((item: any, index: number) => {
        return {
          index: index + 1,
          id: item.idTransferenciaBodega,
          idTipoDocumento: item.idTipoDocumento,
          codEstab: item.codEstab,
          nroDoc: item.nroDoc,
          fechaEmision: item.fechaEmision,
          nomEstado: item.estadoDesc,
          estadoCodigo: item.estadoCodigo,
          total: item.total,
          nomBodegaOrigen: item.bodegaOrigen,
          nomBodegaDestino: item.bodegaDestino,
          rowColor: item.rowColor,
          totalRecords: item.totalRecords,
        };
      });

      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }
    return result;
  }

  static fromApiFilter(response: any) {
    const result = {
      estabs: [] as GroupedEstab[],
    };
    if (response && typeof response === 'object') {
      const { establecimientos } = response;

      result.estabs = groupEstabUtil({
        isGroupPuntoEmision: true,
        estabs: establecimientos,
      });
    }
    return result;
  }
}
