import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrNotificationService } from 'acontplus-utils';

import { SuscriptionTypeService } from '@modules/sales/services/suscription-type.service';

import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-suscription-type-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './suscription-type-dialog.component.html',
  styles: ``,
})
export class SuscriptionTypeDialogComponent {
  private dialogRef = inject(MatDialogRef<SuscriptionTypeDialogComponent>);
  private tS = inject(ToastrNotificationService);
  private suscriptionTypeService = inject(SuscriptionTypeService);

  displayedColumns: string[] = ['select', 'position', 'name'];
  @Input() data: any;

  // Adding variables
  suscriptionTypeId = 0;
  title = 'Agregar';

  suscriptionTypeForm = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    duration: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.data) {
      this.setFormValues();

      this.suscriptionTypeId = this.data.id;
      this.title = 'Editar';
    }
  }

  setFormValues() {
    this.suscriptionTypeForm.setValue({
      code: this.data.code,
      name: this.data.name,
      quantity: this.data.quantity,
      duration: this.data.duration,
    });
  }

  onSave() {
    let dataForm = { ...this.suscriptionTypeForm.value };

    this.suscriptionTypeService.post(dataForm).subscribe({
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
          this.dialogRef.close(response);
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onUpdate() {
    let dataForm = { ...this.suscriptionTypeForm.value };

    this.suscriptionTypeService
      .put(this.suscriptionTypeId, dataForm)
      .subscribe({
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
            this.dialogRef.close(response);
          }
        },
        error(err) {
          console.log(err);
        },
      });
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
