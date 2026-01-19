import { Component, inject } from '@angular/core';
import { ToastrNotificationService } from 'acontplus-utils';
import { RoleService } from '@modules/seguridad/services/role.service';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-role-list',
  imports: [
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './role-list.component.html',
  styles: ``,
})
export class RoleListComponent {
  private roleService = inject(RoleService);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);

  roles: any = [];

  ngOnInit() {
    this.get();
  }

  async onUpdate(role: any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: RoleDialogComponent,
        title: role.id ? 'Actualizar Rol' : 'Agregar Rol',
        data: role,
      },
      {
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) return;

      if (result['code'] == '1') {
        this.get();
      }
    });
  }

  changeStatus(role: any) {
    role.isActive = !role.isActive;
    this.roleService.put(role.id, role).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.tS.show({
            type: 'success',
            message: response.message,
          });
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }

  get() {
    this.roleService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '1') {
            let roles = response.payload;
            this.roles = roles || [];
          }
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: RoleDialogComponent,
        title: 'Agregar Rol',
        data: {},
      },
      {
        size: 'lg',
      },
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response.code == '1') {
        this.get();
      }
    });
  }
}
