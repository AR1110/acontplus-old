import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  DynamicCard,
  DataGrid,
  DataGridColumn,
  Button,
  Pagination,
} from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { GetGuiaRemisionFilterDataUseCase } from '@modules/billing/domain/use-cases/guia-remision/get-guia-remision-filter-data.use-case';
import { ListGuiasRemisionUseCase } from '@modules/billing/domain/use-cases/guia-remision/list-guias-remision.use-case';
import { finalize } from 'rxjs';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { NotificationService } from '@acontplus/ng-notifications';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { GuiaRemisionList } from '@billing/domain/models/guia-remision/guia-remision.model';
import { AddEditProductDirective } from '@inventory/ui/product/components/directives/add-edit-product.directive';
import { CompraHabitualHistorialDirective } from '@purchases/shared/directives/compra-habitual-historial.directive';
import { MatMenuModule } from '@angular/material/menu';
import { ProductKardexModalDirective } from '@inventory/ui/product/components/directives/product-kardex-modal.directive';
import { DialogService } from '@core/services/dialog.service';
import { AddEditGuiaRemisionComponent } from '@billing/ui/guia-remision/components/add-edit-guia-remision/add-edit-guia-remision.component';

@Component({
  selector: 'app-guia-remision',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    BreadcrumbComponent,
    DynamicCard,
    DataGrid,
    Button,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    AddEditProductDirective,
    CompraHabitualHistorialDirective,
    ProductKardexModalDirective,
  ],
  templateUrl: './guia-remision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuiaRemisionComponent implements OnInit {
  private $getGuiaRemisionFilterDataUseCase = inject(GetGuiaRemisionFilterDataUseCase);
  private $listGuiasRemisionUseCase = inject(ListGuiasRemisionUseCase);
  private notificationSvc = inject(NotificationService);
  private _dialogSvc = inject(DialogService);

  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc: any[] = [];
  users = signal<any[]>([]);

  dataSearch = {
    codEstab: '',
    puntoEmisionId: 0,
    filterByDate: true,
    clienteId: 0,
    usuarioId: 0,
    codEstado: 0,
    nroSecuencial: '' as string,
    toDate: formatDateToString(new Date()),
    fromDate: formatDateToString(new Date()),
  };

  loading = signal(false);
  isFilterAdvanced = signal(false);

  dataSource = signal<GuiaRemisionList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'serieComprobante', header: 'Serie Comprobante' },
    { field: 'razonSocialDestinatario', header: 'Cliente' },
    { field: 'fechaInicio', header: 'Fecha Inicio' },
    { field: 'fechaFin', header: 'Fecha Llegada' },
    { field: 'serieComprobanteInvoice', header: 'Doc' },
    { field: 'razonSocialTransportista', header: 'Transportista' },
    { field: 'nomUsuario', header: 'Usuario' },
    { field: 'nomEstado', header: 'Estado' },
  ];

  pagination = signal(new Pagination());

  private getParams() {
    if (!isValidField(this.dataSearch.codEstab)) {
      this.notificationSvc.show({
        type: 'warning',
        message: 'Establecimiento no seleccionado',
      });
    }

    if (!getValidId(this.dataSearch.puntoEmisionId)) {
      this.notificationSvc.show({
        type: 'warning',
        message: 'Punto Emisión no seleccionado',
      });
      return;
    }

    return {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: this.dataSearch.puntoEmisionId,
      checkBoxDate: this.dataSearch.filterByDate,
      idCliente: isValidField(this.dataSearch.clienteId),
      codEstado: isValidField(this.dataSearch.codEstado),
      byUsuario: isValidField(this.dataSearch.usuarioId),
      fechaInicio: this.dataSearch.filterByDate ? isValidField(this.dataSearch.fromDate) : null,
      fechaFin: this.dataSearch.filterByDate ? isValidField(this.dataSearch.toDate) : null,
      secuencial: ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
    };
  }

  refresh() {
    this.getGuiasRemision();
  }

  private getGuiasRemision() {
    if (this.loading()) {
      this.notificationSvc.show({
        type: 'warning',
        message: 'Esta cargando los datos...',
      });
      return;
    }

    if (isValidField(this.dataSearch.nroSecuencial)) {
      if (!ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)) {
        this.dataSearch.filterByDate = true;
        this.notificationSvc.show({
          type: 'error',
          message: 'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      if (!(this.dataSearch.clienteId > 0)) {
        this.dataSearch.filterByDate = false;
      }
    }

    const params = this.getParams();
    if (!params) return;
    this.$listGuiasRemisionUseCase.execute(params).subscribe((response) => {
      console.log(response);
      this.dataSource.set(response.data);
      this.pagination.update((e) => new Pagination(e.pageIndex, e.pageSize, response.totalRecords));
    });
  }

  ngOnInit() {
    this.loading.set(true);
    this.$getGuiaRemisionFilterDataUseCase
      .execute()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((filterData) => {
        this.estabs.set(filterData.estabs);
        this.estadosDoc = filterData.estadosDoc;
        this.users.set(filterData.users);

        if (this.estabs().length > 0) {
          const dataEstab = this.estabs().find((item) => item.defaultEstab);

          this.dataSearch.codEstab = dataEstab?.codEstab ?? '';
          this.puntosEmision.set(dataEstab?.puntosEmision ?? []);
          if (this.puntosEmision().length > 0) {
            const dataPuntoEmision = this.puntosEmision().find((item) => item.defaultPtoEmi);

            this.dataSearch.puntoEmisionId = dataPuntoEmision?.idPuntoEmision ?? 0;
          }
          this.refresh();
        }
      });
  }

  changeDateRange($event: any) {
    this.dataSearch.fromDate = $event.from;
    this.dataSearch.toDate = $event.to;
    this.refresh();
  }

  public openAddEditModal() {
    const ref = this._dialogSvc.open(AddEditGuiaRemisionComponent, {
      size: 'xl',
      data: {},
    });
    ref.subscribe((rs) => {
      console.log(rs);
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
