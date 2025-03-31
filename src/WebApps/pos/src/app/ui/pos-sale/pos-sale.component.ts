import { Component, computed, inject, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { ItemService } from '@data/repositories/item/item.service';
import { Pagination } from '@domain/models/pagination.model';
import { ItemRead } from '@domain/models/item.model';
import {  PageEvent } from '@angular/material/paginator';
import { SubCategory } from '@domain/models/inventory/subcategory.model';
import { MatCardModule } from '@angular/material/card';
import {
  PosStoreService,
  posStoreStateInitial,
} from '@ui/store/pos-store.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MainStoreService } from '@domain/services/main-store.service';
import { SUB_CATEGORY_CODE } from '@domain/enums/main.enum';
import { FormsModule } from '@angular/forms';
import { getValidId, isValidField } from '@domain/utils/utils';
import { Order } from '@domain/models/order.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ConfigUseCase } from '@domain/use-cases/config.use-case';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesComponent } from './categories/categories.component';
import { LoadMoreComponent } from './load-more/load-more.component';
import { DialogService } from '@/domain/services/dialog.service';
import { ProductsComponent } from './products/products.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { CartOverlayService } from '../store/cart-overlay.service';
@Component({
  selector: 'app-pos-sale',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CategoriesComponent,
    LoadMoreComponent,
    ProductsComponent,
    PromotionsComponent,
  ],
  templateUrl: './pos-sale.component.html',
  styleUrl: './pos-sale.component.scss',
})
export class PosSaleComponent {
  private posStoreSvc = inject(PosStoreService);
  private mainStore = inject(MainStoreService);
  private _configUseCase = inject(ConfigUseCase);
  private itemSvc = inject(ItemService);
  public dialog = inject(DialogService);
  public $cartOverlaySvc = inject(CartOverlayService);

  private establecimientoId = this.mainStore.select('establecimientoId');
  private codEstab = this.mainStore.select('codEstab');

  currentTabIndex: number = 0;

  subCategorias = signal<SubCategory[]>([
    {
      idSubFamilia: 0,
      codigo: '',
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
    },
  ]);
  items = signal<ItemRead[]>([]);
  dataPagination = signal(new Pagination());

  dataItemSearch = signal({
    idSubFamilia: 0,
    textSearch: null,
  });
  loading = computed(() => {
    return (
      this.posStoreSvc.state().isLoading ||
      this.posStoreSvc.state().isSelectedItem
    );
  });

  constructor() {
    this.posStoreSvc.state.update((e) => {
      if (e.order?.orderId > 0) {
        return e;
      }
      return posStoreStateInitial();
    });
  }

  isPromotion = computed(() => {
    return this.posStoreSvc.state().codeSubCategory === SUB_CATEGORY_CODE.PROM;
  });

  isCombos = computed(() => {
    return this.posStoreSvc.state().codeSubCategory === SUB_CATEGORY_CODE.COM;
  });

  refresh() {
    if (this.loading()) return;

    if (this.isPromotion()) {
      this.getPromotions();
    } else if (this.isCombos()) {
      this.getCombos();
    } else {
      this.getItems();
    }
  }

  getDataFormInit() {
    if (!this.codEstab() || !(this.establecimientoId() > 0)) {
      console.log('no se encontró datos del establecimiento');
      return;
    }
    let params = {
      codEstab: this.codEstab(),
      idEstablecimiento: this.establecimientoId(),
    };
    let paramsItem = {
      pageIndex: this.dataPagination().pageIndex + 1,
      pageSize: this.dataPagination().pageSize,
    };

    return forkJoin([
      this._configUseCase.getDataForm(params),
      this.itemSvc.getAll(paramsItem),
    ]);
  }

  private getParams() {
    return {
      pageIndex: this.dataPagination().pageIndex + 1,
      pageSize: this.dataPagination().pageSize,
      idSubFamilia: getValidId(this.dataItemSearch().idSubFamilia),
      textSearch: isValidField(this.dataItemSearch().textSearch),
    };
  }

  getItems() {
    this.items.set([]);
    this.setLoading(true);
    this.itemSvc
      .getAll(this.getParams())
      .pipe(finalize(() => this.setLoading(false)))
      .subscribe({
        next: (response) => {
          this.items.set(response.items);
          this.setTotalRecords();
        },
      });
  }

  getCombos() {
    this.items.set([]);
    this.setLoading(true);
    this.itemSvc.getCombos(this.getParams()).subscribe({
      next: (response) => {
        this.setLoading(false);
        this.items.set(response.items);
        this.setTotalRecords();
      },
      error: (err) => {
        console.log(err);
        this.setLoading(false);
      },
    });
  }

  getPromotions() {
    this.posStoreSvc.getPromotions(this.establecimientoId());
  }

