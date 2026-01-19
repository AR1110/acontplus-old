import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrNotificationService } from 'acontplus-utils';

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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MenuService } from '@modules/config/services/menu.service';
import { LicenseAccessService } from '@modules/seguridad/data/license-access/license-access.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { LicenciaAccesoMenu } from '@modules/seguridad/domain/models/licencia-acceso';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-licencia-acceso-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCheckbox,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './licencia-acceso-dialog.component.html',
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
export class LicenciaAccesoDialogComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private menuService = inject(MenuService);
  private licenciaAccesoService = inject(LicenseAccessService);

  private dialogRef = inject(MatDialogRef<LicenciaAccesoDialogComponent>);
  private tS = inject(ToastrNotificationService);
  licenses: any = [];
  licenciaAccesoForm = new FormGroup({
    licenciaId: new FormControl(0, Validators.required),
    roleId: new FormControl(0, Validators.required),
  });
  menuParams: any = {};
  dialogIcon = 'add';
  dialogTitle = 'Registrar Accesos';
  roles: any = [];
  selection = new SelectionModel<LicenciaAccesoMenu>(true, []);
  selectedMenus: LicenciaAccesoMenu[] = [];
  menus: LicenciaAccesoMenu[] = [];
  validationParams: any = [undefined, null, '', 0];
  isUpdatingNow: boolean = false;
  isCheckAll: boolean = false;
  displayedColumns: string[] = [
    'select',
    'position',
    'aplicacionName',
    'menuName',
    'name',
    'order',
  ];
  dataSource = new MatTableDataSource<LicenciaAccesoMenu>([]);

  checkboxLabel(row?: LicenciaAccesoMenu): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position ? 0 + 1 : row.position
    }`;
  }

  closeDialog() {
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

  addSubmenusToSave() {
    return this.selectedMenus.map((item) => {
      const { id, ...rest } = item;
      return { menuId: id, order: rest.order };
    });
  }

  ngOnInit(): void {
    this.onGet();
  }

  onGet() {
    this.licenciaAccesoService.get({ tipo: 2 }).subscribe((response) => {
      if (response) {
        if (response.code == '0') {
          this.closeDialog();
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code == '1') {
          let { licenses, roles } = JSON.parse(response.payload as string);
          this.licenses = licenses || [];
          this.roles = roles || [];
        }
      }
    });
  }

  onLicenseChange($event: any) {
    this.onMenuGet($event.target.value);
    this.subscribeArrayChanges();
  }

  onMenuGet(licenciaId: number) {
    this.menuService.get({ tipo: 3, licenciaId }).subscribe((response) => {
      this.menus = response.menus || [];
      this.dataSource.data = response.menus.map(
        (submenu: any, index: number) => ({
          ...submenu,
          position: index + 1,
        }),
      );
    });
  }

  onSave() {
    let dataForm = {
      ...this.licenciaAccesoForm.value,
    };
    const accessesToSave = {
      licenciaId: Number(dataForm.licenciaId),
      roleId: Number(dataForm.roleId),
      licenciaAccesoDetalles: this.addSubmenusToSave(),
    };
    this.licenciaAccesoService.post(accessesToSave).subscribe((response) => {
      if (response) {
        this.tS.show({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
        this.dialogRef.close(response);
      }
    });
  }

  onSetSubmenuOrder($event: any, id: number) {
    if (
      this.selectedMenus.some(
        (x) => x.id != id && x.order == Number($event.target.value),
      )
    ) {
      this.tS.show({ type: 'warning', message: 'orden ya usado' });
    }
    let newArray = this.selectedMenus.map((item) =>
      item.id === id ? { ...item, order: Number($event.target.value) } : item,
    );
    this.selectedMenus = newArray;
  }

  subscribeArrayChanges() {
    this.selection.changed.subscribe(() => {
      this.selectedMenus = [];
      this.selectedMenus.push(...this.selection.selected);
    });
  }
}
