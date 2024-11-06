import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ApiResponse } from "@core/models/api-response";
import { map } from "rxjs";
import { PURCHASE_PATHS } from "../constants/purchase.constants";
import { GroupedEstab } from "@core/models/estab.model";
import { groupEstabUtil } from "@core/utils/group-estab.util";
import { FacturaFisicaLista } from "./factura-fisica.interface";
import { FacturaFisicaAdapter } from "./factura-fisica.adapter";

@Injectable({
  providedIn: 'root'
})
export class FacturaFisicaService {
  private url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.FACTURA_FISICA}`
  private http = inject(HttpClient);

  getDataFilter() {
    let json = JSON.stringify({
      tipo: 3,
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        let resultData = {
          estabs: [] as GroupedEstab[],
          estadosDoc: [] as any[],
          subcategorias: [] as any[]
        }
        if (response.code === "1") {
          const {
            ptoEmision: tempEstabs,
            estadoDocumento,
            subcategories
          } = JSON.parse(response.payload as string);

          let dataToGroup = {
            estabs: tempEstabs,
            isGroupPuntoEmision: true
          }
          resultData.estabs = groupEstabUtil(dataToGroup);
          resultData.estadosDoc = estadoDocumento.map((item: any) => ({
            idEstado: item.idEstadoPago,
            descripcion: item.descripcion,
            codigo: item.codigo
          }))

          resultData.subcategorias = subcategories;

        }



        return resultData
      })
    )
  }


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        let resultData = {
          data: [] as FacturaFisicaLista[],
          totalRecords: 0
        }
        if (response && response.code === "1") {
          let { facturas } = JSON.parse(response.payload as string);

          resultData.data = FacturaFisicaAdapter.fromApiGetAll(facturas)

          if (resultData.data.length > 0) {
            resultData.totalRecords = resultData.data[0].totalRecords;
          }

        }

        return resultData;
      })
    )
  }

  getDetalleCompleto(id: number) {
    let json = JSON.stringify({
      tipo: 5,
      id
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        let resultData = {} as any
        if (response && response.code === "1") {
          let mainData = JSON.parse(response.payload as string);
          resultData = FacturaFisicaAdapter.fromApiDetalleCompleto(mainData)

        }

        return resultData;
      })
    )
  }

}
