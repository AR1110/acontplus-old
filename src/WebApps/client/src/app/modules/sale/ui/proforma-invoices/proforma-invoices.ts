import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { PageEvent } from '@angular/material/paginator';
import {
  ProformaInvoiceFilterUseCase,
  ProformaInvoiceListUseCase,
} from '@sale/domain/use-cases/proforma-invoice.use-case';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Pagination } from '@acontplus/ng-components';
import { ProformaInvoiceList } from '@sale/domain/models/proforma-invoice';
import { finalize } from 'rxjs/operators';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { ACTION_ALIASES } from '@core/constants/permission-actions';
import { SALE_MODULES_CODE } from '@sale/domain/enums/sale.enum';
import { HasPermissionDirective } from '@core/directives/permission';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '@core/services/dialog.service';
import { ProformaInvoiceDetail } from '@sale/ui/proforma-invoices/proforma-invoice-detail/proforma-invoice-detail';
import { ProformaInvoiceAddEdit } from '@sale/ui/proforma-invoices/proforma-invoice-add-edit/proforma-invoice-add-edit';

@Component({
  selector: 'app-proforma-invoices',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DataGrid,
    DateRangeSelectionComponent,
    MatButtonModule,
    MatCheckbox,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatSelectModule,
    HasPermissionDirective,
    MatMenuModule,
  ],
  templateUrl: './proforma-invoices.html',
  styles: ``,
})
export class ProformaInvoices implements OnInit {
  sale_modules_code = signal(SALE_MODULES_CODE);
  action_aliases = signal(ACTION_ALIASES);
  private _filterDataUseCase = inject(ProformaInvoiceFilterUseCase);
  private _listDataUseCase = inject(ProformaInvoiceListUseCase);
  private notiSvc = inject(ToastrNotificationService);
  private dgSvc = inject(DialogService);

  estabs = signal<GroupedEstab[]>([]);
  emissionPoints = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc = [] as any[];
  isSearchAdvanced = signal(false);
  isLoadingResults = signal(false);

  dataSearch = {
    estabId: 0,
    ptoEmiId: 0,
    codEstado: null,
    useFilterDate: true,
    fromDate: '',
    toDate: '',
    isTransferredToDoc: false,
    esBuscarCliente: false,
    esDatoAdicional: false,
    esBuscarPorNro: false,
    esBuscarUsuario: false,
  };
  pagination = signal(new Pagination());

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Op.', field: 'actions' },
    { header: 'Documento', field: 'document' },
    { header: 'Cliente', field: 'client' },
    { header: 'Fecha de emisión', field: 'issuedDate' },
    { header: 'Total', field: 'total' },
    { header: 'Estado', field: 'statusName' },
    { header: 'Usuario', field: 'user' },
  ];
  list = signal<ProformaInvoiceList[]>([]);
  isLoading = signal(false);

  openAddEditDialog(operation: 'add' | 'edit' | 'duplicate' = 'add', id?: number, data?: any) {
    this.dgSvc
      .open(ProformaInvoiceAddEdit, {
        size: 'xxl',
        data: {
          id: 0,
          operation,
          data,
        },
      })
      .subscribe((result) => {
        console.log(result);
        if (result && typeof result === 'object') {
          this.refresh();
        }
      });
  }

  private initLoad() {
    this._filterDataUseCase.execute().subscribe((response) => {
      this.estabs.set(response.estabs);
      const dataEstab = this.estabs().find((estab) => estab.defaultEstab);
      if (!dataEstab) {
        this.notiSvc.warning({
          message: 'No se encontró establecimiento por defecto',
        });
        return;
      }
      this.emissionPoints.set(dataEstab.puntosEmision);
      const dataPtoEmi = this.emissionPoints().find((pto) => pto.defaultPtoEmi);
      if (!dataPtoEmi) {
        this.notiSvc.warning({
          message: 'No se encontró punto de emisión por defecto',
        });
        return;
      }
      this.dataSearch.estabId = dataEstab.idEstablecimiento;
      this.dataSearch.ptoEmiId = dataPtoEmi.idPuntoEmision;
      console.log(this.dataSearch);
      this.getList();
    });
  }

  ngOnInit() {
    // this.initLoad()
  }

  private getParams() {
    const {
      estabId,
      ptoEmiId,
      codEstado,
      fromDate,
      toDate,
      isTransferredToDoc,
      esDatoAdicional,
      esBuscarPorNro,
      esBuscarUsuario,
    } = this.dataSearch;

    const pagination = this.pagination();
    const errors: string[] = [];

    if (!(estabId > 0)) {
      errors.push('Debe seleccionar un establecimiento.');
    }

    if (!(ptoEmiId > 0)) {
      errors.push('Debe seleccionar un punto de emisión.');
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        errors.push('La fecha inicial no puede ser mayor que la final.');
      }
    }

    if (errors.length > 0) {
      const listItems = errors.map((error) => `<li>${error}</li>`).join('');
      const htmlMessage = `<ul>${listItems}</ul>`;
      this.notiSvc.warning({
        message: htmlMessage,
        options: {
          enableHtml: true,
          closeButton: true,
        },
      });
      return null;
    }

    // 🔹 Retornar parámetros listos
    return {
      estabId,
      ptoEmiId,
      codEstado,
      fromDate,
      toDate,
      isTransferredToDoc,
      esDatoAdicional,
      esBuscarPorNro,
      esBuscarUsuario,
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };
  }

  refresh() {
    this.getList();
  }

  getList() {
    const params = this.getParams();
    if (!params) return;
    this.isLoading.set(true);
    this.list.set([]);
    this._listDataUseCase
      .execute(params)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe((response) => {
        this.list.set(response.data);
      });
  }

  onEstabChange() {}

  onDateRangeSelection($event: any) {}

  openViewDetail(rowData: ProformaInvoiceList) {
    this.dgSvc.open(ProformaInvoiceDetail, {
      data: {
        id: rowData.id,
      },
      size: 'xl',
    });
  }
  getNextPage(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.getList();
  }
}
