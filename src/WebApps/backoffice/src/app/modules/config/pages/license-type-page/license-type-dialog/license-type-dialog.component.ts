import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LicenseType } from '@modules/config/models/license-type';
import { LicenseTypeService } from '@modules/config/services/license-type.service';

import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-license-type-dialog',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './license-type-dialog.component.html',
  styles: ``,
})
export class LicenseTypeDialogComponent {
  private licenseTypeService = inject(LicenseTypeService);
  private dialogRef = inject(MatDialogRef<LicenseTypeDialogComponent>);
  data: LicenseType = {
    id: 0,
    code: '',
    name: '',
  };
  licenseTypeForm = new FormGroup({
    id: new FormControl(0),
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });
  dialogIcon = 'add';
  dialogTitle = 'Registrar nueva';

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.data.id > 0) {
      this.licenseTypeForm.patchValue(this.data);
    }
  }
  save() {
    // this.data = {
    //   ...this.licenseTypeForm.value,
    // };
    // this.licenseTypeService.post(this.data);
  }
}
