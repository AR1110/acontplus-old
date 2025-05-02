import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import {DataSearchOrder, OrderList} from "@domain/models/order.model";
import {ListOrderUseCase} from "@domain/use-cases/order/list-order.use-case";
import {PaginationParams} from "@domain/value-objects/pagination-params";
import {PageNumber} from "@domain/value-objects/page-number.vo";
import {PageSize} from "@domain/value-objects/page-size.vo";
import {getValidId} from "@domain/utils/utils";
import {Pagination} from "@domain/models/pagination.model";
import {LayoutStore} from "@ui/store/layout.store";
import {STATUS_ORDER} from "@domain/enums/main.enum";
import {finalize} from "rxjs";


export interface OrderState {
  orders:OrderList[]
  dataSearch: DataSearchOrder
  pagination: Pagination
  moreFilter: boolean
  oldTableId: number
}
const initialState = ()=>  {
  return {
  orders: [],
  dataSearch: new DataSearchOrder(),
  pagination: new Pagination(),
  moreFilter: false,
  oldTableId: 0
} as OrderState
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState()),
  withComputed((store) => ({
    isDeleted: computed(() => store.dataSearch.selectedStatus() === STATUS_ORDER.ANULADO),
    isFinished: computed(() => store.dataSearch.selectedStatus() === STATUS_ORDER.FINALIZADO),
    isPending: computed(() => store.dataSearch.selectedStatus() === STATUS_ORDER.PENDIENTE),
    isDividing: computed(() => store.dataSearch.selectedStatus() === STATUS_ORDER.PROCESO),

  })),

  withMethods((store, $listUseCase = inject(ListOrderUseCase), $layoutStore = inject(LayoutStore)) => ({

    setPropDataSearch<K extends keyof DataSearchOrder>(
      key: K,
      value: DataSearchOrder[K]
    ){
      patchState(store, (state) => ({
        dataSearch: {
          ...state.dataSearch,
          [key]: value
        }
      }));
    },
    setPropState<K extends keyof OrderState>(
      key: K,
      value: OrderState[K]
    ){
      patchState(store, (state) => ({
          ...state,
          [key]: value
      }));
    },

    //filters
    emitDateFilterChange(enableDateFilter: boolean){
      this.setPropDataSearch("enableDateFilter", enableDateFilter);
      this.getList()
    },

    refresh(){
      this.getList()
    },

    getParams(){
      const pagination = new PaginationParams(
        PageNumber.create(store.pagination().pageIndex + 1),
        PageSize.create(store.pagination().pageSize)
      );

      const query = pagination.toQuery();

      return {
        isSearchDate: store.dataSearch.enableDateFilter(),
        estabId: getValidId($layoutStore.establecimientoId()),
        puntoEmisionId: getValidId($layoutStore.puntoEmisionId()),
        startDate: store.dataSearch.startDate(),
        endDate: store.dataSearch.endDate(),
        customerCompanyId: getValidId(store.dataSearch.customerCompanyId()),
        tableId: getValidId(store.dataSearch.tableId()),
        userId: getValidId(store.dataSearch.userId()),
        pageIndex: query.page,
        pageSize: query.pageSize,
        isEnabled: !store.isDeleted(),
        finished: store.isFinished(),
        divided: store.isDividing(),
        deleted: store.isDeleted(),
        typeSearchCustomer: store.dataSearch.typeSearchCustomer(),
      };
    },


    getList() {
      $listUseCase.execute(this.getParams()).subscribe((response) => {
        patchState(store, (state) => ({
          orders: response.data,
          pagination: {
            ...state.pagination,
            totalRecords: response.totalRecords,
          }
        }));
      })
    },


    onLoadMore() {
      this.setPropState("pagination", {
        ...store.pagination(),
        pageIndex: store.pagination().pageIndex+1,
      })
      $listUseCase
        .execute(this.getParams())
        .subscribe((response)=>{
          patchState(store, (state) => ({
            orders: [...state.orders, ...response.data],
            pagination: {
              ...state.pagination,
              totalRecords: response.totalRecords,
            }
          }));
        })
    },


    handleChangeMoreFilter(){
      this.setPropState("moreFilter", !store.moreFilter())
      if(store.moreFilter()){
        this.setPropState("oldTableId", store.dataSearch.tableId())
        this.setPropDataSearch("tableId", 0)
      }else{
        this.setPropDataSearch("tableId", store.oldTableId());
      }
      this.refresh()
    },

    resetState() {
      patchState(store, initialState());
    }

  })),

  withHooks({
    onInit(store) {
    //  store.getList()
    },
    onDestroy(store) {

    },
  })
);
