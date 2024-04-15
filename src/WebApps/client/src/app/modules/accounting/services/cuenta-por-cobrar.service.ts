import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '../enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaPorCobrarService {
  #url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_COBRAR}`;
  #http = inject(HttpClient);

  constructor() { }

  getDataForm(idCuentaPorCobrar: number, idCliente: number) {
    const json = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 3 });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        if (!response) return {};

        const { entidadFinanciera, banco, documentos, subEntidadFinanciera, provincia } = response;

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

        let cuentaPorCobrar = []
        //cuando el cobro es por documento
        if (idCuentaPorCobrar > 0 && response.cuentaPorCobrar) {
          cuentaPorCobrar = response.cuentaPorCobrar;
          cuentaPorCobrar = cuentaPorCobrar.map((cxc: any) => {
            let cuotas = JSON.parse(cxc.cuotas);
            let resultsCuotas = cuotas.map((cuota: any) => {
              return {
                idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                nroCuota: cuota.nroCuota,
                cuota: cuota.cuota,
                mora: cuota.mora,
                interes: cuota.interes,
                diasMora: cuota.diasMora,
                abono: cuota.abono,
                saldoCta: cuota.saldoCta,
                saldo: cuota.saldo,
                estado: cuota.estado,
                saldoOriginal: cuota.saldo
              }
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
              saldoTemporal: cxc.saldo,
              descripcion: cxc.descripcion,
              cuotas: structuredClone(resultsCuotas),
              cuotasOriginal: structuredClone(resultsCuotas)
            }
          })
        }

        let obj = {
          entidadesFinanciera: resultEntidadesFinanciera,
          bancos: banco,
          documentos,
          ciudades: provincia,
          cuentaPorCobrar
        }
        return obj;
      }))

  }


  getCuotasById(id: number) {
    const json = JSON.stringify({ idCuentaPorCobrar: id, tipo: 8 });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let cuotas = [];
        if (response !== null && typeof response === 'object') {
          cuotas = response.cuotas.map((cuota: any) => {
            return {
              idCuotaPorCobrar: cuota.idCuotaPorCobrar,
              idCuentaPorCobrar: cuota.idCuentaPorCobrar,
              nroCuota: cuota.nroCuota,
              cuota: cuota.cuota,
              mora: cuota.mora,
              interes: cuota.interes,
              diasMora: cuota.diasMora,
              abono: cuota.abono,
              saldoCta: cuota.saldoCta,
              saldo: cuota.saldo,
              estado: cuota.estado,
              saldoOriginal: cuota.saldo
            }
          })
        }
        return cuotas;
      })
    )
  }
}
