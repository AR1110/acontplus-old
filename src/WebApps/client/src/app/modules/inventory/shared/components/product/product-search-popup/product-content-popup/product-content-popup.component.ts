import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '@modules/inventory/services/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/class/pagination';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-content-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './product-content-popup.component.html',
  styleUrl: './product-content-popup.component.scss',
})
export class ProductContentPopupComponent   {
  modal = inject(NgbActiveModal)

  productSvc = inject(ProductService)
  dataSearch = {
    textSearch: ''
  }

  displayedColumns: string[] = [];
  mainColumns = [
    { columnDef: 'position', header: 'No.',  },
    { columnDef: 'codigo', header: 'Código', },
    { columnDef: 'descripcion', header: 'Descripción', },
    { columnDef: 'stock', header: 'Stock', },
    { columnDef: 'iva', header: 'Iva', },
    { columnDef: 'subFamilia', header: 'SubFamilia', },
    { columnDef: 'medida', header: 'Medida', },
    { columnDef: 'marca', header: 'Marca', },
  ]
  columns = structuredClone(this.mainColumns)

  dataSource:any[] = [];

  productTarifas:any=[];

  pagination = new Pagination()

  pageEvent!: PageEvent;

  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    this.displayedColumns = this.columns.map(x => x.columnDef);    // pre-fix static

   }


  applyFilter(){
    let params = {
      textSearch: this.dataSearch.textSearch,
      pageIndex: this.pagination.pageIndex+1,
      pageSize: this.pagination.pageSize
    }
    console.log('serach')
    this.productTarifas = [];
    this.productSvc.search(params).subscribe({
      next: (response)=> {
        let results = structuredClone(response);

        this.columns = structuredClone(this.mainColumns)
        this.displayedColumns = this.columns.map(x => x.columnDef);    // pre-fix static
        this.pagination.totalRecords= 0;
          if(results.length>0){
            let dataResult = results[0];
            this.productTarifas = dataResult.tarifas;
            this.pagination.totalRecords = dataResult.totalRecords;
          }

          for(let item of this.productTarifas){
            this.columns.push({
              header: item.tarifa,
              columnDef: item.tarifa,
            })
          }


        this.displayedColumns = this.columns.map(x => x.columnDef);

        this.dataSource = results.map((item:any)=>{
          let {tarifas, ...restItem} = item;
           const tarifasObj = tarifas.reduce((obj:any, item:any) => {
            obj[item.tarifa] = item.precio;
            return obj;
          }, {});
          return {
            ...restItem,
            ...tarifasObj
          }
        })
        console.log(results)

        console.log(this.displayedColumns)
      },
      error(err) {
          console.log(err)
      },
    })
  }


  handlePageEvent(e: PageEvent) {
    console.log(e)
    this.pageEvent = e;
  //  this.pagination.totalRecords = e.length;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.applyFilter()
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pagination.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }


}
