import { AccessAuthorizationComponent } from '@modules/auth/ui/login/access-authorization/access-authorization.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { DynamicCard } from '@acontplus/ng-components';

import { AuthService } from '@modules/auth/domain/auth.service';

@Component({
  selector: 'app-role-selection',
  imports: [MatCustomDialogComponent, DynamicCard],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectionComponent {
  private authUseCase = inject(AuthUseCase);
  private dialogSvc = inject(DialogService);
  authSvc = inject(AuthService);

  public dialogRef = inject(MatDialogRef<RoleSelectionComponent>);
  defaultIcon = '/assets/icons/default-user.png';
  roles = signal<any>([]);
  selectedRole: any | null = null;

  selectRole(role: any): void {
    this.authSvc.selectedRole.set(role);
    if (role.needAuthorization) {
      this.authUseCase
        .requestAccess({
          uuid: role.uuid,
          userRoleId: role.userRoleId,
        })
        .subscribe((response) => {
          if (response.code === '1') {
            const modalRef = this.dialogSvc.open(AccessAuthorizationComponent, {
              size: 'lg',
            });
            modalRef.subscribe((result) => {
              if (result && typeof result === 'object') {
                this.dialogRef.close();
                this.authSvc.createToken();
              }
            });
          }
        });
      return;
    }
    this.dialogRef.close();
    this.authSvc.createToken();
  }
}
