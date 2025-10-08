import { AccessAuthorizationComponent } from '@modules/auth/ui/login/access-authorization/access-authorization.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  imports: [MatCustomDialogComponent, MatCardModule, NgClass],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectionComponent implements OnInit {
  private authUseCase = inject(AuthUseCase);
  private dialogSvc = inject(DialogService);
  private tS = inject(ToastrNotificationService);
  private router = inject(Router);
  private tokenUseCase = inject(TokenUseCase);

  public dialogRef = inject(MatDialogRef<RoleSelectionComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);
  defaultIcon = 'assets/icons/default-user.png';
  roles = signal<any>([]);
  selectedRole: any | null = null;

  /**
   * Generates an acronym from a business or trade name string.
   * E.g., "El Buen Sabor" -> "EBS"
   * E.g., "Soluciones Tecnológicas S.A." -> "STSA"
   * @param {string} name - The name to process.
   * @returns {string} The uppercase acronym.
   */
  private generateAcronym(name: string) {
    if (!name) return '';

    // 1. Remove common separators (like commas, dashes) and replace multiple spaces with a single one.
    // 2. Split the string by space.
    // 3. Filter out common short connecting words (prepositions, articles) in Spanish (optional but improves quality).
    // 4. Map the remaining words to their first letter.
    // 5. Join the letters and convert to uppercase.

    const words = name
      .replace(/[,;()&.-]/g, '') // Remove punctuation
      .split(/\s+/); // Split by one or more spaces

    const stopWords = new Set([
      'de',
      'la',
      'el',
      'los',
      'las',
      'un',
      'una',
      'y',
      'e',
      'o',
      'sas',
      's.a.',
      'cia',
      'ltda',
    ]); // Common words to ignore

    const acronym = words
      .filter((word) => word.length > 0 && !stopWords.has(word.toLowerCase()))
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();

    // Limit to a reasonable length (e.g., 5 characters) for the logo circle
    return acronym.substring(0, 5);
  }

  ngOnInit(): void {
    console.log(this.params);
    this.roles.set(
      this.params.roles.map((role: any) => ({
        ...role,
        imageUrl: `https://placehold.co/100x100/f59e0b/ffffff?text=${this.generateAcronym(role.company.businessName)}`,
      })),
    );
    console.log(this.roles());
  }

  private createToken() {
    const item = this.params.userRolesOriginal.find(
      (x:any) => x.userRoleId === this.selectedRole.userRoleId,
    );
    if (item) {
      item.userAgent = JSON.stringify({
        userAgent: JSON.stringify(this.params.parserResults),
        ipAddress: this.params.customerIp,
      });

      this.authUseCase.createToken(item).subscribe((response) => {
        if (!response.success) {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }

        const userRoles = response.userRoles;
        const dataLogin = userRoles[0];

        this.tokenUseCase.saveSession(dataLogin);
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.router.navigateByUrl('/').then();
      });
    }
  }

  selectRole(role: any, shouldSave: boolean): void {
    this.selectedRole = role;
    if (this.selectedRole.needAuthorization) {
      this.authUseCase
        .requestAccess({
          uuid: this.selectedRole.uuid,
          userRoleId: this.selectedRole.userRoleId,
        })
        .subscribe((response) => {
          if (response.code === '1') {
            const modalRef = this.dialogSvc.open(AccessAuthorizationComponent, {
              size: 'lg',
              data: {
                uuid: this.selectedRole.uuid,
                userRoleId: this.selectedRole.userRoleId,
              },
            });
            modalRef.subscribe((result) => {
              if (result && typeof result === 'object') {
                this.createToken();
              }
            });
          }
        });
      return;
    }
    this.createToken();
  }
}
