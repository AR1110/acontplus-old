import { DECIMALS } from "@core/constants/global.constants";
import { roundNumber } from "@core/utils/round-number.utils";
import { determinadoEstadoPagoCuotaUtil } from "./utils/determinado-estado-pago-cuota.util";
import { EstadoPago } from "../interfaces/estado-pago.interface";
import { minus, plus } from "@core/utils/decimal.util";

export class PagoService {

  private selectedDocumentos: any[] = [];
  private pagosDetalle: any[] = [];
  private historialCuentas: any[] = [];
  private estadosPago: any[] = [];

  private valorAbono = 0;

  private esAbonoPosfechado = false;
  secuencial = 0;

  private dataCuentaPorPagar: any = {}

  setEstadosPago(estadosPago: any[]) {
    this.estadosPago = estadosPago;
  }




  /**
   *
   * @param {*} param0
   * @returns
   */

  generarCuentasPorPagarEstado({ historialCuentas, pagosDetalle }: any) {
    // Your existing code snippet with modifications for decimal.js
    let cuentasPorPagarAgrupado = historialCuentas.reduce((acc: any, curr: any) => {
      let existeDato = acc.find((item: any) => item.idCuentaPorPagar === curr.idCuentaPorPagar);
      if (!existeDato) {
        acc.push({
          idCuentaPorPagar: curr.idCuentaPorPagar,
          valorSaldoLectura: curr.valorSaldoLectura,
          abono: curr.abono,
          diasMora: curr.diasMora,
          mora: curr.mora
        });
      } else {
        existeDato.abono += curr.abono;
      }
      return acc;
    }, []);

    let cuentasPorPagarEstado = [];

    for (let item of cuentasPorPagarAgrupado) {
      let valorSaldo = item.valorSaldoLectura;


      let totalPosfechado = pagosDetalle.filter((cd: any) => cd.idCuentaPorPagar === item.idCuentaPorPagar && cd.posfechado)
        .map((item: any) => item.abono).reduce((acc: number, curr: number) => acc + curr, 0);


      let totalNoPosfechado = pagosDetalle.filter((cd: any) => cd.idCuentaPorPagar === item.idCuentaPorPagar && !cd.posfechado)
        .map((item: any) => item.abono)
        .reduce((acc: number, curr: number) => acc + curr, 0);

      valorSaldo = minus(valorSaldo, totalNoPosfechado, DECIMALS.CINCO) as number;



      let dataEstadoPago = {} as Partial<EstadoPago>;
      if (totalPosfechado > 0) {
        dataEstadoPago = determinadoEstadoPagoCuotaUtil({
          esPosfechado: true,
          abono: 0,
          saldo: 0,
          estadosPago: this.estadosPago
        });
      } else {
        dataEstadoPago = determinadoEstadoPagoCuotaUtil({
          saldo: roundNumber(valorSaldo, DECIMALS.DOS),
          abono: roundNumber(totalNoPosfechado, DECIMALS.DOS),
          estadosPago: this.estadosPago,
          esPosfechado: false,

        });
      }

      cuentasPorPagarEstado.push({
        idCuentaPorPagar: item.idCuentaPorPagar,
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: roundNumber(totalNoPosfechado, DECIMALS.DOS)
      });
    }

    return cuentasPorPagarEstado;

  }


