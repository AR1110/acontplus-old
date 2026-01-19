import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { CuentaPorCobrarRepository } from '@accounting/data/repositories/cuenta-por-cobrar.repository';

import { CuentaPorCobrarMapper } from '@accounting/data/mappers/cuenta-por-cobrar.mapper';
import { DataFilterCuentaPorCobrarMapper } from '@accounting/data/mappers/data-filter-cuenta-por-cobrar.mapper';

@Injectable({
  providedIn: 'root',
})
export class CuentaPorCobrarWebRepository extends CuentaPorCobrarRepository {
  private _http = inject(HttpClient);
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_COBRAR}`;

  constructor() {
    super();
  }

  getDataFilter() {
    const json = DataFilterCuentaPorCobrarMapper.toJson();
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => DataFilterCuentaPorCobrarMapper.fromJson(response)));
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 1 });
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((response) => {
        return CuentaPorCobrarMapper.fromApiGetAll(response);
      }),
    );
  }

  getDataForm(idCuentaPorCobrar: number, idCliente: number) {
    const json = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 3 });
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((response: any) => {
        if (!response) return {};

        const { entidadFinanciera, banco, documentos, subEntidadFinanciera, provincia } = response;

        const resultEntidadesFinanciera = entidadFinanciera.map((ef: any) => {
          const filteredSubEntidadFinanciera = subEntidadFinanciera.filter(
            (sef: any) => sef.idEntidadFinanciera === ef.idEntidadFinanciera,
          );
          return {
            idEntidadFinanciera: ef.idEntidadFinanciera,
            descripcion: ef.descripcion,
            detalle: ef.detalle,
            codigo: ef.codigo,
            subEntidadesFinanciera: filteredSubEntidadFinanciera,
          };
        });

        let cuentaPorCobrar = [];
        //cuando el cobro es por documento
        if (idCuentaPorCobrar > 0 && response.cuentaPorCobrar) {
          cuentaPorCobrar = response.cuentaPorCobrar;
          cuentaPorCobrar = cuentaPorCobrar.map((cxc: any) => {
            const cuotas = JSON.parse(cxc.cuotas);
            const resultsCuotas = cuotas.map((cuota: any) => {
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
                saldoOriginal: cuota.saldo,
              };
            });
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
              cuotasOriginal: structuredClone(resultsCuotas),
            };
          });
        }

        const obj = {
          entidadesFinanciera: resultEntidadesFinanciera,
          bancos: banco,
          documentos,
          ciudades: provincia,
          cuentaPorCobrar,
        };
        return obj;
      }),
    );
  }

  getCuotasById(idCuentaPorCobrar: number) {
    const json = JSON.stringify({ idCuentaPorCobrar, tipo: 8 });
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((response) => {
        return CuentaPorCobrarMapper.fromApiGetCuotasById(response);
      }),
    );
  }
}
