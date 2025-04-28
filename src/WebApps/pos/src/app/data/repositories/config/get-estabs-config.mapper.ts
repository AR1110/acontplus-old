import {GroupedEstab} from "@domain/models/estab.model";
import {groupEstabUtil} from "@domain/utils/group-estab.util";
import {ApiResponse} from "acontplus-utils";
import {GetEstabsResponse} from "@domain/models/config.model";

export class GetEstabsConfigMapper {
  static fromJson(response:ApiResponse): GetEstabsResponse{
    let result = {
      estabs: [] as GroupedEstab[],
    };
    if (response.code === '1') {
      let { puntosEmision, bodegas } = JSON.parse(
        response.payload as string,
      );
      let obj = {
        puntosEmisionEstab: puntosEmision,
        bodegasEstab: bodegas,
        isGroupBodega: true,
        isGroupPuntoEmision: true,
      };
      result.estabs = groupEstabUtil(obj);
    }
    return result;
  }
}