  /**
   *
   * @param {*} param0
   * @returns
   */
  generarCuotasPorPagarEstado({ pagosDetalle }: any) {

    let cuotasPorPagarAgrupado = pagosDetalle.reduce((acc: any, curr: any) => {
      let existeDato = acc.find((item: any) => (item.idCuentaPorPagar === curr.idCuentaPorPagar) && (item.idCuotaPorPagar === curr.idCuotaPorPagar));
      if (!existeDato) {
        acc.push({
          idCuentaPorPagar: curr.idCuentaPorPagar,
          idCuotaPorPagar: curr.idCuotaPorPagar,
          valorSaldoLectura: curr.valorSaldoLectura,
          abono: curr.abono
        });
      } else {
        existeDato.abono += curr.abono;
      }
      return acc;
    }, []);

    let cuotasPorPagarEstado = [];

    for (let item of cuotasPorPagarAgrupado) {
      let totalNoPosfechado = pagosDetalle.filter((cd: any) => cd.idCuotaPorPagar === item.idCuotaPorPagar && !cd.posfechado)
        .map((item: any) => item.abono)
        .reduce((acc: number, curr: number) => {
          return acc + curr
        }, 0);

      let valorSaldoLectura = roundNumber(item.valorSaldoLectura, DECIMALS.DOS);
      let totalNoPosfechadoTemp = roundNumber(totalNoPosfechado, DECIMALS.DOS);

      let valorSaldo = minus(valorSaldoLectura, totalNoPosfechadoTemp, DECIMALS.CINCO) as number;

      let dataEstadoPago = determinadoEstadoPagoCuotaUtil({
        esPosfechado: false,
        estadosPago: this.estadosPago,
        saldo: valorSaldo,
        abono: item.abono
      });

      cuotasPorPagarEstado.push({
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: totalNoPosfechado,
        idCuotaPorPagar: item.idCuotaPorPagar
      });
    }

    return cuotasPorPagarEstado;

  }

