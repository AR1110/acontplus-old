import { CuentaPorPagarHistMovimientoComponent } from '@accounting/cuenta-por-pagar/presentation/components/cuenta-por-pagar-hist-movimiento/cuenta-por-pagar-hist-movimiento.component';
// Angular Common Modules
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, model, signal, OnInit } from '@angular/core';
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
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { MODAL_SIZE } from '@core/constants/global.constants';

// Accounting Module Components and Services
import { CuentaPorPagarLista } from '@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.model';
import { CuentaPorPagarCuotaModalComponent } from '@accounting/cuenta-por-pagar/presentation/components/cuenta-por-pagar-cuota-modal/cuenta-por-pagar-cuota-modal.component';

// Shared Components, Models, and Pipes
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { GetTotalPipe } from '@shared/pipes/get-total.pipe';

// Core Models
import { GroupedEstab } from '@core/models/estab.model';

// RxJS Operators
import { finalize, forkJoin, switchMap, throwError } from 'rxjs';
import { ParameterReportUtil } from '@shared/utils/parameter-report.util';
import { SharedService } from '@core/services/shared.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CuentaPorPagarUseCase } from '@accounting/cuenta-por-pagar/application/cuenta-por-pagar.use-case';
import { ComprobanteEgresoLoteComponent } from '@accounting/comprobante-egreso/presentation/components/comprobante-egreso-lote/comprobante-egreso-lote.component';
import { ComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/comprobante-egreso.use-case';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-cuenta-por-pagar-lista',
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
    DateRangeSelectionComponent,
    SupplierSearchComponent,
  ],
  templateUrl: './cuenta-por-pagar-lista.component.html',
})
export class CuentaPorPagarListaComponent implements OnInit {
  private tS = inject(ToastrNotificationService);
  private dialogSvc = inject(DialogService);
  private sharedSvc = inject(SharedService);
  private useCase = inject(CuentaPorPagarUseCase);
  private _comprobanteEgresoUseCase = inject(ComprobanteEgresoUseCase);

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
    { key: 'select', label: ' ', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'nombreDoc', label: 'Doc.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Doc.', type: 'string' },
    { key: 'identificacionComprador', label: 'Identificación', type: 'string' },
    { key: 'nombreComprador', label: 'Proveedor', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'total', label: 'Total', type: 'number', hasFooter: true },
    { key: 'abono', label: 'Abono', type: 'number', hasFooter: true },
    { key: 'saldo', label: 'Saldo', type: 'number', hasFooter: true },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
    { key: 'nombreUsuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  selection = new SelectionModel<CuentaPorPagarLista>(true, []);
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
    return {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch().codEstab,
      checkboxFecha: this.dataSearch().checkBoxDate,
      codEstado: isValidField(this.dataSearch().codigoEstado || 'NPA'),
      codDoc: isValidField(this.dataSearch().codDoc),
      idProveedor: this.dataSearch().esBuscarProveedor
        ? getValidId(this.dataSearch().idProveedor)
        : null,
      dateStart: this.dataSearch().fromDate,
      dateEnd: this.dataSearch().toDate,
      secuencial: this.dataSearch().esBuscarPorNro
        ? isValidField(this.dataSearch().secuencial)
        : null,
      typeSearchNro: this.dataSearch().typeSearchNro,
    };
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
    const { esBuscarProveedor, idProveedor, esBuscarPorNro, secuencial } = this.dataSearch();

    if (esBuscarProveedor && !ValidatorUtils.getValidId(idProveedor)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Proveedor',
      });
      return;
    }

    // Validación de búsqueda por número secuencial
    if (esBuscarPorNro) {
      if (!ValidatorUtils.isValidField(secuencial)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese número secuencial',
        });
        return;
      }

      // Validar que el número secuencial sea numérico si está presente

      if (!ValidatorUtils.isNumber(secuencial)) {
        this.tS.show({
          type: 'warning',
          message: 'Secuencial tiene que ser un número válido',
        });
        return;
      }

      // Desactivar la búsqueda por fecha cuando se usa número secuencial
      params.checkboxFecha = false;
      this.tS.show({
        type: 'info',
        message: 'Buscando por Nro. Secuencial',
      });
    }

    // Marcar que la carga de resultados ha comenzado
    this.isLoadingResults.set(true);

    // Realizar la llamada al servicio y manejar la respuesta
    this.useCase
      .getAll(params)
      .pipe(
        finalize(() => this.isLoadingResults.set(false)), // Marcar finalización de la carga
      )
      .subscribe((response) => {
        console.log(response);
        this.setResponseGetAll(response);
      });
  }

  refresh() {
    this.getAll();
  }

  private onLoad() {
    this.isLoadingResults.set(true);
    this.useCase
      .getDataFilter()
      .pipe(
        switchMap((initialData) => {
          this.estabs = initialData.estabs;
          this.estadosDoc = initialData.estadosDoc;
          this.tiposDoc = initialData.tiposDoc;

          if (this.estabs.length > 0) {
            const dataEstab = this.estabs.find((estab) => estab.defaultEstab);

            this.dataSearch.update((e) => {
              return {
                ...e,
                codEstab: dataEstab?.codEstab,
              };
            });
          } else {
            this.tS.show({
              type: 'warning',
              message: 'No tienes asignado Establecimiento!',
            });
            return throwError(() => new Error('No tienes asignado Establecimiento'));
          }

          return this.useCase.getAll(this.getDataParams());
        }),
      )
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }

  ngOnInit(): void {
    //  this.openCuotaModal()
    this.onLoad();
  }

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K],
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

  onSelectSupplier($event: any) {
    this.setDataSearch('idProveedor', $event.idProveedor);
    this.setDataSearch('nombreProveedor', $event.name);
  }

  clearSearchSupplier() {
    this.setDataSearch('idProveedor', 0);
  }

  onClickSecuencial(event: any) {
    event.stopPropagation();
    this.refresh();
  }

  // Función para verificar si los valores de razonSocialComprador son los mismos
  private tienenMismoProveedorSeleccionado() {
    const firstCustomerId = this.selection.selected[0]?.idProveedor;

    // Verificar si todas las demás entradas tienen la misma idProveedor
    return this.selection.selected.every((item) => item.idProveedor === firstCustomerId);
  }

  openPaymentModal() {
    const selected = this.selection.selected;
    if (selected.length === 0) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione al menos un documento',
      });
      return;
    }

    if (!this.tienenMismoProveedorSeleccionado()) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione documentos que pertenezca al mismo proveedor',
      });
      return;
    }

    // Crear un array de observables para obtener las cuotas
    const observables = selected.map((item) =>
      this._comprobanteEgresoUseCase.getCuotasByIdCuentaPorPagar(item.idCuentaPorPagar),
    );

    forkJoin(observables).subscribe((cuotasResponse) => {
      const selectedMergeCuotas = selected.map((item) => {
        // Aplanamos las cuotas de la respuesta y las filtramos por idCuentaPorPagar
        const filteredCuotas = cuotasResponse
          .flatMap((payment) => payment.cuotas)
          .filter((cuota) => cuota.idCuentaPorPagar === item.idCuentaPorPagar);

        // Devolvemos el documento combinado con las cuotas clonadas
        return {
          ...item,
          cuotas: structuredClone(filteredCuotas), // Clonamos las cuotas
          cuotasCopy: structuredClone(filteredCuotas), // Clonamos nuevamente si es necesario
        };
      });

      if (selectedMergeCuotas.some((item) => item.cuotas.length === 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Algunos de los documentos seleccionados no tienen cuotas',
        });
        return;
      }

      this.dialogSvc.open(ComprobanteEgresoLoteComponent, {
        size: 'xxl',
        // isFullScreen: true,
        data: {
          dataCuentaPorPagar: selectedMergeCuotas[0],
          cuentasPorPagar: selectedMergeCuotas,
        },
      });
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CuentaPorPagarLista): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row  }`;
  }

  openCuotaModal(item: CuentaPorPagarLista) {
    const modalRef = this.dialogSvc.open(CuentaPorPagarCuotaModalComponent, {
      size: MODAL_SIZE.XL,
      data: {
        idCuentaPorPagar: item?.idCuentaPorPagar,
        codigoEstado: item?.codigoEstado,
        total: item?.total || 0,
        idTiempoCredito: item.idTiempoCredito,
        fechaEmision: item.fechaEmision,
      },
    });

    modalRef.subscribe((result) => {
      console.log(result);
    });
  }

  openHistorialMovimientoModal(item: CuentaPorPagarLista) {
    const modalRef = this.dialogSvc.open(CuentaPorPagarHistMovimientoComponent, {
      size: MODAL_SIZE.XL,
      data: {
        idCuentaPorPagar: item.idCuentaPorPagar,
      },
    });

    modalRef.subscribe((result) => {
      console.log(result);
    });
  }

  getReport(row: CuentaPorPagarLista) {
    const params = ParameterReportUtil.getParams(row.codDoc, {
      id: row.idDocumento,
      codEstab: row.codEstab,
    });

    this.sharedSvc.getReport({
      data: params,
      isOldVersion: true,
      openInModal: true,
    });
    console.log(params);
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
}
