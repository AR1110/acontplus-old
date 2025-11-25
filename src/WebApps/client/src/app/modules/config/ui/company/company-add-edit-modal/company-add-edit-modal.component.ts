import { Component, inject, signal, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputChip } from '@acontplus/ng-components';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { UpdateCompanyUseCase } from '@modules/config/application/use-cases/company/update-company.use-case';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    MatCustomDialogComponent,
    InputChip,
  ],
  templateUrl: './company-add-edit-modal.component.html',
  styles: ``,
})
export class CompanyAddEditModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CompanyAddEditModalComponent>);
  private params = inject(MAT_DIALOG_DATA);

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

  ngOnInit() {
    this.data = structuredClone(this.params);
    this.emails.set(this.params.emails);
    this.telefonos.set(this.params.telefonos);
  }

  showSwal(icon: any, text: string) {
    Swal.fire({
      icon: icon,
      text: text,
    });
  }
  save() {
    if (!isValidField(this.data.ruc)) {
      this.showSwal('warning', 'Ingrese número de ruc');
      return;
    }

    if (this.data.ruc?.slice(this.data.ruc?.length - 3) !== '001') {
      this.showSwal('warning', 'Número de RUC tiene que contener (001) en últimos dígitos');
      return;
    }

    if (!isValidField(this.data.razonSocial)) {
      this.showSwal('warning', 'Ingrese Razón Social');
      return;
    }

    if (!isValidField(this.data.nombreComercial)) {
      this.showSwal('warning', 'Ingrese Nombre Comercial');
      return;
    }

    if (this.emails().length > 0 && this.emails().some((c) => !isValidEmail(c))) {
      this.showSwal('warning', 'Correo inválido!');
      return;
    }

    const params = {
      idEntidad: this.params.idEntidad,
      razonSocial: this.data.razonSocial,
      ruc: this.data.ruc,
      nombreComercial: this.data.nombreComercial,
      telefono:
        this.telefonos().length > 0 ? this.telefonos().join(SEPARATOR_KEY_CODE.SLASH) : null,
      //estado: true,
      email: this.emails().length > 0 ? this.emails().join(SEPARATOR_KEY_CODE.SLASH) : null,
      direccion: isValidField(this.data.direccion),
      //  idCiudad: 111
    } as any;

    this.$updateUseCase.execute(params).subscribe((response) => {
      if (response.code === '0') {
        this.showSwal('warning', response.message);
      }
      if (response.code === '1') {
        Swal.fire({
          icon: 'success',
          text: response.message,
          timer: 1000,
        });
        this.dialogRef.close(response);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
