import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {GroupedEstab} from "@core/models/estab.model";

export abstract class CuentaPorCobrarRepository {
  abstract getDataFilter ( ): Observable< {
    estabs: GroupedEstab[],
    estadosDoc: any[],
    tiposDoc: any[],
    empresas: any[],
    ciudades: any[],
  }>;
  abstract getAll<T>(obj:T): Observable<{ data: any[] }>;
  abstract getDataForm(idCuentaPorCobrar: number, idCliente: number): Observable<any>
  abstract getCuotasById(idCuentaPorCobrar: number): Observable<any[]>;
}
