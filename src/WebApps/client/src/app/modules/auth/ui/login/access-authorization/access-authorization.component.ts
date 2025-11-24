import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DynamicCard } from '@acontplus/ng-components';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@modules/auth/domain/auth.service';

@Component({
  selector: 'app-access-authorization',
  imports: [MatCustomDialogComponent, DynamicCard, MatIcon, MatButtonModule, FormsModule],
  templateUrl: './access-authorization.component.html',
  styleUrl: './access-authorization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessAuthorizationComponent {
  private authUseCase = inject(AuthUseCase);
  private authSvc = inject(AuthService);
  private tS = inject(ToastrNotificationService);
  public dialogRef = inject(MatDialogRef<AccessAuthorizationComponent>);

  codes: string[] = ['', '', '', '', '', ''];
  success = false;
  readonly VALID_CODE = '123456'; // ejemplo

  /** Permite avanzar automáticamente al siguiente campo */
  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    if (!/^[0-9]$/.test(val)) {
      input.value = '';
      this.codes[index] = '';
      return;
    }
    if (val && index < 5) {
      const next = document.getElementById(`otp${index + 1}`);
      next?.focus();
    }
  }

  /** Retrocede al campo anterior con Backspace */
  onBackspace(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prev = document.getElementById(`otp${index - 1}`);
      prev?.focus();
    }
  }

  /** Permite pegar los 6 dígitos */
  onPaste(event: ClipboardEvent) {
    const data = event.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(data)) {
      this.codes = data.split('');
      this.verifyCode();
    }
  }

  /** Verifica el código */
  verifyCode() {
    const code = this.codes.join('');

    const dataSend = {
      senderId: 0,
      receiverId: 0,
      uuid: this.authSvc.selectedRole().uuid,
      code: Number(code),
    };

    this.authUseCase.authenticate(dataSend).subscribe((response) => {
      if (response.code === '0') {
        this.tS.warning({
          message: response.message,
        });
        return;
      }
      if (response.code == '1') {
        this.success = true;
        setTimeout(() => {
          this.authSvc.goToDashboard();
        }, 1000);
      }
    });
  }

  /** Reenviar código */
  resendCode() {}
}
