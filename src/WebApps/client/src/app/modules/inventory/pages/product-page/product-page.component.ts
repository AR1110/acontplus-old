
import { Component, ElementRef, ViewChild, inject } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { hideLoader, showLoader } from '@core/utils/loader';
import { ProductAddEditDirective } from '@modules/inventory/directives';
import { SubCategoryModalDirective } from '@modules/inventory/directives/sub-category.directive';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { MeasureSelectHtmlOnly } from '@modules/inventory/models/measure.model';
import { SubCategorySelectHtmlOnly } from '@modules/inventory/models/sub-category.model';
import { ProductService } from '@modules/inventory/services/product.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/class/Pagination';

type Product = {
  position: number
  idArticulo: number
  idMedida: number
  code_unique: string
  codigo: string
  descripcion: string
  precioCosto: number
  estado: boolean
  stock: number
  observaciones: string
  subFamilia: string
  medida: string
  marca: string
  modelo: string
  tipoIva: string
  tipoArticulo: string
  style: string
  precioSinSubsidio: number
  stockMinimo: number
  totalRecords: number
  s3ObjectKey: string
  s3ObjectUrl: string
}

@Component({
  selector: 'inventory-product-page',
  standalone: true,
  imports: [
    InventoryModule,
    FormsModule,
    ProductAddEditDirective,
    MatTableModule,
    MatPaginatorModule,
    NgbDropdownModule,
    SubCategoryModalDirective
  ],
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  private readonly productSvc = inject(ProductService);

  @ViewChild('productsTabulator') myTabularTable!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['op', 'position', 's3ObjectUrl', 'codigo', 'descripcion', 'medida', 'subFamilia', 'stock', 'estado'];
  dataSource = new MatTableDataSource<Product>();



  public subCategorias: Array<SubCategorySelectHtmlOnly> = [];
  public measures: Array<MeasureSelectHtmlOnly> = [];


  pagination = new Pagination();


  private initLoad() {
    try {
      showLoader();
      this.productSvc.getDataFilter().subscribe({
        next: (response) => {
          hideLoader();
          const {
            subCategorias,
            medidas,
            marcas,
            modelos,
            tarifasImpuesto
          } = response;

          this.subCategorias = subCategorias;
          this.measures = medidas;
        },
        error(err) {
          hideLoader()
          console.log(err)
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  private getProducts() {
    try {
      let params = {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }
      this.productSvc.getAll(params).subscribe({
        next: (response) => {
          let results: Array<Product> = JSON.parse(response)[0]
          let products = results.map((product, index) => {
            return {
              ...product,
              position: index + 1
            }
          });
          console.log(products)
          this.dataSource = new MatTableDataSource(products);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        complete() {
          hideLoader();
        },
        error() {
          hideLoader();
        }
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

  ngOnInit() {
    // this.initLoad();
    // this.getProducts();
  }



}

