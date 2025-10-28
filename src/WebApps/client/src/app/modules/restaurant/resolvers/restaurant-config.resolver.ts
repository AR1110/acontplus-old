import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RestaurantConfigService } from '@restaurant/data/services/restaurant-config.service';
import { RestaurantStoreService } from '@restaurant/application/store/restaurant-store.service';

export const restaurantConfigDataResolver: ResolveFn<any> = (route, state) => {
  const posStoreSvc = inject(RestaurantStoreService);

  const mainData = inject(RestaurantConfigService).getMainData();

  mainData.subscribe(response => {
    const dataEstab = response.estabs.find(e => e.defaultEstab);

    if (dataEstab) {
      const puntosEmision = dataEstab.puntosEmision;
      const bodegas = dataEstab.bodegas;
      const dataPuntoEmision = puntosEmision.find(p => p.defaultPtoEmi);
      const dataBodega = bodegas.find(p => p.defaultBodega);
      posStoreSvc.state.update(e => {
        return {
          ...e,
          dataEstab: dataEstab,
          establecimientos: response.estabs,
          puntosEmision: dataEstab.puntosEmision,
          bodegas: dataEstab.bodegas,
          codEstab: dataEstab.codEstab,
          establecimientoId: dataEstab.idEstablecimiento,
          puntoEmisionId: dataPuntoEmision?.idPuntoEmision ?? 0,
          bodegaId: dataBodega?.idBodega ?? 0,
        };
      });
    } else {
      throw new Error('No se pudo recuperar el establecimiento');
    }
  });

  return mainData;
};
