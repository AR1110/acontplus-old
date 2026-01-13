import { CuentaPorPagarHistMovimientoComponent } from '@accounting/ui/cuenta-por-pagar-page/components/cuenta-por-pagar-hist-movimiento/cuenta-por-pagar-hist-movimiento.component';
// Angular Common Modules
import { CommonModule } from '@angular/common';
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

// External Libraries
import { NgxMaskDirective } from 'ngx-mask';

// Core Components and Services
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DialogService } from '@core/services/dialog.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { MODAL_SIZE } from '@core/constants/global.constants';

// Accounting Module Components and Services
import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { CuentaPorPagarCuotaModalComponent } from '@accounting/ui/cuenta-por-pagar-page/components/cuenta-por-pagar-cuota-modal/cuenta-por-pagar-cuota-modal.component';

// Shared Components, Models, and Pipes
import { DataGrid, DataGridColumn, Pagination, Button } from '@acontplus/ng-components';

// Core Models
import { GroupedEstab } from '@core/models/estab.model';

// RxJS Operators
import { finalize, forkJoin, switchMap, throwError } from 'rxjs';
import { ParameterReportUtil } from '@shared/utils/parameter-report.util';
import { SharedService } from '@core/services/shared.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CUENTA_POR_PAGAR_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { ComprobanteEgresoLoteComponent } from '@accounting/ui/comprobante-egreso-page/components/comprobante-egreso-lote/comprobante-egreso-lote.component';
import { ComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/comprobante-egreso.use-case';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-cuenta-por-pagar-page-lista',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    NgxMaskDirective,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    DataGrid,
    Button,
  ],
  templateUrl: './cuenta-por-pagar-lista.component.html',
})
export class CuentaPorPagarListaComponent implements OnInit {
  private tS = inject(ToastrNotificationService);
  private dialogSvc = inject(DialogService);
  private sharedSvc = inject(SharedService);
  private useCase = inject(CUENTA_POR_PAGAR_HTTP_TOKEN);
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

  columnsDefs: DataGridColumn[] = [
    {
      header: 'Op.',
      field: 'op',
      width: '80px',
    },
    { header: 'Nro.', field: 'index', width: '80px' },
    { header: 'Doc.', field: 'nombreDoc', width: '100px' },
    { header: 'Serie Doc.', field: 'serieComprobante', width: '120px' },
    { header: 'Identificación', field: 'identificacionComprador', width: '130px' },
    { header: 'Proveedor', field: 'nombreComprador', width: '200px' },
    { header: 'Fecha Emisión', field: 'fechaEmision', width: '120px' },
    { header: 'Fecha Vcto', field: 'fechaVencimiento', width: '120px' },
    { header: 'Total', field: 'total', width: '100px' },
    { header: 'Abono', field: 'abono', width: '100px' },
    { header: 'Saldo', field: 'saldo', width: '100px' },
    { header: 'Estado', field: 'nombreEstado', width: '100px' },
    { header: 'Usuario', field: 'nombreUsuario', width: '120px' },
  ];

  selection = new SelectionModel<CuentaPorPagarLista>(true, []);
  dataSource: CuentaPorPagarLista[] = [];

  pagination = signal(new Pagination());

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
    this.dataSource = response.data;
    this.pagination.update((p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords));
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
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }

  onRowClick(event: any) {
    // Handle row selection with Ctrl/Cmd key for multi-select
    const item = event.rowData;

    if (event.ctrlKey || event.metaKey) {
      // Multi-select mode
      this.selection.toggle(item);
    } else {
      // Single select mode - clear previous selections and select this item
      this.selection.clear();
      this.selection.select(item);
    }
  }
}
