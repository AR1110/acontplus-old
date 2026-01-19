import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';


import { Ec2Instance } from '@modules/config/models/ec2instance.model';
import { Ec2instanceService } from '@modules/config/services/ec2instance.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-ec2instance-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatDialogTitle,
    MatFormFieldModule,
  ],
  templateUrl: './ec2instance-dialog.component.html',
  styleUrls: ['./ec2instance-dialog.component.scss'],
})
export class Ec2instanceDialogComponent {
  titleDialog = 'Nueva Instancia';
  titleBtn = 'Guardar';
  form: FormGroup;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Ec2instanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Ec2Instance,
    private tS: ToastrNotificationService,
    private ec2InstanceService: Ec2instanceService,
  ) {
    this.form = this.fb.group({
      id: [0, []],
      region: ['', Validators.required],
      instanceId: ['', Validators.required],
      instanceName: ['', Validators.required],
      instanceType: ['', Validators.nullValidator],
      ipAddress: ['', Validators.required],
      urlStart: ['', Validators.nullValidator],
      urlStop: ['', Validators.nullValidator],
      isActive: [false, Validators.required],
    });

    if (data && data.id > 0) {
      this.titleDialog = 'Editar Instancia';
      this.titleBtn = 'Actualizar';
      this.form.controls['id'].setValue(data.id);
      this.form.controls['region'].setValue(data.region);
      this.form.controls['instanceId'].setValue(data.instanceId);
      this.form.controls['instanceName'].setValue(data.instanceName);
      this.form.controls['instanceType'].setValue(data.instanceType);
      this.form.controls['ipAddress'].setValue(data.ipAddress);
      this.form.controls['urlStart'].setValue(data.urlStart);
      this.form.controls['urlStop'].setValue(data.urlStop);
    }
  }

  save() {
    try {
      const data = {
        ...this.form.value,
      };

      if (data.id > 0) {
        this.ec2InstanceService
          .put(data.id, data)
          .subscribe(this.commonResponse);
      }

      if (!(data.id > 0)) {
        this.ec2InstanceService.post(data).subscribe(this.commonResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      this.tS.show({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message!,
      });
      if (response.code === '1') {
        this.dialogRef.close(response);
      }
    }
  };
  close() {
    this.dialogRef.close();
  }
}
