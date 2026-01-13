import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DynamicCard,
  DataGrid,
  DataGridColumn,
  Button,
  Pagination,
  DateRangePicker, DateRangeValue,
} from '@acontplus/ng-components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { NotificationService } from '@acontplus/ng-notifications';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { InvoiceService } from '@billing/services/invoice.service';
import { finalize, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-invoice-page',
  imports: [
    FormsModule,
    DynamicCard,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    //components
    BreadcrumbComponent,
    DateRangePicker,
    DataGrid,
    Button,
    DateRangeSelectionComponent,
  ],
  templateUrl: './invoice-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePage implements OnInit {
  private invoiceSvc = inject(InvoiceService);
  private notificationSvc = inject(NotificationService);

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc = [] as any[];
  isSearchAdvanced = signal(false);
  isLoadingResults = signal(false);

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'serieComprobante', header: 'Serie' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'fechaVencimiento', header: 'Fecha Vcto' },
    { field: 'razonSocialComprador', header: 'Cliente' },
    { field: 'total', header: 'Total' },
    { field: 'abono', header: 'Abono' },
    { field: 'saldo', header: 'Saldo' },
    { field: 'estadoNom', header: 'Estado' },
    { field: 'usuario', header: 'Usuario' },
  ];

  dataSource = signal<any[]>([]);

  pagination = signal(new Pagination());

  dataSearch = {
    codEstab: null as string | null | undefined,
    idPuntoEmision: 0,
    checkBoxDate: true,
    idCliente: 0,
    idUsuario: 0,
    idEstadoDoc: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    isTransferredToDoc: false,
    esDatoAdicional: false,
    esBuscarPorNro: false,
    esBuscarUsuario: false,
    esBuscarCliente: false,
  };

  private getDataParams() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,

      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: getValidId(this.dataSearch.idPuntoEmision),
      byCliente: this.dataSearch.idCliente,
      checkBoxFecha: this.dataSearch.checkBoxDate,
      byUsuario: getValidId(this.dataSearch.idUsuario),
      idEstadoPago: getValidId(this.dataSearch.idEstadoDoc),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      //     nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
      //    infoAdicional: this.dataSearch.infoAdicional ? this.dataSearch.infoAdicional : null,
      convertToDoc: this.dataSearch.isTransferredToDoc,
    };
    return params;
  }

  private setGetAll(response: any) {
    this.dataSource.set(response.data);
    this.pagination.update((p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords));
  }

  private getNotasEntrega() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true);
    this.invoiceSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.setGetAll(response);
      });
  }

  refresh() {
    this.getNotasEntrega();
  }

  ngOnInit(): void {
    this.isLoadingResults.set(true);
    this.invoiceSvc
      .getDataFilter()
      .pipe(
        switchMap((initialData) => {
          this.estabs = initialData.estabs;
          this.estadosDoc = initialData.estadosDoc;

          if (this.estabs.length > 0) {
            const dataEstab = this.estabs.find((estab) => estab.defaultEstab);
            this.puntosEmision = dataEstab?.puntosEmision || [];

            this.dataSearch.codEstab = dataEstab?.codEstab || '';
            this.dataSearch.idPuntoEmision =
              this.puntosEmision.find((pto) => pto.defaultPtoEmi)?.idPuntoEmision ?? 0;
          } else {
            this.notificationSvc.show({
              type: 'warning',
              message: 'No tienes asignado Establecimiento!',
            });
            return throwError(() => new Error('No tienes asignado Establecimiento'));
          }

          return this.invoiceSvc.getAll(this.getDataParams());
        }),
      )
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.setGetAll(response);
      });
  }

  setDataSearch<K extends keyof typeof this.dataSearch>(
    key: K,
    value: (typeof this.dataSearch)[K],
  ) {
    this.dataSearch = {
      ...this.dataSearch,
      [key]: value,
    };
  }

  onEstabChange() {
    const dataEstab = this.estabs.find((estab) => estab.codEstab === this.dataSearch.codEstab);
    this.puntosEmision = dataEstab?.puntosEmision || [];

    if (this.puntosEmision.length > 0) {
      this.setDataSearch(
        'idPuntoEmision',
        this.puntosEmision.find((pto) => pto.defaultPtoEmi)?.idPuntoEmision ?? 0,
      );
      this.refresh();
    } else {
      this.notificationSvc.show({
        type: 'warning',
        message: 'No tiene puntos de emisión asignados',
      });
    }
  }

  dateRangeSelected(range: DateRangeValue<true>){
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.refresh();
  }
  checkboxChangeDateRange($event:boolean){
    this.dataSearch.checkBoxDate=$event;
    this.refresh()
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
