import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  ColumnDefinition,
  MatDynamicCardComponent,
  MatDynamicTableComponent,
  Pagination,
} from 'acontplus-ui-components';
import { PageEvent } from '@angular/material/paginator';
import { ListBugsUseCase } from '@modules/common/domain/use-cases/bugs/list-bugs.use-case';
import { formatDateString } from '@core/utils/date.util';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BugsList } from '@modules/common/domain/models/bugs.model';

@Component({
  selector: 'app-bugs',
  imports: [
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './bugs.component.html',
  styles: ``,
})
export class BugsComponent {
  private $listUseCase = inject(ListBugsUseCase);

  loading = false;

  dataSource: BugsList[] = [];

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'errorDate', label: 'Fecha Error', type: 'string' },
    { key: 'method', label: 'Método', type: 'string' },
    {
      key: 'errorProcedure',
      label: 'Procedimiento Almacenado',
      type: 'string',
    },
    { key: 'errorMessage', label: 'Mensaje Error', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  bugsPagination: Pagination = {
    totalRecords: 0,
    pageSize: 5,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 50],
    maxSize: 0,
    getTotalPages: function (): number {
      throw new Error('Function not implemented.');
    },
    updatePageSize: function (newPageSize: number): void {
      throw new Error('Function not implemented.');
    },
    updateFromPaginatorEvent: function (event: any): void {
      throw new Error('Function not implemented.');
    },
  };

  dataSearch = {
    fromDate: formatDateString(new Date()),
    toDate: formatDateString(new Date()),
  };

  refresh() {
    this.getList();
  }

  getList() {
    let dataSearch = {
      pageIndex: this.bugsPagination.pageIndex + 1,
      pageSize: this.bugsPagination.pageSize,
      fromDate: this.dataSearch.fromDate,
      toDate: this.dataSearch.toDate,
    };
    this.$listUseCase.execute(dataSearch).subscribe((response) => {
      this.dataSource = response.data;
      this.bugsPagination.totalRecords = response.totalRecords;
    });
  }

  ngOnInit() {
    this.getList();
  }

  handlePageEvent(event: PageEvent) {
    this.bugsPagination.pageIndex = event.pageIndex;
    this.bugsPagination.pageSize = event.pageSize;
    this.refresh();
  }
}
