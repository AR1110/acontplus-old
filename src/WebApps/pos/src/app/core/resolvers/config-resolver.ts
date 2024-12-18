
import {ConfigService} from "@data/repositories/config/config.service"
import {MainStoreService} from "@domain/services/main-store.service"
import {inject} from "@angular/core"
import {ResolveFn} from "@angular/router"
import {TokenUseCase} from "@domain/use-cases/token.use-case";


export const configDataResolver: ResolveFn<any> = (route, state) => {
  let _tokenUseCase = inject(TokenUseCase)
  let posStoreSvc = inject(MainStoreService)
  let dataEstab = _tokenUseCase.getDataEstab();
  let mainData = inject(ConfigService).getMainData();

  mainData.subscribe(response => {
    let dataEstabNew = response.estabs.find(e => e.idEstablecimiento === dataEstab.idEstablecimiento);
    if (dataEstabNew) {
      let puntosEmision = dataEstabNew.puntosEmision;
      let bodegas = dataEstabNew.bodegas;
      let dataPuntoEmision = puntosEmision.find(p => p.defaultPtoEmi)
      let dataBodega = bodegas.find(p => p.defaultBodega)
      posStoreSvc.state.update(e => {
        return {
          ...e,
          dataEstab: dataEstabNew,
          entidadName: dataEstab.entidad,
          userName: dataEstab.usuario,
          establecimientos: response.estabs,
          puntosEmision: dataEstabNew.puntosEmision,
          bodegas: dataEstabNew.bodegas,
          codEstab:dataEstabNew.codEstab,
          establecimientoId: dataEstabNew.idEstablecimiento,
          puntoEmisionId: dataPuntoEmision?.idPuntoEmision ?? 0,
          bodegaId: dataBodega?.idBodega ?? 0
        }
      })
    } else {
      throw new Error('No se pudo recuperar el establecimiento')
    }
  })

  return mainData;
}
