
import { Component, computed,   inject, signal,   } from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { ConfigService } from '@/shared/services/config.service';
import { forkJoin,   } from 'rxjs';
import { ItemService } from '@/features/pos/services/item.service';
import { Pagination } from "@/shared/models/pagination.model";
import { ItemRead } from "@/features/pos/models/item.model";
import {MatPaginator,  PageEvent} from '@angular/material/paginator';
import { SubCategory } from "@/shared/models/inventory/subcategory.model";
import {MatProgressSpinner,  } from '@angular/material/progress-spinner';
import {MatCard, MatCardContent, } from "@angular/material/card";
import { PosStoreService, posStoreStateInitial } from "@/features/pos/store/pos-store.service";
import {  MatFormFieldModule} from "@angular/material/form-field";
import { MainStoreService } from "@/store/main-store.service";
import { SUB_CATEGORY_CODE } from '@/shared/enums/main.enum';
import { Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { isValidField } from '@/shared/utils/utils'; ;
import { Order } from '@domain/models/order.model';
import { CategoriesTabComponent } from '../components/categories-tab/categories-tab.component';
import { PromotionsComponent } from '../components/promotions/promotions.component';
import { ItemsComponent } from '../components/items/items.component';
import { TableModalComponent } from '../components/table-modal/table-modal.component';
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-pos-page',
    imports: [
        CommonModule,
        MatCard,
        MatCardContent,
        CategoriesTabComponent,
        MatPaginator,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatIcon,
        PromotionsComponent,
        MatProgressSpinner,
        ItemsComponent
    ],
    templateUrl: './pos-page.component.html',
    styleUrl: './pos-page.component.scss'
})
export class PosPageComponent {

  private posStoreSvc = inject(PosStoreService)
  private mainStore = inject(MainStoreService)
  private configSvc = inject(ConfigService);
  private itemSvc = inject(ItemService);

  public dialog = inject(Dialog)

  selectedSubCategoryIndex = 0;

  private establecimientoId = this.mainStore.select("establecimientoId");
  private codEstab = this.mainStore.select("codEstab");


  currentTabIndex: number = 0;

  subCategorias = signal<SubCategory[]>([{
    idSubFamilia: 0,
    codigo: "",
    descripcion: 'TODOS',
  },
  {
    idSubFamilia: 0,
    codigo: SUB_CATEGORY_CODE.COM,
    descripcion: 'COMBOS',
  },
  {
    idSubFamilia: 0,
    codigo: SUB_CATEGORY_CODE.PROM,
    descripcion: 'PROMOCIONES',
  }
  ]);
  items = signal<ItemRead[]>([])
  dataPagination = signal(new Pagination())

  dataItemSearch = signal({
    idSubFamilia: 0,
    textSearch: null
  })
  loading = computed(() => {
    return (this.posStoreSvc.state().isLoading || this.posStoreSvc.state().isSelectedItem)
  });

  constructor() {
    this.posStoreSvc.state.update(e => {

      if (e.order?.orderId > 0) {
        return e;
      }
      return posStoreStateInitial()
    })
  }



  refresh() {
    if(this.loading()) return;

    if (this.posStoreSvc.state().codeSubCategory === SUB_CATEGORY_CODE.PROM) {
      this.getPromotions()
    } else if (this.posStoreSvc.state().codeSubCategory === SUB_CATEGORY_CODE.COM) {
      this.getCombos()
    } else {
      this.getItems()
    }

  }


  getDataFormInit() {
    if (!this.codEstab() || !(this.establecimientoId() > 0)) {
      console.log('no se encontró datos del establecimiento')
      return
    }
    let params = {
      codEstab: this.codEstab(),
      idEstablecimiento: this.establecimientoId()
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
      idSubFamilia: this.dataItemSearch().idSubFamilia,
      textSearch: isValidField(this.dataItemSearch().textSearch)
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

  getCombos() {
    let params = {
      pageIndex: this.dataPagination().pageIndex + 1,
      pageSize: this.dataPagination().pageSize,
      idSubFamilia: this.dataItemSearch().idSubFamilia,
      textSearch: isValidField(this.dataItemSearch().textSearch)
    }

    this.items.set([]);
    this.setLoading(true)
    this.itemSvc.getCombos(params).subscribe({
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

  getPromotions() {
    this.posStoreSvc.getPromotions(this.establecimientoId())
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
    let orderId = this.posStoreSvc.state().order?.orderId || 0;
    if (!(orderId > 0)) {
        this.dialog.open(TableModalComponent, {
        width: '100vw',
        height: '100vh',
        panelClass: 'full-screen-cdk-dialog',
      });

    }
    if(this.posStoreSvc.state().isLoading) return

    this.setLoading(true)
    this.getDataFormInit()?.subscribe({
      next: response => {
        this.setLoading(false)
        const [dataForm, dataItem] = response;

        this.posStoreSvc.state.update(e => {

          let tarifaId = dataForm.tarifas.find(t=>t.defaultTarifa)?.idTarifa ?? 0;
          let orderData: Order = {
            ...e.order,
            puntoEmisionId: this.mainStore.state().puntoEmisionId,
            establecimientoId: this.mainStore.state().establecimientoId,
            userId: orderId > 0 ? e.order.userId : dataForm.vendedores.find((u: any) => u.predeterminado)?.idUsuario ?? 0,
          }
          return {
            ...e,
            order: orderData,
            vendedores: dataForm.vendedores,
            taxes: dataForm.taxes,
            taxRates: dataForm.taxRates,
            tarifas: dataForm.tarifas,
            tarifaId,
            oldTarifaId: tarifaId
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

  onTabChange(event: any) {
    if(this.loading()) return

    this.currentTabIndex = event.index;
    let dataSubcategory = this.subCategorias()[event.index];
    if (dataSubcategory) {
      this.posStoreSvc.state.update(e => {
        return {
          ...e,
          codeSubCategory: dataSubcategory.codigo
        }
      })
      this.dataPagination.update(dp => {
        return {
          ...dp,
          pageIndex: 0,
          pageSize: 25,
          totalRecords: 0
        }
      })
      this.dataItemSearch.update(e => ({ ...e, idSubFamilia: dataSubcategory.idSubFamilia, textSearch: null }));
      this.refresh()
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


  private hasReloadedForNullSearch = false; // Nueva variable para rastrear recarga

  onEnterInputSearch($event: any) {
    this.dataItemSearch.update(e => {
      return {
        ...e,
        textSearch: $event.target.value
      };
    });

    let textSearch = isValidField(this.dataItemSearch().textSearch)

    // Si textSearch es válido
    if (textSearch) {
      this.refresh();
      this.hasReloadedForNullSearch = false;
    }
    else if (!textSearch && !this.hasReloadedForNullSearch) {
      this.refresh(); // Recarga la búsqueda
      this.hasReloadedForNullSearch = true; // Marca como recargado para evitar recargas adicionales
    }
  }


  onBlurTextSearch($event: any) {
    this.dataItemSearch.update(e => {
      return {
        ...e,
        textSearch: $event.target.value
      }
    })
  }



}


