import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { Licencia } from '@modules/config/models/licencia';
import { LicenciaDetalle } from '@modules/config/models/licencia-detalle.model';
import { LicenciaService } from '@modules/config/services/licencia.service';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { LicenciaDetalleService } from '@modules/config/services/licencia-detalle.service';
import Swal from 'sweetalert2';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-license-dialog',
  templateUrl: './licencia-dialog.component.html',
  styles: `
    mat-form-field {
      width: 100%;
    }
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,

    TabulatorComponent,
    MatSelect,
    MatOption,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
})
export class LicenciaDialogComponent implements OnInit {
  titleDialog = 'Nueva Licencia';
  titleBtn = 'Guardar';
  @Input() params: any;

  licenseTypes: any = [];
  sistemas: any = [];
  aplicaciones: any = [];
  isDisabled: boolean = false;
  data: Licencia = {
    id: 0,
    code: '',
    licenseTypeId: 0,
    sistemaId: 0,
    cost: 0.0,
    tax: 0.0,
    discount: 0.0,
    total: 0.0,
    licenciaDetalles: [],
  };

  constructor(
    private dialogRef: MatDialogRef<LicenciaDialogComponent>,
    private tS: ToastrNotificationService,
    private licenseService: LicenciaService,
    private licenciaDetalleService: LicenciaDetalleService,
  ) {}

  checkedApplication = new FormControl([]);

  tableData: LicenciaDetalle[] = [];

  columnNames: any[] = [
    { title: 'Aplicación', field: 'name', width: 300 },
    {
      title: 'Costo',
      field: 'cost',
      width: 150,
      editor: 'input',
      cellEdited: (cell: any) => {
        // Sum the total of the details
        cell._cell.row.data.total = cell._cell.row.data.cost
          ? cell._cell.row.data.cost
          : 0;

        // Sum the total of the details
        let totalDetalle = 0;
        this.tableData.forEach((i: any) => {
          totalDetalle += Number(i.total);
        });

        // Now, sum the total of the details to the total of the license
        let totalLicense = this.data.total ? this.data.total : 0;
        this.data.total = totalDetalle + totalLicense;
      },
    },
    { title: 'Total', field: 'total', width: 150, editor: 'input' },
    {
      title: 'Opciones',
      field: 'delete',
      width: 150,
      editor: 'button',
      formatter: 'buttonCross',
      cellClick: (e: any, cell: any) => {
        let id = cell._cell.row.data.id;

        if (id === 0) {
          this.tableData = this.tableData.filter(
            (x: any) => x.uuid != cell._cell.row.data.uuid,
          );
          return;
        }

        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, continuar!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.licenciaDetalleService.delete(id).subscribe({
              next: (response) => {
                if (response) {
                  if (response.code === '0') {
                    return this.tS.show({
                      type: 'warning',
                      message: response.message,
                    });
                  }

                  this.tS.show({
                    type: 'success',
                    message: response.message,
                  });
                  this.tableData = this.tableData.filter(
                    (x: any) => x.id != id,
                  );
                }
              },
            });
          }
        });
      },
    },
  ];

  onSelectionChange(selectedValues: string[]) {
    // Filter the selected values from the list of aplicaciones
    let filtered = this.aplicaciones.filter((x: any) =>
      selectedValues.includes(x.id),
    );

    // Push the selected values to the tableData, if not already present
    filtered.forEach((element: any) => {
      let applicationFound = this.tableData.find(
        (x: any) => x.aplicacionId == element.id,
      );

      if (applicationFound === undefined) {
        this.tableData.push({
          id: 0,
          licenciaId: 0,
          aplicacionId: element.id,
          name: element.name,
          cost: 0.0,
          total: 0.0,
          uuid: this.generateRandomCharacter(),
        });
      }
    });
  }

  ngOnInit(): void {
    const self = this;

    this.licenseService.getAll(JSON.stringify({ tipo: 2 })).subscribe({
      next(response) {
        self.licenseTypes = response.licenseTypes;
        self.sistemas = response.sistemas;
        self.aplicaciones = response.aplicaciones;
      },
      error() {},
    });

    if (this.params) {
      this.setDataForUpdate();
    }
  }

  sumTotal() {
    let cost = this.data.cost ? this.data.cost : 0;
    let tax = this.data.tax ? this.data.tax : 0;
    let discount = this.data.discount ? this.data.discount : 0;
    let total = cost + tax - discount;
    this.data.total = total ? total : 0;
  }

  save() {
    try {
      if (this.data.licenseTypeId == 0) {
        this.tS.show({
          type: 'warning',
          message: 'Debe seleccionar un tipo de licencia',
        });
        return;
      }

      if (this.data.id > 0) {
        this.data.licenciaDetalles = this.tableData;
        this.licenseService.put(this.data.id, this.data).subscribe({
          next: this.commonResponse,
          error() {},
        });
      }

      if (!(this.data.id > 0)) {
        const licenseType = this.licenseTypes.find(
          (x: { id: number }) => x.id == this.data.licenseTypeId,
        );
        const sistema = this.sistemas.find(
          (x: { id: number }) => x.id == this.data.sistemaId,
        );

        if (this.data.sistemaId ? this.data.sistemaId : 0 > 0) {
          this.data.code = sistema.code + '-' + licenseType.code;
        }

        this.data.licenciaDetalles = this.tableData;

        this.licenseService.post(this.data).subscribe({
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
      this.tS.show({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message!,
      });
      if (response.code === '1') {
        this.dialogRef.close(response);
      }
    }
  };

  setDataForUpdate() {
    this.titleDialog = 'Editar Licencia';
    this.titleBtn = 'Actualizar';
    this.isDisabled = true;

    this.data = this.params;

    this.licenciaDetalleService.get({ tipo: 1, id: this.data.id }).subscribe({
      next: (response: any) => {
        let { licenciaDetalle } = JSON.parse(response.payload as string);

        if (licenciaDetalle) {
          this.tableData = licenciaDetalle;
        }
      },
    });
  }

  // Generate a random character
  generateRandomCharacter() {
    const randomHex = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
  }

  // Close the dialog
  dialogClose() {
    this.dialogRef.close();
  }
}
