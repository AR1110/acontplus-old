import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuscripcionService } from '@modules/sales/services/suscripcion.service';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { CompanySearch } from '@modules/config/models/company.model';
import { Suscripcion } from '@modules/sales/models/suscripcion';
import { CompanyService } from '@modules/config/services/company.service';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { SuscripcionDetalle } from '@modules/sales/models/suscripcion-detalle';
import { SuscripcionDetalleService } from '@modules/sales/services/suscripcion-detalle.service';
import Swal from 'sweetalert2';
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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-suscripcion-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    TabulatorComponent,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatCheckbox,
    MatHeaderCell,
    MatColumnDef,
    MatSort,
    MatTable,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogContent,
    MatThemeButtonComponent,
  ],
  templateUrl: './suscripcion-dialog.component.html',
  styles: `
    .example-full-width {
      width: 100%;
    }

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
  providers: [DatePipe],
})
export class SuscripcionDialogComponent {
  private companyService = inject(CompanyService);
  private datePipe = inject(DatePipe);
  private dialogRef = inject(MatDialogRef<SuscripcionDialogComponent>);
  private subscriptionService = inject(SuscripcionService);
  private subscriptionDetailService = inject(SuscripcionDetalleService);
  private tS = inject(ToastrNotificationService);

  columnNames: any[] = [
    {
      field: 'id',
      visible: false,
    },
    {
      field: 'licenciaDetalleId',
      visible: false,
    },
    {
      title: 'Tipo',
      field: 'licenseTypeName',
      width: 150,
    },
    {
      title: 'Aplicacion',
      field: 'aplicacionName',
      width: 150,
    },
    {
      title: 'Fecha Inicio',
      field: 'startDate',
      editor: 'date',
      width: 150,
      formatter: 'date',
      placeholder: 'dd/mm/yyyy',
      validator: 'required',
      formatterParams: {
        inputFormat: 'yyyy-MM-dd',
        outputFormat: 'dd/MM/yyyy',
        invalidPlaceholder: '(invalid date)',
        timezone: 'America/Guayaquil',
      },
    },
    {
      title: 'Fecha Fin',
      field: 'endDate',
      editor: 'date',
      width: 150,
      formatter: 'date',
      placeholder: 'dd/mm/yyyy',
      validator: 'required',
      formatterParams: {
        inputFormat: 'yyyy-MM-dd',
        outputFormat: 'dd/MM/yyyy',
        invalidPlaceholder: '(invalid date)',
        timezone: 'America/Guayaquil',
      },
    },
    {
      title: 'Fecha Maxima de Pago',
      field: 'maxPaymentDate',
      editor: 'date',
      width: 150,
      formatter: 'date',
      placeholder: 'dd/mm/yyyy',
      validator: 'required',
      formatterParams: {
        inputFormat: 'yyyy-MM-dd',
        outputFormat: 'dd/MM/yyyy',
        invalidPlaceholder: '(invalid date)',
        timezone: 'America/Guayaquil',
      },
    },
    { title: 'Costo', field: 'cost', width: 100, editor: 'input' },
    { title: 'Impuesto', field: 'tax', width: 105, editor: 'input' },
    { title: 'Descuento', field: 'discount', width: 120, editor: 'input' },
    { title: 'Total', field: 'total', width: 90, editor: 'input' },
  ];

  currentDate = new Date();
  dataSource = new MatTableDataSource<SuscripcionDetalle>([]);
  displayedColumns: string[] = [
    'select',
    'licenciaCode',
    'licenseTypeName',
    'aplicacionName',
  ];
  filteredCompanies: Array<CompanySearch> = [];
  endDate: any = new Date(this.currentDate.getTime());
  formattedDate: any = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  endFormatedDate: any = this.datePipe.transform(
    new Date(this.endDate.setFullYear(this.currentDate.getFullYear() + 1)),
    'yyyy-MM-dd',
  );

  data: Suscripcion = {
    id: 0,
    companyId: 0,
    subscriptionTypeId: 0,
    startDate: this.formattedDate,
    endDate: this.endFormatedDate,
    maxPaymentDate: this.endFormatedDate,
    warningMessage:
      'Su licencia esta próxima a caducar, comuniquese con el departamento de ventas de acontplus',
  };
  reactiveData: boolean = false;
  selection = new SelectionModel<SuscripcionDetalle>(true, []);
  suscripcionDetalle: SuscripcionDetalle[] = [];
  suscripcionDetalleExistents: SuscripcionDetalle[] = [];
  subscriptionTypes: any = [];
  stateCtrl = new FormControl('');

  addDetails() {
    this.suscripcionDetalle.forEach((row) => {
      if (
        !this.suscripcionDetalleExistents.some(
          (x: { licenciaDetalleId: number }) =>
            x.licenciaDetalleId === row.licenciaDetalleId,
        )
      ) {
        this.suscripcionDetalleExistents.push(row);
      }
    });
    return this.suscripcionDetalleExistents;
  }

  checkboxLabel(row?: SuscripcionDetalle): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position ? 0 + 1 : row.position
    }`;
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

  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.get();
  }

  onCompanySearch() {
    try {
      let textSearch = this.removeAccents(this.stateCtrl.value);
      this.filteredCompanies = [];
      if (textSearch.length < 3) return;

      this.companyService.search({ textSearch, tipo: 2 }).subscribe({
        next: (response) => {
          this.filteredCompanies = response;
        },
        error(err) {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  get() {
    console.log(this.data.companyId);
    this.subscriptionService
      .get({ tipo: 2, companyId: this.data.companyId, id: this.data.id })
      .subscribe({
        next: (response) => {
          this.subscriptionTypes = response.subscriptionTypes;
          this.dataSource.data = response.licencias || [];
          if (response.details && response.details.length > 0) {
            this.suscripcionDetalle = response.details;
            this.suscripcionDetalleExistents = response.details;
          }
          if (this.suscripcionDetalleExistents.length > 0) {
            this.suscripcionDetalleExistents.forEach((row) => {
              this.data.cost = row.suscripcionCost;
              this.data.tax = row.suscripcionTax;
              this.data.discount = row.suscripcionDiscount;
              this.data.total = row.suscripcionTotal;
            });
            this.dataSource.data.forEach((row) => {
              if (
                this.suscripcionDetalleExistents.some(
                  (x: { licenciaDetalleId: number }) =>
                    x.licenciaDetalleId === row.licenciaDetalleId,
                )
              ) {
                this.selection.select(row);
              }
            });
          }
          if (this.data.id == 0) {
            this.data.subscriptionTypeId = this.subscriptionTypes.find(
              (x: { code: string }) => x.code === 'A',
            ).id;
          } else {
            this.filteredCompanies = response.companies;
            let find = this.filteredCompanies.filter(
              (x: { id: number }) => x.id === this.data.companyId,
            );
            this.data.companyId = find[0].id;
            this.stateCtrl.setValue(find[0].tradeName);
          }
          this.subscribeArrayChanges();
        },
        error() {},
        complete() {},
      });
  }

  onCheckboxChange(event: any, row: SuscripcionDetalle) {
    let id =
      this.suscripcionDetalleExistents.find(
        (x) => x.licenciaDetalleId == row.licenciaDetalleId,
      )?.id || 0;

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
          this.subscriptionDetailService.delete(id).subscribe({
            next: (response) => {
              if (response) {
                this.tS.show({
                  type: response.code == '1' ? 'success' : 'warning',
                  message: response.message,
                });
                if (response.code == '1') {
                  this.selection.toggle(row);
                }
              }
            },
            error(err) {
              console.error(err);
            },
            complete() {},
          });
        } else {
          this.selection.toggle(row);
        }
      });
    } else {
      this.data.cost = row.licenciaCost;
      this.data.tax = row.licenciaTax;
      this.data.discount = row.licenciaDiscount;
      this.data.total = row.licenciaTotal;
      this.selection.toggle(row);
    }
  }

  onStartDateChange(event: any) {
    let date = new Date(event);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    this.formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    let endDate = new Date(date.getTime());
    endDate.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    this.endFormatedDate = this.datePipe.transform(
      new Date(endDate.setFullYear(date.getFullYear() + 1)),
      'yyyy-MM-dd',
    );
    this.data.endDate = this.endFormatedDate;
    this.data.maxPaymentDate = this.endFormatedDate;
    let newStartDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    let newEndDate = this.datePipe.transform(
      new Date(endDate.setFullYear(date.getFullYear() + 1)),
      'yyyy-MM-dd',
    );
    if (this.suscripcionDetalle.length > 0) {
      this.suscripcionDetalle = this.suscripcionDetalle.map((item) => {
        return {
          ...item,
          endDate: newEndDate as unknown as Date,
          maxPaymentDate: newEndDate as unknown as Date,
          startDate: newStartDate as unknown as Date,
        };
      });
    }
  }

  onCompanySelected(company: CompanySearch) {
    this.data.companyId = company.id;
  }

  removeAccents(str: string | null) {
    str = str || '';
    return str.replace(/[^a-z0-9]/gi, '');
  }

  onSave() {
    try {
      if (!(this.data.companyId > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la Empresa!',
        });
        return;
      }

      if (this.suscripcionDetalle.length == 0) {
        this.tS.show({
          type: 'warning',
          message: 'Debe agregar al menos un detalle de licencia',
        });
        return;
      }

      this.suscripcionDetalle.forEach((item: any) => {
        if (!item.startDate || !item.endDate || !item.maxPaymentDate) {
          this.tS.show({
            type: 'warning',
            message: 'Las fechas de los detalles de licencia son requeridas',
          });
          return;
        }
      });

      let dataToSave = {
        ...this.data,
        suscripcionDetalles: this.addDetails(),
      };
      console.log(dataToSave);

      this.subscriptionService.post(dataToSave).subscribe({
        next: this.commonResponse,
        error() {},
        complete() {},
      });
    } catch (error) {
      console.log(error);
    }
  }

  onEdit() {
    try {
      if (!(this.data.companyId > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la Empresa!',
        });
        return;
      }

      if (this.suscripcionDetalle.length == 0) {
        this.tS.show({
          type: 'warning',
          message: 'Debe agregar al menos un detalle de licencia',
        });
        return;
      }

      this.suscripcionDetalle.forEach((item: any) => {
        if (!item.startDate || !item.endDate || !item.maxPaymentDate) {
          this.tS.show({
            type: 'warning',
            message: 'Las fechas de los detalles de licencia son requeridas',
          });
          return;
        }
      });

      const dataToSave = {
        ...this.data,
        suscripcionDetalles: this.addDetails(),
      };
      console.log(dataToSave);

      this.subscriptionService.put(this.data.id, dataToSave).subscribe({
        next: this.commonResponse,
        error() {},
        complete() {},
      });
    } catch (error) {
      console.log(error);
    }
  }

  sumTotal() {
    let cost = this.data.cost ? this.data.cost : 0;
    let tax = this.data.tax ? this.data.tax : 0;
    let discount = this.data.discount ? this.data.discount : 0;
    let total = cost + tax - discount;
    this.data.total = total ? total : 0;
  }

  generateRandomCharacter() {
    const randomHex = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
  }

  subscribeArrayChanges() {
    this.selection.changed.subscribe(() => {
      this.suscripcionDetalle = [];
      this.suscripcionDetalle.push(...this.selection.selected);
      this.suscripcionDetalle.map(
        (item: { endDate: any; maxPaymentDate: any; startDate: any }) => {
          (item.endDate = this.data.endDate.toString()),
            (item.maxPaymentDate = this.data.maxPaymentDate),
            (item.startDate = this.data.startDate);
        },
      );
    });
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '1') {
        this.dialogRef.close(response);
      }
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
    }
  };
}
