import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { ProvinciaCiudad } from '@shared/models/ciudad.interface';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { computed, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';
import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { PagoDetalle } from '@accounting/data/models/pago-detalle.model';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import {
  CuentaPorPagarCuota,
  CuentaPorPagarHistorial,
  FormaPago,
} from '@accounting/data/models/comprobante-egreso.entity';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { isDateValid } from '@core/utils/date.util';
import { ComprobanteEgresoUtil } from '@accounting/utils/comprobante-egreso.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { minus } from '@core/utils/decimal.util';
import { COMPROBANTE_EGRESO_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { ComprobanteEgresoFormaPagoData } from '@accounting/data/repositories/comprobante-egreso.repository';

interface ComprobanteEgresoStore {
  isLoading: boolean;

  dataCuentaPorPagar: Partial<CuentaPorPagarLista>;
  cuentasPorPagar: CuentaPorPagarCuota[];
  cuentasPorPagarCopy: CuentaPorPagarCuota[];
  pagosDetalle: PagoDetalle[];
  cuentasPorPagarHistorial: CuentaPorPagarHistorial[];

  dataFormaPago: FormaPago;
  formasPago: FormaPago[];

  entidadesFinanciera: EntidadFinanciera[];
  subEntidadesFinanciera: SubEntidadFinancieraSelectHtmlOnly[];
  subEntidadesFinancieraFiltered: SubEntidadFinancieraSelectHtmlOnly[];
  bancos: BancoSelectOnly[];
  provinciaCiudades: ProvinciaCiudad[];
  estadosPago: EstadoPago[];
  documentos: any[];
  nota?: string;
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
    controlCaja: false,
  });
};

const initialComprobanteEgresoState: ComprobanteEgresoStore = {
  isLoading: false,
  dataCuentaPorPagar: {},
  cuentasPorPagar: [],
  cuentasPorPagarCopy: [],
  pagosDetalle: [],
  cuentasPorPagarHistorial: [],

  entidadesFinanciera: [],
  bancos: [],
  provinciaCiudades: [],
  subEntidadesFinanciera: [],
  subEntidadesFinancieraFiltered: [],
  estadosPago: [],
  documentos: [],

  dataFormaPago: getDataFormaPagoState(),
  formasPago: [],
};

