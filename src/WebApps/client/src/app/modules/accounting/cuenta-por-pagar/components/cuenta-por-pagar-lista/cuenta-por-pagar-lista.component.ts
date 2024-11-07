// Angular Common Modules
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// External Libraries
import { NgxMaskDirective } from 'ngx-mask';

// Core Components and Services
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DialogService } from '@core/services/dialog.service';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { MODAL_SIZE } from '@core/constants/global.constants';

// Accounting Module Components and Services
import { CuentaPorPagarLista } from '@modules/accounting/cuenta-por-pagar/cuenta-por-pagar.interface';
import { CuentaPorPagarService } from '@modules/accounting/cuenta-por-pagar/cuenta-por-pagar.service';
import { CuentaPorPagarCuotaModalComponent } from '../cuenta-por-pagar-cuota-modal/cuenta-por-pagar-cuota-modal.component';

// Customer Module Components
import { SupplierSearchMatComponent } from '@modules/customer/supplier/components/supplier-search-mat/supplier-search-mat.component';

// Shared Components, Models, and Pipes
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { GetTotalPipe } from '@shared/pipes/get-total.pipe';

// Core Models
import { GroupedEstab } from '@core/models/estab.model';

// RxJS Operators
import { finalize, switchMap, throwError } from 'rxjs';


@Component({
  selector: 'app-cuenta-por-pagar-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    NgxMaskDirective,
    MatTableModule,
    MatSortModule,
    DecimalPipe,
    GetTotalPipe,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,
    SupplierSearchMatComponent,
  ],
  templateUrl: './cuenta-por-pagar-lista.component.html',
})
export class CuentaPorPagarListaComponent {
  private cpcSvc = inject(CuentaPorPagarService);
  private tS = inject(ToasterService);
  private dialogSvc = inject(DialogService);

  estabs: GroupedEstab[] = [];
  estadosDoc = [] as any[];
  tiposDoc = [] as any[];

  typesSearchNro = signal([
    { code: 1, description: 'Ninguna' },
    { code: 2, description: 'Retención' },
    { code: 3, description: 'Nota Crédito' },
  ]);

  isSearchAdvanced = signal(false);
  isLoadingResults = signal(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'nombreDoc', label: 'Doc.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Doc.', type: 'string' },
    { key: 'identificacionComprador', label: 'Identificación', type: 'string' },
    { key: 'nombreComprador', label: 'Proveedor', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'total', label: 'Total', type: 'number',  hasFooter: true },
    { key: 'abono', label: 'Abono', type: 'number',  hasFooter: true },
    { key: 'saldo', label: 'Saldo', type: 'number', hasFooter: true },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
    { key: 'nombreUsuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<CuentaPorPagarLista>();

  pagination = signal(new MatPagination());

  dataSearch = model({
    codEstab: null as string | null | undefined,
    codDoc: 0,
    checkBoxDate: true,
    codigoEstado: 0,
    idProveedor: 0,
    nombreProveedor: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),

    esBuscarPorNro: false,
    esBuscarProveedor: false,
    typeSearchNro: 1,
    secuencial: '',
  });

  private getDataParams() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch().codEstab,
      checkboxFecha: this.dataSearch().checkBoxDate,
      codEstado: isValidField(this.dataSearch().codigoEstado),
      codDoc: isValidField(this.dataSearch().codDoc),
      idProveedor: this.dataSearch().esBuscarProveedor ? getValidId(this.dataSearch().idProveedor) : null ,
      dateStart: this.dataSearch().fromDate,
      dateEnd: this.dataSearch().toDate,
      secuencial: this.dataSearch().esBuscarPorNro ? isValidField(this.dataSearch().secuencial): null,
      typeSearchNro: this.dataSearch().typeSearchNro,
    };
    return params;
  }

  private setResponseGetAll(response: any) {
    this.dataSource = new MatTableDataSource(response.data);
    this.pagination.update((p) => ({
      ...p,
      totalRecords: response.totalRecords,
    }));
  }
  private getAll() {
    // Evitar múltiples llamadas si ya está cargando
    if (this.isLoadingResults()) return;

    // Obtener los parámetros iniciales
    const params = this.getDataParams();
    const {esBuscarProveedor, idProveedor, esBuscarPorNro, secuencial} = this.dataSearch();

    if(esBuscarProveedor && !ValidatorUtils.getValidId(idProveedor)){
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Proveedor',
      });
      return;
    }

    // Validación de búsqueda por número secuencial
    if (esBuscarPorNro) {

      if (!ValidatorUtils.isValidField(secuencial)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese número secuencial',
        });
        return;
      }

      // Validar que el número secuencial sea numérico si está presente

      if (!ValidatorUtils.isNumber(secuencial)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Secuencial tiene que ser un número válido',
        });
        return;
      }

      // Desactivar la búsqueda por fecha cuando se usa número secuencial
      params.checkboxFecha = false;
      this.tS.toastr({
        type: 'info',
        message: 'Buscando por Nro. Secuencial',
      });
    }

    // Marcar que la carga de resultados ha comenzado
    this.isLoadingResults.set(true);

    // Realizar la llamada al servicio y manejar la respuesta
    this.cpcSvc
      .getAll(params)
      .pipe(
        finalize(() => this.isLoadingResults.set(false)) // Marcar finalización de la carga
      )
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }


  refresh() {
    this.getAll();
  }

  ngOnInit(): void {
    this.isLoadingResults.set(true);
    this.cpcSvc
      .getDataFilter()
      .pipe(
        switchMap((initialData) => {
          this.estabs = initialData.estabs;
          this.estadosDoc = initialData.estadosDoc;
          this.tiposDoc = initialData.tiposDoc;

          if (this.estabs.length > 0) {
            let dataEstab = this.estabs.find((estab) => estab.defaultEstab);

            this.dataSearch.update((e) => {
              return {
                ...e,
                codEstab: dataEstab?.codEstab,
              };
            });
          } else {
            this.tS.toastr({
              type: 'warning',
              message: 'No tienes asignado Establecimiento!',
            });
            return throwError(
              () => new Error('No tienes asignado Establecimiento')
            );
          }

          return this.cpcSvc.getAll(this.getDataParams());
        })
      )
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K]
  ) {
    this.dataSearch.update((ds) => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update((e) => {
      return {
        ...e,
        fromDate: range.from,
        toDate: range.to,
      };
    });
    this.refresh();
  }

  onSelectSupplier($event:any){
    this.setDataSearch("idProveedor", $event.idProveedor)
    this.setDataSearch("nombreProveedor", $event.name)
  }

  clearInputSupplier(){
    this.setDataSearch("idProveedor", 0)
  }

  onClickSecuencial(event: any) {
    event.stopPropagation();
    this.refresh()
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }

  openCuotaModal(item: CuentaPorPagarLista) {
    let modalRef = this.dialogSvc.open(CuentaPorPagarCuotaModalComponent, {
      size: MODAL_SIZE.XL,
      data: {
        idCuentaPorPagar: item.idCuentaPorPagar,
      },
    });

    modalRef.subscribe((result) => {
      console.log(result);
    });
  }
}
