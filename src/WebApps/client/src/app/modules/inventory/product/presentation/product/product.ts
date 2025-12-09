import {
  Component,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChildren,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { ProductPhotoComponent } from '@inventory/product/presentation/components/product-photo/product-photo.component';
import { SubCategoryGroupComponent } from '@inventory/ui/sub-category/components/sub-category-group/sub-category-group.component';
import { ProductKardexModalDirective } from '@inventory/product/presentation/directives/product-kardex-modal.directive';
import { StockService } from '@inventory/data/services/stock.service';
import { CompraHabitualHistorialDirective } from '@purchase/directives/compra-habitual-historial.directive';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import { finalize, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductUseCase } from '@inventory/product/application/use-cases/product.use-case';
import { ProductList } from '@inventory/product/domain/entities/product.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddEditProductDirective } from '@inventory/product/presentation/directives/add-edit-product.directive';
import { DialogService } from '@core/services/dialog.service';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { ProductStock } from '@inventory/product/presentation/components/product-stock/product-stock';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { HasPermissionDirective } from '@core/directives/permission';
import { INVENTORY_MODULES_CODE } from '@inventory/domain/enums/inventory.enum';
import { usePermissions } from '@core/composables/use-permissions';
import { ACTION_ALIASES } from '@core/constants/permission-actions';

@Component({
  selector: 'app-inventory-product',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    SubCategoryGroupComponent,
    AddEditProductDirective,
    CompraHabitualHistorialDirective,
    ProductKardexModalDirective,
    MtxPopoverModule,
    ProductStock,
    DataGrid,
    HasPermissionDirective,
  ],
  templateUrl: './product.html',
  styles: `
    :host ::ng-deep .data-grid {
      height: 400px;
    }
  `,
})
export class Product implements OnInit {
  @ViewChildren('selectElement') selectElements!: QueryList<ElementRef<HTMLSelectElement>>;

  inventory_modules_code = signal(INVENTORY_MODULES_CODE);
  action_aliases = signal(ACTION_ALIASES);
  //usePermissions = usePermissions(this.PRODUCT_CODE);
  dataSearch = {
    filterMode: 4,
    textSearch: null as string | null,
    checkBoxFraccionado: false,
    checkBoxInventario: false,
    status: null,
    byStock: 0,
    bySubFamilia: 0,
    idMarca: 0,
    idMedida: 0,
    idModelo: 0,
    idTipoIva: 0,
  };
  isSearchAdvanced = signal(false);
  subCategorias = signal<any[]>([]);
  medidas = signal<any[]>([]);
  marcas = signal<any[]>([]);
  modelos = signal<any[]>([]);
  tiposIva = signal<any[]>([]);
  stocks = signal<any[]>([]);
  estados = signal<any[]>([]);
  private _productUseCase = inject(ProductUseCase);
  private stockSvc = inject(StockService);
  private tS = inject(ToastrNotificationService);
  private $dialogSvc = inject(DialogService);

  positionStart: any = 'below';
  positionEnd: any = 'center';

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index', showExpand: true },
    {
      header: 'Op.',
      field: 'operation',
    },
    {
      header: 'Descripción',
      field: 'dataDescription',
      width: '300px',
    },
    { header: 'Imagen', field: 's3ObjectUrl', type: 'image' },
    { header: 'SubFamilia', field: 'subFamilia' },
    { header: 'Medida', field: 'medida' },
    { header: 'Stock', field: 'stock' },
    { header: 'Estado', field: 'estado', type: 'boolean' },
  ];
  list = signal<ProductList[]>([]);
  total = signal(0);
  isLoading = signal(false);

  query = {
    page: 0,
    per_page: 10,
  };

  setDataSearch<K extends keyof typeof this.dataSearch>(
    key: K,
    value: (typeof this.dataSearch)[K],
  ) {
    this.dataSearch = {
      ...this.dataSearch,
      [key]: value,
    };
  }

  ngOnInit() {
    this.resetDataAfterFetch();
    this.initLoad()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.toggleSelectsState();
        }),
      )
      .subscribe({
        next: (response) => {
          const [dataForm, responseProduct] = response;
          this.subCategorias.set(dataForm.subCategorias);
          this.medidas.set(dataForm.medidas);
          this.marcas.set(dataForm.marcas);
          this.modelos.set(dataForm.modelos);
          this.tiposIva.set(dataForm.tiposIva);

          this.setResponseGetAll(responseProduct);
        },
        error: (err) => {
          console.error('Error load infrastructure form and products:', err);
        },
      });
  }
  onEnter($event: Event) {
    if (isValidField(this.dataSearch.textSearch)) {
      this.refresh();
    }
  }

  toggleSelectsState(): void {
    this.selectElements?.forEach((selectRef) => {
      selectRef.nativeElement.disabled = this.isLoading();
    });
  }

  refresh() {
    this.getProducts();
  }

  onSelectedSubCategory(id: number) {
    this.setDataSearch('bySubFamilia', id);
    this.getProducts();
  }

  onEmptyDataSubCategory() {
    this.setDataSearch('bySubFamilia', 0);
  }

  async askToUpdateStatus(item: ProductList) {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
        confirmButtonText: 'Sí',
        showDenyButton: true,
        denyButtonText: 'No',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this._productUseCase.updateStatus(item.idArticulo).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateStock(item: ProductList) {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `<small>Está seguro de actualizar el Stock del articulo: <b>${item.descripcion}</b></small>`,
      confirmButtonText: 'Sí',
      showDenyButton: true,
      denyButtonText: 'No',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.stockSvc.put(item.idArticulo).subscribe(this.successResponse);
    }
  }

  onPhotoModal(data: ProductList) {
    const modalRef = this.$dialogSvc.open(ProductPhotoComponent, {
      size: 'lg',
      data,
    });

    modalRef.subscribe((result) => {
      if (result && typeof result === 'object' && result.isRefresh) {
        this.refresh();
      }
    });
  }

  private setResponseGetAll(response: any) {
    const results: ProductList[] = response.products;
    const products = results.map((product, index) => ({
      ...product,
      position: index + 1,
    }));

    this.list.set(products);
    this.total.set(products.length > 0 ? products[0].totalRecords : 0);
  }

  private getDataParams() {
    return {
      bySubFamilia: getValidId(this.dataSearch.bySubFamilia),
      byMedida: getValidId(this.dataSearch.idMedida),
      byMarca: getValidId(this.dataSearch.idMarca),
      byModelo: getValidId(this.dataSearch.idModelo),
      byTipoIva: getValidId(this.dataSearch.idTipoIva),

      pageIndex: this.query.page + 1,
      pageSize: this.query.per_page,
      bySearch: isValidField(this.dataSearch.textSearch),
      status: this.dataSearch.status,
      byStock: this.dataSearch.byStock,
      checkBoxFraccionado: this.dataSearch.checkBoxFraccionado,
      checkBoxInventario: this.dataSearch.checkBoxInventario,
    };
  }

  private resetDataAfterFetch() {
    this.isLoading.set(true);
    this.total.set(0);
    this.toggleSelectsState();
  }

  private initLoad() {
    return forkJoin([
      this._productUseCase.getDataFilter(),
      this._productUseCase.getAll(this.getDataParams()),
    ]);
  }

  private getProducts() {
    if (this.isLoading()) return; // Prevenir múltiples llamadas

    this.resetDataAfterFetch();
    this._productUseCase
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.toggleSelectsState();
        }),
      )
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }

  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.show({
        type: 'success',
        message: response.message,
      });
      this.refresh();
    }
  };

  getNextPage(e: PageEvent) {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    this.refresh();
  }
}
