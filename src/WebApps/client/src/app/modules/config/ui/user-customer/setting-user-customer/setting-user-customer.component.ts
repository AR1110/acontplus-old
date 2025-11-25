import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ListAsignacionEstabComponent } from '@modules/config/ui/user-customer/setting-user-customer/list-asignacion-estab/list-asignacion-estab.component';
import { UserCustomerStore } from '@modules/config/application/store/user-customer.store';
import { ListUserCustomerRoleUseCase } from '@modules/config/application/use-cases/user-customer-role/list-user-customer-role.use-case';
import { UserCustomerRole } from '@modules/config/domain/models/user-customer/user-customer-role.model';
import { MatListModule } from '@angular/material/list';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { UserCustomerRolePermissionComponent } from '@modules/config/ui/user-customer/setting-user-customer/user-customer-role-permission/user-customer-role-permission.component';

import { UserCustomerAccessComponent } from '@modules/config/ui/user-customer/setting-user-customer/user-customer-access/user-customer-access.component';

@Component({
  selector: 'app-setting-user-customer',
  imports: [
    MatTabsModule,
    MatListModule,
    MatCustomDialogComponent,
    DynamicCard,
    ListAsignacionEstabComponent,
    MatIconButton,
    MatIcon,
    UserCustomerRolePermissionComponent,
    UserCustomerAccessComponent,
  ],
  templateUrl: './setting-user-customer.component.html',
  styles: ``,
})
export class SettingUserCustomerComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SettingUserCustomerComponent>);
  readonly params = inject<{
    idUsuario: number;
    nombreCompleto: string;
  }>(MAT_DIALOG_DATA);

  userCustomerRoleData = signal<UserCustomerRole>({} as UserCustomerRole);

  private $listUserCustomerRoleUseCase = inject(ListUserCustomerRoleUseCase);
  private $userCustomerStore = inject(UserCustomerStore);

  expandHeader = signal(false);

  ngOnInit() {
    this.$listUserCustomerRoleUseCase
      .execute({
        idUsuario: this.params.idUsuario,
      })
      .subscribe((response) => {
        if (response.data.length > 0) {
          this.userCustomerRoleData.set(response.data[0]);
          this.$userCustomerStore.setUserRoleId(this.userCustomerRoleData().idUsuarioRol);
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
