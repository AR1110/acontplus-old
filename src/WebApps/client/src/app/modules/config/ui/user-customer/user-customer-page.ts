import { UserCustomerAddEditModal } from '@modules/config/ui/user-customer/user-customer-add-edit-modal/user-customer-add-edit-modal';
import { SettingUserCustomer } from '@modules/config/ui/user-customer/setting-user-customer/setting-user-customer';
import { ListUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/list-user-customer.use-case';
import { UserCustomerList } from '@modules/config/data/models/user-customer/user-customer.model';
import {
  Button,
  DataGrid,
  DataGridColumn,
  AdvancedDialogService,
  Pagination,
} from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '@acontplus/ng-notifications';
import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { SendMaxUsersUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-customer',
  imports: [BreadcrumbComponent, DataGrid, MatIconModule, Button],
  templateUrl: './user-customer-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCustomerPage implements OnInit {
  private $listUserCustomerUseCase = inject(ListUserCustomerUseCase);
  private tS = inject(NotificationService);
  private dialogSvc = inject(AdvancedDialogService);
  private $sendMaxUsersUseCase = inject(SendMaxUsersUseCase);

  $loading = signal(false);

  dataSource = signal<UserCustomerList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'nroIdentificacion', header: 'Nro. Identificacion' },
    { field: 'nombreCompleto', header: 'Nombre Completo' },
    { field: 'username', header: 'Usuario' },
    { field: 'email', header: 'Correo' },
    { field: 'nomEstado', header: 'Estado' },
  ];

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
      this.tS.warning({
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
    await this.openAddEdit();
  }

  async openAddEdit(item?: UserCustomerList) {
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: UserCustomerAddEditModal,
        title: item ? 'Editar Usuario' : 'Nuevo Usuario',
        icon: item ? 'edit' : 'add',
        showCloseButton: true,
        data: item ? structuredClone(item) : {},
      },
      {
        size: 'md',
      },
    );
    ref.afterClosed().subscribe((result: unknown) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  async openSetting(item: UserCustomerList) {
    await this.dialogSvc.openInWrapper(
      {
        component: SettingUserCustomer,
        title: 'Configuración de Usuario',
        icon: 'settings',
        showCloseButton: true,
        data: structuredClone(item),
      },
      {
        size: 'xxl',
      },
    );
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
