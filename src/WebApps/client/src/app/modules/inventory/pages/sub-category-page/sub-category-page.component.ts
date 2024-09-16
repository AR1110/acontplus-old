import { Component, inject, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { CustomTableContainerComponent } from "@core/components/custom-table-container/custom-table-container.component";
import { SubCategoryModalDirective } from "@modules/inventory/directives/sub-category.directive";
import { SubCategoryService } from "@modules/inventory/services/sub-category.service";
import { ActionAddDirective } from "@shared/directives/permission/action-add.directive";
import { MatPagination } from "@shared/models/pagination.model";
import { PrimaryStatusPipe } from "@shared/pipe/primary-status.pipe";

@Component({
  selector: 'app-subcategory-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ActionAddDirective,
    PrimaryStatusPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
    SubCategoryModalDirective
  ],
  templateUrl: './sub-category-page.component.html',

})
export class SubCategoryPageComponent {

  private subCategorySvc = inject(SubCategoryService);
  pagination = signal(new MatPagination());

  displayedColumns: string[] = ['index', 'op','nombreFamilia','img', 'code', 'description', 'estado'];

  dataSource = new MatTableDataSource<any>();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




  pageEvent!: PageEvent;

  onResultModal($event: any){
    this.refresh()
  }

  getSubcategories() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize
    }
    this.isLoadingResults = true;

    this.subCategorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(categories);
      //  this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if(this.dataSource.data.length>0){
          this.pagination.update(e=>{
            return {
              ...e,
              totalRecords: this.dataSource.data[0].totalRecords
            }
          })
        }
      },
      error:(err)=> {
        this.isLoadingResults = false;
        console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getSubcategories()
  }

  refresh() {
    this.getSubcategories();
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
    this.getSubcategories();
  }

}
