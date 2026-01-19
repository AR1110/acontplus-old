import { DynamicCard } from '@acontplus/ng-components';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { UserRole } from '@modules/config/data/models/user/user-role.model';
import { ListAsignacionEstabComponent } from '@modules/config/ui/user/setting-user/list-asignacion-estab/list-asignacion-estab.component';
import { UserCustomerRolePermissionComponent } from '@modules/config/ui/user/setting-user/user-role-permission/user-role-permission.component';
import { UserAccessComponent } from '@modules/config/ui/user/setting-user/user-access/user-access.component';
import { ListUserRoleUseCase } from '@modules/config/application/use-cases/user-role/list-user-role.use-case';
import { UserStore } from '@modules/config/application/store/user.store';

@Component({
  selector: 'app-setting-user',
  imports: [
    MatTabsModule,
    MatListModule,
    MatCustomDialogComponent,
    DynamicCard,
    ListAsignacionEstabComponent,
    MatIconButton,
    MatIcon,
    UserCustomerRolePermissionComponent,
    UserAccessComponent,
  ],
  templateUrl: './setting-user.html',
  styles: ``,
})
export class SettingUser implements OnInit {
  private dialogRef = inject(MatDialogRef<SettingUser>);
  readonly params = inject<{
    idUsuario: number;
    nombreCompleto: string;
  }>(MAT_DIALOG_DATA);

  userRoleData = signal<UserRole>({} as UserRole);

  private $listUserRoleUseCase = inject(ListUserRoleUseCase);
  private $userStore = inject(UserStore);

  expandHeader = signal(false);

  ngOnInit() {
    this.$listUserRoleUseCase
      .execute({
        idUsuario: this.params.idUsuario,
      })
      .subscribe((response) => {
        if (response.data.length > 0) {
          this.userRoleData.set(response.data[0]);
          this.$userStore.setUserRoleId(this.userRoleData().idUsuarioRol);
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
