import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MeasureService } from '@modules/inventory/services/measure.service';
import { MeasureAddEditDirective } from '@modules/inventory/shared/directives/measure-add-edit.directive';
import { Pagination } from '@shared/class/pagination';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';

@Component({
  selector: 'app-measure-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MeasureAddEditDirective,
    ActionAddDirective
  ],
  templateUrl: './measure-page.component.html',
  styles: ``
})
export class MeasurePageComponent {
  measureSvc = inject(MeasureService);

  measures:any[] = [];
  pagination = new Pagination();

  getMeasures(){
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize
    }
    this.measureSvc.getAll(params).subscribe({
      next: (response) =>{
          console.log(response)
      },
    })
  }

  ngOnInit(){
    this.getMeasures();
  }

}
