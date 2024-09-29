import {
  Component,
  ElementRef,
  inject,
  model,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
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
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { ProductPhotoComponent } from '@modules/inventory/components/product/product-photo/product-photo.component';
import { SubCategoryGroupComponent } from '@modules/inventory/components/sub-category/sub-category-group/sub-category-group.component';
import { ProductKardexModalDirective } from '@modules/inventory/directives/product/product-kardex-modal.directive';
import { ProductAddEditDirective } from '@modules/inventory/directives/product/product-list.directive';
import { ProductService } from '@modules/inventory/services/product.service';
import { StockService } from '@modules/inventory/services/stock.service';
import { CompraHabitualHistorialDirective } from '@modules/purchase/directives/compra-habitual-historial.directive';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { MatPagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';
import { finalize, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

type Product = {
  position: number;
  idArticulo: number;
  idMedida: number;
  code_unique: string;
  codigo: string;
  descripcion: string;
  precioCosto: number;
  estado: boolean;
  stock: number;
  observaciones: string;
  subFamilia: string;
  medida: string;
  marca: string;
  modelo: string;
  tipoIva: string;
  tipoArticulo: string;
  style: string;
  precioSinSubsidio: number;
  stockMinimo: number;
  totalRecords: number;
  s3ObjectKey: string;
  s3ObjectUrl: string;
};

@Component({
  selector: 'inventory-product-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    ActionAddDirective,
    PrimaryStatusPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    CustomTableContainerComponent,
    SubCategoryGroupComponent,
    ProductAddEditDirective,
    CompraHabitualHistorialDirective,
    ProductKardexModalDirective,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('selectElement') selectElements!: QueryList<
    ElementRef<HTMLSelectElement>
  >;
  displayedColumns: string[] = [
    'index',
    'op',
    's3ObjectUrl',
    'codigo',
    'descripcion',
    'medida',
    'subFamilia',
    'stock',
    'estado',
  ];
  pagination = signal(new MatPagination());
  dataSource = new MatTableDataSource<Product>();
  isLoadingResults = false;
  pageEvent!: PageEvent;
  dataSearch = model({
    textSearch: null as string | null,
    checkBoxFraccionado: false,
    checkBoxInventario: false,
    status: null,
    byStock: null,
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
  private productSvc = inject(ProductService);
  private stockSvc = inject(StockService);
  private tS = inject(ToasterService);
  private modalSvc = inject(ModalService);
  private wasEmptyBefore: boolean = false; // Indica si alguna vez el campo estuvo vacío

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K],
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

          this.successResponseProductAll(responseProduct);
        },
        error: (err) => {
          console.error('Error load data form and products:', err);
        },
      });
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

  async askToUpdateStatus(item: Product) {
    try {
      let { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
        confirmButtonText: 'Sí',
        showDenyButton: true,
        denyButtonText: 'No',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.productSvc
          .updateStatus(item.idArticulo)
          .subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateStock(item: Product) {
    let { isConfirmed } = await Swal.fire({
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

  onPhotoModal(data: Product) {
    let modalRef = this.modalSvc.open(ProductPhotoComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.params = data;

    modalRef.result.then((result) => {
      if (result && typeof result === 'object' && result.isRefresh) {
        this.refresh();
      }
    });
  }

  private successResponseProductAll(response: any) {
    let results: Array<Product> = response.products;
    let products = results.map((product, index) => ({
      ...product,
      position: index + 1,
    }));

    this.dataSource = new MatTableDataSource(products);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (products.length > 0) {
      this.pagination.update((p) => ({
        ...p,
        totalRecords: products[0].totalRecords,
      }));
    }
  }

  private getDataParams() {
    let params = {
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
      this.productSvc.getDataFilter(),
      this.productSvc.getAll(this.getDataParams()),
    ]);
  }

  private getProducts() {
    if (this.isLoadingResults) return; // Prevenir múltiples llamadas

    this.resetDataAfterFetch();
    this.productSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
          this.toggleSelectsState();
        }),
      )
      .subscribe((response) => {
        this.successResponseProductAll(response);
      });
  }

  private successResponse = (response: ApiResponse) => {
    if (response.code === '0') {
      this.tS.toastr({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.toastr({
        type: 'success',
        message: response.message,
      });
      this.refresh();
    }
  };
}