  addHistorialCuentas() {
    let valorMovimientoSaldo = 0, historialAbono = 0;

    const pagosDetalleFiltered = this.pagosDetalle.filter(cd => cd.idCuentaPorPagar === this.dataCuentaPorPagar.idCuentaPorPagar)


    const totalAbonoCuenta = pagosDetalleFiltered.map(item => item.abono).reduce((acc, curr) => acc + curr, 0);

    if (pagosDetalleFiltered.length === 0) {

      let historialCuentasFiltered = this.historialCuentas.filter(cd => (
        cd.idCuentaPorPagar === this.dataCuentaPorPagar.idCuentaPorPagar && cd.secuencial === this.secuencial
      ));

      let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

      if (dataUltimoCobroDetalle) {
        valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number;

      } else {
        valorMovimientoSaldo = this.dataCuentaPorPagar.saldo
      }

      if (this.valorAbono <= this.dataCuentaPorPagar.saldo) {
        historialAbono = this.valorAbono;

      } else if (this.valorAbono >= this.dataCuentaPorPagar.saldo) {
        historialAbono = this.dataCuentaPorPagar.saldo;
      }

      this.historialCuentas.push({
        secuencial: this.secuencial,
        idCuentaPorPagar: this.dataCuentaPorPagar.idCuentaPorPagar,
        valorSaldoLectura: this.dataCuentaPorPagar.valorSaldoLectura,

        abono: roundNumber(historialAbono, DECIMALS.CINCO),
        saldo: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO),


        diasMora: this.dataCuentaPorPagar.diasMora,
        mora: this.dataCuentaPorPagar.mora,
      })

    }
    if (pagosDetalleFiltered.length > 0) {
      if (roundNumber(totalAbonoCuenta, DECIMALS.DOS) !== roundNumber(this.dataCuentaPorPagar.saldo, DECIMALS.DOS)) {

        let historialCuentasFiltered = this.historialCuentas.filter(cd => (
          cd.idCuentaPorPagar === this.dataCuentaPorPagar.idCuentaPorPagar
        ));

        let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

        if (dataUltimoCobroDetalle) {
          valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number;
        } else {
          valorMovimientoSaldo = roundNumber(this.dataCuentaPorPagar.saldo, DECIMALS.CINCO);
        }

        if (this.valorAbono <= valorMovimientoSaldo) {
          historialAbono = this.valorAbono;

        } else {
          historialAbono = valorMovimientoSaldo
        }

        this.historialCuentas.push({
          secuencial: this.secuencial,
          idCuentaPorPagar: this.dataCuentaPorPagar.idCuentaPorPagar,
          valorSaldoLectura: this.dataCuentaPorPagar.valorSaldoLectura,

          abono: roundNumber(historialAbono, DECIMALS.CINCO),
          saldo: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO),

          diasMora: this.dataCuentaPorPagar.diasMora,
          mora: this.dataCuentaPorPagar.mora,
        })
      }
    }
  }

  //--------------
  addFormaCobro() {

    if (!Array.isArray(this.estadosPago) || this.estadosPago.length === 0) {
      throw new Error("Estado pago no válido ");
    }
    if(isNaN(this.valorAbono)){
      throw new Error("Valor abono no es un número");

    }

    for (let group of this.selectedDocumentos) {

      this.dataCuentaPorPagar = group;

      if (typeof this.valorAbono !== 'number' || this.valorAbono > 0) {
        this.addHistorialCuentas();
      }



      for (let item of group.cuotas) {

        item.abonoPosfechado = 0;


        if (typeof this.valorAbono !== 'number' || this.valorAbono === 0) return;

        //Si la cuota no tiene ningún abono

        if (item.abono > 0) {
          this.cuotaConAbono(item)
        } else {
          this.cuotaSinAbono(item)
        }

        item.cuota = roundNumber(item.cuota, DECIMALS.CINCO)
        item.abono = roundNumber(item.abono, DECIMALS.CINCO)
        item.abonoPosfechado = roundNumber(item.abonoPosfechado, DECIMALS.CINCO)


        let { descripcion } = determinadoEstadoPagoCuotaUtil({
          saldo: item.saldo,
          abono: item.abono,
          esPosfechado: this.esAbonoPosfechado,
          estadosPago: this.estadosPago
        });
        item.nombreEstado = descripcion;
        item.esCuotaAfectada = true; //

      }

    }
  }



  /**
           *
           * @param {*} dataCuota
           */
  handlePartialAbono(dataCuota: any) {

    //Si el Abono pago no es Posfechado
    dataCuota.abono = this.esAbonoPosfechado ? 0 : roundNumber(dataCuota.saldo, DECIMALS.CINCO);

    //Si el abono pago es posfechado
    dataCuota.abonoPosfechado = this.esAbonoPosfechado ? roundNumber(dataCuota.saldo, DECIMALS.CINCO) : 0;

    let valorAbono = minus(this.valorAbono, dataCuota.saldo, DECIMALS.CINCO) as number;

    //verificamos si la resta de valor abono es igual al total a cobrar
    //tomar mucha en cuenta, se agrega por temas de decimales
    if (roundNumber(valorAbono, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)) {
      valorAbono = dataCuota.saldo;
    }

    this.valorAbono = valorAbono;

    this.addPagoDetalle(dataCuota, dataCuota.saldo, 0)
    dataCuota.saldo = 0;
  }

  /**
      *
      * @param {object} item
      */
  cuotaSinAbono(item: any) {

    //Validaciones Saldo Cuota
    if (item.saldoCta >= this.valorAbono) {
      item.saldoCta = minus(item.saldoCta, this.valorAbono, DECIMALS.CINCO);

    } else if (item.saldoCta <= this.valorAbono) {
      item.saldoCta = 0;
    }

    //Validaciones Saldo
    if (item.saldo >= this.valorAbono) {

      //Si el Abono pago no es Posfechado
      item.abono = this.esAbonoPosfechado ? 0 : this.valorAbono;

      //Si el abono pago es posfechado
      item.abonoPosfechado = this.esAbonoPosfechado ? this.valorAbono : 0;

      item.saldo = minus(item.saldo, this.valorAbono, DECIMALS.CINCO);


      this.addPagoDetalle(item, this.valorAbono, item.saldo)
      this.valorAbono = 0;

    } else if (item.saldo <= this.valorAbono) {
      this.handlePartialAbono(item);
    }

  }



  /**
          *
          * @param {*} dataCuota
          */
  handleFullAbonoWithExistingAbono(dataCuota: any) {

    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (this.esAbonoPosfechado) {
      dataCuota.abonoPosfechado = plus(dataCuota.abonoPosfechado, this.valorAbono, DECIMALS.CINCO) as number;

    } else {
      let totalAbonoCuota = plus(dataCuota.abono, this.valorAbono, DECIMALS.CINCO) as number;

      if (roundNumber(totalAbonoCuota, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)) {
        dataCuota.abono = dataCuota.saldo;
      } else {
        dataCuota.abono = totalAbonoCuota;
      }

    }



    // Resta el valor del abono al saldo total actual de la cuota
    let saldoTotalActual = minus(dataCuota.saldo, this.valorAbono, DECIMALS.CINCO) as number;

    //se verifica antes  por temas de decimales porque al final queda milesimas
    if (roundNumber(saldoTotalActual, DECIMALS.DOS) === 0) {
      dataCuota.saldo = 0;
    } else {
      dataCuota.saldo = saldoTotalActual;
    }

    this.addPagoDetalle(dataCuota, this.valorAbono, dataCuota.saldo);
    this.valorAbono = 0;
  }

  /**
           * Maneja un abono parcial con un abono existente.
           *
           * @param {*} dataCuota - El objeto que contiene información del abono y el saldoTotalActual.
           */
  handlePartialAbonoWithExistingAbono(dataCuota: any) {
    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (this.esAbonoPosfechado) {
      dataCuota.abonoPosfechado = plus(dataCuota.abonoPosfechado, dataCuota.saldo, DECIMALS.CINCO);
    } else {
      dataCuota.abono = plus(dataCuota.abono, dataCuota.saldo, DECIMALS.CINCO);
    }

    // Agrega un detalle de cobro con el saldoTotalActual como valor del abono
    this.addPagoDetalle(dataCuota, dataCuota.saldo, 0);

    // Calcula el nuevo valor del abono restando el saldo del valor actual del abono
    this.valorAbono = minus(this.valorAbono, dataCuota.saldo, DECIMALS.CINCO) as number;

    dataCuota.saldo = 0;
  }

  /**
  *
  * @param {object} item
  */
  cuotaConAbono(item: any) {

    //Validaciones Saldo Cuota
    if (item.saldoCta >= this.valorAbono) {
      item.saldoCta = minus(item.saldoCta, this.valorAbono, DECIMALS.CINCO);
    } else if (item.saldoCta <= this.valorAbono) {
      item.saldoCta = 0;
    }

    //Validaciones Saldo

    if (item.saldo >= this.valorAbono) {
      this.handleFullAbonoWithExistingAbono(item)

    } else if (item.saldo <= this.valorAbono) {
      this.handlePartialAbonoWithExistingAbono(item);
    }
  }


  /**
   *
   * @param {*} item
   * @param {*} abono
   * @param {*} saldo
   * @returns
   */

  addPagoDetalle(item: any, abono: number, saldo: number) {
    if (item.cuota === 0 || abono === 0) return;

    let valorMovimientoSaldo = 0;
    let pagosDetalleFiltered = this.pagosDetalle.filter(cd => (
      cd.idCuentaPorPagar === this.dataCuentaPorPagar.idCuentaPorPagar &&
      cd.idCuotaPorPagar === item.idCuotaPorPagar
    ))

    let dataUltimoCobroDetalle = pagosDetalleFiltered.pop();
    if (dataUltimoCobroDetalle) {
      valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldoOriginal, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number
    } else {
      valorMovimientoSaldo = roundNumber(item.saldoOriginal, DECIMALS.CINCO);
    }

    this.pagosDetalle.push({
      idCuentaPorPagar: this.dataCuentaPorPagar.idCuentaPorPagar,
      idCuotaPorPagar: item.idCuotaPorPagar,
      abono,
      interes: item.interes,
      diasMora: item.diasMora,
      mora: item.mora,
      cuota: roundNumber(item.cuota, DECIMALS.CINCO),
      saldo: roundNumber(saldo, DECIMALS.CINCO),
      secuencial: this.secuencial,
      valorSaldoLectura: item.valorSaldoLectura,

      saldoOriginal: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO),
      posfechado: this.esAbonoPosfechado
    })
    item.saldo = roundNumber(item.saldo, DECIMALS.CINCO);

    item.saldoOriginal = minus(item.saldoOriginal, abono, DECIMALS.CINCO);

  }

}
