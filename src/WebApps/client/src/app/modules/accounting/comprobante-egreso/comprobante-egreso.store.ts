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
import { PagoDetalle } from '../cuenta-por-pagar/interfaces/pago-detalle.interface';
import { EstadoPago } from '../interfaces/estado-pago.interface';
import { CuentaPorPagarCuota } from './comprobante-egreso.interface';
import { ToasterService } from '@core/services/toaster.service';
import { getValidId } from '@core/utils/utils';
import { isDateValid } from '@core/utils/date.util';
import { PagoService } from './pago.service';
import { ComprobanteEgresoUtil } from './utils/comprobante-egreso.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';

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
  cuentasPorPagar: CuentaPorPagarCuota[];
  cuentasPorPagarCopy: CuentaPorPagarCuota[];
  pagosDetalle: PagoDetalle[]

  entidadesFinanciera: EntidadFinanciera[];
  subEntidadesFinanciera: SubEntidadFinancieraSelectHtmlOnly[];
  subEntidadesFinancieraFiltered: SubEntidadFinancieraSelectHtmlOnly[];
  bancos: BancoSelectOnly[];
  provinciaCiudades: ProvinciaCiudad[];
  estadosPago: EstadoPago[]
  dataFormaPago: DataFormaPago;


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
  pagosDetalle: [],

  entidadesFinanciera: [],
  bancos: [],
  provinciaCiudades: [],
  subEntidadesFinanciera: [],
  subEntidadesFinancieraFiltered: [],
  estadosPago: [],


  dataFormaPago: dataFormPagoState,


};

export const ComprobanteEgresoStore = signalStore(
  { providedIn: 'root' },
  withState(initialComprobanteEgresoState),
  withComputed(({ cuentasPorPagar, pagosDetalle }) => ({
    total: computed(() =>
      cuentasPorPagar().reduce((prev, acc) => (prev += acc.total), 0),
    ),
    abono: computed(() =>
      cuentasPorPagar().flatMap(item => item.cuotas).map(item => item.abono).reduce((prev, acc) => (prev += acc), 0),
    ),
    saldo: computed(() =>{
      let total = cuentasPorPagar().flatMap(item => item.cuotas).map(item => item.saldo).reduce((prev, acc) => (prev += acc), 0);
      return roundNumber(total, DECIMALS.DOS);

    }
    ),
    getSecuencialPagoDetalle: computed(() => pagosDetalle().length),
  })),

  withMethods(
    (store, comprobanteEgresoSvc = inject(ComprobanteEgresoService), tS = inject(ToasterService)) => ({
      updateStateProperty: function <K extends keyof ComprobanteEgresoStore>(
        key: K,
        value: ComprobanteEgresoStore[K],
      ) {
        patchState(store, {
          [key]: value,
        });
      },

      updateMultipleFields: function (updates: Partial<ComprobanteEgresoStore>) {
        patchState(store, updates);
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
              estadosPago: response.estadosPago
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


      agregarAbono(valorAbono: number) {
        const { idSubEntidadFinanciera, fechaEmision } = store.dataFormaPago();

        if (!getValidId(idSubEntidadFinanciera)) {
          tS.toastr({
            type: 'warning',
            message: 'Seleccione SubEntidad financiera'
          })
          return
        }

        if (!isDateValid(fechaEmision)) {
          tS.toastr({
            type: 'warning',
            message: 'Ingrese una fecha válida'
          })
          return
        }

        if (!getValidId(valorAbono)) {
          tS.toastr({
            type: 'warning',
            message: 'Ingrese el valor abono'
          })
          return
        }

        let compEgresoUtil = new ComprobanteEgresoUtil(structuredClone(store.cuentasPorPagar()));
        compEgresoUtil.setSecuencial(store.getSecuencialPagoDetalle())
        compEgresoUtil.setValorAbono(valorAbono);
        compEgresoUtil.setEstadosPago(store.estadosPago());
        compEgresoUtil.setEsAbonoPosfechado(false)

        compEgresoUtil.abonar()

        patchState(store, {
          pagosDetalle: compEgresoUtil.getPagosDetalle(),
          cuentasPorPagar: compEgresoUtil.getCuentasPorPagar()
        })


        console.log(store.cuentasPorPagar())
      }

    }),
  ),
);
