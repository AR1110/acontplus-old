import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { groupCitiesByProvinceUtil } from '@shared/utils/group-cities-by-province.util';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';
import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial,
  CuotaPorPagarEstado,
  FormaPago,
} from '@accounting/data/models/comprobante-egreso.entity';
import { PagoDetalle } from '@accounting/data/models/pago-detalle.model';
import { getValidId, isValidField } from '@core/utils/utils';
import { formatDateToString } from '@core/utils/date.util';

export interface ParamsGuardar {
  dataCuentaPorPagar: Partial<CuentaPorPagarLista>;
  total: number;
  formasPago: FormaPago[];
  pagosDetalle: PagoDetalle[];
  cuentasPorPagarEstado: CuentaPorPagarEstado[];
  cuotasPorPagarEstado: CuotaPorPagarEstado[];
  cuentasPorPagarHistorial: CuentaPorPagarHistorial[];
  observacion?: string;
}

export class ComprobanteEgresoMapper {
  static fromApiCuotasByICuentaPorPagar(response: any): CuotaPorPagarLista[] {
    const { cuotas } = response;
    return cuotas.map((item: any) => {
      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        idCuotaPorPagar: item.idCuotaPorPagar,
        fechaVencimiento: item.fechaVencimiento,
        nroCuota: item.nroCuota,
        cuota: item.cuota,
        abono: item.abono,
        saldo: item.saldo,
        nombreEstado: item.descripcion,
        codigoEstado: item.codigo,
        saldoInicial: item.saldo,
      };
    });
  }

  static fromApiDataForm(response: any) {
    const {
      entidadFinanciera,
      subEntidadFinanciera,
      banco,
      estadoPago,
      ciudad,
      documentos = [],
    } = response;

    const entidadesFinanciera = entidadFinanciera.map((item: any) => {
      const obj: EntidadFinanciera = {
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
      return obj;
    });

    const subEntidadesFinanciera = subEntidadFinanciera.map((item: any) => {
      const obj: SubEntidadFinancieraSelectHtmlOnly = {
        idSubEntidadFinanciera: item.idSubEntidadFinanciera,
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,

        controlCaja: item.controlCaja,
      };
      return obj;
    });

    const bancos = banco.map((item: any) => {
      const obj: BancoSelectOnly = {
        idBanco: item.idBanco,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
      return obj;
    });

    const estadosPago = estadoPago.map((item: any) => {
      const obj: EstadoPago = {
        idEstadoPago: item.idEstadoPago,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
      return obj;
    });

    const provinciaCiudades = groupCitiesByProvinceUtil(ciudad);

    const documentosTemp = documentos.map((item: any) => {
      return {
        idCuentaPorPagar: item.idComprobante,
        idTipoDocumento: item.idTipoDocumento,
        nroDoc: item.nroDocumento,
        nombreDoc: item.tipoDocumento,
        total: item.saldo,
        numAutDocSustento: item.numAutDocSustento,
        fechaEmision: item.fechaEmision,
      };
    });

    return {
      entidadesFinanciera,
      subEntidadesFinanciera,
      bancos,
      estadosPago,
      provinciaCiudades,
      documentos: documentosTemp,
    };
  }

  static toApiPost(params: ParamsGuardar) {
    const {
      dataCuentaPorPagar,
      formasPago,
      pagosDetalle,
      cuentasPorPagarHistorial,
      total,
      observacion,
      cuentasPorPagarEstado,
      cuotasPorPagarEstado,
    } = params;

    console.log(params);
    const comprobante = {
      idProveedor: dataCuentaPorPagar.idProveedor,
      total,
      codEstab: dataCuentaPorPagar.codEstab,
      observacion: isValidField(observacion),
    };

    const pagos = formasPago.map((item) => {
      return {
        idSubEntidadFinanciera: item.idSubEntidadFinanciera,
        idEntidadFinanciera: item.idEntidadFinanciera,
        idBanco: getValidId(item.idBanco),
        idCuentaPorPagar: getValidId(item.idCuentaPorPagar),
        fechaEmision: formatDateToString(item.fechaEmision),
        nro: isValidField(item.nro),
        valor: item.valorAbonoInput,
        posfechado: item.posfechado,
        cobro: !item.posfechado,
        secuencial: item.secuencial,
        lote: isValidField(item.lote),
        aprobacion: isValidField(item.aprobacion),
        referencia: isValidField(item.referencia),
        abono: item.abono,
        controlCaja: item.controlCaja,
      };
    });

    const pagosDetalleMapper = pagosDetalle.map((item: any) => {
      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        saldo: item.saldo,
        abono: item.abono,
        secuencial: item.secuencial,
      };
    });

    const cuentasPorPagarHistorialMapper = cuentasPorPagarHistorial.map((item) => {
      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        saldo: item.saldo,
        abono: item.abono,
        secuencial: item.secuencial,
      };
    });

    const cuentasPorPagarDeterminarEstado = cuentasPorPagarEstado.map((item) => {
      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        idEstadoPago: item.idEstadoPago,
        abono: item.abono,
      };
    });

    const cuotasPorPagarDeterminarEstado = cuotasPorPagarEstado.map((item) => {
      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        idEstadoPago: item.idEstadoPago,
        abono: item.abono,
      };
    });

    return {
      comprobante,
      pagos,
      pagoDetalle: pagosDetalleMapper,
      historial: cuentasPorPagarHistorialMapper,
      cuenta: cuentasPorPagarDeterminarEstado,
      cuota: cuotasPorPagarDeterminarEstado,
    };
  }
}
