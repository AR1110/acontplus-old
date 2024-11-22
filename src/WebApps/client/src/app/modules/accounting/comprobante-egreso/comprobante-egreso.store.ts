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
import Swal from 'sweetalert2';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { minus } from '@core/utils/decimal.util';

// import { CuentaPorPagarCuota } from "@accounting/comprobante-egreso/comprobante-egreso-pago.interface";

interface FormaPago {
  uuid: string
  codigoEntidadFinanciera: PaymentTypeCode | null;
  fechaEmision: Date;
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  idCiudad?: number
  nro?: string
  referencia?: string
  aprobacion?: string
  posfechado: boolean
  idBanco?: number
  lote?: string
  nombreBanco?: string
  nombreFormaPago?: string
  nombrePosfechado?: string
  nombreCiudad?: string
  valorAbonoInput: number
  abono: number
  secuencial: number
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
  dataFormaPago: FormaPago;
  formasPago: FormaPago[]


}


export const getDataFormaPagoState = (): FormaPago => {
  return structuredClone({
    uuid: generateUuidv4(),
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
    lote: undefined,
    valorAbonoInput: 0,
    abono: 0,
    secuencial: 0,
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
  formasPago: []

};

export const ComprobanteEgresoStore = signalStore(
  { providedIn: 'root' },
  withState(initialComprobanteEgresoState),
  withComputed((store) => {
    const { cuentasPorPagar, formasPago, dataFormaPago } = store;
    const obtenerCuotas = () => cuentasPorPagar().flatMap(item => item.cuotas);

    const esTipoPago = (tipo: PaymentTypeCode | null) => dataFormaPago().codigoEntidadFinanciera === tipo;


    return {

      total: computed(() => {
        let total = cuentasPorPagar().reduce((acumulado, cuenta) => acumulado + cuenta.total, 0)
        return roundNumber(total, DECIMALS.DOS)
      }

      ),
      abono: computed(() => {
        let valorAbonoInput = formasPago().reduce((acumulado, cuota) => acumulado + cuota.valorAbonoInput, 0)
        return roundNumber(valorAbonoInput, DECIMALS.DOS)

      }
      ),
      saldo: computed(() => {
        const totalSaldo = obtenerCuotas().reduce((acumulado, cuota) => acumulado + cuota.saldo, 0);
        return roundNumber(totalSaldo, DECIMALS.DOS);
      }),

      valorDiferencia: computed(() => {
        let diferencia = 0;
        let saldoInicial = store.cuentasPorPagarCopy().reduce((acc, curr) => acc + curr.saldo, 0);
        let valorAbonoInput = formasPago().reduce((acumulado, cuota) => acumulado + cuota.valorAbonoInput, 0)

        if (valorAbonoInput >= saldoInicial) {
          diferencia = minus(valorAbonoInput, saldoInicial, DECIMALS.DOS) as number
        }
        return diferencia;
      }),

      getSecuencialFormasPago: computed(() => formasPago().length + 1),

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
            nombreFormaPago: data.descripcion,
            idEntidadFinanciera: data.idEntidadFinanciera,
            codigoEntidadFinanciera: data.codigo,
            idSubEntidadFinanciera:
              dataSubEntidadFinanciera?.idSubEntidadFinanciera || 0,

          },
        });
      },

      updateDataFormaPago: (dataFormaPago: Partial<FormaPago>) => {
        patchState(store, {

          dataFormaPago: {
            ...store.dataFormaPago(),
            ...dataFormaPago,
          },
        });
      },


      agregarAbono(valorAbono: number) {
        const { idSubEntidadFinanciera, fechaEmision, nro, referencia, lote, aprobacion, idCiudad, idBanco, posfechado } = store.dataFormaPago();

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
                throw new Error("Data not valid");
                ;
              }
            }
          }
        });

        let secuencial = store.getSecuencialFormasPago();
        let compEgresoUtil = new ComprobanteEgresoUtil(structuredClone(store.cuentasPorPagar()));
        compEgresoUtil.setSecuencial(secuencial)
        compEgresoUtil.setValorAbono(valorAbono);
        compEgresoUtil.setEstadosPago(store.estadosPago());
        compEgresoUtil.setEsAbonoPosfechado(false)
        compEgresoUtil.setPagosDetalle(store.pagosDetalle())

        compEgresoUtil.abonar();

        let pagosDetalle = compEgresoUtil.getPagosDetalle();

        let dataCiudad = store.provinciaCiudades().flatMap(item => item.ciudades).find(item => item.idCiudad === idCiudad)

        console.log(idBanco)
        let dataBanco = store.bancos().find(item => item.idBanco === idBanco);



        const totalAbonoPagoDetalle = pagosDetalle.filter(item => item.secuencial === secuencial)
          .reduce((acc, curr) => acc + curr.abono, 0)


        let dataFormaPago: FormaPago = {
          ...store.dataFormaPago(),
          nombreCiudad: dataCiudad?.descripcion,
          nombreBanco: dataBanco?.descripcion,
          nombrePosfechado: posfechado ? 'SI' : 'NO',
          valorAbonoInput: valorAbono,
          abono: roundNumber(totalAbonoPagoDetalle, DECIMALS.DOS),
          secuencial
        }


        patchState(store, {
          pagosDetalle,
          cuentasPorPagar: compEgresoUtil.getCuentasPorPagar(),
          formasPago: [...store.formasPago(), dataFormaPago]
        })
      },


      async eliminarFormaPago(data: FormaPago) {

        let { isConfirmed } = await Swal.fire({
          html: `<small>¿Esta seguro/a de eliminar este Abono ahora?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si ',
          cancelButtonText: 'No '
        })

        try {
          if (isConfirmed) {
            let formasPago = store.formasPago().filter(item => item.uuid !== data.uuid)

            let cuentasPorPagar = store.cuentasPorPagar().map(item => {
              return {
                ...item,
                cuotas: structuredClone(item.cuotasCopy)
              }
            })

            let compEgresoUtil = new ComprobanteEgresoUtil(cuentasPorPagar);
            compEgresoUtil.setPagosDetalle(store.pagosDetalle())

            let secuencial = 0;
            for (const item of formasPago) {
              secuencial++;
              compEgresoUtil.setSecuencial(secuencial)
              compEgresoUtil.setValorAbono(item.valorAbonoInput);
              compEgresoUtil.setEstadosPago(store.estadosPago());
              compEgresoUtil.setEsAbonoPosfechado(false)

              compEgresoUtil.abonar();

            }



            let pagosDetalle = compEgresoUtil.getPagosDetalle();


            patchState(store, {
              pagosDetalle,
              formasPago,
              cuentasPorPagar: compEgresoUtil.getCuentasPorPagar(),
            })

          }
        } catch (error) {
          console.log(error)
        }


      }






    }),
  ),
);
