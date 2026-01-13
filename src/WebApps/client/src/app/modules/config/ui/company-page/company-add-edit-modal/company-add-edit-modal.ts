import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { Button } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputChip } from '@acontplus/ng-components';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { UpdateCompanyUseCase } from '@modules/config/application/use-cases/company/update-company.use-case';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { NotificationService } from '@acontplus/ng-notifications';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-page-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    InputChip,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './company-add-edit-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyAddEditModal implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CompanyAddEditModal>);
  private params = inject(MAT_DIALOG_DATA);
  private tS = inject(NotificationService);

  private $updateUseCase = inject(UpdateCompanyUseCase);

  data = {
    direccion: null as string | null,
    nombreComercial: null as string | null,
    razonSocial: null as string | null,
    ruc: null as string | null,
    email: null as string | null,
    telefono: null as string | null,
  };
  emails = signal<string[]>([]);
  telefonos = signal<string[]>([]);

  get getData() {
    return this.params.data;
  }

  ngOnInit() {
    this.data = structuredClone(this.getData);
    this.emails.set(this.getData.emails);
    this.telefonos.set(this.getData.telefonos);
  }

  save() {
    if (!isValidField(this.data.ruc)) {
      this.tS.warning({ message: 'Ingrese número de ruc' });
      return;
    }

    if (this.data.ruc?.slice(this.data.ruc?.length - 3) !== '001') {
      this.tS.warning({ message: 'Número de RUC tiene que contener (001) en últimos dígitos' });
      return;
    }

    if (!isValidField(this.data.razonSocial)) {
      this.tS.warning({ message: 'Ingrese Razón Social' });
      return;
    }

    if (!isValidField(this.data.nombreComercial)) {
      this.tS.warning({ message: 'Ingrese Nombre Comercial' });
      return;
    }

    if (this.emails().length > 0 && this.emails().some((c) => !isValidEmail(c))) {
      this.tS.warning({ message: 'Correo inválido!' });
      return;
    }

    const params = {
      idEntidad: this.getData.idEntidad,
      razonSocial: this.data.razonSocial,
      ruc: this.data.ruc,
      nombreComercial: this.data.nombreComercial,
      telefono:
        this.telefonos().length > 0 ? this.telefonos().join(SEPARATOR_KEY_CODE.SLASH) : null,
      email: this.emails().length > 0 ? this.emails().join(SEPARATOR_KEY_CODE.SLASH) : null,
      direccion: isValidField(this.data.direccion),
    } as any;

    this.$updateUseCase.execute(params).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000,
      });
      this.dialogRef.close(response);
    });
  }
}
