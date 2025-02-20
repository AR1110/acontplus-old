import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Widget } from '@domain/models/widget.model';
import { TopProductsComponent } from '@/ui/layouts/new-layout/dashboard/widgets/top-products.component';
import { computed, inject, input } from '@angular/core';
import { TotalSummaryComponent } from '@ui/dashboard/widget/total-summary.component';
import { SaleChartComponent } from '@/ui/layouts/new-layout/dashboard/widgets/sale-chart.component';
import { OrderUseCase } from '@domain/use-cases/order.use-case';
import { MetricCardComponent } from '../layouts/new-layout/metric-card/metric-card.component';

function getAnios() {
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

export interface DocumentCounts {
  totalOrdenes: number;
  totalNotasEntrega: number;
  totalFacturas: number;
}
export interface DashboardStata {
  widgets: Widget[];
  addedWidgets: Widget[];
  totalSummaries: Widget[];
  anios: number[];
  anio: number;
  sales: any[];
  topProducts: any[];
  documentCounts: Widget[];
}
const initialDashboardState: DashboardStata = {
  widgets: [],
  totalSummaries: [
    // {
    //   id: 1,
    //   label: 'Ordenes',
    //   content: TotalSummaryComponent,
    //   backgroundColor: "#525CEB",
    //   color: 'whitesmoke'
    // },
    // {
    //   id: 2,
    //   label: 'Notas de Entrega',
    //   content: TotalSummaryComponent,
    //   backgroundColor: "#1679AB",
    //   color: 'whitesmoke'
    // },
    // {
    //   id: 3,
    //   label: 'Facturas',
    //   content: TotalSummaryComponent,
    //   backgroundColor: "#1679AB",
    //   color: 'whitesmoke'
    // },
  ],
  addedWidgets: [
    {
      id: 4,
      label: 'Ventas',
      content: SaleChartComponent,
      backgroundColor: 'var(--mdc-elevated-card-container-color)',
      columns: 2,
      rows: 3,
    },
    {
      id: 5,
      label: 'Productos más vendidos',
      content: TopProductsComponent,
      backgroundColor: 'var(--mdc-elevated-card-container-color)',
      columns: 2,
      rows: 3,
      //  color: 'in'
    },
  ],

  anios: getAnios(),
  anio: new Date().getFullYear(),
  sales: [],
  topProducts: [],
  documentCounts: [],
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialDashboardState),
  withComputed((store) => ({
    widgetsToAdd: computed(() => {
      const addedIds = store.addedWidgets().map((w) => w.id);

      return store.widgets().filter((w) => !addedIds.includes(w.id));
    }),
  })),

  withMethods((store, _orderUseCase = inject(OrderUseCase)) => ({
    addWidget(w: Widget) {
      patchState(store, (state) => ({
        addedWidgets: [...state.addedWidgets, { ...w }],
      }));
    },

    updateWidget(id: number, widget: Partial<Widget>) {
      const index = store.addedWidgets().findIndex((w) => w.id === id);
      if (index !== -1) {
        const newWidgets = [...store.addedWidgets()];
        newWidgets[index] = {
          ...newWidgets[index],
          ...widget,
        };

        patchState(store, () => ({
          addedWidgets: newWidgets,
        }));
      }
    },

    getStats(estabId: number) {
      let params = {
        estabId,
        anio: store.anio(),
      };
      _orderUseCase.getStats(params).subscribe((response) => {
        let documentCounts = response.documentCounts.map((item, index) => {
          return {
            id: index + 1,
            label: item.descripcion,
            title: item.descripcion,
            backgroundColor: '#1679AB',
            color: 'whitesmoke',
            input: item.cantidad,
            value: item.cantidad,
            props: {
              count: item.cantidad,
            },
          };
        });

        patchState(store, () => ({
          sales: response.sales,
          topProducts: response.productsTop,
          documentCounts: documentCounts,
        }));
      });
    },
  })),

  withHooks({
    onInit(store) {
      console.log('init store');
    },
    onDestroy(store) {},
  })
);
