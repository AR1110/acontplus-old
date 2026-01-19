import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LicenseAccessService } from '@modules/seguridad/data/license-access/license-access.service';
import { LicenciaAccesoDetalleService } from '@modules/seguridad/services/licencia-acceso-detalle.service';

import { ToastrNotificationService } from 'acontplus-utils';

import { SelectionModel } from '@angular/cdk/collections';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { LicenciaAccesoDetalle } from '@modules/seguridad/models/licencia-acceso-detalle';

import { LicenciaAcceso } from '@modules/seguridad/domain/models/licencia-acceso';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-licencia-acceso-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatCheckbox,
    MatTable,
    MatSort,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    MatRow,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
    MatSortModule,
  ],
  templateUrl: './licencia-acceso-edit-dialog.component.html',
  styles: `
    .mat-custom-table-container {
      position: relative;
      min-height: 200px;
      max-height: 400px;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    tr.mat-custom-detail-row {
      height: 0;
    }

    .mat-custom-element-row td {
      border-bottom-width: 0;
    }

    .mat-custom-element-detail {
      overflow: hidden;
      display: flex;
    }

    .mat-custom-element-symbol {
      font-weight: bold;
      font-size: 40px;
      line-height: normal;
    }

    .mat-custom-element-description {
      padding: 16px;
    }

    .my-custom-table {
      height: 420px; /* Adjust width as needed */
      overflow-x: auto;
    }
  `,
})
export class LicenciaAccesoEditDialogComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private licenciaAccesoService = inject(LicenseAccessService);
  private licenciaAccesoDetailService = inject(LicenciaAccesoDetalleService);
  private dialogRef = inject(MatDialogRef<LicenciaAccesoEditDialogComponent>);
  private tS = inject(ToastrNotificationService);

  data: LicenciaAcceso = {
    id: 0,
    licenciaId: 0,
    roleId: 0,
    licenciaAccesoDetalles: [],
  };
  licenses: any = [];
  licenciaAccesoForm = new FormGroup({
    licenciaId: new FormControl(0, Validators.required),
    roleId: new FormControl(0, Validators.required),
  });
  menuParams: any = {};
  dialogIcon = 'edit';
  dialogTitle = 'Actualizar Accesos de la Licencia';
  roles: any = [];
  selection = new SelectionModel<LicenciaAccesoDetalle>(true, []);
  selectedSubmenus: LicenciaAccesoDetalle[] = [];
  accesses: LicenciaAccesoDetalle[] = [];
  validationParams: any = [undefined, null, '', 0];
  displayedColumns: string[] = [
    'select',
    'position',
    'aplicacionName',
    'menuName',
    'submenuName',
    'order',
  ];
  dataSource = new MatTableDataSource<LicenciaAccesoDetalle>([]);

  addSubmenusToSave() {
    this.selectedSubmenus.forEach((row) => {
      if (
        !this.accesses.some(
          (x: { licenciaAccesoId: number; menuId: number }) =>
            x.menuId === row.menuId &&
            x.licenciaAccesoId == row.licenciaAccesoId,
        )
      ) {
        this.accesses.push(row);
      }
    });
    return this.accesses;
  }

  checkboxLabel(row?: LicenciaAccesoDetalle): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position ? 0 + 1 : row.position
    }`;
  }

  close() {
    this.dialogRef.close();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.selection.select(...this.dataSource.data);
  }

  ngOnInit(): void {
    this.licenciaAccesoForm.patchValue(this.data);
    this.onGet();
  }

  onCheckboxChange(event: any, row: LicenciaAccesoDetalle) {
    let id = this.selectedSubmenus.find((x) => x.menuId == row.menuId)?.id || 0;

    if (!event.checked && id > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.licenciaAccesoDetailService.delete(id).subscribe((response) => {
            if (response) {
              this.tS.show({
                type: response.code == '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code == '1') {
                this.selection.toggle(row);
              }
            }
          });
        } else {
          this.selection.toggle(row);
        }
      });
    } else {
      this.selection.toggle(row);
    }
  }

  onGet() {
    this.licenciaAccesoService
      .get({ id: this.data.id, tipo: 2, licenciaId: this.data.licenciaId })
      .subscribe((response) => {
        if (response) {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            let { licenses, roles, submenus, accesses } = JSON.parse(
              response.payload as string,
            );
            this.licenses = licenses || [];
            this.roles = roles || [];
            this.accesses = accesses || [];

            const newSubmenus: Array<LicenciaAccesoDetalle> = submenus.map(
              (submenu: any, index: number) => ({
                ...submenu,
                position: index + 1,
              }),
            );
            this.dataSource.data = newSubmenus;
            if (!this.validationParams.includes(this.accesses)) {
              this.selectedSubmenus = this.accesses;
              this.dataSource.data.forEach((row) => {
                if (
                  this.accesses.some(
                    (x: { menuId: number }) => x.menuId === row.menuId,
                  )
                ) {
                  this.selection.select(row);
                }
              });
              this.subscribeArrayChanges();
            }
          }
        }
      });
  }

  onLicenseChange($event: any) {
    //this.onMenuGet($event.target.value);
  }

  onSave() {
    let dataForm = {
      ...this.licenciaAccesoForm.value,
    };

    if (this.validationParams.includes(this.selectedSubmenus)) {
      return this.tS.show({
        type: 'warning',
        message: 'Debe seleccionar al menos un menu para guardar',
      });
    }
    const accessesToSave = {
      id: this.data.id,
      licenciaId: Number(dataForm.licenciaId),
      roleId: Number(dataForm.roleId),
      licenciaAccesoDetalles: this.addSubmenusToSave(),
    };
    // console.log(accessesToSave);
    // return;
    this.licenciaAccesoService
      .put(this.data.id, accessesToSave)
      .subscribe((response) => {
        if (response) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          this.dialogRef.close(response);
        }
      });
  }

  onSetSubmenuOrder($event: any, menuId: number) {
    if (
      this.selectedSubmenus.some(
        (x) => x.menuId != menuId && x.order == Number($event.target.value),
      )
    ) {
      this.tS.show({ type: 'warning', message: 'orden ya usado' });
    }
    let newArray = this.selectedSubmenus.map((item) =>
      item.menuId === menuId
        ? { ...item, order: Number($event.target.value) }
        : item,
    );
    this.selectedSubmenus = newArray;
  }

  removeSubmenu(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar este acceso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.licenciaAccesoDetailService.delete(id).subscribe((response) => {
          if (response) {
            this.tS.show({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            let submenusNoRemoved = this.selectedSubmenus.filter(
              (x: { id: number }) => x.id !== id,
            );
            this.selectedSubmenus = submenusNoRemoved;
          }
        });
      }
    });
  }

  subscribeArrayChanges() {
    this.selection.changed.subscribe(() => {
      this.selectedSubmenus = [];
      this.selectedSubmenus.push(...this.selection.selected);
    });
  }
}
