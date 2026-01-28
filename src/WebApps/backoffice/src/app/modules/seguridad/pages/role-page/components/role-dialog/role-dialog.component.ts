import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrNotificationService } from 'acontplus-utils';

import { RoleService } from '@modules/seguridad/services/role.service';

import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-role-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './role-dialog.component.html',
  styles: ``,
})
export class RoleDialogComponent {
  private dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  private tS = inject(ToastrNotificationService);
  private roleService = inject(RoleService);

  // * Add properties here
  displayedColumns: string[] = ['select', 'position', 'name'];
  companies: any = [];
  days: any = [];
  license: any = [];
  title: string = 'Agregar Rol';
  id: number = 0;
  @Input() data: any;

  roleForm = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.setDataForm(this.data);
    }
  }

  setDataForm(data: any) {
    this.title = 'Actualizar Rol';

    this.id = data.id;

    // * Set the data to the form
    this.roleForm.setValue({
      code: data.code,
      name: data.name,
    });
  }

  post() {
    let dataForm = { ...this.roleForm.value };

    this.roleService.post(dataForm).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '0') {
            this.dialogClose();
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

  update() {
    let dataForm = { ...this.roleForm.value };

    this.roleService.put(this.data.id, dataForm).subscribe({
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
