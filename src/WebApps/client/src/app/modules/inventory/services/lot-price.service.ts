import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { INVENTORY_PATHS } from "../enums/inventory.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class LotPriceService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.LOT_PRICE}`;
  private http = inject(HttpClient)


  getDataFilter() {
    let json = JSON.stringify({ tipo: 1 })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {

        const data = {
          decimal: {},
          tarifasImpuesto: [],
          tarifas: [],
          subFamilias: [],
          familias: []
        }
        if (response !== null && typeof response === 'object') {
          const { decimales, impuestos, familias, subfamilias: subFamilias, tarifas } = response;
          console.log(response)
          const tempDecimal = decimales[0];
          data.decimal = {
            nroPrecio: tempDecimal.nroPrecio,
            nroCantidad: tempDecimal.nroCantidad,
            nroIva: tempDecimal.nroIva,
            nroDescuentoDetalle: tempDecimal.nroDescuentoDetalle,
            nroTotalDetalle: tempDecimal.nroTotalDetalle,
            nroTotalSubTotal: tempDecimal.nroTotalSubTotal,
            nroDescuento: tempDecimal.nroDescuento,
            importeTotal: tempDecimal.importeTotal,
            nroIce: tempDecimal.nroIce,
          }
          data.tarifasImpuesto = impuestos.map((item: any) => {
            return {
              idTipoIva: item.idTipoIva,
              descripcion: item.descripcion,
              porcentaje: item.porcentaje,
              // codigoPorcentaje: item.codigoPorcentaje,
              // idImpuesto: item.idImpuesto,
              // estado: item.estado,
              // fechaRegistro: item.fechaRegistro,
              // idUsuario: item.idUsuario,
              // codigo: item.codigo,
            }
          })

          data.familias = familias.map((item: any) => {
            return {
              idFamilia: item.idFamilia,
              descripcion: item.descripcion,
              siglas: item.siglas,
            }
          })

          data.subFamilias = subFamilias.map((item: any) => {
            return {
              idSubFamilia: item.idSubFamilia,
              idFamilia: item.idFamilia,
              descripcion: item.descripcion,
              siglas: item.siglas,
            }
          })

          data.tarifas = tarifas.map((item: any) => {
            return {
              idTarifa: item.idTarifa,
              descripcion: item.descripcion,
              predeterminada: item.predeterminada,
            }
          })
        }

        return data;

      })
    )
  }

  getAll() {
    let json = JSON.stringify({ tipo: 2 })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let mainData = response.articulos;
        let products = mainData.map((item: any) => {
          let mainTarifas = JSON.parse(item.tarifas);
          let tarifas = mainTarifas.map((t: any) => {
            return {
              idArticuloPvp: t.idArticuloPvp,
              idArticulo: t.idArticulo,
              idTarifa: t.idTarifa,
              precioVenta: t.precioVenta,
              precioConIva: t.precioConIva,
              porcentajeUtilidad: t.porcentajeUtilidad,
              tarifaDesc: t.tarifa
            }
          })
          return {
            idArticulo: item.idArticulo,
            idTipoIva: item.idTipoIva,
            codigo: item.codigo,
            codigoAuxiliar: item.codigoAuxiliar,
            codigoBarra: item.codigoBarra,
            descripcion: item.descripcion,
            stock: item.stock,
            precioCosto: item.precioCosto,
            estado: item.estado,
            iva: item.iva,
            tarifas: tarifas,
          }
        })
        return products;
      })
    )
  }
}
