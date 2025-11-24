import { UserCustomerAddEditModalComponent } from '@modules/config/ui/user-customer/user-customer-add-edit-modal/user-customer-add-edit-modal.component';
import { SettingUserCustomerComponent } from '@modules/config/ui/user-customer/setting-user-customer/setting-user-customer.component';
import { ListUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/list-user-customer.use-case';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { UserCustomerList } from '@modules/config/domain/models/user-customer/user-customer.model';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Component, inject, signal, OnInit } from '@angular/core';
import { Pagination } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { SendMaxUsersUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-customer',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    MatDynamicTableComponent,
    MatIconModule,
    MatButtonModule,
    Button,
  ],
  templateUrl: './user-customer.component.html',
  styles: ``,
})
export class UserCustomerComponent implements OnInit {
  private $listUserCustomerUseCase = inject(ListUserCustomerUseCase);
  private _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);
  private $sendMaxUsersUseCase = inject(SendMaxUsersUseCase);

  $loading = signal(false);

  dataSource = signal<UserCustomerList[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroIdentificacion', label: 'Nro. Identificacion', type: 'string' },
    { key: 'nombreCompleto', label: 'Nombre Completo', type: 'string' },
    { key: 'username', label: 'Usuario', type: 'string' },
    { key: 'email', label: 'Correo', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  refresh() {
    this.getList();
  }

  private getList() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    if (this.$loading()) {
      this._tS.show({
        type: 'warning',
        message: 'Hay proceso pendiente',
      });
      return;
    }
    this.$loading.set(true);
    this.$listUserCustomerUseCase
      .execute(params)
      .pipe(finalize(() => this.$loading.set(false)))

      .subscribe((response) => {
        this.dataSource.set(response.data);
        this.pagination.update(
          (item) => new Pagination(item.pageIndex, item.pageSize, response.totalRecords),
        );
      });
  }

  ngOnInit() {
    this.getList();
  }

  async openAdd() {
    await firstValueFrom(this.$sendMaxUsersUseCase.execute());
    this.openAddEdit();
  }

  openAddEdit(item?: UserCustomerList) {
    const ref = this._dialogSvc.open(UserCustomerAddEditModalComponent, {
      size: 'md',
      data: item ? structuredClone(item) : {},
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  openSetting(item: UserCustomerList) {
    this._dialogSvc.open(SettingUserCustomerComponent, {
      size: 'xxl',
      data: structuredClone(item),
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
