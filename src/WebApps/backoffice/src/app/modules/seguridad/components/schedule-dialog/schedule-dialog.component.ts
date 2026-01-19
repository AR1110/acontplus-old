import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrNotificationService } from 'acontplus-utils';

import { ScheduleService } from '@modules/seguridad/services/schedule.service';

import { MatIcon } from '@angular/material/icon';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatThemeButtonComponent} from "acontplus-ui-components";

@Component({
  selector: 'app-schedule-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatIcon, MatDialogActions, MatThemeButtonComponent, MatDialogContent],
  templateUrl: './schedule-dialog.component.html',
  styles: ``,
})
export class ScheduleDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ScheduleDialogComponent>);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _scheduleService = inject(ScheduleService);

  // * Add properties here
  displayedColumns: string[] = ['select', 'position', 'name'];
  days: any = [];
  title: string = 'Agregar Horario';
  id: number = 0;
  @Input() data: any;

  scheduleForm = new FormGroup({
    id: new FormControl(0),
    dayId: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endTime: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    this.get();

    if (this.data) {
      this.setDataForm(this.data);
    }
  }

  setDataForm(data: any) {
    this.title = 'Editar Horario';
    this.id = data.scheduleId;

    // * Set the data to the form
    this.scheduleForm.setValue({
      id: this.id,
      dayId: data.dayId,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  }

  // * Add methods here
  get() {
    this._scheduleService.get({ tipo: 2 }).subscribe((response) => {
      let { days } = JSON.parse(response.payload as string);
      this.days = days;
    });
  }

  post() {
    let dataForm = { ...this.scheduleForm.value };
    this._scheduleService.post(dataForm).subscribe((response) => {
      this._tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });

      if (response.code === '1') {
        this.dialogRef.close(response);
      }
    });
  }

  update() {
    let dataForm = { ...this.scheduleForm.value };
    this._scheduleService
      .put(this.data.scheduleId, dataForm)
      .subscribe((response) => {
        this._tS.show({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this.dialogRef.close(response);
        }
      });
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
