

import { ComprobanteIngresoAdapter } from '@/shared/adapters/comprobante-ingreso.adapter';
import { PATHS, PATHS_API } from '@/shared/enums/main.enum';
import { ApiResponse } from '@/domain/models/api-response';
import { BancoSelectHtmlOnly } from '@/shared/models/contabilidad/banco.model';
import { PaymentType } from '@/shared/models/contabilidad/payment-type.model';
import { CuentaPorCobrar, CuotaCobro, DataCuentaPorCobrar } from '@/shared/models/contabilidad/payment.model';
import { agruparPorProvinciaUtil } from '@/shared/utils/utils';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteIngresoService {
  private url = `${PATHS_API.ACCOUNTING}${PATHS.COMPROBANTE_INGRESO}`
  private http = inject(HttpClient);
  private comprobanteIngresoAdapter = inject(ComprobanteIngresoAdapter)


  getDataForm<T extends { idCuentaPorCobrar: number }>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 5
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response => {

        // Inicializa el objeto resultante con estructuras vacías
        const resultData = {
          entidadesFinanciera: [] as PaymentType[],
          bancos: [] as BancoSelectHtmlOnly[],
          documentos: [],
          ciudades: [] as any[],
          cuentasPorCobrar: [] as CuentaPorCobrar[],
          dataCuentaPorCobrar: {} as DataCuentaPorCobrar,
          estadosCobro: [],
          configCobro: {}
        };


        if (response.code === "1") {

          const {
            entidadFinanciera,
            banco,
            documentos,
            subEntidadFinanciera,
            provincia,
            cuentaPorCobrar,
            estadoPago,
            config
          } = JSON.parse(response.payload as string)

          const resultEntidadesFinanciera = entidadFinanciera.map((ef: any) => {
            let filteredSubEntidadFinanciera = subEntidadFinanciera.filter((sef: any) => sef.idEntidadFinanciera === ef.idEntidadFinanciera)
            return {
              idEntidadFinanciera: ef.idEntidadFinanciera,
              descripcion: ef.descripcion,
              detalle: ef.detalle,
              codigo: ef.codigo,
              subEntidadesFinanciera: filteredSubEntidadFinanciera
            }
          })


          //cuando el cobro es por documento
          if (Array.isArray(cuentaPorCobrar)) {
            resultData.cuentasPorCobrar = cuentaPorCobrar.map(cxc => {
              let cuotas = JSON.parse(cxc.cuotas) || [];
              const resultsCuotas: CuotaCobro[] = cuotas.map((cuota: any) => {
                return {
                  idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                  idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                  fechaVencimiento: cuota.fechaVencimiento,
                  nroCuota: cuota.nroCuota,
                  cuota: cuota.cuota,
                  mora: cuota.mora,
                  interes: cuota.interes,
                  diasMora: cuota.diasMora,
                  abono: cuota.abono,
                  saldoCta: cuota.saldoCta,
                  saldo: cuota.saldo,
                  estado: cuota.estado,
                  saldoOriginal: cuota.saldo,
                  valorSaldoLectura: cuota.saldo,
                } as CuotaCobro
              })

              return {
                codEstab: cxc.codEstab,
                idCliente: cxc.idCliente,
                identificacionComprador: cxc.identificacionComprador,
                razonSocialComprador: cxc.razonSocialComprador,
                idCuentaPorCobrar: cxc.idCuentaPorCobrar,
                serieComprobante: cxc.serieComprobante,
                codDoc: cxc.codDoc,
                fechaEmision: cxc.fechaEmision,
                fechaVencimiento: cxc.fechaVencimiento,
                importeTotal: cxc.importeTotal,
                diasMora: cxc.diasMora,
                mora: cxc.mora,
                abono: cxc.abono,
                saldo: cxc.saldo,
                cuotas: structuredClone(resultsCuotas),
                cuotasClone: structuredClone(resultsCuotas)
              }
            })
          }

          if (resultData.cuentasPorCobrar.length > 0) {
            const dataCuentaPorCobrar = resultData.cuentasPorCobrar[0]
            resultData.dataCuentaPorCobrar = {
              codEstab: dataCuentaPorCobrar.codEstab,
              idCliente: dataCuentaPorCobrar.idCliente,
              identificacionComprador: dataCuentaPorCobrar.identificacionComprador,
              razonSocialComprador: dataCuentaPorCobrar.razonSocialComprador,
              serieComprobante: dataCuentaPorCobrar.serieComprobante,
              importeTotal: dataCuentaPorCobrar.importeTotal,
              oldSaldo: dataCuentaPorCobrar.saldo,
              saldo: dataCuentaPorCobrar.saldo,
              abono: 0,
              oldAbono: dataCuentaPorCobrar.abono,
              cambio: 0,
              fechaEmision: dataCuentaPorCobrar.fechaEmision
            }
          }




          let configCobro = config[0];

          resultData.entidadesFinanciera = resultEntidadesFinanciera;
          resultData.bancos = banco;
          resultData.documentos = documentos;
          resultData.ciudades = agruparPorProvinciaUtil(provincia)

          resultData.estadosCobro = estadoPago;
          resultData.configCobro = configCobro;

        }
        return resultData;


      })
    )
  }


  post<T>(obj: T) {
    let data = this.comprobanteIngresoAdapter.postTo(obj as any);
    return this.http.post<ApiResponse>(`${this.url}Insert`, { data })

  }
}