export const ComprobanteEgresoStore = signalStore(
  { providedIn: 'root' },
  withState(initialComprobanteEgresoState),
  withComputed((store) => {
    const { cuentasPorPagar, formasPago, dataFormaPago } = store;
    const obtenerCuotas = () => cuentasPorPagar().flatMap((item) => item.cuotas);

    const esTipoPago = (tipo: PaymentTypeCode | null) =>
      dataFormaPago().codigoEntidadFinanciera === tipo;

    return {
      total: computed(() => {
        const total = cuentasPorPagar().reduce((acumulado, cuenta) => acumulado + cuenta.total, 0);
        return roundNumber(total, DECIMALS.DOS);
      }),
      abono: computed(() => {
        const valorAbonoInput = formasPago().reduce(
          (acumulado, cuota) => acumulado + cuota.valorAbonoInput,
          0,
        );
        return roundNumber(valorAbonoInput, DECIMALS.DOS);
      }),
      saldo: computed(() => {
        const totalSaldo = obtenerCuotas().reduce((acumulado, cuota) => acumulado + cuota.saldo, 0);
        return roundNumber(totalSaldo, DECIMALS.DOS);
      }),

      valorDiferencia: computed(() => {
        let diferencia = 0;
        const saldoInicial = store.cuentasPorPagarCopy().reduce((acc, curr) => acc + curr.saldo, 0);
        const valorAbonoInput = formasPago().reduce(
          (acumulado, cuota) => acumulado + cuota.valorAbonoInput,
          0,
        );

        if (valorAbonoInput >= saldoInicial) {
          diferencia = minus(valorAbonoInput, saldoInicial, DECIMALS.DOS) as number;
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
    (
      store,
      useCase = inject(COMPROBANTE_EGRESO_HTTP_TOKEN),
      tS = inject(ToastrNotificationService),
    ) => ({
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
        useCase
          .getFormaPagoData(idProveedor)
          .pipe(finalize(() => patchState(store, { isLoading: false })))
          .subscribe((response: ComprobanteEgresoFormaPagoData) => {
            patchState(store, {
              entidadesFinanciera: response.entidadesFinanciera,
              subEntidadesFinanciera: response.subEntidadesFinanciera,
              bancos: response.bancos,
              provinciaCiudades: response.provinciaCiudades,
              documentos: response.documentos,
              estadosPago: response.estadosPago,
            });
          });
      },

      updateDataEntidadFinanciera: (data: EntidadFinanciera) => {
        const subEntidadesFinancieraFiltered = store
          .subEntidadesFinanciera()
          .filter((item) => item.idEntidadFinanciera === data.idEntidadFinanciera);
        const dataSubEntidadFinanciera =
          subEntidadesFinancieraFiltered.length > 0 ? subEntidadesFinancieraFiltered[0] : null;

        patchState(store, {
          subEntidadesFinancieraFiltered: subEntidadesFinancieraFiltered || [],
          dataFormaPago: {
            ...store.dataFormaPago(),
            nombreFormaPago: data.descripcion,
            idEntidadFinanciera: data.idEntidadFinanciera,
            codigoEntidadFinanciera: data.codigo,
            idSubEntidadFinanciera: dataSubEntidadFinanciera?.idSubEntidadFinanciera || 0,
            controlCaja: dataSubEntidadFinanciera?.controlCaja,
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
        const {
          idSubEntidadFinanciera,
          fechaEmision,
          nro,
          referencia,
          lote,
          aprobacion,
          idCiudad,
          idBanco,
          posfechado,
        } = store.dataFormaPago();

        if (!getValidId(idSubEntidadFinanciera)) {
          tS.show({
            type: 'warning',
            message: 'Seleccione SubEntidad financiera',
          });
          return;
        }

        if (!isDateValid(fechaEmision)) {
          tS.show({
            type: 'warning',
            message: 'Ingrese una fecha válida',
          });
          return;
        }

        if (!getValidId(valorAbono)) {
          tS.show({
            type: 'warning',
            message: 'Ingrese el valor abono',
          });
          return;
        }
        const validations = {
          esTarjetaCreditoDebito: [
            { condition: !isValidField(nro), message: 'Ingrese el número' },
            { condition: !isValidField(referencia), message: 'Ingrese la referencia' },
            { condition: !isValidField(lote), message: 'Ingrese el lote' },
            { condition: !isValidField(aprobacion), message: 'Ingrese la aprobación' },
            { condition: !getValidId(idCiudad), message: 'Seleccione la ciudad' },
          ],
          esTransferencia: [
            { condition: !getValidId(idBanco), message: 'Seleccione el banco' },
            { condition: !isValidField(nro), message: 'Ingrese el número' },
          ],
          esCheque: [
            { condition: !getValidId(idCiudad), message: 'Seleccione la ciudad' },
            { condition: !getValidId(idBanco), message: 'Seleccione el banco' },
            { condition: !isValidField(nro), message: 'Ingrese el número' },
            { condition: !isValidField(referencia), message: 'Ingrese la referencia' },
          ],
        };

        Object.keys(validations).forEach((key) => {
          if (store[key as keyof typeof validations]()) {
            for (const { condition, message } of validations[key as keyof typeof validations]) {
              if (condition) {
                tS.show({
                  type: 'warning',
                  message: message,
                });
                throw new Error('Data not valid');
              }
            }
          }
        });

        const secuencial = store.getSecuencialFormasPago();
        const compEgresoUtil = new ComprobanteEgresoUtil(structuredClone(store.cuentasPorPagar()));
        console.log(compEgresoUtil);
        compEgresoUtil.setSecuencial(secuencial);
        compEgresoUtil.setValorAbono(valorAbono);
        compEgresoUtil.setEstadosPago(store.estadosPago());
        compEgresoUtil.setEsAbonoPosfechado(false);
        compEgresoUtil.setPagosDetalle(store.pagosDetalle());
        compEgresoUtil.setCuentasPorPagarHistorial(store.cuentasPorPagarHistorial());

        compEgresoUtil.abonar();

        const pagosDetalle = compEgresoUtil.getPagosDetalle();
        const cuentasPorPagarHistorial = compEgresoUtil.getCuentasPorPagarHistorial();

        const dataCiudad = store
          .provinciaCiudades()
          .flatMap((item) => item.ciudades)
          .find((item) => item.idCiudad === idCiudad);

        const dataBanco = store.bancos().find((item) => item.idBanco === idBanco);

        const totalAbonoPagoDetalle = pagosDetalle
          .filter((item) => item.secuencial === secuencial)
          .reduce((acc, curr) => acc + curr.abono, 0);

        const dataFormaPago: FormaPago = {
          ...store.dataFormaPago(),
          nombreCiudad: dataCiudad?.descripcion,
          nombreBanco: dataBanco?.descripcion,
          nombrePosfechado: posfechado ? 'SI' : 'NO',
          valorAbonoInput: valorAbono,
          abono: roundNumber(totalAbonoPagoDetalle, DECIMALS.DOS),
          secuencial,
        };

        patchState(store, {
          pagosDetalle,
          cuentasPorPagarHistorial,
          cuentasPorPagar: compEgresoUtil.getCuentasPorPagar(),
          formasPago: [...store.formasPago(), dataFormaPago],
        });
      },

      async eliminarFormaPago(data: FormaPago) {
        const { isConfirmed } = await Swal.fire({
          html: `<small>¿Esta seguro/a de eliminar este Abono ahora?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si ',
          cancelButtonText: 'No ',
        });

        try {
          if (isConfirmed) {
            const formasPago = store.formasPago().filter((item) => item.uuid !== data.uuid);

            const cuentasPorPagar = store.cuentasPorPagar().map((item) => {
              return {
                ...item,
                cuotas: structuredClone(item.cuotasCopy),
              };
            });

            const compEgresoUtil = new ComprobanteEgresoUtil(cuentasPorPagar);
            // compEgresoUtil.setPagosDetalle(store.pagosDetalle())

            let secuencial = 0;
            for (const item of formasPago) {
              secuencial++;
              compEgresoUtil.setSecuencial(secuencial);
              compEgresoUtil.setValorAbono(item.valorAbonoInput);
              compEgresoUtil.setEstadosPago(store.estadosPago());
              compEgresoUtil.setEsAbonoPosfechado(false);

              compEgresoUtil.abonar();
            }

            const pagosDetalle = compEgresoUtil.getPagosDetalle();
            const cuentasPorPagarHistorial = compEgresoUtil.getCuentasPorPagarHistorial();

            patchState(store, {
              pagosDetalle,
              cuentasPorPagarHistorial,
              formasPago,
              cuentasPorPagar: compEgresoUtil.getCuentasPorPagar(),
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ),
);
