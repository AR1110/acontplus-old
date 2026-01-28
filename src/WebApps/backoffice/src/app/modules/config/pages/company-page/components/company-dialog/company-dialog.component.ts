import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { CommonModule } from '@angular/common';


import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { SharedService } from '@core/services/shared.service';

import { Company } from '@modules/config/models/company.model';
import { CompanyService } from '@modules/config/services/company.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-company-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatIconButton,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    MatDialogActions,
    MatButton,
    MatFormFieldModule,
  ],
  templateUrl: './company-dialog.component.html',
  styles: `
    mat-form-field {
      width: 100%;
    }
  `,
})
export class CompanyDialogComponent {
  titleDialog = 'Nueva Empresa';
  titleBtn = 'Guardar';
  form: FormGroup;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Company,
    private tS: ToastrNotificationService,
    private sharedSvc: SharedService,
    private companyService: CompanyService,
    private announcer: LiveAnnouncer,
  ) {
    this.form = this.fb.group({
      id: [0, []],
      idCard: ['', Validators.required],
      businessName: ['', Validators.required],
      tradeName: ['', Validators.required],
      //  email: ["", Validators.required],
      telephone: ['', Validators.required],
      address: ['', Validators.required],
      isActive: [false, Validators.required],
    });

    if (data && data.id > 0) {
      this.titleDialog = 'Editar Empresa';
      this.titleBtn = 'Actualizar';
      this.form.controls['id'].setValue(data.id);
      this.form.controls['idCard'].setValue(data.idCard);
      this.form.controls['businessName'].setValue(data.businessName);
      this.form.controls['tradeName'].setValue(data.tradeName);
      // this.form.controls["email"].setValue(data.email);
      this.form.controls['telephone'].setValue(data.telephone);
      this.form.controls['address'].setValue(data.address);
      this.form.controls['isActive'].setValue(data.isActive);
      this.emails = data.email.split(';');
    }
  }

  isValidRUC() {
    let { idCard } = this.form.value;
    console.log(idCard);
    if (idCard.length !== 13) {
      this.tS.show({
        type: 'warning',
        message: 'Número de Ruc tiene que tener 13 dígitos!',
      });
      return;
    }
    if (idCard.slice(-3) !== '001') {
      this.tS.show({
        type: 'warning',
        message: 'Número de RUC tiene que contener 001',
      });
      return;
    }
    return true;
  }

  searchToSRI() {
    const self = this;
    try {
      if (!this.isValidRUC()) return;

      this.sharedSvc.checkCustomerSRIByRUC(this.form.value.idCard).subscribe({
        next(value) {
          const { razonSocial, nombreComercial, email, telefono, error } =
            value;
          if (error) {
            self.tS.show({
              type: 'info',
              message: error,
            });
            return;
          }
          self.form.controls['businessName'].setValue(razonSocial);
          self.form.controls['tradeName'].setValue(nombreComercial);
          // self.form.controls["email"].setValue(email);
          self.form.controls['telephone'].setValue(telefono);
          self.emails = email ? email.split(';') : [];
        },
        error(error) {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${email}`);
    }
  }

  edit(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.emails.indexOf(fruit);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }

  save() {
    try {
      if (!this.isValidRUC()) return;

      const data = {
        ...this.form.value,
        idCard: this.form.value.idCard.toString(),
        email: this.emails.join(';'),
      };

      if (data.id > 0) {
        this.companyService.put(data.id, data).subscribe({
          next: this.commonResponse,
          error() {},
        });
      }

      if (!(data.id > 0)) {
        this.companyService.post(data).subscribe({
          next: this.commonResponse,
          error() {},
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '0') {
        this.tS.show({
          type: 'warning',
          message: response.message!,
        });
      }
      if (response.code === '1') {
        this.tS.show({
          type: 'success',
          message: response.message!,
        });
        this.dialogRef.close(response);
      }
    }
  };

  close() {
    this.dialogRef.close();
  }
}
