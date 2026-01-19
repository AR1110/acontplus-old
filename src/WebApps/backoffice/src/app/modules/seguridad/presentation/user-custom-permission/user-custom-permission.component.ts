import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  ColumnDefinition,
  AdvancedDialogService,
  MatDynamicTableComponent,
  Pagination,
  MatDynamicCardComponent,
} from 'acontplus-ui-components';
import { ListUserCustomPermissionUseCase } from '@modules/seguridad/domain/use-cases/user-custom-permission/list-user-custom-permission.use-case';
import { AddEditUserCustomPermissionComponent } from '@modules/seguridad/presentation/user-custom-permission/add-edit-user-custom-permission/add-edit-user-custom-permission.component';
import { UserCustomPermissionList } from '@modules/seguridad/domain/models/user-custom-permission.model';

@Component({
  selector: 'app-user-custom-permission',
  imports: [
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './user-custom-permission.component.html',
  styles: ``,
})
export class UserCustomPermissionComponent {
  private $listUserCustomPermissionUseCase = inject(
    ListUserCustomPermissionUseCase,
  );

  private readonly advancedDialogService = inject(AdvancedDialogService);
  loading = false;

  dataSource = signal<any>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomMenu', label: 'Menú', type: 'string' },
    { key: 'nomSubMenu', label: 'SubMenú', type: 'string' },
    { key: 'nomAction', label: 'Acción', type: 'string' },
    { key: 'nomSecurityType', label: 'Seguridad', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  permissionsPagination: Pagination = {
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

  refresh() {
    this.getList();
  }

  private getList() {
    this.$listUserCustomPermissionUseCase.execute({}).subscribe((response) => {
      console.log(response);
      this.dataSource.set(response.data);
    });
  }

  async openAddEdit(data?: UserCustomPermissionList) {
    const ref = await this.advancedDialogService.openInWrapper({
      title: data
        ? 'Editar Permiso Personalizado'
        : 'Agregar Permiso Personalizado',
      component: AddEditUserCustomPermissionComponent,
      icon: 'close',
      data: data ? structuredClone(data) : undefined,
    });
    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getList();
      }
    });
  }

  ngOnInit() {
    this.getList();
  }

  handlePageEvent(event: PageEvent) {
    this.permissionsPagination.pageIndex = event.pageIndex;
    this.permissionsPagination.pageSize = event.pageSize;
    this.refresh();
  }
}
