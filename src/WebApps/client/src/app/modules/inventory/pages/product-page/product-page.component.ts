import { Component, inject, signal, ViewChild } from "@angular/core"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatPaginator, PageEvent } from "@angular/material/paginator"
import { MatSort } from "@angular/material/sort"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component"
import { CustomTableContainerComponent } from "@core/components/custom-table-container/custom-table-container.component"
import { ToasterService } from "@core/services/toaster.service"
import { ProductAddEditDirective } from "@modules/inventory/directives/product/product-list.directive"
import { ProductService } from "@modules/inventory/services/product.service"
import { ActionAddDirective } from "@shared/directives/permission/action-add.directive"
import { MatPagination } from "@shared/models/pagination.model"
import { PrimaryStatusPipe } from "@shared/pipe/primary-status.pipe"
import Swal from "sweetalert2"



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
    BreadcrumbComponent,
    ActionAddDirective,
    PrimaryStatusPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    CustomTableContainerComponent,
    ProductAddEditDirective
  ],
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent {

  productSvc = inject(ProductService);
  private tS = inject(ToasterService)
  pagination = signal(new MatPagination());


  dataSource = new MatTableDataSource<Product>();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




  pageEvent!: PageEvent;



  displayedColumns: string[] = ['index','op', 's3ObjectUrl', 'codigo', 'descripcion', 'medida', 'subFamilia', 'stock', 'estado'];




  private initLoad() {
    // try {
    //   showLoader();
    //   this.productSvc.getDataFilter().subscribe({
    //     next: (response) => {
    //       hideLoader();
    //       const {
    //         subCategorias,
    //         medidas,
    //         marcas,
    //         modelos,
    //         tarifasImpuesto
    //       } = response;

    //       this.subCategorias = subCategorias;
    //       this.measures = medidas;
    //     },
    //     error(err) {
    //       hideLoader()
    //       console.log(err)
    //     },
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
  }

  private getProducts() {
    try {
      let params = {
        pageIndex: this.pagination().pageIndex + 1,
        pageSize: this.pagination().pageSize
      }
      this.isLoadingResults = true;
      this.productSvc.getAll(params).subscribe(
        (response) => {
          this.isLoadingResults = false;
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

      })
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {
    // this.initLoad();
     this.getProducts();
  }


  refresh() {
    this.getProducts();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pagination.update(pag => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      }
    })
    this.getProducts();
  }


  askToDelete(data: any) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
      }).then(result => {

      })
    } catch (error) {
      console.log(error)
    }
  }

}

