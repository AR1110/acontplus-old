import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FilterDataSupportUseCase } from '@mechanical/application/use-cases/support/filter-data-support.use-case';
import { MECHANICAL_STATUS } from '@mechanical/domain/enums/mechanical.enum';

export class MechanicalState {
  selectedIndex = 1;
  supportStatus: any[] = [];
}

export const MechanicalStore = signalStore(
  { providedIn: 'root' },
  withState(new MechanicalState()),

  withComputed(({ selectedIndex }) => ({
    isDashboard: computed(() => selectedIndex() === 0),
    isPending: computed(() => selectedIndex() === 1),
    isProcessing: computed(() => selectedIndex() === 2),
    isToDeliver: computed(() => selectedIndex() === 3),
    isInspection: computed(() => selectedIndex() === 4),
    isApproved: computed(() => selectedIndex() === 5),
    isCanceled: computed(() => selectedIndex() === 6),
    valueStatus: computed(() => {
      if (selectedIndex() === 2) return MECHANICAL_STATUS.EN_PROCESO;
      if (selectedIndex() === 3) return MECHANICAL_STATUS.POR_ENTREGAR;
      if (selectedIndex() === 4) return MECHANICAL_STATUS.INSPECCION;
      if (selectedIndex() === 5) return MECHANICAL_STATUS.APROBADO;
      if (selectedIndex() === 6) return MECHANICAL_STATUS.ANULADO;
      return MECHANICAL_STATUS.PENDIENTE;
    }),
  })),

  withMethods((store, $filterData = inject(FilterDataSupportUseCase)) => ({
    loadFilterData() {
      $filterData.execute().subscribe(response => {
        patchState(store, () => {
          return {
            supportStatus: response.supportStatus,
          };
        });
      });
    },

    selectedIndexChange(index: number) {
      patchState(store, () => ({
        selectedIndex: index,
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadFilterData();
    },
  }),
);
