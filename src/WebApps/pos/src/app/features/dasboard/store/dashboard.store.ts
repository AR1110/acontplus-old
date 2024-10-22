
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Widget } from '../interfaces/widget.interface';
import { TopProductsComponent } from '../components/widget/top-products.component';
import { computed, inject } from '@angular/core';
import { OrderService } from '@/features/orders/services/order.service';
import { TotalSummaryComponent } from '../components/widget/total-summary.component';
import { SaleChartComponent } from '../components/widget/sale-chart.component';


function getAnios() {
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

export interface DashboardStata {
  widgets: Widget[]
  addedWidgets: Widget[],
  totalSummaries:Widget[]
  stats:Widget[]
  anios: number[],
  anio: number
  sales: any[],
  topProducts: any[]

}
const initialDashboardState: DashboardStata = {
  widgets: [

  ],
  totalSummaries: [
    {
      id: 1,
      label: 'Ordenes',
      content: TotalSummaryComponent,
      backgroundColor: "#525CEB",
      color: 'whitesmoke'
    },
    {
      id: 2,
      label: 'Notas de Entrega',
      content: TotalSummaryComponent,
      backgroundColor: "#1679AB",
      color: 'whitesmoke'
    },
    {
      id: 3,
      label: 'Facturas',
      content: TotalSummaryComponent,
      backgroundColor: "#1679AB",
      color: 'whitesmoke'
    },
  ],
  addedWidgets: [
    {
      id: 4,
      label: 'Ventas',
      content: SaleChartComponent,
      backgroundColor: "white",
      columns: 2,
      rows: 2,
      color: 'black'
    },
    {
      id: 5,
      label: 'Productos más vendidos',
      content: TopProductsComponent,
      backgroundColor: "white",
      columns: 2,
      rows: 2,
      color: 'black'
    }
  ],
  stats: [

    {
      id: 4,
      label: 'Ventas',
      content: SaleChartComponent,
      backgroundColor: "white",
      columns: 2,
      rows: 2,
      color: 'black'
    },
    {
      id: 5,
      label: 'Productos más vendidos',
      content: TopProductsComponent,
      backgroundColor: "white",
      columns: 2,
      rows: 2,
      color: 'black'
    }
  ],
  anios: getAnios(),
  anio:  new Date().getFullYear(),
  sales: [],
  topProducts: []
}

export const DashboardStore = signalStore(
  {providedIn: 'root'},
  withState(initialDashboardState),
  withComputed(store=>({

    widgetsToAdd : computed(()=>{

      const addedIds = store.addedWidgets().map(w=>w.id);

      return store.widgets().filter(w=>!addedIds.includes(w.id))
    })


  })),


  withMethods((store, orderSvc = inject(OrderService))=>({

    addWidget(w:Widget){

      patchState(store, (state)=>({
        addedWidgets: [...state.addedWidgets, {...w} ]
      }))
    },

    updateWidget(id:number, widget: Partial<Widget>){
      const index = store.addedWidgets().findIndex(w=>w.id===id);
      if(index!==-1){
        const newWidgets = [...store.addedWidgets()];
        newWidgets[index] = {
          ...newWidgets[index],
          ...widget
        }

        patchState(store, ( )=>({
          addedWidgets: newWidgets
        }))
      }
    },

    getStats(estabId: number ){

      let params = {
        estabId ,
        anio: store.anio()
      }
      orderSvc.getStats(params).subscribe(response => {
        console.log(response)
        patchState(store, ( )=>({
          sales: response.sales,
          topProducts: response.productsTop
        }))


      })
    }


  })),


  withHooks({

    onInit(store) {
      console.log('init store')
    },
    onDestroy(store) {

    },
  }),

)
