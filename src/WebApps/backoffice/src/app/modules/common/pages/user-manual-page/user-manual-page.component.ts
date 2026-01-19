import { Component, inject } from '@angular/core';
import { UserManual } from '@modules/common/domain/models/user-manual.model';
import { UserManualService } from '@modules/common/services/user-manual.service';
import { UserManualAddEditDialogComponent } from '@modules/common/user-manual/user-manual-add-edit-dialog/user-manual-add-edit-dialog.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  AdvancedDialogService,
  ColumnDefinition,
  MatDynamicTableComponent,
  Pagination,
} from 'acontplus-ui-components';
import Swal from 'sweetalert2';
import {  PageEvent } from '@angular/material/paginator';
import {MatInput} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-user-manual-page',
  imports: [
    BreadcrumbComponent,

    MatButton,
    MatCard,
    MatCardContent,
    MatDynamicTableComponent,
    MatIcon,
    MatMenuTrigger,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatInput,
    MatFormFieldModule
  ],
  templateUrl: './user-manual-page.component.html',
  styles: ``,
})
export class UserManualPageComponent {
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'userManualTypeName', label: 'Tipo', type: 'string' },
    { key: 'menuName', label: 'Menu/Modulo', type: 'string' },
    { key: 'title', label: 'Título', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  data = {} as UserManual;

  userManuals: UserManual[] = [];
  userManualPaginationConfig: Pagination = {
    totalRecords: 0,
    pageSize: 5,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 50],
    maxSize: 0,
    getTotalPages: function (): number {
      throw new Error('Function not implemented.');
    },
    updatePageSize: function (newPageSize: number): void {
      console.log(newPageSize);
      throw new Error('Function not implemented.');
    },
    updateFromPaginatorEvent: function (event: any): void {
      console.log('updateFromPaginatorEvent', event);
      throw new Error('Function not implemented.');
    },
  };

  private readonly advancedDialogService = inject(AdvancedDialogService);
  private readonly _userManualService = inject(UserManualService);

  loadData() {
    const obj = {
      pageIndex: this.userManualPaginationConfig.pageIndex + 1,
      pageSize: this.userManualPaginationConfig.pageSize,
    };
    this._userManualService.get(obj).subscribe((response) => {
      this.userManuals = response.userManuals;
      this.userManualPaginationConfig.pageIndex =
        this.userManualPaginationConfig.pageIndex - 1;
      this.userManualPaginationConfig.totalRecords = response.totalRecords;
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onDelete(item: UserManual) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia!',
      text: `Esta seguro de eliminar este registro de manera permanente?`,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      allowOutsideClick: false,
    }).then((response) => {
      if (response.isConfirmed) {
        this._userManualService.delete(item.id).subscribe((result) => {
          Swal.fire({
            icon: result.code == '1' ? 'info' : 'warning',
            title: 'Manual de usuario',
            text: result.message,
          });
          if (result.code === '1') {
            this.loadData();
          }
        });
      }
    });
  }

  async onEdit(item: UserManual) {
    this.data = item;
    await this.onDialogOpen();
  }

  async onDialogOpen() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        title: this.data.id > 0 ? 'Actualizar Manual' : 'Registrar',
        icon: `${this.data.id > 0 ? 'edit' : 'add'}`,
        component: UserManualAddEditDialogComponent,
        data: this.data.id > 0 ? this.data : {},
      },
      {
        size: 'xl',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object' && result.code === '1') {
        this.loadData();
      }
      this.data = {} as UserManual;
    });
  }

  onPageChanged($event: PageEvent) {
    this.userManualPaginationConfig.pageIndex = $event.pageIndex;
    this.userManualPaginationConfig.pageSize = $event.pageSize;
    this.userManualPaginationConfig.totalRecords = $event.length;
    this.loadData();
  }
  onSearch($event: any) {
    const textSearch = $event.target.value;
    if (textSearch.length >= 3) {
      // this.pagination().textSearch = textSearch;
      this.loadData();
    }
    if (!textSearch || textSearch === '' || textSearch.length === 0) {
      // this.pagination().textSearch = '';
      this.loadData();
    }
  }
  onSearchClear(searchInput: any) {
    searchInput.value = '';
    // this.pagination().textSearch = '';
    this.loadData();
  }
}
