import {
  AdvancedDialogService,
  Button,
  DataGrid,
  DataGridColumn,
  Pagination,
} from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SendMaxUsersUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { UserAddEditModal } from '@modules/config/ui/user/user-add-edit-modal/user-add-edit-modal';
import { SettingUser } from '@modules/config/ui/user/setting-user/setting-user';
import { ListUserUseCase } from '@modules/config/application/use-cases/user/list-user.use-case';
import { UserList } from '@modules/config/data/models/user/user.model';
import { firstValueFrom } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  imports: [BreadcrumbComponent, DataGrid, MatIconModule, Button],
  templateUrl: './user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPage implements OnInit {
  private $listUserUseCase = inject(ListUserUseCase);
  private tS = inject(NotificationService);
  private dialogSvc = inject(AdvancedDialogService);
  private $sendMaxUsersUseCase = inject(SendMaxUsersUseCase);

  $loading = signal(false);

  dataSource = signal<UserList[]>([]);

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
    this.$listUserUseCase
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

  async openAddEdit(item?: UserList) {
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: UserAddEditModal,
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

  async openSetting(item: UserList) {
    await this.dialogSvc.openInWrapper(
      {
        component: SettingUser,
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
