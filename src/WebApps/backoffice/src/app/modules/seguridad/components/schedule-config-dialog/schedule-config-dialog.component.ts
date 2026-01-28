import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScheduleService } from '@modules/seguridad/services/schedule.service';

import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { ScheduleCompanyService } from '@modules/seguridad/services/schedule-company.service';
import {
  compareResponseToMapper,
  scheduleCompanyMapper,
} from '@modules/seguridad/mappers/schedule-company.mapper';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatIcon } from '@angular/material/icon';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-config-dialog',
  templateUrl: './schedule-config-dialog.component.html',
  styles: ``,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TabulatorComponent,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class ScheduleConfigDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<ScheduleConfigDialogComponent>,
  );
  private readonly _scheduleService = inject(ScheduleService);
  private readonly _scheduleCompanyService = inject(ScheduleCompanyService);
  private readonly _tS = inject(ToastrNotificationService);

  // * Add properties here
  @Input() data: any;

  // * Create objects here
  title: string = 'Agregar de Horarios';
  isUpdated: boolean = false;
  schedules: any = [];
  columnsName: any = [
    { title: 'id', field: 'id', visible: false },
    {
      title: 'Día',
      field: 'day',
      width: 200,
    },
    {
      title: 'Hora de Inicio',
      field: 'startTime',
      width: 200,
      editor: 'time',
      formatter: {
        format: 'hh:mm:ss',
        verticalNavigation: 'table',
      },
      cellEdited: (cell: any) => {
        const rowData = cell._cell.row.data; // Obtén los datos de la fila
        if (rowData.id > 0) {
          // Si el id es mayor a 0, permite la actualización
          this.update(rowData); // Llama a tu método de actualización
        } else {
          // Si el id no es válido, deshaz el cambio
          cell._cell.setValue(cell._cell.oldValue); // Restaura el valor anterior
        }
      },
    },
    {
      title: 'Hora de Fin',
      field: 'endTime',
      width: 200,
      editor: 'time',
      formatter: {
        format: 'hh:mm:ss',
        verticalNavigation: 'table',
      },
      cellEdited: (cell: any) => {
        const rowData = cell._cell.row.data; // Obtén los datos de la fila
        if (rowData.id > 0) {
          // Si el id es mayor a 0, permite la actualización
          this.update(rowData); // Llama a tu método de actualización
        } else {
          // Si el id no es válido, deshaz el cambio
          cell._cell.setValue(cell._cell.oldValue); // Restaura el valor anterior
        }
      },
    },
    {
      title: 'Estado',
      field: 'isActive',
      align: 'center',
      editor: true,
      formatter: 'tickCross',
      editorParams: {
        values: { true: 'Yes', false: 'No' },
        elementAttributes: {
          style: 'width:100%',
        },
      },
      cellEdited: (cell: any) => {
        this.update(cell._cell.row.data);
      },
    },
  ];

  dataForColumns: any = [];

  ngOnInit() {
    this.getSchedule();
  }

  getSchedule() {
    this._scheduleService.get({ tipo: 1 }).subscribe((response) => {
      if (response.code == '1') {
        let { schedules } = JSON.parse(response.payload as string);
        this.schedules = schedules;
      }

      // * If the data is not empty, then get the data by id
      this.getById();
    });
  }

  getById() {
    this._scheduleCompanyService.getById(this.data.id).subscribe((response) => {
      console.log(response.code);
      if (response.code == '0') {
        this.schedules.forEach((schedule: any) => (schedule.isActive = true));
        return (this.dataForColumns = this.schedules);
      }

      if (response.code == '1') {
        this.title = 'Editar Horarios';
        this.isUpdated = true;
        this.dataForColumns = compareResponseToMapper(
          this.schedules,
          response.payload as any[],
        );
      }
    });
  }

  save() {
    if (this.isUpdated) return;
    let dataToSave = scheduleCompanyMapper(this.data.id, this.dataForColumns);

    this._scheduleCompanyService
      .post({ schedules: dataToSave })
      .subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.dialogRef.close();
        }
      });
  }

  update(scheduleCompany: any) {
    this._scheduleCompanyService
      .put(scheduleCompany.id, scheduleCompany)
      .subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
