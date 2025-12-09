import { Component, inject, model, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetFormDataExcelImportUseCase } from '@modules/config/application/use-cases/excel-import/get-form-data-excel-import.use-case';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelImportService } from '@modules/config/application/services/excel-import.service';
import Swal from 'sweetalert2';
import { ValidateImportedDataUseCase } from '@modules/config/application/use-cases/excel-import/validate-imported-data.use-case';
import { finalize } from 'rxjs/operators';
import { isValidField } from '@core/utils/utils';
import { SaveExcelImportUseCase } from '@modules/config/application/use-cases/excel-import/save-excel-import.use-case';
import { NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Button, DynamicCard } from '@acontplus/ng-components';
@Component({
  selector: 'app-excel-import',
  imports: [
    DynamicCard,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatInput,
    MatDivider,
    FormsModule,
    MatTableModule,
    NgClass,
    Button,
  ],
  templateUrl: './excel-import.component.html',
  styles: `
    //mat-header-cell {
    //  white-space: normal !important;
    //  word-wrap: break-word;
    //  word-break: break-word;
    //  font-weight: bold;
    //  text-align: center;
    //  padding: 12px 8px;
    //}

    .table-container {
      width: 100%;
      height: 400px;
      overflow: auto;
    }

    .full-width-table {
      width: 100%;
      min-width: 600px; /* puedes ajustar este valor según tus columnas */
    }

    .column-header,
    .column-cell {
      //padding: 12px;
      //white-space: wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // min-width: 120px;
      max-width: 330px;
      flex: 1;
      box-sizing: border-box;
    }

    .item-import-register {
      background-color: rgb(116, 255, 158);
    }

    .item-import-error {
      background-color: rgb(255, 167, 116);
    }

    .item-import-register .item-import-error {
      cursor: pointer;
    }

    ::ng-deep mat-header-cell.mat-column-select,
    ::ng-deep mat-cell.mat-column-select {
      //width: 100px !important;
      //max-width: 100px !important;
      //overflow: hidden;
      //width: 32px;
      //border-right: 1px solid currentColor;
      //padding-right: 24px;
      //text-align: center;
    }

    .mat-column-select {
      width: 32px;
      border-right: 1px solid currentColor;
      padding-right: 24px !important;
      text-align: center;
    }
  `,
})
export class ExcelImportComponent implements OnInit {
  private $getFormData = inject(GetFormDataExcelImportUseCase);
  private $validateImportedData = inject(ValidateImportedDataUseCase);
  private $saveUseCase = inject(SaveExcelImportUseCase);
  private _excelImportSvc = inject(ExcelImportService);
  modules = signal<any[]>([]);

  urlFile!: string;
  data = model({
    codeModule: '',
    nameModule: '',
  });

  displayedColumns: string[] = ['select'];
  dataSource = new MatTableDataSource<any>();
  tempArrayFiles: any[] = [];

  selection = new SelectionModel<any>(true, []);

