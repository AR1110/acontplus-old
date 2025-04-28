import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision} from "@domain/models/estab.model";
import {inject} from "@angular/core";
import {TokenUseCase} from "@domain/use-cases/token.use-case";


export interface LayoutStore {
  isRoutePos: boolean
  entidadName: string
  dataEstab: GroupedEstab
  userName: string,
  establecimientos: GroupedEstab[]
  puntosEmision: GroupedEstabPuntoEmision[]
  bodegas: GroupedEstabBodega[]
  codEstab: string
  establecimientoId: number
  bodegaId: number
  puntoEmisionId: number
}
const initialLayoutState: LayoutStore = {
  isRoutePos: false,
  entidadName: '',
  dataEstab: {} as GroupedEstab,
  userName: '',
  establecimientos: [],
  puntosEmision: [],
  bodegas: [],
  codEstab: '',
  establecimientoId: 0,
  bodegaId: 0,
  puntoEmisionId: 0
};

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialLayoutState),
  withMethods((store, $tokenUseCase = inject(TokenUseCase)) => ({
    setData(groupedEstab: GroupedEstab, estabs: GroupedEstab[]) {

      const dataEstabFromToken = $tokenUseCase.getDataEstab();

      const puntosEmision = groupedEstab.puntosEmision;
      const bodegas = groupedEstab.bodegas;

      const defaultPuntoEmision = puntosEmision.find(p => p.defaultPtoEmi);
      const defaultBodega = bodegas.find(b => b.defaultBodega);

      patchState(store, (state) => ({
        dataEstab: groupedEstab,
        entidadName: dataEstabFromToken?.entidad ?? '',
        userName: dataEstabFromToken?.usuario ?? '',
        establecimientos: estabs,
        puntosEmision,
        bodegas,
        codEstab: groupedEstab.codEstab,
        establecimientoId: groupedEstab.idEstablecimiento,
        puntoEmisionId: defaultPuntoEmision?.idPuntoEmision ?? 0,
        bodegaId: defaultBodega?.idBodega ?? 0
      }));
    }
  }))
,
withHooks({
    onInit(store) {
    },
    onDestroy(store) {},
  })
);
