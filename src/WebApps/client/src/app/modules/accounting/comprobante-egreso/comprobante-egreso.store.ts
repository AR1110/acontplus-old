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
import { getValidId, isValidField } from '@core/utils/utils';
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
  idCiudad?: number
  nro?:string
  referencia?:string
  aprobacion?:string
  posfechado: boolean
  idBanco?:number
  lote?:string
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
  documentos: any[]
  dataFormaPago: DataFormaPago;


}


export const getDataFormaPagoState = (): DataFormaPago=>{
  return structuredClone( {
    codigoEntidadFinanciera: null,
    fechaEmision: new Date(),
    idEntidadFinanciera: 0,
    idSubEntidadFinanciera: 0,
    posfechado: false,
    nro: undefined,
    referencia: undefined,
    aprobacion: undefined,
    idBanco: 0,
    idCiudad: 0,
    lote: undefined
  });
}

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
  documentos: [],

  dataFormaPago: getDataFormaPagoState(),


};

export const ComprobanteEgresoStore = signalStore(
  { providedIn: 'root' },
  withState(initialComprobanteEgresoState),
  withComputed(({ cuentasPorPagar, pagosDetalle, dataFormaPago  }) => {
    const obtenerCuotas = () => cuentasPorPagar().flatMap(item => item.cuotas);

    const esTipoPago = (tipo: PaymentTypeCode) => dataFormaPago().codigoEntidadFinanciera === tipo;

    return {

      total: computed(() => {
        let total = cuentasPorPagar().reduce((acumulado, cuenta) => acumulado + cuenta.total, 0)
        return roundNumber(total, DECIMALS.DOS)
      }

      ),
      abono: computed(() => {
        let total = obtenerCuotas().reduce((acumulado, cuota) => acumulado + cuota.abono, 0)
        return roundNumber(total, DECIMALS.DOS)

      }
      ),
      saldo: computed(() => {
        const totalSaldo = obtenerCuotas().reduce((acumulado, cuota) => acumulado + cuota.saldo, 0);
        return roundNumber(totalSaldo, DECIMALS.DOS);
      }),
      getSecuencialPagoDetalle: computed(() => pagosDetalle().length),

      esEfectivo: computed(() => esTipoPago(PaymentTypeCode.EFE)),
      esTarjetaCreditoDebito: computed(() => esTipoPago(PaymentTypeCode.TAR)),
      esTransferencia: computed(() => esTipoPago(PaymentTypeCode.TRA)),
      esCheque: computed(() => esTipoPago(PaymentTypeCode.CHE)),
      esDoc: computed(() => esTipoPago(PaymentTypeCode.DOC)),


    };
  }),


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
            console.log(response)
            patchState(store, {
              entidadesFinanciera: response.entidadesFinanciera,
              subEntidadesFinanciera: response.subEntidadesFinanciera,
              bancos: response.bancos,
              provinciaCiudades: response.provinciaCiudades,
              documentos: response.documentos,
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
        const { idSubEntidadFinanciera, fechaEmision , nro, referencia, lote, aprobacion, idCiudad, idBanco} = store.dataFormaPago();

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
        const validations = {
          esTarjetaCreditoDebito: [
            { condition: !isValidField(nro), message: 'Ingrese el número' },
            { condition: !isValidField(referencia), message: 'Ingrese la referencia' },
            { condition: !isValidField(lote), message: 'Ingrese el lote' },
            { condition: !isValidField(aprobacion), message: 'Ingrese la aprobación' },
            { condition: !getValidId(idCiudad as number), message: 'Seleccione la ciudad' },
          ],
          esTransferencia: [
            { condition: !getValidId(idBanco as number), message: 'Seleccione el banco' },
            { condition: !isValidField(nro), message: 'Ingrese el número' },
          ],
          esCheque: [
            { condition: !getValidId(idCiudad as number), message: 'Seleccione la ciudad' },
            { condition: !getValidId(idBanco as number), message: 'Seleccione el banco' },
            { condition: !isValidField(nro), message: 'Ingrese el número' },
            { condition: !isValidField(referencia), message: 'Ingrese la referencia' },
          ],
        };

        Object.keys(validations).forEach(key => {
          if (store[key as keyof typeof validations]()) {
            for (const { condition, message } of validations[key as keyof typeof validations]) {
              if (condition) {
                tS.toastr({
                  type: 'warning',
                  message: message
                })
                return;
              }
            }
          }
        });


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
