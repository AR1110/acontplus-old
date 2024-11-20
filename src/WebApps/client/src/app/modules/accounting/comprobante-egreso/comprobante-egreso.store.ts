import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/interfaces/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/interfaces/banco.interface';
import { ProvinciaCiudad } from '@shared/models/ciudad.interface';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EntidadFinanciera } from '@accounting/interfaces/entidad-financiera.interface';
import { computed, inject } from '@angular/core';
import { ComprobanteEgresoService } from '@accounting/comprobante-egreso/comprobante-egreso.service';
import { finalize } from 'rxjs/operators';
import { PaymentTypeCode } from '@accounting/enums/accounting.constants';
import { CuentaPorPagarLista } from '@accounting/cuenta-por-pagar/interfaces/cuenta-por-pagar.interface';

// import { CuentaPorPagarCuota } from "@accounting/comprobante-egreso/comprobante-egreso-pago.interface";

interface DataFormaPago {
  codigoEntidadFinanciera: PaymentTypeCode | null;
  fechaEmision: Date;
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
}

interface ComprobanteEgresoStore {
  isLoading: boolean;

  dataCuentaPorPagar: Partial<CuentaPorPagarLista>;
  cuentasPorPagar: any[];
  cuentasPorPagarCopy: any[];

  entidadesFinanciera: EntidadFinanciera[];
  subEntidadesFinanciera: SubEntidadFinancieraSelectHtmlOnly[];
  subEntidadesFinancieraFiltered: SubEntidadFinancieraSelectHtmlOnly[];
  bancos: BancoSelectOnly[];
  provinciaCiudades: ProvinciaCiudad[];

  dataFormaPago: DataFormaPago;

  total: number;
  abono: number;
  saldo: number;
}

let dataFormPagoState: DataFormaPago = {
  codigoEntidadFinanciera: null,
  fechaEmision: new Date(),
  idEntidadFinanciera: 0,
  idSubEntidadFinanciera: 0,
};
let initialComprobanteEgresoState: ComprobanteEgresoStore = {
  isLoading: false,
  dataCuentaPorPagar: {},
  cuentasPorPagar: [],
  cuentasPorPagarCopy: [],

  entidadesFinanciera: [],
  bancos: [],
  provinciaCiudades: [],
  subEntidadesFinanciera: [],
  subEntidadesFinancieraFiltered: [],
  dataFormaPago: dataFormPagoState,

  total: 0,
  abono: 0,
  saldo: 0,
};

export const ComprobanteEgresoStore = signalStore(
  { providedIn: 'root' },
  withState(initialComprobanteEgresoState),
  withComputed(({ cuentasPorPagar }) => ({
    total: computed(() =>
      cuentasPorPagar().reduce((prev, acc) => (prev += acc.total), 0),
    ),
    abono: computed(() =>
      cuentasPorPagar().reduce((prev, acc) => (prev += acc.abono), 0),
    ),
    saldo: computed(() =>
      cuentasPorPagar().reduce((prev, acc) => (prev += acc.saldo), 0),
    ),
  })),

  withMethods(
    (store, comprobanteEgresoSvc = inject(ComprobanteEgresoService)) => ({
      updateCuentaPorPagar: (
        dataCuentaPorPagar: Partial<CuentaPorPagarLista>,
        cuentasPorPagar: any[],
      ) => {
        patchState(store, {
          dataCuentaPorPagar: dataCuentaPorPagar,
          cuentasPorPagar: cuentasPorPagar,
          cuentasPorPagarCopy: cuentasPorPagar,
        });
      },

      loadDataForm: (idProveedor: number) => {
        patchState(store, { isLoading: true });
        comprobanteEgresoSvc
          .getDatForm(idProveedor)
          .pipe(finalize(() => patchState(store, { isLoading: false })))
          .subscribe((response) => {
            patchState(store, {
              entidadesFinanciera: response.entidadesFinanciera,
              subEntidadesFinanciera: response.subEntidadesFinanciera,
              bancos: response.bancos,
              provinciaCiudades: response.provinciaCiudades,
            });
          });
      },

      updateDataEntidadFinanciera: (data: EntidadFinanciera) => {
        let subEntidadesFinancieraFiltered = store
          .subEntidadesFinanciera()
          .filter(
            (item) => item.idEntidadFinanciera === data.idEntidadFinanciera,
          );
        let dataSubEntidadFinanciera =
          subEntidadesFinancieraFiltered.length > 0
            ? subEntidadesFinancieraFiltered[0]
            : null;

        patchState(store, {
          subEntidadesFinancieraFiltered: subEntidadesFinancieraFiltered || [],
          dataFormaPago: {
            ...store.dataFormaPago(),
            idEntidadFinanciera: data.idEntidadFinanciera,
            codigoEntidadFinanciera: data.codigo,
            idSubEntidadFinanciera:
              dataSubEntidadFinanciera?.idSubEntidadFinanciera || 0,
          },
        });
      },

      updateDataFormaPago: (dataFormaPago: Partial<DataFormaPago>) => {
        patchState(store, {
          dataFormaPago: {
            ...store.dataFormaPago(),
            ...dataFormaPago,
          },
        });
      },
    }),
  ),
);
