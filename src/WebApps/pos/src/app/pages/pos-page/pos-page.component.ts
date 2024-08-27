import { CATEGORY_CODE } from './../../../../../RestaurantUI/src/core/models/category.models';
import { Component, computed, inject, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe, CommonModule } from "@angular/common";
import { ConfigService } from '@/services/config.service';
import { forkJoin } from 'rxjs';
import { ItemService } from '@/services/item.service';
import { Pagination } from "@/models/pagination.model";
import { ItemRead } from "@/models/item.model";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SubCategory } from "@/models/inventory/subcategory.model";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemsComponent } from "@/pages/pos-page/components/items/items.component";
import { CartItemsComponent } from "@/pages/pos-page/components/cart-items/cart-items.component";
import { MatCardModule } from "@angular/material/card";
import { PosStoreService, posStoreStateInitial } from "@/store/pos-store.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CartHeaderComponent } from './components/cart-header/cart-header.component';
import { CartFooterComponent } from './components/cart-footer/cart-footer.component';
import { MainStoreService } from "@/store/main-store.service";
import { Order } from '@/models/order.model';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,

    AsyncPipe,
    ItemsComponent,
    CartHeaderComponent,
    CartItemsComponent,
    CartFooterComponent
  ],
  templateUrl: './pos-page.component.html',
  styleUrl: './pos-page.component.scss'
})
export class PosPageComponent {

  private posStoreSvc = inject(PosStoreService)
  private mainStore = inject(MainStoreService)
  private configSvc = inject(ConfigService);
  private itemSvc = inject(ItemService);

  subCategorias = signal<SubCategory[]>([{
    idSubFamilia: 0,
    codigo: "",
    descripcion: 'TODOS',
    s3ObjectUrl: '',
  },
  {
    idSubFamilia: 0,
    codigo: CATEGORY_CODE.COM,
    descripcion: 'COMBOS',
    s3ObjectUrl: ''
  }]);
  items = signal<ItemRead[]>([])
  dataPagination = signal(new Pagination())

  dataItemSearch = signal({
    idSubFamilia: 0
  })
  loading = computed(() => {
    return (this.posStoreSvc.state().isLoading || this.posStoreSvc.state().isSelectedItem)
  });

  constructor() {
    this.posStoreSvc.state.update(e => posStoreStateInitial)
  }

  refresh() {
    this.getItems()
  }

  getDataFormInit() {
    let { codEstab, establecimientoId } = this.mainStore.state();
    if (!codEstab || !(establecimientoId > 0)) {
      console.log('no se encontró datos del establecimiento')
      return
    }
    let params = {
      codEstab,
      idEstablecimiento: establecimientoId
    }
    let paramsItem = {
      pageIndex: this.dataPagination().pageIndex + 1,
      pageSize: this.dataPagination().pageSize
    }
    return forkJoin([
      this.configSvc.getDataForm(params),
      this.itemSvc.getAll(paramsItem)
    ])
  }

  getItems() {
    let params = {
      pageIndex: this.dataPagination().pageIndex + 1,
      pageSize: this.dataPagination().pageSize,
      idSubFamilia: this.dataItemSearch().idSubFamilia
    }

    this.items.set([]);
    this.setLoading(true)
    this.itemSvc.getAll(params).subscribe({
      next: (response) => {
        this.setLoading(false)
        this.items.set(response.items);
        this.setTotalRecords();
      },
      error: (err) => {
        console.log(err)
        this.setLoading(false)

      }
    })

  }

  setTotalRecords() {
    if (this.items().length > 0) {
      this.dataPagination.update(e => {
        return {
          ...e,
          totalRecords: this.items()[0].totalRecords
        }
      })
    }
  }

  setLoading(isLoading: boolean) {
    this.posStoreSvc.state.update(e => ({
      ...e,
      isLoading
    }))
  }

  ngOnInit() {
    this.setLoading(true)
    this.getDataFormInit()?.subscribe({
      next: response => {
        this.setLoading(false)
        const [dataForm, dataItem] = response;
        console.log(dataForm.vendedores)

        this.posStoreSvc.state.update(e => {
          let orderData: Order = {
            ...e.order,
            puntoEmisionId: this.mainStore.state().puntoEmisionId,
            establecimientoId: this.mainStore.state().establecimientoId,
            userId: dataForm.vendedores.find((u: any) => u.predeterminado)?.idUsuario ?? 0
          }
          return {
            ...e,
            order: orderData,
            vendedores: dataForm.vendedores,
            taxes: dataForm.taxes,
            taxRates: dataForm.taxRates
          }
        })

        this.subCategorias.update((sc) => [...sc, ...dataForm.subCategorias]);
        this.items.set(dataItem.items);
        this.setTotalRecords()
      }
      ,
      error: (err) => {
        this.setLoading(false)
      }
    })
  }

  onTabChange(event: MatTabChangeEvent) {
    let dataSubcategory = this.subCategorias()[event.index];
    if (dataSubcategory) {
      this.dataPagination.update(dp => {
        return {
          ...dp,
          pageIndex: 0,
          pageSize: 25,
        }
      })
      this.dataItemSearch.update(e => ({ ...e, idSubFamilia: dataSubcategory.idSubFamilia }))
      this.getItems()
    }
  }

  handlePageEvent(e: PageEvent) {
    this.dataPagination.update(dp => {
      return {
        ...dp,
        totalRecords: e.length,
        pageIndex: e.pageIndex,
        pageSize: e.pageSize,
      }
    })
    this.getItems()
  }


}