  setTotalRecords() {
    if (this.items().length > 0) {
      this.dataPagination.update((e) => {
        return {
          ...e,
          totalRecords: this.items()[0].totalRecords,
        };
      });
    }
  }

  setLoading(isLoading: boolean) {
    this.posStoreSvc.state.update((e) => ({
      ...e,
      isLoading,
    }));
  }

  ngOnInit() {
    let orderId = this.posStoreSvc.state().order?.orderId || 0;
    // if (!(orderId > 0)) {
    //   this.dialog.open(TableModalComponent, {
    //     size: 'xl',
    //   });
    // }
    if (this.posStoreSvc.state().isLoading) return;

    this.setLoading(true);
    this.getDataFormInit()
      ?.pipe(finalize(() => this.setLoading(false)))
      .subscribe((response) => {
        this.setLoading(false);
        const [dataForm, dataItem] = response;

        this.posStoreSvc.state.update((e) => {
          let tarifaId =
            dataForm.tarifas.find((t) => t.defaultTarifa)?.idTarifa ?? 0;
          let orderData: Order = {
            ...e.order,
            puntoEmisionId: this.mainStore.state().puntoEmisionId,
            establecimientoId: this.mainStore.state().establecimientoId,
            userId:
              orderId > 0
                ? e.order.userId
                : dataForm.vendedores.find((u: any) => u.predeterminado)
                    ?.idUsuario ?? 0,
          };
          return {
            ...e,
            isModulePos: true,
            order: orderData,
            vendedores: dataForm.vendedores,
            taxes: dataForm.taxes,
            taxRates: dataForm.taxRates,
            tarifas: dataForm.tarifas,
            tarifaId,
            oldTarifaId: tarifaId,
            pendingOrders: dataForm.pendingOrders,
          };
        });

        this.subCategorias.update((sc) => [...sc, ...dataForm.subCategorias]);
        this.items.set(dataItem.items);
        this.setTotalRecords();
      });
  }

  ngAfterViewInit() {
    let orderId = this.posStoreSvc.state().order?.orderId || 0;
    setTimeout(() => {
      if (orderId > 0 && !this.$cartOverlaySvc.overlayState()) {
        document.getElementById('cart-button-id')?.click();
      }
    }, 1000);
  }

  onTabChange(event: any) {
    if (this.loading()) return;

    this.currentTabIndex = event.index;
    let dataSubcategory = this.subCategorias()[event.index];
    if (dataSubcategory) {
      this.posStoreSvc.state.update((e) => {
        return {
          ...e,
          codeSubCategory: dataSubcategory.codigo,
        };
      });
      this.dataPagination.update((dp) => {
        return {
          ...dp,
          pageIndex: 0,
          pageSize: 25,
          totalRecords: 0,
        };
      });
      this.dataItemSearch.update((e) => ({
        ...e,
        idSubFamilia: dataSubcategory.idSubFamilia,
        textSearch: null,
      }));
      this.refresh();
    }
  }

  handlePageEvent(e: PageEvent) {
    this.dataPagination.update((dp) => {
      return {
        ...dp,
        totalRecords: e.length,
        pageIndex: e.pageIndex,
        pageSize: e.pageSize,
      };
    });
    this.getItems();
  }

  private hasReloadedForNullSearch = false; // Nueva variable para rastrear recarga

  onEnterInputSearch($event: any) {
    this.dataItemSearch.update((e) => {
      return {
        ...e,
        textSearch: $event.target.value,
      };
    });

    let textSearch = isValidField(this.dataItemSearch().textSearch);

    // Si textSearch es válido
    if (textSearch) {
      this.refresh();
      this.hasReloadedForNullSearch = false;
    } else if (!textSearch && !this.hasReloadedForNullSearch) {
      this.refresh(); // Recarga la búsqueda
      this.hasReloadedForNullSearch = true; // Marca como recargado para evitar recargas adicionales
    }
  }

  onBlurTextSearch($event: any) {
    this.dataItemSearch.update((e) => {
      return {
        ...e,
        textSearch: $event.target.value,
      };
    });
  }

  //items to cart

  onLoadMore() {
    console.log('load more');
    this.dataPagination.update((dp) => {
      return {
        ...dp,
        pageIndex: dp.pageIndex + 1,
      };
    });
    if (!this.isCombos() || !this.isPromotion()) {
      this.setLoading(true);
      this.itemSvc
        .getAll(this.getParams())
        .pipe(finalize(() => this.setLoading(false)))
        .subscribe({
          next: (response) => {
            this.items.set([...this.items(), ...response.items]);
            this.setTotalRecords();
          },
        });
    }
  }

  ngOnDestroy() {
    this.posStoreSvc.state.update((e) => {
      return {
        ...posStoreStateInitial(),
        isModulePos: false,
      };
    });
  }
}