  ngOnInit() {
    this.$getFormData.execute().subscribe((response) => {
      this.modules.set(response.modules);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  isSelectionDisabled() {
    return this.dataSource.data.some((item) => !(item.estado === 'IMPORTAR'));
  }

  handleChangeModule() {
    const dataModule = this.modules().find((item) => item.codigo === this.data().codeModule);
    this.data.set({
      nameModule: dataModule.descripcion,
      codeModule: dataModule.codigo,
    });
    this.urlFile = dataModule.urlDocument;
  }

  async onFileSelected(ev: any) {
    const target: DataTransfer = ev.target as DataTransfer;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    try {
      const rawData = await this._excelImportSvc.parseExcelFile(target.files[0]);
      const displayedColumns = Object.keys(rawData[0]).map((c) => c.trim());

      // this.displayedColumns = [...this.displayedColumns, ...displayedColumns]
      this.tempArrayFiles = this._excelImportSvc
        .mapItems(rawData, this.displayedColumns)
        .map((row) => this._excelImportSvc.cleanRow(row, displayedColumns, this.data().codeModule));
      this.validateImport();
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }

    // const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {
    //
    //   const ab: ArrayBuffer = e.target.result;
    //   const wb: WorkBook = read(ab, {type: 'binary', cellDates: true});
    //
    //
    //   const wsname: string = wb.SheetNames[0];
    //   const ws: WorkSheet = wb.Sheets[wsname];
    //
    //   /* save infrastructure */
    //   const infrastructure:any =(utils.sheet_to_json(ws, {header: 1}));
    //
    //   console.log(infrastructure)
    //
    //   const [headers, ...rows] = infrastructure;
    //
    //   this.displayedColumns = headers;
    //   const tempArrayFiles = this._excelImportSvc.mapItems(rows, this.displayedColumns).map(row =>
    //     this._excelImportSvc.cleanRow(row, this.displayedColumns, this.infrastructure().codeModule)
    //   );
    //
    //
    //   this.tempArrayFiles.set(tempArrayFiles);
    //   this.validateImport()
    // };
    // reader.readAsArrayBuffer(target.files[0]);
  }

  validateImport() {
    Swal.fire({
      title: '<small>Espere por favor...</small>',
      html: 'Validando datos...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.$validateImportedData
      .execute({
        code: this.data().codeModule,
        data: {
          jsonParams: JSON.stringify(this.tempArrayFiles),
        },
      })
      .pipe(finalize(() => Swal.close()))
      .subscribe((response) => {
        if (response.code === '0') {
          Swal.fire({ icon: 'warning', html: `<small>${response.message}</small>` });
        } else if (response.code === '1') {
          Swal.close();
          const payload = JSON.parse(response.payload as string);
          this.dataSource.data = payload;
          const displayedColumns = Object.keys(payload[0]).filter(
            (item) => !['idArticulo', 'idMedida', 'idSubFamilia', 'idTipoIva'].includes(item),
          );

          this.displayedColumns = [...this.displayedColumns, ...displayedColumns];
        }
      });
  }

  showSwalFire(campo: string) {
    Swal.fire({
      icon: 'warning',
      html: `Ingrese campo ${campo}`,
    });
  }

  private isValidForm() {
    let isComplete = false;
    for (const item of this.selection.selected) {
      if (Object.prototype.hasOwnProperty.call(item, 'codigo') && !isValidField(item.codigo)) {
        this.showSwalFire('codigo');
        return;
      }

      //Cliente/Proveedor
      if (
        Object.prototype.hasOwnProperty.call(item, 'codContribuyente') &&
        !isValidField(item.codContribuyente)
      ) {
        this.showSwalFire('codContribuyente');
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(item, 'codIdentificacion') &&
        !isValidField(item.codIdentificacion)
      ) {
        this.showSwalFire('codIdentificacion');
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(item, 'nombreComercial') &&
        !isValidField(item.nombreComercial)
      ) {
        this.showSwalFire('nombreComercial');
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(item, 'nombreFiscal') &&
        !isValidField(item.nombreFiscal)
      ) {
        this.showSwalFire('nombreFiscal');
        return;
      }

      isComplete = true;
    }

    return isComplete;
  }

  save() {
    if (!this.isValidForm()) return;

    Swal.fire({
      icon: 'warning',
      html: `
      ¿Está seguro de guardar la importación de
      <b><h3>${this.selection.selected.length}</h3></b>
      ítems del módulo <b>${this.data().nameModule}</b>?`,
      showDenyButton: true,
      confirmButtonText: 'Sí, guardar',
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (!result.isConfirmed) return;
      const sendData = {
        code: this.data().codeModule,
        data: {
          jsonParams: JSON.stringify(this.selection.selected),
        },
      };

      this.$saveUseCase
        .execute(sendData)
        .pipe(finalize(() => Swal.close()))
        .subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: `<small>${response.message}</small>`,
            });
          }
          if (response.code === '1') {
            const timer = 1000;
            Swal.fire({
              icon: 'success',
              html: `<small>${response.message}</small>`,
              timer,
            });

            setTimeout(() => {
              this.data.set({
                codeModule: '',
                nameModule: '',
              });
            }, timer);
            this.selection.clear();
            this.displayedColumns = ['select'];
            this.dataSource.data = [];
          }
        });
    });
  }
}
