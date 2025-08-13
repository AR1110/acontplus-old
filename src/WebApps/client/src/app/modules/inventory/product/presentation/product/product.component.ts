import {
  Component,
  ElementRef,
  inject,
  model,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewChildren,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { ProductPhotoComponent } from '@inventory/product/presentation/components/product-photo/product-photo.component';
import { SubCategoryGroupComponent } from '@inventory/ui/sub-category/components/sub-category-group/sub-category-group.component';
import { ProductKardexModalDirective } from '@inventory/product/presentation/directives/product-kardex-modal.directive';
import { StockService } from '@inventory/data/services/stock.service';
import { CompraHabitualHistorialDirective } from '@purchase/directives/compra-habitual-historial.directive';

import { MatPagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import { finalize, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductUseCase } from '@inventory/product/application/use-cases/product.use-case';
import { ProductList } from '@inventory/product/domain/entities/product.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MECHANICAL_STATUS } from '@mechanical/domain/enums/mechanical.enum';
import { AddEditProductDirective } from '@inventory/product/presentation/directives/add-edit-product.directive';
import { DialogService } from '@core/services/dialog.service';
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";

@Component({
  selector: 'inventory-product',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    SubCategoryGroupComponent,
    MatDynamicTableComponent,
    MatDynamicCardComponent,
    AddEditProductDirective,
    CompraHabitualHistorialDirective,
    ProductKardexModalDirective,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('selectElement') selectElements!: QueryList<
    ElementRef<HTMLSelectElement>
  >;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  pagination = signal(new MatPagination());
  dataSource = new MatTableDataSource<ProductList>();
  isLoadingResults = false;
  pageEvent!: PageEvent;
  dataSearch = model({
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
  });
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
  private wasEmptyBefore = false; // Indica si alguna vez el campo estuvo vacío

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 's3ObjectUrl', label: 'Imagen', type: 'image' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'subFamilia', label: 'SubFamilia', type: 'string' },
    { key: 'medida', label: 'Medida', type: 'string' },
    { key: 'stock', label: 'Stock', type: 'string' },
    { key: 'status', label: 'Estado', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K]
  ) {
    this.dataSearch.update((ds) => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  ngOnInit() {
    this.resetDataAfterFetch();
    this.initLoad()
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
          this.toggleSelectsState();
        })
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

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

  onEnter($event: Event){
    if( isValidField(this.dataSearch().textSearch)){
      this.refresh()
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchValue = isValidField(target.value);
    this.setDataSearch('textSearch', searchValue);

    if (!searchValue) {
      if (this.wasEmptyBefore) {
        return;
      }

      this.wasEmptyBefore = true;
      this.applyFilter();
    } else {
      this.wasEmptyBefore = false;
      this.applyFilter();
    }
  }

  applyFilter(): void {
    this.getProducts();
  }

  toggleSelectsState(): void {
    this.selectElements?.forEach((selectRef) => {
      selectRef.nativeElement.disabled = this.isLoadingResults;
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

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.getProducts();
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
        this._productUseCase
          .updateStatus(item.idArticulo)
          .subscribe(this.successResponse);
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

    this.dataSource = new MatTableDataSource(products);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (products.length > 0) {
      this.pagination.update((p) => ({
        ...p,
        totalRecords: response.totalRecords,
      }));
    }
  }

  private getDataParams() {
    const params = {
      bySubFamilia: getValidId(this.dataSearch().bySubFamilia),
      byMedida: getValidId(this.dataSearch().idMedida),
      byMarca: getValidId(this.dataSearch().idMarca),
      byModelo: getValidId(this.dataSearch().idModelo),
      byTipoIva: getValidId(this.dataSearch().idTipoIva),

      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      bySearch: isValidField(this.dataSearch().textSearch),
      status: this.dataSearch().status,
      byStock: this.dataSearch().byStock,
      checkBoxFraccionado: this.dataSearch().checkBoxFraccionado,
      checkBoxInventario: this.dataSearch().checkBoxInventario,
    };
    return params;
  }

  private resetDataAfterFetch() {
    this.isLoadingResults = true;
    this.pagination.update((p) => ({
      ...p,
      totalRecords: 0,
    }));

    this.toggleSelectsState();
  }

  private initLoad() {
    return forkJoin([
      this._productUseCase.getDataFilter(),
      this._productUseCase.getAll(this.getDataParams()),
    ]);
  }

  private getProducts() {
    if (this.isLoadingResults) return; // Prevenir múltiples llamadas

    this.resetDataAfterFetch();
    this._productUseCase
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
          this.toggleSelectsState();
        })
      )
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }

  private successResponse = (response: ApiResponse) => {
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
  protected readonly statusTab = MECHANICAL_STATUS;
}
