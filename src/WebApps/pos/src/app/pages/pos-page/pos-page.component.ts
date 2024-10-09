
import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
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
import { PromotionsComponent } from './components/promotions/promotions.component';
import { SUB_CATEGORY_CODE } from '@/enums/main.enum';
import { Dialog } from '@angular/cdk/dialog';
import { TableModalComponent } from './components/table-modal/table-modal.component';
import { FormsModule } from '@angular/forms';
import { isValidField } from '@/core/utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    AsyncPipe,
    PromotionsComponent,
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

  public dialog = inject(Dialog)

  selectedSubCategoryIndex = 0;

  private establecimientoId = this.mainStore.select("establecimientoId");
  private codEstab = this.mainStore.select("codEstab");

  @ViewChild('tabGroup', { static: false }) tabGroup!: MatTabGroup;

  private startX: number = 0;
  private endX: number = 0;

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
      const dialogRef = this.dialog.open(TableModalComponent, {
        width: '100vw',
        height: '100vh',
        panelClass: 'full-screen-cdk-dialog',
      });

    }

    this.setLoading(true)
    this.getDataFormInit()?.subscribe({
      next: response => {
        this.setLoading(false)
        const [dataForm, dataItem] = response;

        this.posStoreSvc.state.update(e => {
          let orderData: Order = {
            ...e.order,
            puntoEmisionId: this.mainStore.state().puntoEmisionId,
            establecimientoId: this.mainStore.state().establecimientoId,
            userId: orderId > 0 ? e.order.userId : dataForm.vendedores.find((u: any) => u.predeterminado)?.idUsuario ?? 0
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




  ngAfterViewInit() {
    const element = this.tabGroup._elementRef.nativeElement;

    if (element) {
      element.addEventListener('touchstart', this.onTouchStart.bind(this));
      element.addEventListener('touchend', this.onTouchEnd.bind(this));
    } else {
      console.error('Tab group element not found');
    }
  }

  private onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  private onTouchEnd(event: TouchEvent) {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    if (this.endX - this.startX < -50) {
      this.nextTab();  // Swipe left
    } else if (this.endX - this.startX > 50) {
      this.previousTab();  // Swipe right
    }
  }

  private nextTab() {
    const index = this.tabGroup.selectedIndex ?? 0;
    if (index < this.tabGroup._tabs.length - 1) {
      this.tabGroup.selectedIndex = index + 1;
    }
  }

  private previousTab() {
    const index = this.tabGroup.selectedIndex ?? 0;
    if (index > 0) {
      this.tabGroup.selectedIndex = index - 1;
    }
  }


}


