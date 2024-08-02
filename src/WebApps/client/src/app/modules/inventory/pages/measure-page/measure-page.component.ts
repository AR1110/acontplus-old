import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MeasureAddEditDirective } from '@modules/inventory/directives/measure-add-edit.directive';
import { MeasureRead } from '@modules/inventory/models/measure.model';
import { MeasureService } from '@modules/inventory/services/measure.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { Pagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';

@Component({
  selector: 'app-measure-page',
  standalone: true,
  imports: [
    FormsModule,
    NgbPaginationModule,
    BreadcrumbComponent,
    MeasureAddEditDirective,
    ActionAddDirective,
    PrimaryStatusPipe
  ],
  templateUrl: './measure-page.component.html',
  styles: ``
})
export class MeasurePageComponent {
  measureSvc = inject(MeasureService);

  measures:MeasureRead[] = [];
  pagination = new Pagination();

  onResultModal(){
    this.getMeasures();
  }

  getMeasures(){
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize
    }
    this.measures = [];
    this.measureSvc.getAll(params).subscribe(response=>{
      this.measures = response;
      if(this.measures.length>0){
        this.pagination.totalRecords = this.measures[0].totalRecords;
      }
    })
  }

  ngOnInit(){
    this.getMeasures();
  }

  pageChanged(): void {
    this.getMeasures();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
    this.getMeasures();
  }
}
