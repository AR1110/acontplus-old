import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { groupSubCategoryUtil } from '@inventory/utils/group-sub-category.util';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { LotPriceRepository } from '@inventory/data/repositories/lot-price-repository';

@Injectable({
  providedIn: 'root',
})
export class LotPriceHttp implements LotPriceRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.LOT_PRICE}`;
  private http = inject(HttpClient);

  getDataFilter() {
    const json = JSON.stringify({ tipo: 1 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        const data = {
          decimal: {
            nroPrecio: 2,
          },
          tarifasImpuesto: [],
          tarifas: [],
          subFamilias: [],
          familias: [],
        };
        if (response !== null && typeof response === 'object') {
          const { decimales, impuestos, familias, subfamilias: subFamilias, tarifas } = response;

          const tempDecimal = decimales[0];
          data.decimal = {
            nroPrecio: tempDecimal.nroPrecio,
            // nroCantidad: tempDecimal.nroCantidad,
            // nroIva: tempDecimal.nroIva,
            // nroDescuentoDetalle: tempDecimal.nroDescuentoDetalle,
            // nroTotalDetalle: tempDecimal.nroTotalDetalle,
            // nroTotalSubTotal: tempDecimal.nroTotalSubTotal,
            // nroDescuento: tempDecimal.nroDescuento,
            // importeTotal: tempDecimal.importeTotal,
            // nroIce: tempDecimal.nroIce,
          };
          data.tarifasImpuesto = impuestos.map((item: any) => {
            return {
              idTarifaImpuesto: item.idTipoIva,
              descripcion: item.descripcion,
              porcentaje: item.porcentaje,
              // codigoPorcentaje: item.codigoPorcentaje,
              // idImpuesto: item.idImpuesto,
              // estado: item.estado,
              // fechaRegistro: item.fechaRegistro,
              // idUsuario: item.idUsuario,
              // codigo: item.codigo,
            };
          });

          // infrastructure.familias = familias.map((item: any) => {
          //   return {
          //     idFamilia: item.idFamilia,
          //     descripcion: item.descripcion,
          //     siglas: item.siglas,
          //   }
          // })
          data.subFamilias = groupSubCategoryUtil(subFamilias);

          data.tarifas = tarifas.map((item: any) => {
            return {
              idTarifa: item.idTarifa,
              descripcion: item.descripcion,
              predeterminada: item.predeterminada,
            };
          });
        }

        return data;
      }),
    );
  }

  getAll<T>(obj: T): Observable<any[]> {
    const json = JSON.stringify({ ...obj });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        const mainData = response.articulos;

        const products = mainData.map((item: any, index: number) => {
          const mainTarifas = JSON.parse(item.tarifas);
          const tarifas = mainTarifas.map((t: any) => {
            return {
              idArticuloFraccionadoPvP: t.idArticuloFraccionadoPvP || 0, //Articulo Fraccionado
              idArticuloFraccionado: t.idArticuloFraccionado || 0, //Articulo Fraccionado

              idArticuloPvP: t.idArticuloPvp,
              idArticulo: t.idArticulo,
              idTarifa: t.idTarifa,
              precioVenta: t.precioVenta,
              precioConIva: t.precioConIva,
              porcentajeUtilidad: t.porcentajeUtilidad,
              tarifaDesc: t.tarifa,
              utilidad: roundNumber(
                pricingCalculateUtil.getValueUtility(t.precioVenta, item.precioCosto),
                5,
              ),
            };
          });
          return {
            index: index + 1,
            idArticulo: item.idArticulo,
            idArticuloFraccionado: item.idArticuloFraccionado, //articulo fraccionado
            idTipoIva: item.idTipoIva,
            codigo: item.codigo,
            codigoAuxiliar: item.codigoAuxiliar,
            codigoBarra: item.codigoBarra,
            descripcion: item.descripcion,
            stock: item.stock,
            precioCosto: item.precioCosto,
            estado: item.estado,
            iva: item.iva,
            _children: tarifas,
          };
        });
        return products;
      }),
    );
  }

  put<T>(data: T) {
    return this.http.put<ApiResponseLegacy>(`${this.url}`, { data });
  }
}
